import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { ArrowLeft, Search, PlusCircle, Heart, MessageCircle, MapPin, Camera, Tag } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const C2C_CATEGORIES = [
  { id: '1', name: 'Fashion', icon: '👕', color: '#FCE4EC' },
  { id: '2', name: 'Electronics', icon: '📱', color: '#E3F2FD' },
  { id: '3', name: 'Home', icon: '🏠', color: '#E8F5E9' },
  { id: '4', name: 'Vehicles', icon: '🚗', color: '#FFF3E0' },
];

const FEATURED_ITEMS = [
  { id: '1', title: 'Vintage Camera', price: '$120', location: 'Nairobi', time: '2h ago', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
  { id: '2', title: 'Mountain Bike', price: '$250', location: 'Kisumu', time: '5h ago', image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400' },
];

export default function C2CScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#E91E63'; // Marketplace pink
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={18} color="#888" />
          <TextInput 
            placeholder="Search in marketplace..." 
            placeholderTextColor="#888"
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MessageCircle size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Sell Button Header */}
        <TouchableOpacity style={[styles.sellBanner, { backgroundColor: activeColor }]}>
          <View style={styles.sellInfo}>
            <ThemedText style={styles.sellTitle}>Have something to sell?</ThemedText>
            <ThemedText style={styles.sellSubtitle}>List your item in less than a minute</ThemedText>
          </View>
          <View style={styles.cameraCircle}>
            <Camera size={24} color={activeColor} />
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Categories</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        <View style={styles.catGrid}>
          {C2C_CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2a2a2a' : cat.color }]}>
                <ThemedText style={styles.catEmoji}>{cat.icon}</ThemedText>
              </View>
              <ThemedText style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Items */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Featured Listings</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        <View style={styles.itemsGrid}>
          {FEATURED_ITEMS.map(item => (
            <TouchableOpacity key={item.id} style={[styles.itemCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <TouchableOpacity style={styles.heartBtn}>
                <Heart size={16} color="#fff" />
              </TouchableOpacity>
              <View style={styles.itemInfo}>
                <ThemedText type="defaultSemiBold" style={styles.itemPrice}>{item.price}</ThemedText>
                <ThemedText numberOfLines={1} style={styles.itemTitle}>{item.title}</ThemedText>
                <View style={styles.itemLocation}>
                  <MapPin size={10} color="#888" />
                  <ThemedText style={styles.locationText}>{item.location} • {item.time}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Banner */}
        <View style={[styles.safetyCard, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Tag size={20} color={activeColor} />
          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemedText type="defaultSemiBold">Safety First!</ThemedText>
            <ThemedText style={styles.safetyText}>Always meet in public places and inspect items before paying.</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: activeColor }]}>
        <PlusCircle size={24} color="#fff" />
        <ThemedText style={styles.fabText}>Sell Now</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, gap: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)', height: 45, borderRadius: 22.5, paddingHorizontal: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  sellBanner: { flexDirection: 'row', marginHorizontal: 20, padding: 20, borderRadius: 25, alignItems: 'center', marginBottom: 30 },
  sellInfo: { flex: 1 },
  sellTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sellSubtitle: { color: '#fff', fontSize: 12, opacity: 0.8, marginTop: 4 },
  cameraCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  catGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30 },
  catItem: { alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catEmoji: { fontSize: 24 },
  catName: { fontSize: 12, fontWeight: '500' },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  itemCard: { width: '47%', borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 2, shadowOpacity: 0.05 },
  itemImage: { width: '100%', height: 150 },
  heartBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.3)', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { padding: 12 },
  itemPrice: { fontSize: 16, color: '#E91E63' },
  itemTitle: { fontSize: 13, marginVertical: 4 },
  itemLocation: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 10, opacity: 0.5, marginLeft: 4 },
  safetyCard: { flexDirection: 'row', marginHorizontal: 20, padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  safetyText: { fontSize: 11, opacity: 0.6, marginTop: 4 },
  fab: { position: 'absolute', bottom: 30, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 30, elevation: 5, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  fabText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
});
