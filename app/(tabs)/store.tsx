import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Trash2, Plus, Minus, ShoppingCart, Package, Clock, ChevronRight } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const CART_ITEMS = [
  { id: '1', name: 'Wireless Earbuds', price: 49.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: '2', name: 'Smart Watch', price: 129.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
];

const ACTIVE_ORDERS = [
  { 
    id: '1', 
    orderNumber: 'EH-90210', 
    items: 'Wireless Earbuds Pro + 1 other', 
    total: 179.98, 
    status: 'Shipping', 
    statusColor: '#4CAF50',
    date: 'Oct 24, 2023', 
    estimatedDelivery: 'Oct 26', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' 
  },
  { 
    id: '2', 
    orderNumber: 'EH-90211', 
    items: 'Premium Travel Backpack', 
    total: 79.00, 
    status: 'Processing', 
    statusColor: '#FF9800',
    date: 'Oct 25, 2023', 
    estimatedDelivery: 'Oct 28', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' 
  },
];

export default function StoreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const activeColor = Colors[colorScheme].tint;

  const total = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const EmptyState = ({ icon: Icon, message }: { icon: any, message: string }) => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconContainer, { backgroundColor: activeColor + '10' }]}>
        <Icon size={50} color={activeColor} />
      </View>
      <ThemedText style={styles.emptyText}>{message}</ThemedText>
      <TouchableOpacity 
        style={[styles.shopNowBtn, { backgroundColor: activeColor }]}
        onPress={() => router.push('/(tabs)')}
      >
        <ThemedText style={styles.shopNowText}>Go Shopping</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={{ fontSize: 28 }}>My Store</ThemedText>
        <TouchableOpacity style={[styles.historyBtn, { backgroundColor: activeColor + '10' }]}>
          <Clock size={22} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => setActiveTab('cart')}
          style={[styles.tab, activeTab === 'cart' && { borderBottomColor: activeColor, borderBottomWidth: 3 }]}
        >
          <View style={styles.tabLabel}>
            <ShoppingCart size={20} color={activeTab === 'cart' ? activeColor : '#888'} />
            <ThemedText style={[styles.tabText, activeTab === 'cart' && { color: activeColor, fontWeight: '700' }]}>Cart ({CART_ITEMS.length})</ThemedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('orders')}
          style={[styles.tab, activeTab === 'orders' && { borderBottomColor: activeColor, borderBottomWidth: 3 }]}
        >
          <View style={styles.tabLabel}>
            <Package size={20} color={activeTab === 'orders' ? activeColor : '#888'} />
            <ThemedText style={[styles.tabText, activeTab === 'orders' && { color: activeColor, fontWeight: '700' }]}>Orders</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'cart' ? (
          <View style={styles.listContainer}>
            {CART_ITEMS.length > 0 ? (
              <>
                {CART_ITEMS.map(item => (
                  <View key={item.id} style={[styles.itemCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.itemName}>{item.name}</ThemedText>
                      <ThemedText style={styles.itemPrice}>${item.price.toFixed(2)}</ThemedText>
                      <View style={styles.qtyRow}>
                        <View style={styles.qtyControls}>
                          <TouchableOpacity style={styles.qtyBtn}><Minus size={14} color={Colors[colorScheme].text} /></TouchableOpacity>
                          <ThemedText style={styles.qtyText}>{item.quantity}</ThemedText>
                          <TouchableOpacity style={styles.qtyBtn}><Plus size={14} color={Colors[colorScheme].text} /></TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.removeBtn}><Trash2 size={18} color="#FF6347" /></TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
                
                <View style={[styles.summaryCard, { backgroundColor: colorScheme === 'light' ? '#f8f8f8' : '#1a1a1a' }]}>
                  <View style={styles.summaryRow}>
                    <ThemedText>Subtotal</ThemedText>
                    <ThemedText style={{ fontWeight: '600' }}>${total.toFixed(2)}</ThemedText>
                  </View>
                  <View style={styles.summaryRow}>
                    <ThemedText>Shipping</ThemedText>
                    <ThemedText style={{ color: '#4CAF50', fontWeight: '600' }}>Free</ThemedText>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <ThemedText type="subtitle">Total</ThemedText>
                    <ThemedText type="subtitle" style={{ color: activeColor }}>${total.toFixed(2)}</ThemedText>
                  </View>
                  <TouchableOpacity 
                    style={[styles.checkoutBtn, { backgroundColor: activeColor }]}
                    onPress={() => router.push('/shop/payment')}
                  >
                    <ThemedText style={styles.checkoutBtnText}>Checkout</ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <EmptyState icon={ShoppingCart} message="Your cart is empty" />
            )}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {ACTIVE_ORDERS.length > 0 ? (
              ACTIVE_ORDERS.map(order => (
                <TouchableOpacity key={order.id} style={[styles.orderCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
                  <View style={styles.orderHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: order.statusColor + '15' }]}>
                      <ThemedText style={[styles.statusText, { color: order.statusColor }]}>{order.status}</ThemedText>
                    </View>
                    <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
                  </View>
                  
                  <View style={styles.orderContent}>
                    <Image source={{ uri: order.image }} style={styles.orderImage} />
                    <View style={styles.orderDetails}>
                      <ThemedText type="defaultSemiBold" style={styles.orderNumber}>Order #{order.orderNumber}</ThemedText>
                      <ThemedText numberOfLines={1} style={styles.orderItems}>{order.items}</ThemedText>
                      <ThemedText style={styles.orderTotal}>Total: ${order.total.toFixed(2)}</ThemedText>
                    </View>
                    <ChevronRight size={20} color="#888" />
                  </View>
                  
                  <View style={[styles.deliveryInfo, { backgroundColor: colorScheme === 'light' ? '#f9f9f9' : '#2a2a2a' }]}>
                    <Clock size={14} color="#888" />
                    <ThemedText style={styles.deliveryText}>Estimated Delivery: <ThemedText style={{ fontWeight: '700' }}>{order.estimatedDelivery}</ThemedText></ThemedText>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <EmptyState icon={Package} message="No active orders" />
            )}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { marginBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyBtn: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabLabel: { flexDirection: 'row', alignItems: 'center' },
  tabText: { marginLeft: 10, fontSize: 14, color: '#888' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  listContainer: { paddingBottom: 20 },
  itemCard: { flexDirection: 'row', borderRadius: 20, padding: 12, marginBottom: 15, elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  itemImage: { width: 90, height: 90, borderRadius: 15 },
  itemInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  itemName: { fontSize: 15 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#0a7ea4' },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 10, padding: 4 },
  qtyBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  qtyText: { marginHorizontal: 12, fontWeight: '600' },
  removeBtn: { padding: 5 },
  summaryCard: { marginTop: 10, padding: 20, borderRadius: 25 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalRow: { marginTop: 8, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.1)' },
  checkoutBtn: { marginTop: 20, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyText: { fontSize: 16, opacity: 0.5, marginBottom: 25 },
  shopNowBtn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  shopNowText: { color: '#fff', fontWeight: 'bold' },
  
  // Order Card Styles
  orderCard: { borderRadius: 20, padding: 15, marginBottom: 15, elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  orderDate: { fontSize: 12, opacity: 0.5 },
  orderContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  orderImage: { width: 60, height: 60, borderRadius: 12 },
  orderDetails: { flex: 1, marginLeft: 12 },
  orderNumber: { fontSize: 15, marginBottom: 2 },
  orderItems: { fontSize: 13, opacity: 0.6, marginBottom: 4 },
  orderTotal: { fontSize: 14, fontWeight: '700' },
  deliveryInfo: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },
  deliveryText: { fontSize: 12, marginLeft: 8, opacity: 0.7 },
});
