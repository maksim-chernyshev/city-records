import { Bot } from 'node-telegram-bot-api';
import 'dotenv/config';
import getRecords from './stores/index.mts';
import type { IDisplayedProduct } from './interfaces/types.mts';

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
        const result: IDisplayedProduct[] | string = await getRecords(
            ctx.update.message?.text || '',
        );

        if (typeof result === 'string' || !result?.length) {
            return ctx.reply(`К сожалению ничего не найдено :(`);
        }

        result.map((item) => {
            return ctx.reply(
                `Название: ${item.title}\nЦена: ${item.price}\nМагазин: ${item.store}\nСсылка: ${item.link}`,
            );
        });
    });

    await cityRecordsBot.startPolling();
}

init();
