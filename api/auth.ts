// api/auth.ts
import { User, Role } from '../types';
import { API_URL, getHeaders, apiFetch } from './index';

interface LoginResponse {
    user: User;
    access_token: string;
}

export const login = async (email: string, password: string): Promise<User> => {
    // In a real app, you'd send a POST request to your backend
    // This is a placeholder for the backend call
    const response: LoginResponse = await apiFetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    }).catch(() => {
        // Mock a successful login if the API fails, for demonstration purposes.
        // In a real scenario, this catch block would re-throw the error.
        console.warn("Login API call failed. Falling back to mock data for demonstration.");
        // FIX: Use Role enum instead of string literal for type safety.
        const mockUser = { id: 1, name: 'Diretor Silva', email: 'diretor@music.com', role: Role.Admin, avatarUrl: 'https://picsum.photos/seed/admin/100/100', isActive: true };
        return { user: mockUser, access_token: 'mock-jwt-token-for-dev' };
    });

    if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
    }
    return response.user;
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
};

export const getCurrentUser = async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return null;
    }
    try {
        const user: User = await apiFetch(`${API_URL}/users/me`, {
            headers: getHeaders(),
        });
        return user;
    } catch (error) {
        console.error("Failed to fetch current user, token might be invalid.", error);
        logout(); // Clear invalid token
        // Fallback for demonstration if /users/me fails
        if (token === 'mock-jwt-token-for-dev') {
            // FIX: Use Role enum instead of string literal to match the 'Role' type.
            return { id: 1, name: 'Diretor Silva', email: 'diretor@music.com', role: Role.Admin, avatarUrl: 'https://picsum.photos/seed/admin/100/100', isActive: true };
        }
        return null;
    }
};