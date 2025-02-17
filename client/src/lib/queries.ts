export async function fetchWithAuth(url: string, options = {}) {
    let response = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (response.status === 401) {
        await fetch(import.meta.env.VITE_API_URL 
            + "token/refresh/", {
            method: "POST",
            credentials: "include",
        });

        response = await fetch(url, {
            ...options,
            credentials: "include",
        });
    }

    return response.json();
}