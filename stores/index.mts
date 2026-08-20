import playRecords from './play/index.mts';
import kulturaRecords from './kultura/index.mts';
import ritmRecords from './ritm/index.mts';

const getRecords = async () => {
    const records = await Promise.all([
        kulturaRecords(),
        playRecords(),
        ritmRecords(),
    ]);
    const recordsArray = records.flat();

    console.log(recordsArray);

    return recordsArray;
};

getRecords().catch(console.error);
