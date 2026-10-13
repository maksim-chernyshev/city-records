interface IRitmArtistRaw {
    ID: string;
    UF_NAME: string;
    UF_XML_ID: string;
    UF_UID: string;
    UF_DESCRIPTION: string;
    UF_FULL_DESCRIPTION: string;
}

export interface IRitmProductRaw {
    FORMATED_PRICE: string;
    NAME: string;
    DETAIL_PAGE_URL: string;
    MORE_PHOTO: string;
    ARTIST: IRitmArtistRaw;
}
