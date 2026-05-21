import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Star, MapPin, Clock, ArrowLeft, Phone, MessageCircle, Heart } from 'lucide-react-native';

export default function RestaurantDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { id } = useLocalSearchParams();
  const activeColor = Colors[colorScheme].tint;

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
        setLoading(true);
        const [biz, items] = await Promise.all([
            api.getBusinessProfile(id as string),
            api.getBusinessProducts(id as string) // Restaurants use food items, which are listed as business products here
        ]);
        setRestaurant(biz);
        setMenuItems(items || []);
    } catch (err) {
        console.error('Failed to fetch restaurant details:', err);
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

  if (!restaurant) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Restaurant not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <Image source={{ uri: restaurant.banner_url || 'https://via.placeholder.com/800x400' }} style={styles.headerImage} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        {/* Restaurant Info */}
        <View style={[styles.infoContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title" style={styles.restaurantName}>{restaurant.name}</ThemedText>
          <ThemedText style={styles.cuisineText}>{restaurant.miniservice_type.toUpperCase()}</ThemedText>
          <View style={styles.ratingRow}>
            <Star size={18} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{restaurant.rating || '0.0'} ({restaurant.review_count || 0} reviews)</ThemedText>
          </View>
          <ThemedText style={styles.descriptionText}>{restaurant.description}</ThemedText>

          {/* Location & Hours */}
          <View style={styles.detailSection}>
            <View style={styles.detailItem}>
              <MapPin size={18} color={activeColor} />
              <ThemedText style={styles.detailItemText}>{restaurant.address_id || 'Address unknown'}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <Clock size={18} color={activeColor} />
              <ThemedText style={styles.detailItemText}>
                {restaurant.is_active ? 'Open Now' : 'Closed'}
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
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => router.push(`/shop/product/${item.id}`)}>
                <View style={[styles.menuItemCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
                  <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.menuItemImage} />
                  <View style={styles.menuItemDetails}>
                    <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                    <ThemedText style={styles.menuItemDescription} numberOfLines={2}>{item.description}</ThemedText>
                    <ThemedText style={styles.menuItemPrice}>{item.currency} {item.price}</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
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
