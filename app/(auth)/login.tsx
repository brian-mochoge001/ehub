import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useGoogleLogin } from '@/services/auth-client';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import LottieView from 'lottie-react-native';

export default function AuthScreen() {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [error, setError] = useState('');
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const activeColor = Colors[colorScheme].tint;
    
    const { login: googleLogin, loading: googleLoading, error: googleError } = useGoogleLogin();

    useEffect(() => {
        if (googleError) {
            setError(googleError);
        }
    }, [googleError]);

    const handleAppleLogin = async () => {
        setError('Apple login will be implemented later');
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft size={24} color={Colors[colorScheme].text} />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <LottieView
                                source={require('@/assets/animations/logo.json')}
                                autoPlay
                                loop
                                style={{width: 150, height: 150, marginBottom: 20}}
                            />
                        </View>

                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity 
                                style={[styles.tab, activeTab === 'login' && { borderBottomColor: activeColor, borderBottomWidth: 2 }]} 
                                onPress={() => setActiveTab('login')}
                            >
                                <ThemedText style={[styles.tabText, activeTab === 'login' && { color: activeColor, fontWeight: 'bold' }]}>
                                    Login
                                </ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tab, activeTab === 'signup' && { borderBottomColor: activeColor, borderBottomWidth: 2 }]} 
                                onPress={() => setActiveTab('signup')}
                            >
                                <ThemedText style={[styles.tabText, activeTab === 'signup' && { color: activeColor, fontWeight: 'bold' }]}>
                                    Sign Up
                                </ThemedText>
                            </TouchableOpacity>
                        </View>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <ThemedText style={styles.errorText}>{error}</ThemedText>
                            </View>
                        ) : null}

                        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <ThemedText style={styles.dividerText}>OR CONTINUE WITH</ThemedText>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity 
                                style={[styles.socialButton, { borderColor: colorScheme === 'light' ? '#ddd' : '#444' }]}
                                onPress={() => googleLogin()}
                                disabled={googleLoading}
                            >
                                {googleLoading ? (
                                    <ActivityIndicator size="small" color={activeColor} />
                                ) : (
                                    <>
                                        <Image source={require('@/assets/images/google.png')} style={{width: '100%', resizeMode: 'contain', height: 24}} />
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.socialButton, { borderColor: colorScheme === 'light' ? '#ddd' : '#444' }]}
                                onPress={handleAppleLogin}
                            >
                                <Image source={require('@/assets/images/apple.png')} style={{ width: '100%', resizeMode: 'contain', height: 24}} />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.socialButton, { borderColor: colorScheme === 'light' ? '#ddd' : '#444' }]}
                            >
                                <Image source={require('@/assets/images/facebook.png')} style={{width: '100%', resizeMode: 'contain', height: 24}} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128,128,128,0.1)',
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 5,
        borderRadius: 15,
        marginBottom: 25,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
    },
    errorContainer: {
        backgroundColor: '#FF525215',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FF525230',
    },
    errorText: {
        color: '#FF5252',
        fontSize: 14,
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(128,128,128,0.2)',
    },
    dividerText: {
        marginHorizontal: 15,
        fontSize: 12,
        opacity: 0.5,
        fontWeight: 'bold',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
