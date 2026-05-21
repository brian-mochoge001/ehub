import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

export default function OfflineScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const handleRetry = () => {
    router.replace('/');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: activeColor + '15' }]}>
            <WifiOff size={48} color={activeColor} />
        </View>
        <ThemedText type="title" style={styles.title}>No Internet Connection</ThemedText>
        <ThemedText style={styles.message}>
            Please check your internet settings or ensure the eHub server is reachable.
        </ThemedText>
        
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: activeColor }]} onPress={handleRetry}>
          <RefreshCw size={20} color="#fff" style={{ marginRight: 10 }} />
          <ThemedText style={styles.retryText}>Try Again</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: { alignItems: 'center', width: '100%' },
  iconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  message: { fontSize: 16, textAlign: 'center', opacity: 0.7, marginBottom: 40, lineHeight: 22 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  retryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
