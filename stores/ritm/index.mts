import getJson from '../../helpers/getJson.mts';
import { searchQuery } from '../../data/data.mts';
import type { IDisplayedProduct } from '../../interfaces/types.mts';

const STORE_NAME = 'Ritm';

const HOST = 'https://ritm.store';

const getRitmStoreQuery = (text: string) => {
    const encodedText = encodeURI(text);

    return `https://ritm.store/ajax/search.php?value=${encodedText}`;
};

const ritmRecords = async () => {
    const data = await getJson(getRitmStoreQuery(searchQuery));

    const products = data.PRODUCTS;

    const items = products.map((product): IDisplayedProduct => {
        const price = product.FORMATED_PRICE.replace(/&nbsp;/g, '')
            .replace(/&#8381;/g, '')
            .replace(/\D/g, '');

        return {
            store: STORE_NAME,
            title: product.NAME || '',
            price: price || '',
            link: `${HOST}${product.DETAIL_PAGE_URL}` || '',
            image: `${HOST}${product.MORE_PHOTO}` || '',
        };
    });

    return items;
};

export default ritmRecords;
