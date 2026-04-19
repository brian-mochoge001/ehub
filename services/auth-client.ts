import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
  User
} from 'firebase/auth';
import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const authClient = {
    signIn: {
        email: async ({ email, password }: any) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                return { data: userCredential.user, error: null };
            } catch (error: any) {
                return { data: null, error: { message: error.message } };
            }
        },
        // We will export a hook for Google login instead of a direct method
        // because expo-auth-session requires being called within a component.
    },
    signUp: {
        email: async ({ email, password, name }: any) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                return { data: userCredential.user, error: null };
            } catch (error: any) {
                return { data: null, error: { message: error.message } };
            }
        }
    },
    signOut: async () => {
        return await firebaseSignOut(auth);
    }
};

export const { signIn, signUp, signOut } = authClient;

/**
 * Custom hook to manage Firebase auth session
 */
export function useSession() {
    const [session, setSession] = useState<{ user: User } | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession({ user: user as User });
            } else {
                setSession(null);
            }
            setIsPending(false);
        });

        return unsubscribe;
    }, []);

    return { data: session, isPending };
}

/**
 * Custom hook for Google Login
 */
export function useGoogleLogin() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token, authentication } = response.params;
            
            // If using standard redirect, token might be in authentication object
            const token = id_token || authentication?.idToken;

            if (!token) {
                setError('No ID token received from Google');
                return;
            }

            const credential = GoogleAuthProvider.credential(token);
            setLoading(true);
            signInWithCredential(auth, credential)
                .then(() => {
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (response?.type === 'error') {
            setError(response.error?.message || 'Google login failed');
        }
    }, [response]);

    return {
        login: () => promptAsync(),
        loading: loading || !request,
        error,
    };
}
