import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API = 'http://localhost:8000/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Login failed');
        setToken(data.access_token);
        setUser(data.user);
        return data;
    };

    const signup = async (email, password, full_name, country) => {
        const res = await fetch(`${API}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name, country }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Signup failed');
        if (data.access_token) {
            setToken(data.access_token);
            setUser(data.user);
        }
        return data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const updateUser = (updates) => {
        setUser(prev => prev ? { ...prev, ...updates } : prev);
    };

    const authFetch = async (endpoint, options = {}) => {
        const res = await fetch(`${API}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        });
        if (res.status === 401) {
            logout();
            throw new Error('Session expired');
        }
        return res;
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, authFetch, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

/** Wrap any route that requires auth */
export const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();

    if (!token) {
        // No token in memory → go to login
        window.location.href = '/login';
        return null;
    }

    return children;
};

export default AuthContext;
