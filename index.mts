import {Bot} from 'node-telegram-bot-api';
import 'dotenv/config';
import getRecords from './stores/index.mts';
import type {IRecordStore} from './interfaces/types.mts';
import {formatStoresResult} from "./helpers/formatStoresResult.mts";

const botToken = process.env.TELEGRAM_BOT_TOKEN || '';

async function init() {
    if (!botToken) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }

    const cityRecordsBot = new Bot(botToken);

    cityRecordsBot.command('start', (ctx) =>
        ctx.reply(
            'Привет! Напиши исполнителя или название записи которую ты ищешь',
        ),
    );

    cityRecordsBot.on('message', async (ctx) => {
        const storesResponse: IRecordStore[] | undefined = await getRecords(
            ctx.update.message?.text || '',
        );

        if (!storesResponse || !storesResponse?.length) {
            return ctx.reply(
                `К сожалению ничего не найдено :(`,
            );
        }

        const formattedStoresResult = formatStoresResult(storesResponse);

        formattedStoresResult.map((item) => {
            if (!item?.content) return;

            return ctx.reply(
                `*${item?.store}*\n\n${item?.content}`
            );
        });
    });

    await cityRecordsBot.startPolling();
}

init();
