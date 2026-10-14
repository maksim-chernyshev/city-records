import https from "https";
import {
    type IDisplayedProduct,
    type IRecordStore,
    RecordStores,
} from "../../interfaces/types.ts";
import * as cheerio from "cheerio";

const STORE_NAME = RecordStores.Phonoteka;
const STORE_SEARCH_URL = process.env.PHONOTEKA_REQUEST_URL;

const HOST = "https://plastinka.com";

const getPhonotekaStoreQuery = (text: string) => {
    const encodedText = encodeURI(text);

    console.log(`${STORE_SEARCH_URL}${encodedText}`);

    return `${STORE_SEARCH_URL}${encodedText}`;
};

const phonotekaRecords = (text: string): Promise<IRecordStore> =>
    new Promise((resolve, reject) => {
        https
            .get(getPhonotekaStoreQuery(text), (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    // console.log(body);

                    const $ = cheerio.load(body);

                    const data = $.extract({
                        products: [
                            {
                                selector: `#products-list-box .products-grid-item`,
                                value: {
                                    artist: ".products-grid-item__artist a",
                                    title: ".products-grid-item__title",
                                    price: {
                                        selector:
                                            ".products-grid-item__price meta",
                                        value: "content",
                                    },
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

                    const items = data.products.reduce(
                        (acc, curr): IDisplayedProduct[] => {
                            const trimmedArtist = curr.artist?.trim();
                            const trimmedTitle = curr.title?.trim();
                            const trimmedPrice = curr.price
                                ?.trim()
                                .replace(/\D/g, "");
                            const trimmedLink = `${HOST}${curr.link?.trim()}`;
                            const trimmedImg = curr.image?.trim();

                            if (
                                !trimmedArtist
                                    ?.toLocaleLowerCase()
                                    .includes(text.toLowerCase()) &&
                                !trimmedTitle
                                    ?.toLocaleLowerCase()
                                    .includes(text.toLowerCase())
                            ) {
                                return acc;
                            }

                            return [
                                ...acc,
                                {
                                    title:
                                        `${trimmedArtist} - ${trimmedTitle}` ||
                                        "",
                                    price: trimmedPrice || "",
                                    link: trimmedLink || "",
                                    image: trimmedImg || "",
                                },
                            ];
                        },
                        [],
                    );

                    resolve({
                        store: STORE_NAME,
                        products: items,
                    });
                });
            })
            .on("error", reject);
    });

export default phonotekaRecords;
