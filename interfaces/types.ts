export const RecordStores = {
    Kultura: "Kultura",
    Play: "Play",
    Ritm: "Ritm",
    Vinylbox: "Vinylbox",
    ImagineClub: "Imagine Club",
} as const;

export type RecordStore = (typeof RecordStores)[keyof typeof RecordStores];

export interface IDisplayedProduct {
    title: string;
    price: string;
    quantity?: string;
    link: string;
    image?: string;
}

export interface IRecordStore {
    store: RecordStore;
    products: IDisplayedProduct[];
}

export interface IDisplayedRecordStore extends Pick<IRecordStore, "store"> {
    content: string;
}
