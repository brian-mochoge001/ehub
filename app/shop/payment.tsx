import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, MapPin, CreditCard, ChevronRight, CheckCircle2, Wallet, Banknote, Plus } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

const PAYMENT_METHODS = [
  { id: 'wallet', name: 'eHub Wallet', icon: Wallet, color: '#0a7ea4' },
  { id: 'cash', name: 'Cash on Delivery', icon: Banknote, color: '#FF9800' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const [cartData, addressData, walletData] = await Promise.all([
        api.getCart(),
        api.getAddresses().catch(() => []), // Fallback to empty if not implemented
        api.getWalletBalance().catch(() => ({ balance: '0.00' }))
      ]);
      
      setCartItems(cartData);
      setAddresses(addressData);
      setWallet(walletData);
      
      if (addressData.length > 0) {
        const defaultAddr = addressData.find((a: any) => a.is_default) || addressData[0];
        setSelectedAddress(defaultAddr.id);
      }
    } catch (err) {
      console.error('Failed to fetch checkout data:', err);
      Alert.alert('Error', 'Failed to load checkout information.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free for now
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Selection Required', 'Please select a delivery address.');
      return;
    }

    if (selectedMethod === 'wallet' && parseFloat(wallet?.balance || '0') < total) {
      Alert.alert('Insufficient Balance', 'Your wallet balance is not enough to complete this purchase.');
      return;
    }

    try {
      setProcessing(true);
      const result = await api.checkout(selectedAddress);
      setOrderId(result.order_id || 'EH-' + Math.floor(100000 + Math.random() * 900000));
      setIsOrdered(true);
      
      // Navigate back after delay
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 3000);
    } catch (err: any) {
      console.error('Checkout failed:', err);
      Alert.alert('Checkout Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={activeColor} />
        <ThemedText style={{ marginTop: 10 }}>Preparing your checkout...</ThemedText>
      </ThemedView>
    );
  }

  if (isOrdered) {
    return (
      <ThemedView style={styles.successContainer}>
        <CheckCircle2 size={100} color="#4CAF50" />
        <ThemedText type="title" style={styles.successTitle}>Order Placed!</ThemedText>
        <ThemedText style={styles.successSubtitle}>Your order #{orderId} has been received and is being processed.</ThemedText>
        <TouchableOpacity style={[styles.backHomeBtn, { backgroundColor: activeColor }]} onPress={() => router.replace('/(tabs)')}>
            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Back to Mall</ThemedText>
        </TouchableOpacity>
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
        <ThemedText type="subtitle">Payment & Checkout</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Delivery Address */}
        <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold">Delivery Address</ThemedText>
            <TouchableOpacity onPress={() => Alert.alert('Add Address', 'Address management coming soon')}>
                <ThemedText style={{ color: activeColor, fontSize: 12 }}>+ Add New</ThemedText>
            </TouchableOpacity>
        </View>
        
        {addresses.length > 0 ? (
            addresses.map((addr) => (
                <TouchableOpacity 
                    key={addr.id} 
                    style={[
                        styles.card, 
                        { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' },
                        selectedAddress === addr.id && { borderColor: activeColor, borderWidth: 1 }
                    ]}
                    onPress={() => setSelectedAddress(addr.id)}
                >
                    <View style={[styles.iconContainer, { backgroundColor: activeColor + '15' }]}>
                        <MapPin size={20} color={activeColor} />
                    </View>
                    <View style={styles.cardInfo}>
                        <ThemedText style={styles.cardTitle}>{addr.label || 'Address'}</ThemedText>
                        <ThemedText style={styles.cardSubtitle}>{addr.address_line1}, {addr.city}</ThemedText>
                    </View>
                    <View style={[styles.radioButton, selectedAddress === addr.id && { backgroundColor: activeColor, borderColor: activeColor }]}>
                        {selectedAddress === addr.id && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>
            ))
        ) : (
            <TouchableOpacity style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]} onPress={() => Alert.alert('Add Address', 'Address management coming soon')}>
                <View style={[styles.iconContainer, { backgroundColor: '#88815' }]}>
                    <Plus size={20} color="#888" />
                </View>
                <View style={styles.cardInfo}>
                    <ThemedText style={styles.cardTitle}>No Address Found</ThemedText>
                    <ThemedText style={styles.cardSubtitle}>Tap to add a delivery address</ThemedText>
                </View>
                <ChevronRight size={18} color="#888" />
            </TouchableOpacity>
        )}

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
              <ThemedText style={styles.cardSubtitle}>
                {method.id === 'wallet' ? `Balance: Ksh ${wallet?.balance || '0.00'}` : 'Pay when you receive'}
              </ThemedText>
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
            <ThemedText>Subtotal ({cartItems.length} items)</ThemedText>
            <ThemedText style={{ fontWeight: '600' }}>Ksh {subtotal.toFixed(2)}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText>Shipping Fee</ThemedText>
            <ThemedText style={{ color: '#4CAF50', fontWeight: '600' }}>Free</ThemedText>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText type="subtitle">Total</ThemedText>
            <ThemedText type="subtitle" style={{ color: activeColor }}>Ksh {total.toFixed(2)}</ThemedText>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.payBtn, { backgroundColor: activeColor }, processing && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={processing}
        >
          {processing ? (
              <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.payBtnText}>Place Order</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  placeholder: { width: 40 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 16, marginBottom: 15, marginTop: 20 },
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
  backHomeBtn: { marginTop: 30, paddingHorizontal: 30, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
});
