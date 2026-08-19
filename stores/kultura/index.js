const https = require('https');
const getKulturaStoreQuery = require('./data');

const searchQuery = 'dj';

const kulturaRecords = https.get(getKulturaStoreQuery(searchQuery), (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        const products = JSON.parse(body).products;

        const items = products.map((product) => {
            return {
                title: product.title,
                price: product.price,
                quantity: product.quantity,
                link: product.url,
            };
        });

        console.log(items);
    });
});

kulturaRecords.on('error', console.error);
