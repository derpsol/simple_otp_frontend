import React, {createContext, useEffect, useReducer, useCallback, useMemo} from 'react';
// utils
import axios from 'axios';
//
import {ActionMapType, AuthStateType, AuthUserType, JWTContextType} from './types';

enum Types {
    VERIFY = 'VERIFY',
}

type Payload = {
    [Types.VERIFY]: {
        user: AuthUserType;
    };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
    if (action.type === Types.VERIFY) {
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
        };
    }
    return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
    children: React.ReactNode;
};

export function AuthProvider({children}: AuthProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Verify
    const verify = useCallback(
        async (type: string, code: string) => {
            const response = await axios.post('/users/validate', {
                type,
                code,
                _id: state.user?._id,
            });
            const {message} = response.data;

            return message;
        },
        [state.user],
    );

    const memoizedValue = useMemo(
        () => ({
            isInitialized: state.isInitialized,
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            method: 'jwt',
            verify,
        }),
        [
            state.isInitialized,
            state.isAuthenticated,
            state.user,
            verify,
        ],
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
