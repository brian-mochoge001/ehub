import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Bike, Heart, Search, MapPin, ShoppingBag, Star, Clock, ArrowLeft, SlidersHorizontal } from 'lucide-react-native';

const CATEGORIES = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burgers', icon: '🍔' },
  { id: '3', name: 'Sushi', icon: '🍣' },
  { id: '4', name: 'Coffee', icon: '☕' },
  { id: '5', name: 'Desserts', icon: '🍦' },
  { id: '6', name: 'Healthy', icon: '🥗' },
];

const RESTAURANTS = [
  {
    id: '1',
    name: 'Gourmet Burger Kitchen',
    cuisine: 'American • Burgers',
    rating: 4.8,
    time: '15-25 min',
    fee: 'Free',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    featured: true,
  },
  {
    id: '2',
    name: 'Sushi Zen Master',
    cuisine: 'Japanese • Seafood',
    rating: 4.9,
    time: '20-35 min',
    fee: '$1.99',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
    featured: false,
  },
  {
    id: '3',
    name: 'Napoli Pizzeria',
    cuisine: 'Italian • Pizza',
    rating: 4.7,
    time: '25-40 min',
    fee: '$0.99',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
    featured: true,
  },
];

export default function FoodScreen() {
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
        <View style={styles.addressContainer}>
          <ThemedText style={styles.deliveryTo}>Delivery to</ThemedText>
          <View style={styles.locationRow}>
            <MapPin size={14} color={activeColor} />
            <ThemedText style={styles.addressText} numberOfLines={1}>Home, 123 Maple Avenue</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <ShoppingBag size={24} color={Colors[colorScheme].text} />
          <View style={[styles.cartBadge, { backgroundColor: activeColor }]}>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a' }]}>
            <Search size={20} color="#888" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search dishes or restaurants..." 
              placeholderTextColor="#888"
              style={[styles.searchInput, { color: Colors[colorScheme].text }]}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: activeColor }]}>
            <SlidersHorizontal size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Promo Banner */}
        <View style={[styles.promoCard, { backgroundColor: colorScheme === 'light' ? '#FFF3E0' : '#4E342E' }]}>
          <View style={styles.promoInfo}>
            <ThemedText style={styles.promoTag}>FREE DELIVERY</ThemedText>
            <ThemedText style={styles.promoTitle}>Summer Flavors</ThemedText>
            <ThemedText style={styles.promoSubtitle}>free delivery for orders above Ksh 2500 within your county</ThemedText>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80' }} 
            style={styles.promoImage}
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: colorScheme === 'light' ? '#fff' : '#333' }]}>
                <ThemedText style={styles.categoryEmoji}>{cat.icon}</ThemedText>
              </View>
              <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Section */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Featured Restaurants</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>

        {RESTAURANTS.map(restaurant => (
          <TouchableOpacity key={restaurant.id} style={[styles.restaurantCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
            <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
            {restaurant.featured && (
              <View style={[styles.featuredBadge, { backgroundColor: activeColor }]}>
                <ThemedText style={styles.featuredBadgeText}>Featured</ThemedText>
              </View>
            )}
            <TouchableOpacity style={styles.favoriteButton}>
              <Heart size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantNameRow}>
                <ThemedText type="defaultSemiBold" style={styles.restaurantName}>{restaurant.name}</ThemedText>
                <View style={styles.ratingBadge}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <ThemedText style={styles.ratingText}>{restaurant.rating}</ThemedText>
                </View>
              </View>
              
              <ThemedText style={styles.cuisineText}>{restaurant.cuisine}</ThemedText>
              
              <View style={styles.deliveryDetails}>
                <View style={styles.detailItem}>
                  <Clock size={14} color="#888" />
                  <ThemedText style={styles.detailText}>{restaurant.time}</ThemedText>
                </View>
                <View style={styles.detailSeparator} />
                <View style={styles.detailItem}>
                  <Bike size={14} color="#888" />
                  <ThemedText style={styles.detailText}>{restaurant.fee === 'Free' ? 'Free Delivery' : restaurant.fee}</ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
        <ThemedView style={{ padding: 20 }}>
          <ThemedView style={{ alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 20, borderRadius: 20, backgroundColor: colorScheme === 'light' ? '#FFF3E0' : '#4E342E' }}>
            <ThemedText style={{ fontSize: 14 }}>Do you have a <ThemedText style={{ fontWeight: 'bold', fontSize: 24, color: activeColor }}>Restaurant?</ThemedText> Partner with us</ThemedText>
            <TouchableOpacity style={[styles.learnMoreBtn, { borderColor: Colors[colorScheme].text }]}>
              <ThemedText style={{ fontWeight: 'bold' }}>Learn More</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  addressContainer: { flex: 1, marginHorizontal: 15 },
  deliveryTo: { fontSize: 10, opacity: 0.5, textTransform: 'uppercase', fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  addressText: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
  cartButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cartBadge: { position: 'absolute', top: 0, right: 0, width: 16, height: 16, padding: 2, borderRadius: 8, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 20 },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  filterButton: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  promoCard: { marginHorizontal: 20, borderRadius: 25, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 25, overflow: 'hidden' },
  promoInfo: { flex: 1, zIndex: 1, maxWidth: '75%' },
  promoTag: { fontSize: 10, fontWeight: 'bold', color: '#FF9800', marginBottom: 5 },
  promoTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  promoSubtitle: { fontSize: 12, opacity: 0.7, lineHeight: 18 },
  promoImage: { width: 100, height: 100, borderRadius: 50, position: 'absolute', right: -20, bottom: -10, opacity: 0.8 },
  categoriesList: { paddingLeft: 20, paddingRight: 10, marginBottom: 25 },
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryIcon: { width: 65, height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2, shadowOpacity: 0.1, shadowRadius: 5 },
  categoryEmoji: { fontSize: 30 },
  categoryName: { fontSize: 12, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20 },
  restaurantCard: { marginHorizontal: 20, borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  restaurantImage: { width: '100%', height: 180 },
  featuredBadge: { position: 'absolute', top: 15, left: 15, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  featuredBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  favoriteButton: { position: 'absolute', top: 15, right: 15, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  restaurantInfo: { padding: 15 },
  restaurantNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  restaurantName: { fontSize: 18 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 215, 0, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#FFB800', marginLeft: 4 },
  cuisineText: { fontSize: 13, opacity: 0.5, marginBottom: 12 },
  deliveryDetails: { flexDirection: 'row', alignItems: 'center' },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: 12, color: '#888', marginLeft: 5 },
  detailSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ddd', marginHorizontal: 10 },
  learnMoreBtn: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginTop: 10, alignSelf: 'flex-start' },
});
