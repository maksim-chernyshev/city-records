import https from "https";

const getJson = (url: string) =>
    new Promise<any>((resolve, reject) => {
        https
            .get(url, (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    resolve(JSON.parse(body));
                });
            })
            .on("error", reject);
    });

export default getJson;
