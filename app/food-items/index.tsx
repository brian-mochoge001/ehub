import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Star, ArrowLeft } from 'lucide-react-native';

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

export default function FoodItemsScreen() {
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
        data={FOOD_ITEMS}
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
