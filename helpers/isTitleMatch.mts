function isTitleMatch(searchedText?: string, fullTitle?: string) {
    if (!searchedText || !fullTitle) {
        return '';
    }

    const lowerCasedSearchedText = searchedText.toLowerCase();
    const lowerCasedFullTitle = fullTitle.toLowerCase();

    return lowerCasedFullTitle.includes(lowerCasedSearchedText);
}

export { isTitleMatch };
