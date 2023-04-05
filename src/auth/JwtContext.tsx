import React, {createContext, useEffect, useReducer, useCallback, useMemo} from 'react';
// utils
import axios from 'axios';
//
import {ActionMapType, AuthStateType, AuthUserType, JWTContextType} from './types';

enum Types {
    VERIFY = 'VERIFY',
    REGISTER = 'REGISTER',
}

type Payload = {
    [Types.VERIFY]: {
        user: AuthUserType;
    };
    [Types.REGISTER]: {
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
    if (action.type === Types.REGISTER) {
        return {
            ...state,
            isAuthenticated: false,
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


    const register = useCallback(
        async (
            email: string,
            digit: string,
        ) => {
            const response = await axios.post('http://43.206.151.17/users/register', {
                email,
                digit,
            });

            const {message, user} = response.data;

            dispatch({
                type: Types.REGISTER,
                payload: {
                    user,
                },
            });

            return message;
        },
        [],
    );
    // Verify
    const verify = useCallback(
        async (type: string, code: string) => {
            const response = await axios.post('http://43.206.151.17/users/validate', {
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
            register,
        }),
        [
            state.isInitialized,
            state.isAuthenticated,
            state.user,
            verify,
            register,
        ],
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
