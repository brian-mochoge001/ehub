import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Star, ArrowLeft, ShoppingBag, Heart } from 'lucide-react-native';

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

export default function FoodItemDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { id } = useLocalSearchParams();
  const activeColor = Colors[colorScheme].tint;

  const foodItem = FOOD_ITEMS.find(item => item.id === id);
  const restaurant = RESTAURANTS.find(r => r.id === foodItem?.vendor_id);

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
            <ArrowLeft size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.screenTitle}>{foodItem.name}</ThemedText>
          <TouchableOpacity style={styles.cartButton}>
            <ShoppingBag size={24} color={Colors[colorScheme].text} />
            <View style={[styles.cartBadge, { backgroundColor: activeColor }]} />
          </TouchableOpacity>
        </View>

        {/* Food Item Image */}
        <Image source={{ uri: foodItem.image_url }} style={styles.foodItemImage} />

        {/* Food Item Info */}
        <View style={[styles.infoContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title" style={styles.foodItemName}>{foodItem.name}</ThemedText>
          <TouchableOpacity onPress={() => router.push(`/restaurants/${restaurant.id}` as any)}>
            <ThemedText style={styles.restaurantName}>{restaurant.shop_name}</ThemedText>
          </TouchableOpacity>
          <View style={styles.ratingRow}>
            <Star size={18} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{foodItem.rating} ({restaurant.review_count} reviews)</ThemedText>
          </View>
          <ThemedText style={styles.descriptionText}>{foodItem.description}</ThemedText>

          <View style={styles.priceRow}>
            <ThemedText style={styles.priceText}>Ksh {foodItem.price.toFixed(2)}</ThemedText>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors[colorScheme].tint }]}>
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
