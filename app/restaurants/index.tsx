import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Star, Clock, Bike, ArrowLeft } from 'lucide-react-native';

export default function RestaurantsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
        setLoading(true);
        // We use 'restaurant' as miniservice_type
      const data = await api.getBusinesses({ type: 'restaurant' });
      setRestaurants(data || []);
    } catch (err) {
        console.error('Failed to fetch restaurants:', err);
    } finally {
        setLoading(false);
    }
  };

  const renderRestaurantCard = ({ item: restaurant }: { item: any }) => (
    <TouchableOpacity key={restaurant.id} style={[styles.restaurantCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
      onPress={() => router.push(`/shop/merchant/${restaurant.id}` as any)}
    >
      <Image source={{ uri: restaurant.logo_url || 'https://via.placeholder.com/150' }} style={styles.restaurantImage} />
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
          <ThemedText type="defaultSemiBold" style={styles.restaurantName}>{restaurant.name}</ThemedText>
          <View style={styles.ratingBadge}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{restaurant.rating || '0.0'}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.cuisineText}>{restaurant.miniservice_type.toUpperCase()}</ThemedText>
        <View style={styles.deliveryDetails}>
          <View style={styles.detailItem}>
            <Clock size={14} color="#888" />
            <ThemedText style={styles.detailText}>20-30 min</ThemedText>
          </View>
          <View style={styles.detailSeparator} />
          <View style={styles.detailItem}>
            <Bike size={14} color="#888" />
            <ThemedText style={styles.detailText}>Free Delivery</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.screenTitle}>All Restaurants</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={restaurants}
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
