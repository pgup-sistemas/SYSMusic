// api/index.ts

// Base URL for the backend API
export const API_URL = '/api'; // Using a proxy in development

/**
 * Retrieves the stored authentication token.
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

/**
 * Creates standard headers for API requests, including the Authorization token if available.
 */
export const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * A wrapper around fetch to handle errors and JSON parsing.
 */
export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        // Try to parse error message from backend
        const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro na comunicação com o servidor.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }
    return response.json();
};
