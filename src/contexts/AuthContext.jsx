import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import jwt_decode from "jwt-decode";

import AuthService from "../services/AuthService";
import authHeader from "../services/AuthHeader";

const DefaultProps = {
    login: () => null,
    logout: () => null,
    refreshTokens: () => null,
    authAxios: axios,
    user: null,
    tokens: null,
};

export const AuthContext = createContext(DefaultProps);

export const AuthContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => AuthService.getCurrentUser());
    const [tokens, setTokens] = useState(() => AuthService.getCurrentUserTokens());

    async function login(email, password) {
        // Call login funcion from AuthService, return a pair of tokens
        const data = await AuthService.login(email, password);
        // If return value contains an access token...
        if (data.access) {
            // ...obtain username by decoding the access token
            const access = jwt_decode(data.access)
            const username = access.username
            AuthService.setUserInLocalStorage(username)
            setUser(username);
            setTokens({"access": data.access, "refresh": data.refresh})
        }
        console.log("Login (Context level). Current user: ", user)
        return data;
    }

    function logout() {
        AuthService.logout();
        setUser(null);
        navigate("/login");
    }

    // When called, sends current refresh token to API in order to get a new pair of tokens.
    async function refreshTokens() {
        const currentTokens = AuthService.getCurrentUserTokens();
        console.log("Refresh tokens function (step 1). Current refresh token: ", currentTokens.refresh )

        try {
            const response = await axios.post("http://localhost:8000/api/token/refresh/", {
                "refresh": currentTokens.refresh,
            });
            var newTokens = response.data;
            console.log("New tokens obtained (step 2)", newTokens)

            if (!newTokens.access) {
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
            }

            AuthService.setTokensInLocalStorage(newTokens);
            console.log("New tokens as stored (step 3) in the local storage: ", AuthService.getCurrentUserTokens())

            return newTokens
        } catch (error) {
            localStorage.removeItem('tokens');
            localStorage.removeItem('user');
            console.log(error);
        }
    };

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
        <AuthContext.Provider value={{ user, tokens, login, logout, refreshTokens, authAxios }}>
            {children}
        </AuthContext.Provider>
    );
};

