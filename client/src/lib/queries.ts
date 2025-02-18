export async function fetchWithAuth(url: string, options = {}) {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
        ...options,
        headers: {
           "Authorization": `Token ${token}`
        },
    });

    return response.json();
}