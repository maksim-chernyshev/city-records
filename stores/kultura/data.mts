const getKulturaStoreQuery = (text: string) => {
    const encodedText = encodeURI(text);

    return `https://store.tildaapi.com/api/getproductslist/?storepartuid=794705076345&recid=197833805&c=1787152012654&getparts=true&getoptions=true&slice=1&filters%5Bcharact%3A386528%5D%5B0%5D=LP&filters%5Bquantity%5D=y&filters%5Bquery%5D%5B0%5D=${encodedText}&sort%5Bcreated%5D=desc&size=36&flag_root=withroot`;
};

export default getKulturaStoreQuery;
