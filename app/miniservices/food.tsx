import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Bike, Heart, Search, MapPin, ShoppingBag, Star, Clock, ArrowLeft, SlidersHorizontal, ChevronRight } from 'lucide-react-native';

const CATEGORIES = [
  { id: '1', name: 'Pizza', image_url: 'https://i.pinimg.com/1200x/15/f1/d9/15f1d9c15a0e9f18ab4156e6918bd31b.jpg' },
  { id: '2', name: 'Burgers', image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80' },
  { id: '3', name: 'Sushi', image_url: 'https://i.pinimg.com/1200x/09/ba/bb/09babb3a6aaf5455ad8bcdc723df988d.jpg' },
  { id: '4', name: 'Coffee', image_url: 'https://i.pinimg.com/736x/f0/65/5f/f0655f2737da76be9b4ac435c65e3d9b.jpg' },
  { id: '5', name: 'Desserts', image_url: 'https://i.pinimg.com/1200x/95/66/47/956647cdbab072b168f571e3c0315b8b.jpg' },
  { id: '6', name: 'Healthy', image_url: 'https://i.pinimg.com/736x/36/8f/75/368f758b5497126de43a16aff78f56dc.jpg' },
];

export default function FoodScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [motorbikeDrivers, setMotorbikeDrivers] = useState<any[]>([]);
  const [deliveryEstimate, setDeliveryEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Get Real Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      let locationToUse = { latitude: -1.286389, longitude: 36.817223 }; // Default Nairobi
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        locationToUse = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        setUserLocation(locationToUse);
      } else {
        Alert.alert('Permission Denied', 'Using default location.');
      }

      const [itemsResult, bizsResult, driversResult, estimateResult] = await Promise.allSettled([
        api.getAllFoodItems(),
        api.getBusinesses({ type: 'restaurant', limit: 30 }),
        api.getNearbyMotorbikeDrivers(locationToUse.longitude, locationToUse.latitude, 10),
        api.getFoodDeliveryEstimate({ latitude: locationToUse.latitude, longitude: locationToUse.longitude, radius: 5000 }),
      ]);

      if (itemsResult.status === 'fulfilled') {
        setFoodItems(itemsResult.value || []);
      } else {
        console.error('Failed to fetch food items:', itemsResult.reason);
        setFoodItems([]);
      }

      if (bizsResult.status === 'fulfilled') {
        setRestaurants(bizsResult.value || []);
      } else {
        console.error('Failed to fetch restaurants:', bizsResult.reason);
        setRestaurants([]);
      }

      if (driversResult.status === 'fulfilled') {
        setMotorbikeDrivers(driversResult.value || []);
      } else {
        console.error('Failed to fetch nearby drivers:', driversResult.reason);
        setMotorbikeDrivers([]);
      }

      if (estimateResult.status === 'fulfilled') {
        setDeliveryEstimate(estimateResult.value);
      } else {
        console.error('Failed to fetch delivery estimate:', estimateResult.reason);
        setDeliveryEstimate(null);
      }
    } catch (err) {
      console.error('Failed to fetch food data:', err);
      setFoodItems([]);
      setRestaurants([]);
      setMotorbikeDrivers([]);
      setDeliveryEstimate(null);
    } finally {
      setLoading(false);
    }
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const aRating = Number(a.rating || 0);
    const bRating = Number(b.rating || 0);
    return bRating - aRating;
  });

  const recommendedRestaurants = sortedRestaurants.slice(0, 4);

  const renderFoodItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.foodItemCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
      onPress={() => router.push(`/food-items/${item.id}` as any)}
    >
      <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.foodItemImage} />
      <View style={styles.foodItemInfo}>
        <ThemedText numberOfLines={1} style={styles.foodItemName}>{item.name}</ThemedText>
        <ThemedText numberOfLines={1} style={styles.foodItemRestaurant}>{item.restaurant_name}</ThemedText>
        <View style={styles.foodItemPriceRating}>
          <ThemedText style={{ fontWeight: '500', fontSize: 12 }}>Ksh <ThemedText style={{ color: activeColor }}>{item.price}</ThemedText></ThemedText>
          <View style={styles.ratingRow}>
            <Star size={10} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{item.rating || '0.0'}</ThemedText>
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
        <TouchableOpacity style={styles.deliveryToContainer} onPress={async () => {
              try {
                const response = await api.calculateDeliveryQuote({
                  distance: 5,
                  is_peak_hour: false,
                  weather_surcharge: 0
                });
                alert(`Estimated delivery cost: ${response.estimated_price} ${response.currency}`);
              } catch (e) {
                console.error(e);
              }
            }}>
          <ThemedText style={styles.deliveryTo}>Check Delivery Rates</ThemedText>
          <View style={styles.locationRow}>
            <MapPin size={14} color={activeColor} />
            <ThemedText style={styles.addressText} numberOfLines={1}>Home, 123 Maple Avenue</ThemedText>
            <ChevronRight size={14} color={activeColor} style={{ marginLeft: 5 }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
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

      {/* Delivery Coverage */}
      <View style={styles.deliveryInfoCard}>
        <View style={styles.deliveryInfoRow}>
          <MapPin size={16} color={activeColor} />
          <ThemedText style={styles.deliveryInfoText}>Food delivery only with motorbike drivers</ThemedText>
        </View>
        <ThemedText style={styles.deliveryKeyText}>
          {deliveryEstimate?.available
            ? `Estimate: ${deliveryEstimate.estimated_minutes} min · ${deliveryEstimate.driver_count} drivers nearby`
            : 'Delivery may exceed 2 hours or be unavailable in your area.'}
        </ThemedText>
      </View>

      {recommendedRestaurants.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Recommended Restaurants</ThemedText>
            <TouchableOpacity onPress={() => router.push('/restaurants' as any)}>
              <ThemedText style={{ color: activeColor }}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRestaurantsList}>
            {recommendedRestaurants.map(restaurant => (
              <TouchableOpacity
                key={restaurant.id}
                style={[styles.quickRestaurantCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
                onPress={() => router.push(`/shop/merchant/${restaurant.id}` as any)}
              >
                <Image source={{ uri: restaurant.logo_url || 'https://via.placeholder.com/150' }} style={styles.quickRestaurantImage} />
                <View style={styles.quickRestaurantInfo}>
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{Number(restaurant.rating || 0) >= 4.4 ? 'Top Pick' : 'Popular'}</ThemedText>
                  </View>
                  <ThemedText numberOfLines={1} style={styles.quickRestaurantName}>{restaurant.name}</ThemedText>
                  <View style={styles.ratingRow}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <ThemedText style={styles.quickRestaurantRating}>{restaurant.rating || '0.0'}</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {restaurants.length > 0 && (
        <>
            <View style={styles.sectionHeader}>
                <ThemedText type="subtitle">Restaurants Near You</ThemedText>
                <TouchableOpacity onPress={() => router.push('/restaurants' as any)}>
                <ThemedText style={{ color: activeColor }}>See All</ThemedText>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRestaurantsList}>
                {restaurants.map(restaurant => (
                <TouchableOpacity 
                    key={restaurant.id} 
                    style={[styles.quickRestaurantCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
                    onPress={() => router.push(`/shop/merchant/${restaurant.id}` as any)}
                >
                    <Image source={{ uri: restaurant.logo_url || 'https://via.placeholder.com/150' }} style={styles.quickRestaurantImage} />
                    <View style={styles.quickRestaurantInfo}>
                    <ThemedText numberOfLines={1} style={styles.quickRestaurantName}>{restaurant.name}</ThemedText>
                    <View style={styles.ratingRow}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <ThemedText style={styles.quickRestaurantRating}>{restaurant.rating || '0.0'}</ThemedText>
                    </View>
                    </View>
                </TouchableOpacity>
                ))}
            </ScrollView>
        </>
      )}

      {/* All Food Items Section Title */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">All Food Items</ThemedText>
      </View>
    </View>
  );

  if (loading) {
    return (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={activeColor} />
        </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={renderFoodItem}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <ThemedText type="subtitle">No food items available right now</ThemedText>
            <ThemedText style={styles.emptyStateSubtitle}>Check back later or try a different area.</ThemedText>
          </View>
        }
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
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
  cartBadge: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, zIndex: 1 },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  filterButton: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  categoriesList: { paddingLeft: 20, paddingRight: 10, marginBottom: 25 },
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryIcon: { width: 65, height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2, shadowOpacity: 0.1, shadowRadius: 5 },
  categoryImage: { width: '100%', height: '100%', borderRadius: 20 },
  categoryName: { fontSize: 12, fontWeight: '600' },
  deliveryInfoCard: { padding: 16, marginHorizontal: 20, marginBottom: 20, borderRadius: 18, backgroundColor: '#F8F8F8' },
  deliveryInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  deliveryInfoText: { fontSize: 12, color: '#444', fontWeight: '600' },
  deliveryKeyText: { fontSize: 13, color: '#333', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20 },
  quickRestaurantsList: { paddingLeft: 20, paddingRight: 10, marginBottom: 25 },
  quickRestaurantCard: { width: 150, borderRadius: 15, marginRight: 15, overflow: 'hidden', elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  quickRestaurantImage: { width: '100%', height: 100 },
  quickRestaurantInfo: { padding: 10 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#FFF2E5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 6 },
  badgeText: { fontSize: 10, color: '#FF6B00', fontWeight: '700' },
  quickRestaurantName: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  quickRestaurantRating: { fontSize: 12, fontWeight: 'bold', color: '#FFB800', marginLeft: 4 },
  flatListContent: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 20 },
  foodItemCard: { width: '48%', borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  foodItemImage: { width: '100%', height: 120 },
  foodItemInfo: { padding: 10 },
  foodItemName: { fontSize: 14, fontWeight: '600' },
  foodItemRestaurant: { fontSize: 12, opacity: 0.7, marginBottom: 5 },
  foodItemPriceRating: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, marginLeft: 3, color: '#888' },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyStateSubtitle: { marginTop: 8, textAlign: 'center', opacity: 0.65 },
});
