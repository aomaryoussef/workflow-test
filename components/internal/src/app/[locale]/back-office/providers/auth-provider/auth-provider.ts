"use client";

import {AuthBindings} from "@refinedev/core";
import Cookies from "js-cookie";
import axios, { isAxiosError } from "axios";

const locale = Cookies.get("NEXT_LOCALE");

export const authProvider: AuthBindings = {
    login: async (values) => {
        try {
            const fd = new FormData();
            fd.append("csrf_token", values.csrfToken);
            fd.append("method", "password");
            fd.append("identifier", values.email);
            fd.append("password", values.password);
            const response = await axios.post(values.loginAction, fd, {
                withCredentials: true,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const response = await axios.get('/en/back-office/private/api/getDefaultURL');
                const defaultURL = response.data.defaultURL;
                return {
                    success: true,
                    redirectTo: `/${locale}${defaultURL}`,
                };
            }
            return {
                success: false,
                error: {
                    name: "LoginError",
                    message: "Invalid username or password",
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    name: "LoginError",
                    message: "Invalid username or password",
                },
            };
        }
    },
    logout: async () => {
        try {
            const {data} = await axios.get(`/.ory/kratos/public/self-service/logout/browser`, {
                withCredentials: true,
            });
            const {logout_token, logout_url} = data;
            const logout_response = await axios.get(logout_url, {
                withCredentials: true,
            });
            return {
                success: true,
                redirectTo: `/${locale}/back-office/public/login`,
            };
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 401) {
                return {
                    success: true,
                    redirectTo: `/${locale}/back-office/public/login`,
                };
            }
            return {
                success: false,
                error: {
                    name: "LogoutError",
                    message: "Logout failed",
                },
            }
        }
    },
    check: async () => {
        const auth = Cookies.get("auth");
        const locale = Cookies.get("NEXT_LOCALE");
        if (auth) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: `/${locale}/login`,
        };
    },
    getPermissions: async () => {
        const auth = Cookies.get("auth");
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser.roles;
        }
        return null;
    },
    getIdentity: async () => {
        const auth = Cookies.get("auth");
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser;
        }
        return null;
    },
    onError: async (error) => {
        if (error.response?.status === 401) {
            return {
                logout: true,
            };
        }

        return {error};
    },
};