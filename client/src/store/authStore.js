import { create } from "zustand";
import { API_BASE } from "../lib/utils";

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem("docura_user") || "null"),
    token: localStorage.getItem("docura_token") || null,
    loading: false,
    error: null,

    setAuth: (user, token) => {
        localStorage.setItem("docura_user", JSON.stringify(user));
        localStorage.setItem("docura_token", token);
        set({ user, token, error: null });
    },

    register: async ({ name, email, password }) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");
            get().setAuth(data.user, data.token);
            set({ loading: false });
            return data;
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");
            get().setAuth(data.user, data.token);
            set({ loading: false });
            return data;
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem("docura_user");
        localStorage.removeItem("docura_token");
        set({ user: null, token: null });
    },

    getAuthHeaders: () => {
        const token = get().token;
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
}));

export default useAuthStore;
