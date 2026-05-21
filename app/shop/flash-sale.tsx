import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { ArrowLeft, Clock, ShoppingCart } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

const { width } = Dimensions.get('window');

export default function FlashSaleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashSales();
  }, []);

  const fetchFlashSales = async () => {
    try {
        setLoading(true);
        const data = await api.getFlashSaleProducts();
        setFlashSales(data || []);
    } catch (err) {
        console.error('Failed to fetch flash sales:', err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={activeColor} />
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
        <ThemedText type="subtitle">Flash Sales</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Timer Banner */}
      <View style={[styles.timerBanner, { backgroundColor: activeColor }]}>
        <Clock size={20} color="#fff" />
        <ThemedText style={styles.timerText}>Ending in: 02:45:12</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {flashSales.length > 0 ? flashSales.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
              onPress={() => router.push(`/shop/product/${item.id}`)}
            >
              <Image source={{ uri: item.image_url || 'https://via.placeholder.com/400' }} style={styles.image} />
              <View style={styles.discountBadge}>
                <ThemedText style={styles.discountText}>{item.discount_percentage}% OFF</ThemedText>
              </View>
              
              <View style={styles.info}>
                <ThemedText numberOfLines={1} style={styles.name}>{item.name}</ThemedText>
                <View style={styles.priceRow}>
                  <ThemedText style={[styles.price, { color: activeColor }]}>{item.currency} {item.price}</ThemedText>
                </View>
                
                <View style={styles.stockBarContainer}>
                  <View style={[styles.stockBar, { width: `${(item.stock_quantity / 50) * 100}%`, backgroundColor: activeColor }]} />
                </View>
                <ThemedText style={styles.stockText}>{item.stock_quantity} left in stock</ThemedText>
                
                <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: activeColor }]}
                    onPress={() => api.addToCart(item.business_id, item.id, 'ecommerce', 1)}
                >
                  <ShoppingCart size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )) : (
              <View style={{ width: '100%', alignItems: 'center', marginTop: 50 }}>
                  <ThemedText style={{ opacity: 0.5 }}>No flash sales available</ThemedText>
              </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  placeholder: { width: 40 },
  timerBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginHorizontal: 20, borderRadius: 12, marginBottom: 20 },
  timerText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: (width - 45) / 2, borderRadius: 20, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  image: { width: '100%', height: 150 },
  discountBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FF6347', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  info: { padding: 12 },
  name: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  price: { fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  oldPrice: { fontSize: 12, color: '#888', textDecorationLine: 'line-through' },
  stockBarContainer: { height: 6, backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 3, marginBottom: 4 },
  stockBar: { height: '100%', borderRadius: 3 },
  stockText: { fontSize: 10, opacity: 0.5 },
  addButton: { position: 'absolute', bottom: 10, right: 10, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
