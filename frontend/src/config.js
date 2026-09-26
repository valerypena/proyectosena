// Normaliza VITE_API_URL: acepta "https://mi-api.onrender.com", "mi-api.onrender.com" o solo "mi-api"
function resolveApiUrl() {
    let url = (import.meta.env.VITE_API_URL || '').trim();
    if (!url) return 'http://127.0.0.1:8000';
    if (!/^https?:\/\//i.test(url)) {
        if (!url.includes('.') && !url.includes(':')) url += '.onrender.com';
        url = `https://${url}`;
    }
    return url.replace(/\/+$/, '');
}

export const API_URL = resolveApiUrl();
