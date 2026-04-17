import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { ArrowLeft, Search, ShoppingCart, Star, Plus, Info, Wine } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const LIQUOR_CATEGORIES = [
  { id: '1', name: 'Whiskey', icon: '🥃', color: '#795548' },
  { id: '2', name: 'Wine', icon: '🍷', color: '#AD1457' },
  { id: '3', name: 'Beer', icon: '🍺', color: '#FFA000' },
  { id: '4', name: 'Vodka', icon: '🍸', color: '#00ACC1' },
];

const PREMIUM_PICKS = [
  { id: '1', name: 'Johnnie Walker Black', price: 'Ksh4,000.00', volume: '750ml', rating: 4.9, image: 'https://www.montyskenya.com/wp-content/uploads/2020/05/jw-black-label-1.jpg', color: '#3E2723' },
  { id: '2', name: 'Moët & Chandon', price: 'Ksh8,000.00', volume: '750ml', rating: 4.8, image: 'https://giftsandflowers.co.ke/wp-content/uploads/2020/11/Moet-750ml-1-1.jpg', color: '#FFF8E1' },
];

export default function LiquorScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#8D6E63'; 
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">eLiquor Store</ThemedText>
        <TouchableOpacity style={styles.cartButton}>
          <ShoppingCart size={24} color={Colors[colorScheme].text} />
          <View style={[styles.cartBadge, { backgroundColor: '#FF5252' }]}>
            <ThemedText style={styles.cartBadgeText}>1</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search brands, types..." 
            placeholderTextColor="#888"
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          />
        </View>

        {/* Age Warning */}
        <View style={[styles.warningBox, { backgroundColor: isDark ? '#3E2723' : '#EFEBE9' }]}>
          <Info size={18} color={activeColor} />
          <ThemedText style={styles.warningText}>You must be over 18 to order. Delivery personnel will check ID.</ThemedText>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Categories</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        <View style={styles.catGrid}>
          {LIQUOR_CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <ThemedText style={styles.catEmoji}>{cat.icon}</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium Picks */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Premium Picks</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        
        {PREMIUM_PICKS.map(item => (
          <TouchableOpacity key={item.id} style={[styles.premiumCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <ThemedText type="defaultSemiBold" style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemVolume}>{item.volume}</ThemedText>
              <View style={styles.ratingRow}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
              </View>
              <View style={styles.priceRow}>
                <ThemedText style={[styles.itemPrice, { color: activeColor }]}>{item.price}</ThemedText>
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: activeColor }]}>
                  <Plus size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Promo */}
        <View style={[styles.promoCard, { backgroundColor: '#3E2723' }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.promoTitle}>Weekend Specials</ThemedText>
            <ThemedText style={styles.promoSubtitle}>Up to 15% off on selected craft beers and wines.</ThemedText>
          </View>
          <Wine size={90} color="#D7CCC8" style={{ opacity: 0.3, bottom: 0, right: -30, position: 'absolute' }}/>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  cartButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  warningBox: { flexDirection: 'row', marginHorizontal: 20, padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 25 },
  warningText: { flex: 1, marginLeft: 10, fontSize: 11, opacity: 0.7 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  catGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 30 },
  catCard: { flex: 1, paddingHorizontal: 6, paddingTop: 12, paddingBottom: 8, borderRadius: 20, alignItems: 'center', elevation: 2, shadowOpacity: 0.05 },
  catEmoji: { fontSize: 24, marginBottom: 8 },
  catName: { fontSize: 10 },
  premiumCard: { flexDirection: 'row', marginHorizontal: 20, padding: 15, borderRadius: 25, marginBottom: 15, elevation: 2, shadowOpacity: 0.05 },
  itemImage: { width: 100, height: 120, borderRadius: 15 },
  itemInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  itemName: { fontSize: 16 },
  itemVolume: { fontSize: 12, opacity: 0.5, marginVertical: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ratingText: { fontSize: 11, opacity: 0.6, marginLeft: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 18, fontWeight: 'bold' },
  addBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  promoCard: { flexDirection: 'row', marginHorizontal: 20, padding: 25, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  promoTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  promoSubtitle: { color: '#D7CCC8', fontSize: 12 },
});
