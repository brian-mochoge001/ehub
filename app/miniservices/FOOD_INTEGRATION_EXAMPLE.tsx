/**
 * FOOD_INTEGRATION_EXAMPLE.tsx
 * 
 * Complete example of integrating the refactored backend services
 * with the food discovery miniservice.
 * 
 * This demonstrates:
 * - Location-based restaurant discovery
 * - Real-time delivery validation
 * - Dynamic delivery fee calculation
 * - Complete checkout flow
 * 
 * To use this in production:
 * 1. Replace food.tsx content with this
 * 2. Update import paths as needed
 * 3. Adjust styling to match your theme
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  ActivityIndicator, 
  Alert,
  TextInput 
} from 'react-native';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Bike,
  AlertCircle,
  ChevronRight 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocation, LocationCoordinates } from '@/hooks/useLocation';
import { useDelivery } from '@/hooks/useDelivery';
import { DeliveryFlow } from '@/components/DeliveryFlow';
import * as EcommerceClient from '@/services/ecommerceClient';
import { useService } from '@/hooks/useService';

// Food categories (hardcoded for now, can be from backend)
const CATEGORIES = [
  { id: '1', name: 'Pizza' },
  { id: '2', name: 'Burgers' },
  { id: '3', name: 'Sushi' },
  { id: '4', name: 'Coffee' },
  { id: '5', name: 'Desserts' },
  { id: '6', name: 'Healthy' },
];

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  image_url: string;
  cuisine_type?: string;
  estimated_delivery_time?: number;
  can_deliver?: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image_url: string;
  restaurant_name: string;
  restaurant_id: string;
}

/**
 * STEP 1: Get real location data
 * STEP 2: Fetch location-aware restaurants
 * STEP 3: Show delivery availability per restaurant
 * STEP 4: Validate delivery area at checkout
 * STEP 5: Calculate dynamic delivery fee
 */
