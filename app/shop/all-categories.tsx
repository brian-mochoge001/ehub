import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Search, Smartphone, Shirt, House, Footprints, Dumbbell, Star } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const CATEGORIES_DATA = [
  { 
    id: 'electronics', 
    name: 'Electronics', 
    icon: Smartphone,
    subcategories: [
      { id: 'phones', name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
      { id: 'laptops', name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' },
      { id: 'audio', name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
      { id: 'watches', name: 'Smart Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    ]
  },
  { 
    id: 'fashion', 
    name: 'Fashion', 
    icon: Shirt,
    subcategories: [
      { id: 'men', name: 'Men\'s Wear', image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&q=80' },
      { id: 'women', name: 'Women\'s Wear', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80' },
      { id: 'kids', name: 'Kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69af63e6?w=400&q=80' },
    ]
  },
  { 
    id: 'home', 
    name: 'Home', 
    icon: House,
    subcategories: [
      { id: 'furniture', name: 'Furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80' },
      { id: 'kitchen', name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80' },
      { id: 'decor', name: 'Decor', image: 'https://images.unsplash.com/photo-1513519247388-4466627e30cd?w=400&q=80' },
    ]
  },
  { 
    id: 'shoes', 
    name: 'Shoes', 
    icon: Footprints,
    subcategories: [
      { id: 'sneakers', name: 'Sneakers', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80' },
      { id: 'formal', name: 'Formal', image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400&q=80' },
    ]
  },
  { 
    id: 'fitness', 
    name: 'Fitness', 
    icon: Dumbbell,
    subcategories: [
      { id: 'gym', name: 'Gym Gear', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
      { id: 'yoga', name: 'Yoga', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80' },
    ]
  },
  { 
    id: 'beauty', 
    name: 'Beauty', 
    icon: Star,
    subcategories: [
      { id: 'makeup', name: 'Makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
      { id: 'skincare', name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80' },
    ]
  },
];

export default function AllCategoriesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES_DATA[0].id);

  const activeCategory = CATEGORIES_DATA.find(c => c.id === activeCategoryId) || CATEGORIES_DATA[0];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a' }]}>
          <Search size={18} color="#888" style={styles.searchIcon} />
          <ThemedText style={styles.searchText}>Search categories...</ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        {/* Sidebar */}
        <View style={[styles.sidebar, { borderRightColor: 'rgba(128,128,128,0.1)' }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {CATEGORIES_DATA.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.sidebarItem}
                onPress={() => setActiveCategoryId(cat.id)}
              >
                <View style={[styles.sidebarIcon, activeCategoryId === cat.id && { backgroundColor: activeColor }]}>
                  <cat.icon size={20} color={activeCategoryId === cat.id ? '#fff' : '#888'} />
                </View>
                <ThemedText style={[
                  styles.sidebarText, 
                  activeCategoryId === cat.id && { color: activeColor, fontWeight: 'bold' }
                ]}>
                  {cat.name}
                </ThemedText>
                {activeCategoryId === cat.id && <View style={[styles.activeIndicator, { backgroundColor: activeColor }]} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainScroll}>
            <View style={styles.bannerContainer}>
              <Image 
                source={{ uri: activeCategory.subcategories[0].image }} 
                style={styles.categoryBanner}
              />
              <View style={styles.bannerOverlay}>
                <ThemedText style={styles.bannerTitle}>{activeCategory.name}</ThemedText>
                <ThemedText style={styles.bannerSubtitle}>Up to 50% Off</ThemedText>
              </View>
            </View>

            <View style={styles.subcategoriesGrid}>
              {activeCategory.subcategories.map((sub) => (
                <TouchableOpacity 
                  key={sub.id} 
                  style={styles.subcategoryCard}
                  onPress={() => router.push(`/shop/category/${sub.name}`)}
                >
                  <Image source={{ uri: sub.image }} style={styles.subcategoryImage} />
                  <ThemedText style={styles.subcategoryName}>{sub.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15, gap: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, height: 45 },
  searchIcon: { marginRight: 10 },
  searchText: { color: '#888', fontSize: 14 },
  content: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 80, borderRightWidth: 1 },
  sidebarItem: { paddingVertical: 15, alignItems: 'center', position: 'relative' },
  sidebarIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  sidebarText: { fontSize: 10, textAlign: 'center' },
  activeIndicator: { position: 'absolute', right: 0, top: '25%', bottom: '25%', width: 3, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 },
  mainContent: { flex: 1 },
  mainScroll: { padding: 15 },
  bannerContainer: { width: '100%', height: 120, borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  categoryBanner: { width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 15 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  bannerSubtitle: { color: '#fff', fontSize: 12, opacity: 0.8 },
  subcategoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  subcategoryCard: { width: '48%', marginBottom: 15, alignItems: 'center' },
  subcategoryImage: { width: '100%', height: 100, borderRadius: 12, marginBottom: 8 },
  subcategoryName: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
});
