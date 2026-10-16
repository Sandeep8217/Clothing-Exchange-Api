import {useState} from "react";
import {loginUser, registerUser} from "../api/auth";

export default function useAuth() {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("rewearUser");
            return saved ? JSON.parse(saved) : null;
        } catch {
            localStorage.removeItem("rewearUser");
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem("rewearToken"));
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    async function login(credentials) {
        setAuthLoading(true);
        setAuthError("");
        try {
            const result = await loginUser(credentials);
            localStorage.setItem("rewearToken", result.token);
            localStorage.setItem("rewearUser", JSON.stringify(result.user));
            setToken(result.token);
            setUser(result.user);
            return result;
        } catch (error) {
            setAuthError(error.message || "Login failed");
            throw error;
        } finally {
            setAuthLoading(false);
        }
    }

    async function register(data) {
        setAuthLoading(true);
        setAuthError("");
        try {
            return await registerUser(data);
        } catch (error) {
            setAuthError(error.message || "Registration failed");
            throw error;
        } finally {
            setAuthLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem("rewearToken");
        localStorage.removeItem("rewearUser");
        setToken(null);
        setUser(null);
        setAuthError("");
    }


    return {
        user,
        token,
        isAuthenticated: Boolean(token && user),
        authLoading,
        authError,
        login,
        register,
        logout,
        setAuthError,
        setUser,
    };

}
