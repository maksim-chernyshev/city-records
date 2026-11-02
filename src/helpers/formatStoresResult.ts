import type {
    IDisplayedRecordStore,
    IRecordStore,
} from "../interfaces/types.ts";

const escapeMarkdownV2 = (value: string) =>
    value.replace(/([_\*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");

const formatProductTitle = (title: string, link?: string) => {
    if (!link) return escapeMarkdownV2(title);

    const safeLink = link.replace(/([\\()])/g, "\\$1");
    return `[${escapeMarkdownV2(title)}](${safeLink})`;
};

export function formatStoresResult(
    items: IRecordStore[],
): IDisplayedRecordStore[] {
    return items.map((item) => {
        let content = "";

        for (const product of item.products) {
            content += `${formatProductTitle(product.title, product.link)}\n${escapeMarkdownV2(product.price)} р\\.\n\n`;
        }

        return {
            store: item.store,
            content,
        };
    });
}