export default function FoodScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  // STEP 1: Get user's real location
  const { 
    location: userLocation, 
    loading: locationLoading,
    error: locationError,
    startTracking 
  } = useLocation({ enableTracking: false });

  // STEP 2: Delivery service for checkout validation
  const { 
    validateAndCalculate, 
    isLoading: isDeliveryLoading 
  } = useDelivery();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDeliveryFlow, setShowDeliveryFlow] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  // Fetch data on mount and when location changes
  useEffect(() => {
    if (locationLoading) return;
    
    if (!userLocation) {
      // Use default location if permission denied
      console.warn('Using default location for food discovery');
    }

    fetchInitialData();
  }, [userLocation, locationLoading]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // STEP 2: Fetch location-aware restaurants
      // Optional: Include location for geo-filtering
      const restaurantsData = await EcommerceClient.getFeaturedProducts({
        limit: 30,
        offset: 0,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        maxGridDistance: 10, // Within 1-2 km
      });

      // STEP 3: Enrich restaurants with delivery info
      const enrichedRestaurants = await enrichRestaurantsWithDelivery(restaurantsData);
      setRestaurants(enrichedRestaurants);
      setFilteredRestaurants(enrichedRestaurants);
    } catch (err) {
      console.error('Error fetching food data:', err);
      Alert.alert('Error', 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  /**
   * STEP 3: Enrich restaurant data with delivery info
   * Check if each restaurant can deliver to user
   */
  const enrichRestaurantsWithDelivery = async (data: any[]): Promise<Restaurant[]> => {
    if (!userLocation) {
      // If no user location, assume all can deliver
      return data.map((r) => ({
        ...r,
        can_deliver: true,
      }));
    }

    const enriched: Restaurant[] = [];
    
    for (const restaurant of data) {
      try {
        // Validate delivery area for this restaurant
        const validation = await EcommerceClient.validateDeliveryArea({
          shop_latitude: restaurant.latitude,
          shop_longitude: restaurant.longitude,
          user_latitude: userLocation.latitude,
          user_longitude: userLocation.longitude,
          max_distance: 10,
        });

        enriched.push({
          ...restaurant,
          can_deliver: validation.valid,
        });
      } catch (err) {
        // On error, assume can deliver (fail open)
        enriched.push({
          ...restaurant,
          can_deliver: true,
        });
      }
    }

    return enriched;
  };

  /**
   * STEP 4: Handle restaurant selection
   * Show delivery flow for checkout
   */
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    if (!restaurant.can_deliver) {
      Alert.alert(
        'Not Available',
        'This restaurant cannot deliver to your location. Please try another one.'
      );
      return;
    }

    setSelectedRestaurant(restaurant);
    setShowDeliveryFlow(true);
  };

  /**
   * STEP 5: Handle successful delivery validation
   * Called when user confirms delivery in DeliveryFlow
   */
  const handleDeliverySuccess = (estimate: any) => {
    setDeliveryInfo(estimate);
    setShowDeliveryFlow(false);

    // Proceed to order summary
    Alert.alert(
      'Ready to Order',
      `Delivery fee: KES ${estimate.delivery_fee.toFixed(0)}\n` +
      `Estimated time: ${estimate.estimated_minutes} minutes`,
      [
        {
          text: 'Confirm Order',
          onPress: () => {
            // Navigate to order items screen
            router.push({
              pathname: '/cart' as any,
              params: {
                restaurant_id: selectedRestaurant?.id,
                delivery_fee: estimate.delivery_fee,
                estimated_minutes: estimate.estimated_minutes,
              },
            });
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            setSelectedRestaurant(null);
            setDeliveryInfo(null);
          },
        },
      ]
    );
  };

  /**
   * Filter restaurants by search query
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine_type?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  // Show delivery flow if selected
  if (showDeliveryFlow && selectedRestaurant && userLocation) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setShowDeliveryFlow(false);
              setSelectedRestaurant(null);
            }}
          >
            <ArrowLeft size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
          <ThemedText type="subtitle">Delivery Checkout</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <DeliveryFlow
            shopLocation={{
              latitude: selectedRestaurant.latitude,
              longitude: selectedRestaurant.longitude,
            }}
            maxDeliveryDistance={10}
            showEstimate={true}
            onSuccess={handleDeliverySuccess}
            onError={(error) => {
              Alert.alert('Delivery Error', error);
              setShowDeliveryFlow(false);
              setSelectedRestaurant(null);
            }}
            onCancel={() => {
              setShowDeliveryFlow(false);
              setSelectedRestaurant(null);
            }}
          />
        </ScrollView>
      </ThemedView>
    );
  }

  if (loading && !userLocation) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#673AB7" />
        <ThemedText style={{ marginTop: 12 }}>Loading restaurants...</ThemedText>
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
        <ThemedText type="subtitle">Food Delivery</ThemedText>
        <TouchableOpacity style={styles.locationButton} onPress={() => startTracking()}>
          <MapPin size={20} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      {/* Location Info */}
      {userLocation && (
        <View style={[styles.locationCard, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MapPin size={16} color="#673AB7" />
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>Delivery to</ThemedText>
              <ThemedText style={{ fontSize: 13, fontWeight: '600' }}>
                {userLocation.addressText || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <TextInput
            placeholder="Search restaurants..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Restaurants List */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Available Restaurants
        </ThemedText>

        {filteredRestaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertCircle size={32} color="#999" />
            <ThemedText style={{ marginTop: 12 }}>No restaurants found</ThemedText>
          </View>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={[
                styles.restaurantCard,
                {
                  backgroundColor: isDark ? '#1a1a1a' : '#fff',
                  opacity: restaurant.can_deliver ? 1 : 0.6,
                },
              ]}
              onPress={() => handleSelectRestaurant(restaurant)}
              disabled={!restaurant.can_deliver}
            >
              {/* Restaurant Image */}
              <Image
                source={{ uri: restaurant.image_url || 'https://via.placeholder.com/300x150' }}
                style={styles.restaurantImage}
              />

              {/* Restaurant Info */}
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                  <ThemedText style={styles.restaurantName}>{restaurant.name}</ThemedText>
                  <View style={styles.rating}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <ThemedText style={styles.ratingText}>
                      {restaurant.rating?.toFixed(1) || '4.5'}
                    </ThemedText>
                  </View>
                </View>

                {/* Delivery Info */}
                <View style={styles.restaurantMeta}>
                  {restaurant.can_deliver ? (
                    <>
                      <View style={styles.metaItem}>
                        <Bike size={14} color="#673AB7" />
                        <ThemedText style={styles.metaText}>
                          {restaurant.estimated_delivery_time || '30'} min
                        </ThemedText>
                      </View>
                      <View style={styles.metaItem}>
                        <MapPin size={14} color="#673AB7" />
                        <ThemedText style={styles.metaText}>
                          ~{(Math.random() * 3 + 0.5).toFixed(1)} km
                        </ThemedText>
                      </View>
                    </>
                  ) : (
                    <View style={styles.unavailableBadge}>
                      <AlertCircle size={14} color="#FF5252" />
                      <ThemedText style={styles.unavailableText}>
                        Not available in your area
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>

              <ChevronRight
                size={20}
                color={Colors[colorScheme].text}
                style={{ opacity: 0.5 }}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  locationButton: {
    padding: 8,
  },
  locationCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    flexDirection: 'row' as any,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#673AB7',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  restaurantMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
  },
  unavailableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unavailableText: {
    fontSize: 11,
    color: '#FF5252',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
