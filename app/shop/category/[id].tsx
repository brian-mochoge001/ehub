import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Search, SlidersHorizontal, Star } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter, useLocalSearchParams } from 'expo-router';

const CATEGORY_PRODUCTS: Record<string, any[]> = {
  'Electronics': [
    { id: '1', name: 'Wireless Earbuds', price: '$49.99', rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { id: '2', name: 'Smart Watch', price: '$129.99', rating: 4.5, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
    { id: '5', name: 'Gaming Mouse', price: '$59.99', rating: 4.9, image: 'https://images.unsplash.com/photo-1527690719478-fb9766964b36?w=500&q=80' },
  ],
  'Fashion': [
    { id: '7', name: 'Classic T-Shirt', price: '$25.00', rating: 4.4, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
    { id: '8', name: 'Denim Jacket', price: '$85.00', rating: 4.7, image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&q=80' },
  ],
  'Home': [
    { id: '4', name: 'Coffee Maker', price: '$89.00', rating: 4.6, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80' },
    { id: '9', name: 'Table Lamp', price: '$45.00', rating: 4.3, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  ],
};

const DEFAULT_PRODUCTS = [
  { id: '3', name: 'Premium Backpack', price: '$79.00', rating: 4.7, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: '6', name: 'Yoga Mat', price: '$29.00', rating: 4.7, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80' },
];

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  
  const categoryName = typeof id === 'string' ? id : 'Products';
  const products = CATEGORY_PRODUCTS[categoryName] || DEFAULT_PRODUCTS;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">{categoryName}</ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color={activeColor} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        activeOpacity={0.8}
        style={[styles.searchContainer, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a' }]}
        onPress={() => router.push('/search')}
      >
        <Search size={20} color="#888" style={styles.searchIcon} />
        <ThemedText style={{ color: '#888', flex: 1 }}>Search in {categoryName}...</ThemedText>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={[styles.productCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
              onPress={() => router.push(`/shop/product/${product.id}`)}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <ThemedText numberOfLines={1} style={styles.productName}>{product.name}</ThemedText>
                <View style={styles.priceRow}>
                  <ThemedText style={[styles.productPrice, { color: activeColor }]}>{product.price}</ThemedText>
                  <View style={styles.ratingRow}>
                    <Star size={10} color="#FFD700" fill="#FFD700" />
                    <ThemedText style={styles.ratingText}>{product.rating}</ThemedText>
                  </View>
                </View>
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
  filterButton: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20, marginHorizontal: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', borderRadius: 20, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  productImage: { width: '100%', height: 150 },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, marginLeft: 3, color: '#888' },
});
