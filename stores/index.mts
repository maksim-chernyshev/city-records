import playRecords from './play/index.mts';
import kulturaRecords from './kultura/index.mts';

const getRecords = async () => {
    const records = await Promise.all([kulturaRecords(), playRecords()]);
    const recordsArray = records.flat();

    console.log(recordsArray);

    return recordsArray;
};

getRecords().catch(console.error);
