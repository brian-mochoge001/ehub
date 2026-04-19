import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const CATEGORIES_DATA = [
  { 
    id: 'groceries', 
    name: 'Groceries', 
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    subcategories: [
      { id: 'fruits', name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80' },
      { id: 'meat', name: 'Meat & Fish', image: 'https://images.unsplash.com/photo-1604908176997-4319c3dfe52b?w=400&q=80' },
      { id: 'beverages', name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
      { id: 'snacks', name: 'Snacks', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80' },
    ]
  },
  {
    id: 'baby', 
    name: 'Baby Products', 
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80',
    subcategories: [
      { id: 'diapers', name: 'Diapers', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80' },
      { id: 'feeding', name: 'Feeding', image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?w=400&q=80' },
      { id: 'baby-toys', name: 'Baby Toys', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80' },
    ]
  },
  { 
    id: 'books', 
    name: 'Books & Stationery', 
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    subcategories: [
      { id: 'novels', name: 'Novels', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80' },
      { id: 'education', name: 'Educational Books', image: 'https://images.unsplash.com/photo-1584697964154-8a6cdb6c96f8?w=400&q=80' },
      { id: 'office-supplies', name: 'Office Supplies', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80' },
    ]
  },
  { 
    id: 'automotive', 
    name: 'Automotive', 
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80',
    subcategories: [
      { id: 'car-accessories', name: 'Car Accessories', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80' },
      { id: 'motorbike', name: 'Motorbike', image: 'https://images.unsplash.com/photo-1558981359-8f3b3f6b2f7b?w=400&q=80' },
      { id: 'tools', name: 'Tools & Equipment', image: 'https://images.unsplash.com/photo-1581090700227-1e8c6c7b5b3b?w=400&q=80' },
    ]
  },
  { 
    id: 'gaming', 
    name: 'Gaming', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
    subcategories: [
      { id: 'consoles', name: 'Consoles', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80' },
      { id: 'games', name: 'Video Games', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' },
      { id: 'accessories', name: 'Gaming Accessories', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80' },
    ]
  },
  { 
    id: 'pets', 
    name: 'Pet Supplies', 
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80',
    subcategories: [
      { id: 'dog', name: 'Dog Supplies', image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80' },
      { id: 'cat', name: 'Cat Supplies', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80' },
      { id: 'pet-food', name: 'Pet Food', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1d4?w=400&q=80' },
    ]
  },
  { 
    id: 'travel', 
    name: 'Travel', 
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764b6e?w=400&q=80',
    subcategories: [
      { id: 'bags', name: 'Travel Bags', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764b6e?w=400&q=80' },
      { id: 'suitcases', name: 'Suitcases', image: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?w=400&q=80' },
      { id: 'travel-accessories', name: 'Travel Accessories', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80' },
    ]
  },
  { 
    id: 'construction', 
    name: 'Construction', 
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80',
    subcategories: [
      { id: 'building', name: 'Building Materials', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80' },
      { id: 'hardware', name: 'Hardware', image: 'https://images.unsplash.com/photo-1581147036324-c2d7a4c3f98f?w=400&q=80' },
      { id: 'power-tools', name: 'Power Tools', image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=400&q=80' },
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
                <Image source={{ uri: cat.image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
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
