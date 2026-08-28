import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

const AUTH_USER_STORAGE_KEY = "cineshare-auth-user";
const AUTH_TOKEN_STORAGE_KEY = "cineshare-auth-token";

export type AuthUser = {
    userId?: number | string;
    email: string;
    username: string;
};

type AuthApiResponse = {
    token?: string;
    accessToken?: string;
    user?: Partial<AuthUser>;
    userId?: number | string;
    id?: number | string;
    email?: string;
    username?: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: AuthUser, token?: string | null) => void;
    logout: () => void;
};


const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser() {
    const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as AuthUser;
    } catch {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    );

    function login(authenticatedUser: AuthUser, authToken?: string | null) {
        setUser(authenticatedUser);
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authenticatedUser));

        setToken(authToken ?? null);

        if (authToken) {
            localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken);
        } else {
            localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        }
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }

    const authContextValue = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: user !== null,
            login,
            logout,
        }),
        [user, token]
    );

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }

    return authContext;
}

export function getAuthDataFromResponse(
    authApiResponse: AuthApiResponse | null,
    fallbackUser: AuthUser
) {
    const apiUser = authApiResponse?.user;

    return {
        user: {
            userId: apiUser?.userId ?? authApiResponse?.userId ?? authApiResponse?.id,
            email: apiUser?.email ?? authApiResponse?.email ?? fallbackUser.email,
            username: apiUser?.username ?? authApiResponse?.username ?? fallbackUser.username,
        },
        token: authApiResponse?.token ?? authApiResponse?.accessToken ?? null,
    };
}
