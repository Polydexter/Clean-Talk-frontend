import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import AuthService from "../services/AuthService";
import authHeader from "../services/AuthHeader";

const DefaultProps = {
    login: () => null,
    logout: () => null,
    authAxios: axios,
    user: null,
};

export const AuthContext = createContext(DefaultProps);

export const AuthContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => AuthService.getCurrentUser());

    async function login(username, password) {
        console.log("Context method triggered")
        const data = await AuthService.login(username, password);
        setUser(data);
        return data;
    }

    function logout() {
        AuthService.logout();
        setUser(null);
        navigate("/login");
    }

    const authAxios = axios.create();

    // interceptor for adding token
    authAxios.interceptors.request.use((config) => {
        config.headers = authHeader();
        return config;
    });

    authAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 401) {
                logout();
            }
            return Promise.reject(error)
        }
    );

    return (
        <AuthContext.Provider value={{ user, login, logout, authAxios }}>
            {children}
        </AuthContext.Provider>
    );
};

