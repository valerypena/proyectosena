import { API_URL } from '../config';

/**
 * Cliente HTTP unificado con inyección de JWT y manejo centralizado de respuestas.
 */
export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        ...(options.headers || {}),
    };

    if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            // Si el token expiró o es inválido, limpiar sesión
            if (token) {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('auth-logout'));
            }
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage = data?.detail || `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        throw error;
    }
}
