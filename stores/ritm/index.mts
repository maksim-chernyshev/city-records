import getJson from '../../helpers/getJson.mts';
import {type IDisplayedProduct, type IRecordStore, RecordStores} from '../../interfaces/types.mts';
import type {IRitmProductRaw} from "./types.mts";

const STORE_NAME = RecordStores.Ritm;

const HOST = 'https://ritm.store';

const getRitmStoreQuery = (text: string) => {
    const encodedText = encodeURI(text);

    return `https://ritm.store/ajax/search.php?value=${encodedText}`;
};

const ritmRecords = async (text: string): Promise<IRecordStore> => {
    const data = await getJson(getRitmStoreQuery(text));

    const products = data.PRODUCTS;

    const items = products.map((product: IRitmProductRaw): IDisplayedProduct => {
        const price = product.FORMATED_PRICE.replace(/&nbsp;/g, '')
            .replace(/&#8381;/g, '')
            .replace(/\D/g, '');

        return {
            title: product.NAME || '',
            price: price || '',
            link: `${HOST}${product.DETAIL_PAGE_URL}` || '',
            image: `${HOST}${product.MORE_PHOTO}` || '',
        };
    });

    return {
        store: STORE_NAME,
        products: items,
    }
};

export default ritmRecords;
