export const BASE_URL = "https://api-duo.truonghuyhoang.com/Player Duo"

export const myFetch = async (params: any) => {
    const [url, headers, ops] = params;

    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: {'accept': 'application/json',
            ...headers},
        ...ops
    });

    return res.json()
};

export const arFetcher = (urlArray: any) => {
    if(urlArray)
        return Promise.all(urlArray.map(myFetch));
};

export const commonHeaders = {
    accept: "application/json",
    "Content-Type": "application/json"
}

export const getStaticFile = (path: string | null) => {
    if(!path) return ''
    return `${BASE_URL}/file/path?path=${path}`
}

