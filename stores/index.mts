import playRecords from './play/index.mts';
import kulturaRecords from './kultura/index.mts';
import ritmRecords from './ritm/index.mts';
import vinylBoxRecords from './vinylbox/index.mts';
import 'dotenv/config';

const botToken = process.env.TELEGRAM_BOT_TOKEN;

const getRecords = async () => {
    if (!botToken) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }

    const records = await Promise.all([
        kulturaRecords(),
        playRecords(),
        ritmRecords(),
        vinylBoxRecords(),
    ]);
    const recordsArray = records.flat();

    console.log(recordsArray);

    return recordsArray;
};

getRecords().catch(console.error);
