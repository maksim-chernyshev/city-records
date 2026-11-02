import { Bot } from "node-telegram-bot-api";
import "dotenv/config";
import getRecords from "./src/data/index.ts";
import type { IRecordStore } from "./src/interfaces/types.ts";
import { formatStoresResult } from "./src/helpers/formatStoresResult.ts";
import {
    MAX_REPLY_LENGTH,
    MAX_ITEMS_IN_LONG_REPLY,
} from "./src/consts/consts.ts";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

async function init() {
    if (!botToken) {
        throw new Error("TELEGRAM_BOT_TOKEN is not set");
    }

    const cityRecordsBot = new Bot(botToken);

    cityRecordsBot.command("start", (ctx) =>
        ctx.reply(
            "Привет! Напиши исполнителя или название записи которую ты ищешь",
        ),
    );

    cityRecordsBot.on("message", async (ctx) => {
        const storesResponse: IRecordStore[] | undefined = await getRecords(
            // TODO fix types
            //@ts-ignore
            ctx.update.message?.text || "",
        );

        if (!storesResponse || !storesResponse?.length) {
            return ctx.reply(`К сожалению ничего не найдено :(`);
        }

        const formattedStoresResult = formatStoresResult(storesResponse);
        const notEmptyResult = formattedStoresResult.filter(
            (item) => item?.content,
        );

        for (let result of notEmptyResult) {
            if (result.content.length > MAX_REPLY_LENGTH) {
                const parts = result.content.split("\n\n");
                let packs = [];

                const messages = Math.ceil(
                    parts.length / MAX_ITEMS_IN_LONG_REPLY,
                );

                for (let i = 0; i < messages; i++) {
                    const index = i * MAX_ITEMS_IN_LONG_REPLY;
                    packs = [
                        ...packs,
                        parts.slice(index, MAX_ITEMS_IN_LONG_REPLY + index),
                    ];
                }

                for (const [i, pack] of packs.entries()) {
                    await ctx.reply(
                        `*${result.store}* Часть ${i + 1}\n\n${pack.join("\n\n")}`,
                        { link_preview_options: { is_disabled: true } },
                    );
                }

                return;
            }

            await ctx.reply(`*${result.store}*\n\n${result.content}`, {
                link_preview_options: { is_disabled: true },
            });
        }

        await ctx.reply("Внимание! Наличие лучше уточнить на сайте магазина!");
    });

    await cityRecordsBot.startPolling();
}

init();
