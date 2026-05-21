import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft, Search, SlidersHorizontal, Star } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '@/services/api';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  
  const categoryName = typeof id === 'string' ? id : 'Products';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  const fetchProducts = async () => {
    try {
        setLoading(true);
        // We'll use getFeaturedProducts but filter by category name locally for now
        // A better way would be a category-specific endpoint
        const all = await api.getFeaturedProducts(50);
        const filtered = all.filter((p: any) => p.category_name === categoryName);
        setProducts(filtered);
    } catch (err) {
        console.error('Failed to fetch category products:', err);
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
          {products.length > 0 ? products.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={[styles.productCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
              onPress={() => router.push(`/shop/product/${product.id}`)}
            >
              <Image source={{ uri: product.image_url || 'https://via.placeholder.com/150' }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <ThemedText numberOfLines={1} style={styles.productName}>{product.name}</ThemedText>
                <View style={styles.priceRow}>
                  <ThemedText style={[styles.productPrice, { color: activeColor }]}>{product.currency} {product.price}</ThemedText>
                  <View style={styles.ratingRow}>
                    <Star size={10} color="#FFD700" fill="#FFD700" />
                    <ThemedText style={styles.ratingText}>{product.rating || '0.0'}</ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )) : (
              <View style={{ width: '100%', alignItems: 'center', marginTop: 50 }}>
                  <ThemedText style={{ opacity: 0.5 }}>No products in this category</ThemedText>
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
