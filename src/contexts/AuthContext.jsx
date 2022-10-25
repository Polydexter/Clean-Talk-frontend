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
        console.log("Context login method triggered")
        const data = await AuthService.login(email, password);
        console.log("Response of middle login method(AuthContext level): ", data)
        // This contains either a pair of token (to extract username)
        if (data.access) {
            // If login was successfull - obtain username by decoding the access token
            const access = jwt_decode(data.access)
            const username = access.username
            setUser(username);
            setTokens({"access": data.access, "refresh": data.refresh})
            console.log("Tokens set on Context level: ", tokens);
        }
        // In any case it passes initial answer (tokens or error) up to the component
        return data;
    }

    function logout() {
        AuthService.logout();
        setUser(null);
        navigate("/login");
    }

    // When called, sends current refresh token to API in order to get new pair of tokens.
    async function refreshTokens() {
        const currentTokens = AuthService.getCurrentUserTokens();
        console.log("Context. Old tokens, as obtained on the top of the function: ", currentTokens)

        try {
            const response = await axios.post("http://localhost:8000/api/token/refresh/", {
                "refresh": currentTokens.refresh,
            });
            console.log("Context function (response to request for new tokens): ", response)
            var newTokens = response.data;

            if (!newTokens.access) {
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
            }

            AuthService.setTokensInLocalStorage(newTokens);
            const x = AuthService.getCurrentUserTokens();
            console.log("Context. Renewd tokens at the bottom: ", x)

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

