import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { ArrowLeft, Package, ChevronRight, Clock } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { useSession } from '@/services/auth-client';

export default function OrdersScreen() {
  const router = useRouter();
  const { data: session } = useSession();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrdersByUserID(session?.user.id || '');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FF9800';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      case 'delivered': return '#2196F3';
      default: return '#888';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
        style={[styles.orderCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
        onPress={() => {}} // Could navigate to order details later
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Package size={20} color={activeColor} />
          <ThemedText style={styles.orderId}>Order #{item.id.split('-')[0]}</ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderBody}>
        <View style={styles.infoRow}>
          <Clock size={14} color="#888" />
          <ThemedText style={styles.infoText}>{new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
        </View>
        <View style={styles.priceRow}>
          <ThemedText style={styles.priceLabel}>Total Amount:</ThemedText>
          <ThemedText style={styles.totalAmount}>{item.currency} {item.total_amount}</ThemedText>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <ThemedText style={styles.viewDetailsText}>View Details</ThemedText>
        <ChevronRight size={16} color="#888" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="title">My Orders</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={activeColor} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Package size={80} color="#ccc" />
              <ThemedText style={styles.emptyTitle}>No orders yet</ThemedText>
              <ThemedText style={styles.emptySubtitle}>Start shopping in the Mall to see your orders here!</ThemedText>
              <TouchableOpacity 
                style={[styles.shopBtn, { backgroundColor: activeColor }]}
                onPress={() => router.replace('/(tabs)')}
              >
                <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Start Shopping</ThemedText>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, gap: 15 },
  backButton: { padding: 5 },
  placeholder: { width: 40 },
  listContent: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderCard: { borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderIdContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginBottom: 15 },
  orderBody: { gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 12, opacity: 0.5 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  priceLabel: { fontSize: 14, opacity: 0.7 },
  totalAmount: { fontSize: 16, fontWeight: 'bold' },
  orderFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15, gap: 5 },
  viewDetailsText: { fontSize: 12, color: '#888' },
  emptyState: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  emptySubtitle: { textAlign: 'center', opacity: 0.5, marginTop: 10, lineHeight: 20 },
  shopBtn: { marginTop: 30, paddingHorizontal: 30, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
});
