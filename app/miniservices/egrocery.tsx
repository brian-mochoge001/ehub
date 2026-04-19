import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Search, ShoppingCart, Star, Plus, MapPin, ChevronRight, Leaf } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'Fruits', icon: '🍎', color: '#FFEBEE' },
  { id: '2', name: 'Vegetables', icon: '🥦', color: '#E8F5E9' },
  { id: '3', name: 'Dairy', icon: '🥛', color: '#E3F2FD' },
  { id: '4', name: 'Bakery', icon: '🍞', color: '#FFF3E0' },
  { id: '5', name: 'Meat', icon: '🥩', color: '#FBE9E7' },
  { id: '6', name: 'Frozen', icon: '🍦', color: '#F3E5F5' },
];

const PRODUCTS = [
  { id: '1', name: 'Fresh Avocado', price: '$2.50', unit: 'per kg', rating: 4.8, image: 'https://images.unsplash.com/photo-1523049673857-d1183b75b618?w=400', color: '#E8F5E9' },
  { id: '2', name: 'Organic Banana', price: '$1.20', unit: 'per kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', color: '#FFFDE7' },
  { id: '3', name: 'Red Strawberry', price: '$4.99', unit: 'per pack', rating: 4.9, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', color: '#FFEBEE' },
  { id: '4', name: 'Fresh Milk', price: '$3.50', unit: '1L', rating: 4.7, image: 'https://images.unsplash.com/photo-1550583724-125581f77833?w=400', color: '#E3F2FD' },
];

export default function GroceryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#2E7D32'; // Grocery green
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={styles.addressContainer}>
          <ThemedText style={styles.deliverText}>Deliver to</ThemedText>
          <View style={styles.locationRow}>
            <MapPin size={14} color={activeColor} />
            <ThemedText style={styles.addressText} numberOfLines={1}>123 Green Lane, Nairobi</ThemedText>
            <ChevronRight size={14} color="#888" />
          </View>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <ShoppingCart size={24} color={Colors[colorScheme].text} />
          <View style={[styles.cartBadge, { backgroundColor: activeColor }]}>
            <ThemedText style={styles.cartBadgeText}>2</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search fresh groceries..." 
            placeholderTextColor="#888"
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          />
        </View>

        {/* Promo Banner */}
        <View style={[styles.promoCard, { backgroundColor: '#E8F5E9' }]}>
          <View style={styles.promoInfo}>
            <View style={styles.organicBadge}>
              <Leaf size={12} color="#2E7D32" />
              <ThemedText style={styles.organicText}>100% Organic</ThemedText>
            </View>
            <ThemedText style={styles.promoTitle}>Fresh Vegetables</ThemedText>
            <ThemedText style={styles.promoSubtitle}>Get 20% off on your first order</ThemedText>
            <TouchableOpacity style={[styles.shopNowBtn, { backgroundColor: '#2E7D32' }]}>
              <ThemedText style={styles.shopNowText}>Shop Now</ThemedText>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' }} 
            style={styles.promoImage}
          />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Categories</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? '#2a2a2a' : cat.color }]}>
                <ThemedText style={styles.categoryEmoji}>{cat.icon}</ThemedText>
              </View>
              <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Daily Fresh</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {PRODUCTS.map(product => (
            <View key={product.id} style={[styles.productCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <View style={[styles.imageContainer, { backgroundColor: isDark ? '#333' : product.color }]}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
              </View>
              <View style={styles.productInfo}>
                <View style={styles.ratingRow}>
                  <Star size={10} color="#FFD700" fill="#FFD700" />
                  <ThemedText style={styles.ratingText}>{product.rating}</ThemedText>
                </View>
                <ThemedText type="defaultSemiBold" style={styles.productName}>{product.name}</ThemedText>
                <ThemedText style={styles.unitText}>{product.unit}</ThemedText>
                <View style={styles.priceRow}>
                  <ThemedText style={[styles.productPrice, { color: activeColor }]}>{product.price}</ThemedText>
                  <TouchableOpacity style={[styles.addBtn, { backgroundColor: activeColor }]}>
                    <Plus size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  addressContainer: { flex: 1, marginHorizontal: 15 },
  deliverText: { fontSize: 10, opacity: 0.5, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  addressText: { fontSize: 14, fontWeight: '600', marginRight: 4, maxWidth: 150 },
  cartButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  promoCard: { marginHorizontal: 20, borderRadius: 25, padding: 20, flexDirection: 'row', overflow: 'hidden', marginBottom: 25 },
  promoInfo: { flex: 1, zIndex: 1 },
  organicBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(46, 125, 50, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  organicText: { fontSize: 10, color: '#2E7D32', fontWeight: 'bold', marginLeft: 4 },
  promoTitle: { fontSize: 22, fontWeight: 'bold', color: '#1B5E20', marginBottom: 4 },
  promoSubtitle: { fontSize: 12, color: '#4CAF50', marginBottom: 15, maxWidth: '60%' },
  shopNowBtn: { alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  shopNowText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  promoImage: { width: 150, height: 150, borderRadius: 75, position: 'absolute', right: -20, bottom: -20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  categoriesList: { paddingLeft: 20, paddingRight: 10, marginBottom: 25 },
  categoryItem: { alignItems: 'center', marginRight: 15 },
  categoryIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryEmoji: { fontSize: 20 },
  categoryName: { fontSize: 12, fontWeight: '500' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  productCard: { width: '47%', borderRadius: 20, marginBottom: 15, overflow: 'hidden', elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  imageContainer: { width: '100%', height: 120, justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '80%', height: '80%', resizeMode: 'contain' },
  productInfo: { padding: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { fontSize: 10, color: '#888', marginLeft: 3 },
  productName: { fontSize: 14, marginBottom: 2 },
  unitText: { fontSize: 12, opacity: 0.5, marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  addBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});
