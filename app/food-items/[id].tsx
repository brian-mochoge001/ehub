import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Star, ArrowLeft, ShoppingBag, Heart } from 'lucide-react-native';

export default function FoodItemDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { id } = useLocalSearchParams();
  const activeColor = Colors[colorScheme].tint;

  const [foodItem, setFoodItem] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        fetchFoodItemData();
    }
  }, [id]);

  const fetchFoodItemData = async () => {
    try {
      setLoading(true);
      const item = await api.getFoodItem(id as string);
      setFoodItem(item);

      const biz = await api.getBusinessProfile(item.business_id);
      setRestaurant(biz);
    } catch (err) {
        console.error('Failed to fetch food item details:', err);
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

  if (!foodItem || !restaurant) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Food item not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Back and Cart Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.screenTitle}>{foodItem.name}</ThemedText>
          <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
            <ShoppingBag size={24} color="#fff" />
            <View style={[styles.cartBadge, { backgroundColor: activeColor }]} />
          </TouchableOpacity>
        </View>

        {/* Food Item Image */}
        <Image source={{ uri: foodItem.image_url || 'https://via.placeholder.com/800' }} style={styles.foodItemImage} />

        {/* Food Item Info */}
        <View style={[styles.infoContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title" style={styles.foodItemName}>{foodItem.name}</ThemedText>
          <TouchableOpacity onPress={() => router.push(`/shop/merchant/${restaurant.id}` as any)}>
            <ThemedText style={styles.restaurantName}>{restaurant.name}</ThemedText>
          </TouchableOpacity>
          <View style={styles.ratingRow}>
            <TouchableOpacity onPress={() => router.push(`/reviews/${id}?type=food` as any)} style={styles.ratingRow}>
                <Star size={18} color="#FFD700" fill="#FFD700" />
                <ThemedText style={styles.ratingText}>{foodItem.rating || '0.0'} ({restaurant.review_count || 0} reviews)</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.descriptionText}>{foodItem.description}</ThemedText>

          <View style={styles.priceRow}>
            <ThemedText style={styles.priceText}>{foodItem.currency} {foodItem.price}</ThemedText>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: activeColor }]}
                onPress={() => api.addToCart(foodItem.business_id, foodItem.id, 'food', 1)}
              >
                <ShoppingBag size={20} color="#fff" />
                <ThemedText style={styles.actionButtonText}>Add to Cart</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.favoriteButton}>
                <Heart size={20} color={activeColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    // backgroundColor: 'transparent', // Will be dynamic based on scroll
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  screenTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Should be dynamic based on header background
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    padding: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  foodItemImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
    marginTop: -30, // Overlap with the image
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  foodItemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 16,
    color: Colors.light.tint,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginRight: 10,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
});
