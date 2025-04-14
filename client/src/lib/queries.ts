export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});
    
    if (token) {
        headers.set("Authorization", `Token ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });
    return response;
}
