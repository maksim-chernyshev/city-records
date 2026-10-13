import getJson from "../../helpers/getJson.ts";
import {
    type IDisplayedProduct,
    type IRecordStore,
    RecordStores,
} from "../../interfaces/types.ts";

const STORE_NAME = RecordStores.Play;
const STORE_SEARCH_URL = process.env.PLAY_REQUEST_URL;

const MAX_PRODUCTS_ON_PAGE = 10;
const EXCLUDED_PRODUCTS = "Значок";

const getPlayStoreQuery = (text: string, page: number = 1) => {
    const encodedText = encodeURI(text);

    return `${STORE_SEARCH_URL}${encodedText}&page=${page}`;
};

const playRecords = async (text: string): Promise<IRecordStore> => {
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

    const items = products.map((product): IDisplayedProduct => {
        const roundedPrice =
            product.product.price &&
            Math.floor(Number(product.product.price)).toString();

        return {
            title: product.product.title || "",
            price: roundedPrice || "",
            link: product.pageurl || "",
            image: product.product.img || "",
        };
    });

    const filteredItems = items.filter((item) => {
        return !item.title.includes(EXCLUDED_PRODUCTS);
    });

    return {
        store: STORE_NAME,
        products: filteredItems,
    };
};

export default playRecords;
