import type {IDisplayedRecordStore, IRecordStore} from "../interfaces/types.mts";

export function formatStoresResult(items: IRecordStore[]): IDisplayedRecordStore[] {
    return items.map((item) => {
        let content = '';

        for (const product of item.products) {
            content += `Название: ${product.title}\nЦена: ${product.price} р.\nСсылка: ${product.link}\n\n`
        }

        return {
            store: item.store,
            content,
        }
    })
}


