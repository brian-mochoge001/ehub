import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Star, Clock, Bike, ArrowLeft } from 'lucide-react-native';

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

export default function RestaurantsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const renderRestaurantCard = ({ item: restaurant }: { item: typeof RESTAURANTS[0] }) => (
    <TouchableOpacity key={restaurant.id} style={[styles.restaurantCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
      onPress={() => router.push(`/restaurants/${restaurant.id}` as any)}
    >
      <Image source={{ uri: restaurant.logo_url }} style={styles.restaurantImage} />
      {restaurant.featured && (
        <View style={[styles.featuredBadge, { backgroundColor: activeColor }]}>
          <ThemedText style={styles.featuredBadgeText}>Featured</ThemedText>
        </View>
      )}
      {!restaurant.is_active && (
        <View style={[styles.closedBadge]}>
          <ThemedText style={styles.closedBadgeText}>Closed</ThemedText>
        </View>
      )}
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantNameRow}>
          <ThemedText type="defaultSemiBold" style={styles.restaurantName}>{restaurant.shop_name}</ThemedText>
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
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.screenTitle}>All Restaurants</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={RESTAURANTS}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurantCard}
        contentContainerStyle={styles.flatListContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  screenTitle: { flex: 1, textAlign: 'center', marginLeft: 20, marginRight: 20 },
  flatListContent: { paddingBottom: 20 },
  restaurantCard: { marginHorizontal: 20, borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  restaurantImage: { width: '100%', height: 180 },
  featuredBadge: { position: 'absolute', top: 15, left: 15, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  featuredBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  closedBadge: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }], paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.6)' },
  closedBadgeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
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
});
