import https from 'https';
import type { IDisplayedProduct } from '../../interfaces/types.mts';
import * as cheerio from 'cheerio';
import { isTitleMatch } from '../../helpers/isTitleMatch.mts';

const STORE_NAME = 'Vinyl Box';

const HOST = 'https://vinylbox.ru';

const getVinylBoxStoreQuery = (text: string) => {
    const encodedText = text.replaceAll(' ', '+');

    return `https://vinylbox.ru/new-products/search/result?setsearchdata=1&category_id=0&add_desc_in_search=1&search=${encodedText}`;
};

const vinylBoxRecords = (text: string) =>
    new Promise<IDisplayedProduct[]>((resolve, reject) => {
        https
            .get(getVinylBoxStoreQuery(text), (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    const $ = cheerio.load(body);

                    const data = $.extract({
                        products: [
                            {
                                selector: '.product',
                                value: {
                                    title: '.name',
                                    description: '.description',
                                    price: '.jshop_price',
                                    link: {
                                        selector: 'a',
                                        value: 'href',
                                    },
                                    image: {
                                        selector: 'img',
                                        value: 'src',
                                    },
                                },
                            },
                        ],
                    });

                    const items = data.products.map(
                        (product): IDisplayedProduct | null => {
                            const trimmedTitle = product.title?.trim();
                            const trimmedDesc = product.description?.trim();
                            const trimmedPrice = product.price
                                ?.trim()
                                .replace(/\D/g, '');
                            const trimmedLink = `${HOST}${product.link?.trim()}`;
                            const trimmedImg = product.image?.trim();

                            if (!isTitleMatch(text, trimmedTitle)) {
                                return null;
                            }

                            return {
                                store: STORE_NAME,
                                title: `${trimmedTitle} - ${trimmedDesc}` || '',
                                price: trimmedPrice || '',
                                link: trimmedLink || '',
                                image: trimmedImg || '',
                            };
                        },
                    );

                    resolve(items);
                });
            })
            .on('error', reject);
    });

export default vinylBoxRecords;
