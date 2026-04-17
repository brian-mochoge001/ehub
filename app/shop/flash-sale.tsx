import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ArrowLeft, Clock, ShoppingCart } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const FLASH_SALES = [
  { id: '1', name: 'MacBook Pro M3', price: '1,299', oldPrice: '1,499', discount: '15% OFF', image: 'https://p.turbosquid.com/ts-thumb/Er/pVXRH9/f5/render9/jpg/1698836482/600x600/fit_q87/884035449414a1d9d55583f603f6eeba72f2b135/render9.jpg', stock: 5 },
  { id: '2', name: 'iPhone 15 Pro', price: '999', oldPrice: '1,099', discount: '10% OFF', image: 'https://alephksa.com/cdn/shop/files/iPhone_15_Pro_Natural_Titanium_PDP_Image_Position-1__en-ME.jpg?v=1694758467&width=1445', stock: 12 },
  { id: '3', name: 'Sony WH-1000XM5', price: '349', oldPrice: '429', discount: '20% OFF', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', stock: 8 },
  { id: '4', name: 'iPad Air M2', price: '549', oldPrice: '599', discount: '8% OFF', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', stock: 15 },
  { id: '5', name: 'Samsung S24 Ultra', price: '1,199', oldPrice: '1,299', discount: '8% OFF', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80', stock: 4 },
  { id: '6', name: 'DJI Mini 4 Pro', price: '759', oldPrice: '899', discount: '15% OFF', image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80', stock: 2 },
];

export default function FlashSaleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

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
          {FLASH_SALES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
              onPress={() => router.push(`/shop/product/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.discountBadge}>
                <ThemedText style={styles.discountText}>{item.discount}</ThemedText>
              </View>
              
              <View style={styles.info}>
                <ThemedText numberOfLines={1} style={styles.name}>{item.name}</ThemedText>
                <View style={styles.priceRow}>
                  <ThemedText style={[styles.price, { color: activeColor }]}>{item.price}</ThemedText>
                  <ThemedText style={styles.oldPrice}>{item.oldPrice}</ThemedText>
                </View>
                
                <View style={styles.stockBarContainer}>
                  <View style={[styles.stockBar, { width: `${(item.stock / 20) * 100}%`, backgroundColor: activeColor }]} />
                </View>
                <ThemedText style={styles.stockText}>{item.stock} left in stock</ThemedText>
                
                <TouchableOpacity style={[styles.addButton, { backgroundColor: activeColor }]}>
                  <ShoppingCart size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
