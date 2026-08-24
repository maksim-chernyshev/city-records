import playRecords from './play/index.mts';
import kulturaRecords from './kultura/index.mts';
import ritmRecords from './ritm/index.mts';
import vinylBoxRecords from './vinylbox/index.mts';
import type {IDisplayedProduct} from "../interfaces/types.mts";

const getRecords = async (text: string) => {
    try {
        const result: IDisplayedProduct[] = await Promise.all([
            kulturaRecords(text),
            playRecords(text),
            ritmRecords(text),
            vinylBoxRecords(text),
        ])

        const flatResult = result.flat();

        return flatResult;
    } catch (e) {
        console.error(e);
    }
};

export default getRecords;
