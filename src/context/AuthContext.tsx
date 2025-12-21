"use client";

import { config } from "@/config";
import { useRouter } from "next/navigation";
import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    ReactNode,
} from "react";

interface AuthContextPayload {
    user: User | null;
    loading: boolean;
    login: (user: User) => void,
    logout: () => void;
    handleReFetchUser: () => void;
}

type User = {
    id: string;
    username: string;
    email: string;
};

type State = {
    user: User | null;
    loading: boolean;
};

type Action =
    | { type: "LOGIN"; payload: User }
    | { type: "LOGOUT" }
    | { type: "INIT"; payload: User | null };

const initialState: State = {
    user: null,
    loading: true,
};

function authReducer(state: State, action: Action): State {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload, loading: false };

        case "LOGOUT":
            return { user: null, loading: false };

        case "INIT":
            return { user: action.payload, loading: false };

        default:
            return state;
    }
}

const AuthContext = createContext<AuthContextPayload | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const router = useRouter();

    const handleReFetchUser = () => {
        const storedUser = localStorage.getItem("user-details");
        if (storedUser) {
            dispatch({ type: "INIT", payload: JSON.parse(storedUser) });
        } else {
            dispatch({ type: "INIT", payload: null });
        }
    }

    useEffect(() => {
        handleReFetchUser();
    }, []);


    const login = (user: User) => {
        localStorage.setItem("user-details", JSON.stringify(user));
        dispatch({ type: "LOGIN", payload: user });
    };

    const logout = async () => {
        localStorage.removeItem("user-details");
        await fetch(`${config.baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
        dispatch({ type: "LOGOUT" });
        router.push("/sign-in");
    };



    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                loading: state.loading,
                login,
                logout,
                handleReFetchUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
