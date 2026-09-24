import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export const VerificationFallback = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="subtitle" style={styles.title}>Verification Failed</ThemedText>
    <ThemedText style={styles.text}>
      We couldn't verify your identity automatically. 
      Please visit our office to complete account activation.
    </ThemedText>
    <View style={styles.info}>
      <ThemedText type="defaultSemiBold">Address: 123 Main St, Tech City</ThemedText>
      <ThemedText>Bring your National ID and KTRA License.</ThemedText>
    </View>
  </ThemedView>
);

const styles = StyleSheet.create({
  container: { padding: 20, borderRadius: 16, backgroundColor: '#FFF3E0', alignItems: 'center' },
  title: { color: '#E65100', marginBottom: 10 },
  text: { textAlign: 'center', marginBottom: 20 },
  info: { padding: 15, backgroundColor: '#FFE0B2', borderRadius: 8, alignItems: 'center' },
});
