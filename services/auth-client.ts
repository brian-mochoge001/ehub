import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from './api';

const generateUsername = (email: string) => {
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    if (baseUsername.length >= 3) return baseUsername;
    return `${baseUsername || 'user'}user`;
};

export const auth = {
    currentUser: null,
};

export const authClient = {
    signIn: {
        email: async ({ email, password }: any) => {
            try {
                const response = await api.login({ email, password });
                if (!response?.token) {
                    return { data: null, error: { message: 'Login failed: no token returned' } };
                }

                await SecureStore.setItemAsync('backend_token', response.token);
                return {
                    data: {
                        user: {
                            email: response.email,
                            user_id: response.user_id,
                            roles: response.roles,
                        },
                    },
                    error: null,
                };
            } catch (error: any) {
                const message = error?.response?.data?.error || error?.message || 'Login failed';
                return { data: null, error: { message } };
            }
        },
    },
    signUp: {
        email: async ({ email, password, name }: any) => {
            try {
                const response = await api.register({
                    email,
                    password,
                    username: generateUsername(email),
                    first_name: name || '',
                    role: 'user',
                });

                if (!response?.token) {
                    return { data: null, error: { message: 'Signup failed: no token returned' } };
                }

                await SecureStore.setItemAsync('backend_token', response.token);
                return {
                    data: {
                        user: {
                            email: response.email,
                            user_id: response.user_id,
                            roles: response.roles,
                        },
                    },
                    error: null,
                };
            } catch (error: any) {
                const message = error?.response?.data?.error || error?.message || 'Signup failed';
                return { data: null, error: { message } };
            }
        },
    },
    signOut: async () => {
        await SecureStore.deleteItemAsync('backend_token');
        return true;
    },
    getToken: async () => {
        return await SecureStore.getItemAsync('backend_token');
    },
};

export const { signIn, signUp, signOut } = authClient;

export function useSession() {
    const [session, setSession] = useState<{ user: any } | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            const token = await authClient.getToken();
            if (isMounted) {
                setSession(token ? { user: { id: 'backend-user' } } : null);
                setIsPending(false);
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data: session, isPending };
}
