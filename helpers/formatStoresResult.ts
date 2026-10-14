import type {
    IDisplayedRecordStore,
    IRecordStore,
} from "../interfaces/types.ts";

export function formatStoresResult(
    items: IRecordStore[],
): IDisplayedRecordStore[] {
    return items.map((item) => {
        let content = "";

        for (const product of item.products) {
            content += `${product.title}\n${product.price} р.\n${product.link}\n\n`;
        }

        return {
            store: item.store,
            content,
        };
    });
}
