export const convertUrlToFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const extend = url.split('.').pop();
    const fileName = url.split('/').pop();
    const mega = { type: `image/${extend}` };

    return new File([data], fileName as string, mega);
}

export const convertUrlsToFile = async (urls: string[]) => {
    const files: File[] = [];
    urls.map(url => convertUrlToFile(url).then(file => files.push(file)));
    return files;
}

