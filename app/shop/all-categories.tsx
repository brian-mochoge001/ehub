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
    id: 'phones',
    name: 'Phones & Accessories',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
      { id: 'feature-phones', name: 'Feature Phones', image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80' },
      { id: 'phone-accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1585386959984-a415522316e4?w=400&q=80' },
    ]
  },
  {
    id: 'computers',
    name: 'Computers & Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    subcategories: [
      { id: 'laptops', name: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80' },
      { id: 'desktops', name: 'Desktops', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&q=80' },
      { id: 'computer-accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80' },
    ]
  },
  {
    id: 'electronics',
    name: 'Consumer Electronics',
    image: 'https://images.unsplash.com/photo-1518441902112-fd4c0d1d3a7f?w=400&q=80',
    subcategories: [
      { id: 'tv', name: 'TVs', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80' },
      { id: 'audio', name: 'Audio & Speakers', image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&q=80' },
      { id: 'cameras', name: 'Cameras', image: 'https://images.unsplash.com/photo-1519183071298-a2962eadc3e3?w=400&q=80' },
    ]
  },
  {
    id: 'appliances',
    name: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    subcategories: [
      { id: 'kitchen-appliances', name: 'Kitchen Appliances', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80' },
      { id: 'large-appliances', name: 'Large Appliances', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
      { id: 'small-appliances', name: 'Small Appliances', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?w=400&q=80',
    subcategories: [
      { id: 'mens-clothing', name: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&q=80' },
      { id: 'womens-clothing', name: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80' },
      { id: 'shoes', name: 'Shoes', image: 'https://images.unsplash.com/photo-1528701800489-20be3c4ea5c0?w=400&q=80' },
      { id: 'bags', name: 'Bags & Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80' },
    ]
  },
  {
    id: 'beauty',
    name: 'Health & Beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    subcategories: [
      { id: 'skincare', name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80' },
      { id: 'haircare', name: 'Hair Care', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
      { id: 'makeup', name: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80' },
    ]
  },
  {
    id: 'home',
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
    subcategories: [
      { id: 'furniture', name: 'Furniture', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80' },
      { id: 'decor', name: 'Home Decor', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80' },
      { id: 'kitchenware', name: 'Kitchen & Dining', image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=400&q=80' },
    ]
  },
  {
    id: 'supermarket',
    name: 'Supermarket',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    subcategories: [
      { id: 'food', name: 'Food Staples', image: 'https://images.unsplash.com/photo-1604908176997-4319c3dfe52b?w=400&q=80' },
      { id: 'beverages', name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
      { id: 'cleaning', name: 'Cleaning Supplies', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
    ]
  },
  {
    id: 'baby',
    name: 'Baby Products',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80',
    subcategories: [
      { id: 'diapers', name: 'Diapers', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80' },
      { id: 'feeding', name: 'Feeding', image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?w=400&q=80' },
      { id: 'baby-toys', name: 'Toys', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80' },
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    subcategories: [
      { id: 'fitness', name: 'Fitness Equipment', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
      { id: 'outdoor', name: 'Outdoor Gear', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80' },
      { id: 'sportswear', name: 'Sportswear', image: 'https://images.unsplash.com/photo-1528701800489-20be3c4ea5c0?w=400&q=80' },
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
    image: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=400&q=80',
    subcategories: [
      { id: 'consoles', name: 'Consoles', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80' },
      { id: 'games', name: 'Video Games', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' },
      { id: 'gaming-accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80' },
    ]
  },
  {
    id: 'books',
    name: 'Books & Stationery',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    subcategories: [
      { id: 'books', name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80' },
      { id: 'office-supplies', name: 'Office Supplies', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80' },
      { id: 'school-supplies', name: 'School Supplies', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80' },
    ]
  },
  {
    id: 'pets',
    name: 'Pet Supplies',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80',
    subcategories: [
      { id: 'dog-supplies', name: 'Dog Supplies', image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80' },
      { id: 'cat-supplies', name: 'Cat Supplies', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80' },
      { id: 'pet-food', name: 'Pet Food', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&q=80' },
    ]
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
    subcategories: [
      { id: 'educational-toys', name: 'Educational Toys', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80' },
      { id: 'action-figures', name: 'Action Figures', image: 'https://images.unsplash.com/photo-1608889175119-9a3fcb9b1c42?w=400&q=80' },
      { id: 'board-games', name: 'Board Games', image: 'https://images.unsplash.com/photo-1606509038263-3d4c0f5c0e5f?w=400&q=80' },
    ]
  },
  {
    id: 'garden',
    name: 'Garden & Outdoor',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80',
    subcategories: [
      { id: 'plants', name: 'Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80' },
      { id: 'garden-tools', name: 'Garden Tools', image: 'https://images.unsplash.com/photo-1592878849122-4d68b46f0e8c?w=400&q=80' },
      { id: 'outdoor-furniture', name: 'Outdoor Furniture', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80' },
    ]
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Watches',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
    subcategories: [
      { id: 'necklaces', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80' },
      { id: 'watches', name: 'Watches', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
      { id: 'rings', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Luggage',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764b84?w=400&q=80',
    subcategories: [
      { id: 'luggage', name: 'Luggage', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764b84?w=400&q=80' },
      { id: 'travel-accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80' },
      { id: 'camping', name: 'Camping Gear', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80' },
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial & Scientific',
    image: 'https://images.unsplash.com/photo-1581090700227-1e8c6c7b5b3b?w=400&q=80',
    subcategories: [
      { id: 'lab-equipment', name: 'Lab Equipment', image: 'https://images.unsplash.com/photo-1581091012184-5c39b2b0d1e9?w=400&q=80' },
      { id: 'safety-equipment', name: 'Safety Gear', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400&q=80' },
      { id: 'power-tools', name: 'Power Tools', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
    ]
  }
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
