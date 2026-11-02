interface IRecordEdition {
    uid?: number;
    price?: string;
    priceold?: string;
    sku?: string;
    quantity?: string;
    img?: string;
}

interface ICharacteristic {
    title?: string;
    value?: string;
}

export interface IKulturaProduct {
    uid?: number;
    title?: string;
    sku?: string;
    text?: string;
    mark?: string;
    quantity?: string;
    portion?: number;
    unit?: string;
    single?: string;
    price?: string;
    priceold?: string;
    descr?: string;
    gallery?: any;
    buttonlink?: string;
    buttontarget?: string;
    json_options?: string;
    sort?: number;
    url?: string;
    pack_label?: string;
    pack_x?: number;
    pack_y?: number;
    pack_z?: number;
    pack_m?: number;
    partuids?: string;
    brand?: string;
    externalid?: string;
    editions?: IRecordEdition[];
    characteristics?: ICharacteristic[];
}
