import https from "https";
import {
    type IDisplayedProduct,
    type IRecordStore,
    RecordStores,
} from "../../interfaces/types.ts";
import * as cheerio from "cheerio";

const STORE_NAME = RecordStores.ImagineClub;
const STORE_SEARCH_URL = process.env.IMAGINE_CLUB_REQUEST_URL;

const HOST = "https://imagine-club.com";

const getImagineClubStoreQuery = (text: string) => {
    return `${STORE_SEARCH_URL}${text}`;
};

const imagineClubRecords = (text: string): Promise<IRecordStore> =>
    new Promise((resolve, reject) => {
        https
            .get(getImagineClubStoreQuery(text), (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    const $ = cheerio.load(body);

                    const data = $.extract({
                        products: [
                            {
                                selector: ".node",
                                value: {
                                    artist: ".field-name-field-artist-ref",
                                    title: ".field-name-title",
                                    price: "button",
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

export default imagineClubRecords;
