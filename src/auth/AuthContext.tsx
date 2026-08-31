import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const API_BASE_URL = "http://localhost:5203";

export type AuthUser = {
    userId?: number | string;
    username: string;
    profileURL?: string | null;
};

type AuthApiResponse = {
    user?: Partial<AuthUser> & { userName?: string };
    userId?: number | string;
    id?: number | string;
    email?: string;
    username?: string;
    userName?: string;
    profileURL?: string | null;
    profileUrl?: string | null;
    profilePictureUrl?: string | null;
    userProfilePictureUrl?: string | null;
};

type AuthContextValue = {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (user: AuthUser) => void;
    logout: () => Promise<void>;
    refreshCurrentUser: () => Promise<AuthUser | null>;
};


const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    function login(authenticatedUser: AuthUser) {
        setUser(authenticatedUser);
    }

    async function refreshCurrentUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                credentials: "include",
            });

            if (!response.ok) {
                setUser(null);
                return null;
            }

            const authApiResponse = await response.json();
            const currentUser = getAuthUserFromResponse(authApiResponse);

            setUser(currentUser);
            return currentUser;
        } catch {
            setUser(null);
            return null;
        }
    }

    async function logout() {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        }).catch(() => null);

        setUser(null);
    }

    useEffect(() => {
        refreshCurrentUser().finally(() => setIsLoading(false));
    }, []);

    const authContextValue = useMemo(
        () => ({
            user,
            isLoading,
            isAuthenticated: user !== null,
            login,
            logout,
            refreshCurrentUser,
        }),
        [user, isLoading]
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


// Construct a global user auth object after login
export function getAuthUserFromResponse(
    authApiResponse: AuthApiResponse | null,
    fallbackUser?: AuthUser
) {
    // Auth endpoints often return either { user: {...} }
    // or a flatter shape like { email: "...", username: "..." }.
    const apiUser = authApiResponse?.user;

    return {
        // Prefer values from the API response, then fall back to the form data
        // so the auth state still has a usable user after a successful request.
        userId: apiUser?.userId ?? authApiResponse?.userId ?? authApiResponse?.id,
        username:
            apiUser?.username ??
            apiUser?.userName ??
            authApiResponse?.username ??
            authApiResponse?.userName ??
            fallbackUser?.username ??
            "",
        profileURL:
            apiUser?.profileURL ??
            authApiResponse?.profileURL ??
            authApiResponse?.profileUrl ??
            authApiResponse?.profilePictureUrl ??
            authApiResponse?.userProfilePictureUrl ??
            fallbackUser?.profileURL ??
            null,
    };
}
