import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { api } from './api';
import { auth as firebaseAuth } from './firebaseConfig';

export const authClient = {
    signIn: {
        email: async ({ email, password }: any) => {
            try {
                const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
                const idToken = await userCredential.user.getIdToken();

                const response = await api.syncUser(idToken);
                
                await SecureStore.setItemAsync('backend_user', JSON.stringify(response.data));
                return {
                    data: {
                        user: response.data,
                    },
                    error: null,
                };
            } catch (error: any) {
                return { data: null, error: { message: error.message || 'Login failed' } };
            }
        },
    },
    signUp: {
        email: async ({ email, password }: any) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
                const idToken = await userCredential.user.getIdToken();

                const response = await api.syncUser(idToken, 'user');
                
                await SecureStore.setItemAsync('backend_user', JSON.stringify(response.data));
                return {
                    data: {
                        user: response.data,
                    },
                    error: null,
                };
            } catch (error: any) {
                return { data: null, error: { message: error.message || 'Signup failed' } };
            }
        },
    },
    signOut: async () => {
        await firebaseSignOut(firebaseAuth);
        await SecureStore.deleteItemAsync('backend_user');
        return true;
    },
    getToken: async () => {
        const user = firebaseAuth.currentUser;
        return user ? await user.getIdToken() : null;
    },
};

export const { signIn, signUp, signOut } = authClient;

export function useSession() {
    const [session, setSession] = useState<{ user: any } | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const userStr = await SecureStore.getItemAsync('backend_user');
            if (userStr) {
                setSession({ user: JSON.parse(userStr) });
            } else {
                setSession(null);
            }
            setIsPending(false);
        };

        checkSession();
    }, []);

    return { data: session, isPending };
}
