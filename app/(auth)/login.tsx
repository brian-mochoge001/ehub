import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const activeColor = Colors[colorScheme].tint;

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/(tabs)');
                                }
                            }}
                        >
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

                        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
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
});
