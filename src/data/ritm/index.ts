import getJson from "../../helpers/getJson.ts";
import {
    type IDisplayedProduct,
    type IRecordStore,
    RecordStores,
} from "../../interfaces/types.ts";
import type { IRitmProductRaw } from "./types.ts";

const STORE_NAME = RecordStores.Ritm;
const STORE_SEARCH_URL = process.env.RITM_REQUEST_URL;

const HOST = "https://ritm.store";

const getRitmStoreQuery = (text: string) => {
    const encodedText = encodeURI(text);

    return `${STORE_SEARCH_URL}${encodedText}`;
};

const ritmRecords = async (text: string): Promise<IRecordStore> => {
    const data = await getJson(getRitmStoreQuery(text));

    const products: IRitmProductRaw[] = data.PRODUCTS;

    const items = products.reduce((acc, curr): IDisplayedProduct[] => {
        const price = curr.FORMATED_PRICE.replace(/&nbsp;/g, "")
            .replace(/&#8381;/g, "")
            .replace(/\D/g, "");

        if (!curr.NAME.toLowerCase().includes(text.toLowerCase())) {
            return acc;
        }

        return [
            ...acc,
            {
                title: curr.NAME || "",
                price: price || "",
                link: `${HOST}${curr.DETAIL_PAGE_URL}` || "",
                image: `${HOST}${curr.MORE_PHOTO}` || "",
            },
        ];
    }, []);

    return {
        store: STORE_NAME,
        products: items,
    };
};

export default ritmRecords;
