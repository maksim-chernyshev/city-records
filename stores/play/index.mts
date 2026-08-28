import getJson from '../../helpers/getJson.mts';
import type { IDisplayedProduct } from '../../interfaces/types.mts';
import { isTitleMatch } from '../../helpers/isTitleMatch.mts';

const STORE_NAME = 'Play';

const MAX_PRODUCTS_ON_PAGE = 10;
const EXCLUDED_PRODUCTS = 'Значок';

const getPlayStoreQuery = (text: string, page: number = 1) => {
    const encodedText = encodeURI(text);

    return `https://search.tildacdn.com/search/?p=1067415&q=${encodedText}&page=${page}&hs=50&st=all`;
};

const playRecords = async (text: string) => {
    const firstPage = await getJson(getPlayStoreQuery(text));

    const totalProducts = firstPage.total;
    const pages = Math.ceil(totalProducts / MAX_PRODUCTS_ON_PAGE);
    const requestsArray = Array.from(
        { length: pages - 1 },
        (_, index) => index + 2,
    );

    const otherPages = await Promise.all(
        requestsArray.map((page) => getJson(getPlayStoreQuery(text, page))),
    );

    const products = [
        ...firstPage.pages,
        ...otherPages.flatMap((page) => page.pages),
    ];

    const items = products.map((product): IDisplayedProduct | null => {
        const roundedPrice =
            product.product.price &&
            Math.floor(Number(product.product.price)).toString();

        if (!isTitleMatch(text, product.title)) {
            return null;
        }

        return {
            store: STORE_NAME,
            title: product.product.title || '',
            price: roundedPrice || '',
            link: product.pageurl || '',
            image: product.product.img || '',
        };
    });

    const filteredItems = items.filter((item) => {
        return !item?.title.includes(EXCLUDED_PRODUCTS);
    });

    return filteredItems;
};

export default playRecords;
