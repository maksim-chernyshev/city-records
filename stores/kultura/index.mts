import https from 'https';
import getKulturaStoreQuery from './data.mts';
import type { IKulturaProduct, IDisplayedProduct } from './types.mts';
import { log } from 'console';

const searchQuery: string = 'dj';

const kulturaRecords = https.get(getKulturaStoreQuery(searchQuery), (res) => {
    let body: string = '';

    res.on('data', (chunk: string) => {
        body += chunk;
    });

    res.on('end', () => {
        const products: IKulturaProduct[] = JSON.parse(body).products;

        const items = products.map((product): IDisplayedProduct => {
            return {
                title: product.title || '',
                price: product.price || '',
                quantity: product.quantity || '',
                link: product.url || '',
                image: JSON.parse(product.gallery)[0].img || '',
            };
        });

        console.log(items);
    });
});

kulturaRecords.on('error', console.error);
