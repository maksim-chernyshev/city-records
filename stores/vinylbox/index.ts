import https from "https";
import {
    type IDisplayedProduct,
    type IRecordStore,
    RecordStores,
} from "../../interfaces/types.ts";
import * as cheerio from "cheerio";

const STORE_NAME = RecordStores.Vinylbox;
const STORE_SEARCH_URL = process.env.VINYLBOX_REQUEST_URL;

const HOST = "https://vinylbox.ru";

const getVinylBoxStoreQuery = (text: string) => {
    const encodedText = text.replaceAll(" ", "+");

    return `${STORE_SEARCH_URL}${encodedText}`;
};

const vinylBoxRecords = (text: string): Promise<IRecordStore> =>
    new Promise((resolve, reject) => {
        https
            .get(getVinylBoxStoreQuery(text), (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    const $ = cheerio.load(body);

                    const data = $.extract({
                        products: [
                            {
                                selector: ".product",
                                value: {
                                    title: ".name",
                                    description: ".description",
                                    price: ".jshop_price",
                                    link: {
                                        selector: "a",
                                        value: "href",
                                    },
                                    image: {
                                        selector: "img",
                                        value: "src",
                                    },
                                },
                            },
                        ],
                    });

                    const items = data.products.map(
                        (product): IDisplayedProduct => {
                            const trimmedTitle = product.title?.trim();
                            const trimmedDesc = product.description?.trim();
                            const trimmedPrice = product.price
                                ?.trim()
                                .replace(/\D/g, "");
                            const trimmedLink = `${HOST}${product.link?.trim()}`;
                            const trimmedImg = product.image?.trim();

                            return {
                                title: `${trimmedTitle} - ${trimmedDesc}` || "",
                                price: trimmedPrice || "",
                                link: trimmedLink || "",
                                image: trimmedImg || "",
                            };
                        },
                    );

                    resolve({
                        store: STORE_NAME,
                        products: items,
                    });
                });
            })
            .on("error", reject);
    });

export default vinylBoxRecords;
