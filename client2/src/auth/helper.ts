function makeHeaders(token: string) {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

async function makeUrl(path: string) {
    const slashlessPath = path.startsWith("/") ? path.slice(1) : path;
    const domainResponse = await fetch("/api-info.json");
    const { domain } = await domainResponse.json();
    const domainSlash = domain.endsWith("/") ? domain : `${domain}/`;
    return `${domainSlash}${slashlessPath}`;
}

export async function authenticatedGet(token: string, path: string) {
    const url = await makeUrl(path);
    const headers = makeHeaders(token);
    const response = await fetch(url, { headers });
    const data = await response.json();
    return data;
}

export async function authenticatedPost<T>(token: string, path: string, body: T) {
    const url = await makeUrl(path);
    const headers = makeHeaders(token);
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return [data, response.status];
}
export async function authenticatedDelete(token: string, path: string) {
    const url = await makeUrl(path);
    const headers = makeHeaders(token);
    const response = await fetch(url, {
        method: "DELETE",
        headers,
    });
    const data = await response.json();
    return [data, response.status];
}

export async function authenticatedPut<T>(token: string, path: string, body: T): Promise<number> {
    const url = await makeUrl(path);
    const headers = makeHeaders(token);
    const result = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
    });
    return result.status;
    // const data = await response.json();
    // return data;
}
