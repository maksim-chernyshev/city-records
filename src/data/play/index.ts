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

    const items = products.reduce((acc, curr): IDisplayedProduct[] => {
        const roundedPrice =
            curr.product.price &&
            Math.floor(Number(curr.product.price)).toString();

        if (!curr.product.title.toLowerCase().includes(text.toLowerCase())) {
            return acc;
        }

        return [
            ...acc,
            {
                title: curr.product.title || "",
                price: roundedPrice || "",
                link: curr.pageurl || "",
                image: curr.product.img || "",
            },
        ];
    }, []);

    const filteredItems = items.filter((item: IDisplayedProduct) => {
        return !item.title.includes(EXCLUDED_PRODUCTS);
    });

    return {
        store: STORE_NAME,
        products: filteredItems,
    };
};

export default playRecords;
