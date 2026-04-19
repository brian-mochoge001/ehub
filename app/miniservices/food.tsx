import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Bike, Heart, Search, MapPin, ShoppingBag, Star, Clock, ArrowLeft, SlidersHorizontal, ChevronRight } from 'lucide-react-native';
import { ProductSkeleton } from '@/components/Skeleton'; // Assuming a similar skeleton can be used for food items

// Mock Data - Updated and expanded
const CATEGORIES = [
  { id: '1', name: 'Pizza', image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80' },
  { id: '2', name: 'Burgers', image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
  { id: '3', name: 'Sushi', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80' },
  { id: '4', name: 'Coffee', image_url: 'https://images.unsplash.com/photo-1497636577773-fd124446c5a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '5', name: 'Desserts', image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '6', name: 'Healthy', image_url: 'https://images.unsplash.com/photo-1512621776951-a573b35f2ed6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const RESTAURANTS = [
  {
    id: '1',
    shop_name: 'Gourmet Burger Kitchen',
    description: 'Serving up the best burgers in town since 2005. Fresh ingredients, great taste.',
    cuisine: 'American • Burgers',
    rating: 4.8,
    review_count: 1250,
    time: '15-25 min',
    fee: 'Free',
    logo_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    header_image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YnVyZ2VyfHx8fHx8MTY4Mzg3MjcwNg&ixlib=rb-4.0.3&q=80&w=1080',
    featured: true,
    is_active: true,
    addressText: '123 Burger St, Nairobi',
    operating_hours: [{ day_of_week: 1, open_time: '09:00', close_time: '22:00' }],
  },
  {
    id: '2',
    shop_name: 'Sushi Zen Master',
    description: 'Authentic Japanese sushi prepared by master chefs. Experience the taste of Tokyo.',
    cuisine: 'Japanese • Seafood',
    rating: 4.9,
    review_count: 980,
    time: '20-35 min',
    fee: '$1.99',
    logo_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
    header_image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8c3VzaGkxfHx8fHwxNjg0Njg1MTc3&ixlib=rb-4.0.3&q=80&w=1080',
    featured: false,
    is_active: true,
    addressText: '456 Sushi Ave, Nairobi',
    operating_hours: [{ day_of_week: 1, open_time: '11:00', close_time: '23:00' }],
  },
  {
    id: '3',
    shop_name: 'Napoli Pizzeria',
    description: 'Traditional Neapolitan pizzas, baked in a wood-fired oven. A slice of Italy in every bite.',
    cuisine: 'Italian • Pizza',
    rating: 4.7,
    review_count: 1500,
    time: '25-40 min',
    fee: '$0.99',
    logo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
    header_image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8cGl6emF8fHx8fHwxNjg0Njg1NTA3&ixlib=rb-4.0.3&q=80&w=1080',
    featured: true,
    is_active: false,
    addressText: '789 Pizza Blvd, Nairobi',
    operating_hours: [],
  },
];

const FOOD_ITEMS = [
  { id: 'fi1', name: 'Classic Beef Burger', description: 'Juicy beef patty, fresh lettuce, tomato, onion, and our special sauce.', price: 950.00, image_url: 'https://images.unsplash.com/photo-1568901346379-847e0915a111?w=500&q=80', vendor_id: '1', restaurant_name: 'Gourmet Burger Kitchen', rating: 4.5 },
  { id: 'fi2', name: 'Sushi Platter Deluxe', description: 'Assortment of fresh sashimi, nigiri, and maki rolls.', price: 2500.00, image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80', vendor_id: '2', restaurant_name: 'Sushi Zen Master', rating: 4.9 },
  { id: 'fi3', name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.', price: 1200.00, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80', vendor_id: '3', restaurant_name: 'Napoli Pizzeria', rating: 4.7 },
  { id: 'fi4', name: 'Veggie Supreme Pizza', description: 'Loaded with fresh vegetables and rich mozzarella cheese.', price: 1350.00, image_url: 'https://images.unsplash.com/photo-1604382186842-bf2330a51989?w=500&q=80', vendor_id: '3', restaurant_name: 'Napoli Pizzeria', rating: 4.6 },
  { id: 'fi5', name: 'Chicken Teriyaki Bowl', description: 'Grilled chicken with teriyaki sauce, rice, and steamed vegetables.', price: 1100.00, image_url: 'https://images.unsplash.com/photo-1612927601601-52775796c8a7?w=500&q=80', vendor_id: '2', restaurant_name: 'Sushi Zen Master', rating: 4.6 },
  { id: 'fi6', name: 'Double Cheese Burger', description: 'Two juicy beef patties, double cheese, pickles, and our secret sauce.', price: 1200.00, image_url: 'https://images.unsplash.com/photo-1582236528739-16e53c4481d6?w=500&q=80', vendor_id: '1', restaurant_name: 'Gourmet Burger Kitchen', rating: 4.7 },
  { id: 'fi7', name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo and cucumber, rolled in seaweed and rice.', price: 900.00, image_url: 'https://images.unsplash.com/photo-1579871701386-8d1474136f32?w=500&q=80', vendor_id: '2', restaurant_name: 'Sushi Zen Master', rating: 4.8 },
  { id: 'fi8', name: 'Pepperoni Passion Pizza', description: 'Generous servings of spicy pepperoni and melted mozzarella.', price: 1300.00, image_url: 'https://images.unsplash.com/photo-1628840040974-9d419b6d9e48?w=500&q=80', vendor_id: '3', restaurant_name: 'Napoli Pizzeria', rating: 4.8 },
];

export default function FoodScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const renderFoodItem = ({ item }: { item: typeof FOOD_ITEMS[0] }) => (
    <TouchableOpacity 
      style={[styles.foodItemCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
      onPress={() => router.push(`/food-items/${item.id}` as any)}
    >
      <Image source={{ uri: item.image_url }} style={styles.foodItemImage} />
      <View style={styles.foodItemInfo}>
        <ThemedText numberOfLines={1} style={styles.foodItemName}>{item.name}</ThemedText>
        <ThemedText numberOfLines={1} style={styles.foodItemRestaurant}>{item.restaurant_name}</ThemedText>
        <ThemedText numberOfLines={2} style={styles.foodItemDescription}>{item.description}</ThemedText>
        <View style={styles.foodItemPriceRating}>
          <ThemedText style={{ fontWeight: '500', fontSize: 12 }}>Ksh <ThemedText style={{ color: activeColor }}>{item.price.toFixed(2)}</ThemedText></ThemedText>
          <View style={styles.ratingRow}>
            <Star size={10} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deliveryToContainer}>
          <ThemedText style={styles.deliveryTo}>Delivery to</ThemedText>
          <View style={styles.locationRow}>
            <MapPin size={14} color={activeColor} />
            <ThemedText style={styles.addressText} numberOfLines={1}>Home, 123 Maple Avenue</ThemedText>
            <ChevronRight size={14} color={activeColor} style={{ marginLeft: 5 }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <ShoppingBag size={24} color={Colors[colorScheme].text} />
          <View style={[styles.cartBadge, { backgroundColor: activeColor }]} />
        </TouchableOpacity>
      </View>

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
              <Image source={{ uri: cat.image_url }} style={styles.categoryImage} />
            </View>
            <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Restaurants */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Restaurants Near You</ThemedText>
        <TouchableOpacity onPress={() => router.push('/restaurants' as any)}>
          <ThemedText style={{ color: activeColor }}>See All</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRestaurantsList}>
        {RESTAURANTS.map(restaurant => (
          <TouchableOpacity 
            key={restaurant.id} 
            style={[styles.quickRestaurantCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
            onPress={() => router.push(`/restaurants/${restaurant.id}` as any)}
          >
            <Image source={{ uri: restaurant.logo_url }} style={styles.quickRestaurantImage} />
            <View style={styles.quickRestaurantInfo}>
              <ThemedText numberOfLines={1} style={styles.quickRestaurantName}>{restaurant.shop_name}</ThemedText>
              <View style={styles.ratingRow}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <ThemedText style={styles.quickRestaurantRating}>{restaurant.rating}</ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* All Food Items Section Title */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">All Food Items</ThemedText>
        <TouchableOpacity onPress={() => router.push('/food-items' as any)}>
          <ThemedText style={{ color: activeColor }}>See All</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={FOOD_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderFoodItem}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        // Assuming infinite scroll for food items will be added later if needed
        // onEndReached={loadMore}
        // onEndReachedThreshold={0.5}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  deliveryToContainer: { flex: 1, marginHorizontal: 15 },
  deliveryTo: { fontSize: 10, opacity: 0.5, textTransform: 'uppercase', fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  addressText: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
  cartButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cartBadge: { position: 'absolute', top: 0, right: 0, width: 16, height: 16, padding: 2, borderRadius: 8, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
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
  categoryImage: { width: '100%', height: '100%', borderRadius: 20 },
  categoryName: { fontSize: 12, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20 },
  // Quick Restaurants Styles
  quickRestaurantsList: { paddingLeft: 20, paddingRight: 10, marginBottom: 25 },
  quickRestaurantCard: { width: 150, borderRadius: 15, marginRight: 15, overflow: 'hidden', elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  quickRestaurantImage: { width: '100%', height: 100 },
  quickRestaurantInfo: { padding: 10 },
  quickRestaurantName: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  quickRestaurantRating: { fontSize: 12, fontWeight: 'bold', color: '#FFB800', marginLeft: 4 },
  // Food Item Grid Styles
  flatListContent: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 20 },
  foodItemCard: { width: '48%', borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  foodItemImage: { width: '100%', height: 120 },
  foodItemInfo: { padding: 10 },
  foodItemName: { fontSize: 14, fontWeight: '600' },
  foodItemRestaurant: { fontSize: 12, opacity: 0.7, marginBottom: 5 },
  foodItemDescription: { fontSize: 10, opacity: 0.6, marginBottom: 8 },
  foodItemPriceRating: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, marginLeft: 3, color: '#888' },
  learnMoreBtn: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginTop: 10, alignSelf: 'flex-start' },
  // Styles for the closed badge (reused from previous implementation)
  closedBadge: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }], paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.6)' },
  closedBadgeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
