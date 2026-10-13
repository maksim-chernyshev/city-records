export const RecordStores = {
    Kultura: "Kultura",
    Play: "Play",
    Ritm: "Ritm",
    Vinylbox: "Vinylbox",
} as const;

export interface IDisplayedProduct {
    title: string;
    price: string;
    quantity?: string;
    link: string;
    image?: string;
}

export interface IRecordStore {
    store: keyof typeof RecordStores;
    products: IDisplayedProduct[];
}

export interface IDisplayedRecordStore extends Pick<IRecordStore, "store"> {
    content: string;
}
