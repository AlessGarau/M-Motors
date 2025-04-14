export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});

    // Assurez-vous de ne pas écraser d'autres en-têtes existants
    if (token) {
        headers.set("Authorization", `Token ${token}`);
    }

    // // Définit le Content-Type pour les requêtes JSON si non défini
    // if (!headers.has("Content-Type") && options.method !== "GET") {
    //     // headers.set("Content-Type", "application/json");
    // }
    const response = await fetch(url, {
        ...options,
        headers,
    });
    return response;
}
