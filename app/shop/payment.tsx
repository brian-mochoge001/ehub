import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, MapPin, CreditCard, ChevronRight, CheckCircle2, Wallet, Banknote } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const PAYMENT_METHODS = [
  { id: 'wallet', name: 'eHub Wallet', icon: Wallet, color: '#0a7ea4', balance: '$1,250.50' },
  { id: 'card', name: 'Credit Card', icon: CreditCard, color: '#4CAF50', details: 'Visa **** 4242' },
  { id: 'cash', name: 'Cash on Delivery', icon: Banknote, color: '#FF9800' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [isOrdered, setIsOrdered] = useState(false);

  const handlePlaceOrder = () => {
    setIsOrdered(true);
    // Simulate navigation back home after 2 seconds
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);
  };

  if (isOrdered) {
    return (
      <ThemedView style={styles.successContainer}>
        <CheckCircle2 size={100} color="#4CAF50" />
        <ThemedText type="title" style={styles.successTitle}>Order Placed!</ThemedText>
        <ThemedText style={styles.successSubtitle}>Your order #EH-90210 has been received and is being processed.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">Checkout</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Delivery Address */}
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Delivery Address</ThemedText>
        <TouchableOpacity style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          <View style={[styles.iconContainer, { backgroundColor: activeColor + '15' }]}>
            <MapPin size={20} color={activeColor} />
          </View>
          <View style={styles.cardInfo}>
            <ThemedText style={styles.cardTitle}>Home</ThemedText>
            <ThemedText style={styles.cardSubtitle}>123 Maple Avenue, Nairobi, Kenya</ThemedText>
          </View>
          <ChevronRight size={18} color="#888" />
        </TouchableOpacity>

        {/* Payment Methods */}
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Payment Method</ThemedText>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={[
              styles.card, 
              { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' },
              selectedMethod === method.id && { borderColor: activeColor, borderWidth: 1 }
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: method.color + '15' }]}>
              <method.icon size={20} color={method.color} />
            </View>
            <View style={styles.cardInfo}>
              <ThemedText style={styles.cardTitle}>{method.name}</ThemedText>
              <ThemedText style={styles.cardSubtitle}>{method.balance || method.details || 'Pay when you receive'}</ThemedText>
            </View>
            <View style={[styles.radioButton, selectedMethod === method.id && { backgroundColor: activeColor, borderColor: activeColor }]}>
              {selectedMethod === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Order Summary */}
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Order Summary</ThemedText>
        <View style={[styles.summaryCard, { backgroundColor: colorScheme === 'light' ? '#f8f8f8' : '#1a1a1a' }]}>
          <View style={styles.summaryRow}>
            <ThemedText>Subtotal (2 items)</ThemedText>
            <ThemedText style={{ fontWeight: '600' }}>$179.98</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText>Shipping Fee</ThemedText>
            <ThemedText style={{ color: '#4CAF50', fontWeight: '600' }}>Free</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText>Discount</ThemedText>
            <ThemedText style={{ color: '#FF6347', fontWeight: '600' }}>-$10.00</ThemedText>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText type="subtitle">Total</ThemedText>
            <ThemedText type="subtitle" style={{ color: activeColor }}>$169.98</ThemedText>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.payBtn, { backgroundColor: activeColor }]}
          onPress={handlePlaceOrder}
        >
          <ThemedText style={styles.payBtnText}>Place Order</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  placeholder: { width: 40 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, marginBottom: 15, marginTop: 10 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 18, marginBottom: 12, elevation: 1 },
  iconContainer: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardSubtitle: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#888', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  summaryCard: { padding: 20, borderRadius: 25, marginTop: 5 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalRow: { marginTop: 8, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.1)' },
  payBtn: { marginTop: 30, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  successTitle: { marginTop: 20, marginBottom: 10 },
  successSubtitle: { textAlign: 'center', opacity: 0.6, lineHeight: 22 },
});
