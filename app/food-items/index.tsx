import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Star, ArrowLeft } from 'lucide-react-native';

export default function FoodItemsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
        setLoading(true);
        const data = await api.getAllFoodItems();
        setFoodItems(data || []);
    } catch (err) {
        console.error('Failed to fetch food items:', err);
    } finally {
        setLoading(false);
    }
  };

  const renderFoodItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.foodItemCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
      onPress={() => router.push(`/food-items/${item.id}` as any)}
    >
      <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.foodItemImage} />
      <View style={styles.foodItemInfo}>
        <ThemedText numberOfLines={1} style={styles.foodItemName}>{item.name}</ThemedText>
        <ThemedText numberOfLines={1} style={styles.foodItemRestaurant}>{item.restaurant_name}</ThemedText>
        <ThemedText numberOfLines={2} style={styles.foodItemDescription}>{item.description}</ThemedText>
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
        <ThemedText type="subtitle" style={styles.screenTitle}>All Food Items</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={renderFoodItem}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
        ListFooterComponent={<View style={{ height: 20 }} />}
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
});
