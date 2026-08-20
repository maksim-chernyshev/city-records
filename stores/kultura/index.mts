import type { IKulturaProduct } from './types.mts';
import getJson from '../../helpers/getJson.mts';
import { searchQuery } from '../../data/data.mts';
import type { IDisplayedProduct } from '../../interfaces/types.mts';

const STORE_NAME = 'Kultura';

const getKulturaStoreQuery = (text: string) => {
    const encodedText = encodeURI(text);

    return `https://store.tildaapi.com/api/getproductslist/?storepartuid=794705076345&recid=197833805&c=1787152012654&getparts=true&getoptions=true&slice=1&filters%5Bcharact%3A386528%5D%5B0%5D=LP&filters%5Bquantity%5D=y&filters%5Bquery%5D%5B0%5D=${encodedText}&sort%5Bcreated%5D=desc&size=36&flag_root=withroot`;
};

const kulturaRecords = async () => {
    const data = await getJson(getKulturaStoreQuery(searchQuery));
    const products: IKulturaProduct[] = data.products;

    const items = products.map((product): IDisplayedProduct => {
        const roundedPrice =
            product.price && Math.floor(Number(product.price)).toString();

        return {
            store: STORE_NAME,
            title: product.title || '',
            price: roundedPrice || '',
            quantity: product.quantity || '',
            link: product.url || '',
            image: JSON.parse(product.gallery)[0].img || '',
        };
    });

    return items;
};

export default kulturaRecords;
