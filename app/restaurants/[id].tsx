import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Star, MapPin, Clock, ArrowLeft, Phone, MessageCircle, Heart } from 'lucide-react-native';

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

const MENU_ITEMS = [
  { id: 'mi1', vendor_id: '1', name: 'Classic Beef Burger', description: 'Juicy beef patty, fresh lettuce, tomato, onion, and our special sauce.', price: 950.00, image_url: 'https://images.unsplash.com/photo-1568901346379-847e0915a111?w=500&q=80' },
  { id: 'mi2', vendor_id: '1', name: 'Chicken Burger', description: 'Grilled chicken breast with crisp lettuce and mayo.', price: 850.00, image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80' },
  { id: 'mi3', vendor_id: '2', name: 'Sushi Platter Deluxe', description: 'Assortment of fresh sashimi, nigiri, and maki rolls.', price: 2500.00, image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
  { id: 'mi4', vendor_id: '2', name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo and cucumber.', price: 900.00, image_url: 'https://images.unsplash.com/photo-1579871701386-8d1474136f32?w=500&q=80' },
  { id: 'mi5', vendor_id: '3', name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.', price: 1200.00, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80' },
  { id: 'mi6', vendor_id: '3', name: 'Pepperoni Pizza', description: 'Generous servings of spicy pepperoni and melted mozzarella.', price: 1300.00, image_url: 'https://images.unsplash.com/photo-1628840040974-9d419b6d9e48?w=500&q=80' },
];

export default function RestaurantDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { id } = useLocalSearchParams();
  const activeColor = Colors[colorScheme].tint;

  const restaurant = RESTAURANTS.find(r => r.id === id);

  if (!restaurant) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Restaurant not found.</ThemedText>
      </ThemedView>
    );
  }

  const restaurantMenuItems = MENU_ITEMS.filter(item => item.vendor_id === restaurant.id);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <Image source={{ uri: restaurant.header_image_url }} style={styles.headerImage} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        {/* Restaurant Info */}
        <View style={[styles.infoContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title" style={styles.restaurantName}>{restaurant.shop_name}</ThemedText>
          <ThemedText style={styles.cuisineText}>{restaurant.cuisine}</ThemedText>
          <View style={styles.ratingRow}>
            <Star size={18} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{restaurant.rating} ({restaurant.review_count} reviews)</ThemedText>
          </View>
          <ThemedText style={styles.descriptionText}>{restaurant.description}</ThemedText>

          {/* Location & Hours */}
          <View style={styles.detailSection}>
            <View style={styles.detailItem}>
              <MapPin size={18} color={activeColor} />
              <ThemedText style={styles.detailItemText}>{restaurant.addressText}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <Clock size={18} color={activeColor} />
              <ThemedText style={styles.detailItemText}>
                {restaurant.is_active ? `Open: ${restaurant.operating_hours[0]?.open_time} - ${restaurant.operating_hours[0]?.close_time}` : 'Closed'}
              </ThemedText>
            </View>
          </View>

          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            <TouchableOpacity style={{ backgroundColor: activeColor, borderRadius: 30, justifyContent: 'center', alignItems: 'center', padding: 10, width: '15%' }}>
              <Heart size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: activeColor, width: '80%' }]}>
              <MessageCircle size={20} color="#fff" />
              <ThemedText style={styles.contactButtonText}>Message</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Menu Section */}
          <ThemedText type="subtitle" style={styles.menuTitle}>Menu</ThemedText>
          {restaurantMenuItems.length > 0 ? (
            restaurantMenuItems.map((item) => (
              <ThemedView key={item.id}>
                <ThemedView style={styles.menuItemCard}>
                  <Image source={{ uri: item.image_url }} style={styles.menuItemImage} />
                  <View style={styles.menuItemDetails}>
                    <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                    <ThemedText style={styles.menuItemDescription}>{item.description}</ThemedText>
                    <ThemedText style={styles.menuItemPrice}>Ksh {item.price.toFixed(2)}</ThemedText>
                  </View>
                </ThemedView>
              </ThemedView>
            ))
          ) : (
            <ThemedText style={styles.noMenuItemsText}>No menu items available for this restaurant.</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImage: {
    width: '100%',
    height: 350,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginTop: 20,
  },
  infoContainer: {
    padding: 20,
    marginTop: -50, // Overlap with the image
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff', // This will be themed background
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cuisineText: {
    fontSize: 16,
    opacity: 0.7,
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
  detailSection: {
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Roughly half width
    marginBottom: 10,
  },
  detailItemText: {
    marginLeft: 10,
    fontSize: 14,
    opacity: 0.8,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  contactButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItemCard: {
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  menuItemImage: {
    width: 100,
    height: '100%',
    marginRight: 15,
    top: 0,
    left: 0,
  },
  menuItemDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  menuItemDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginVertical: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tint, // Use light tint for price
  },
  noMenuItemsText: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 20,
  },
});
