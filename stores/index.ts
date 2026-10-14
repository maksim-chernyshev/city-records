import playRecords from "./play/index.ts";
import kulturaRecords from "./kultura/index.ts";
import ritmRecords from "./ritm/index.ts";
import vinylBoxRecords from "./vinylbox/index.ts";
import type { IRecordStore } from "../interfaces/types.ts";
import imagineClubRecords from "./imagineClub/index.ts";

const getRecords = async (text: string) => {
    try {
        const result: IRecordStore[] = await Promise.all([
            kulturaRecords(text),
            playRecords(text),
            ritmRecords(text),
            vinylBoxRecords(text),
            imagineClubRecords(text),
        ]);

        return result.flat();
    } catch (e) {
        console.error(e);
    }
};

export default getRecords;
