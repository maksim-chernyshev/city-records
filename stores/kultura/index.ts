import type { IKulturaProduct } from "./types.ts";
import getJson from "../../helpers/getJson.ts";
import {
    type IDisplayedProduct,
    type IRecordStore,
    RecordStores,
} from "../../interfaces/types.ts";

const STORE_NAME = RecordStores.Kultura;
const STORE_SEARCH_URL = process.env.KULTURA_REQUEST_URL;

const getKulturaStoreQuery = (text: string) => {
    const encodedText = encodeURI(text);

    return `${STORE_SEARCH_URL}${encodedText}`;
};

const kulturaRecords = async (text: string): Promise<IRecordStore> => {
    const data = await getJson(getKulturaStoreQuery(text));
    const products: IKulturaProduct[] = data.products;

    const items = products.map((product): IDisplayedProduct => {
        const roundedPrice =
            product.price && Math.floor(Number(product.price)).toString();

        return {
            title: product.title || "",
            price: roundedPrice || "",
            quantity: product.quantity || "",
            link: product.url || "",
            image: JSON.parse(product.gallery)[0].img || "",
        };
    });

    return {
        store: STORE_NAME,
        products: items,
    };
};

export default kulturaRecords;
