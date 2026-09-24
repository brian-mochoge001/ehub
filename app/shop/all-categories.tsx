import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

export default function AllCategoriesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      const transformed = transformCategories(data || []);
      setCategories(transformed);
      if (transformed.length > 0) setActiveCategoryId(transformed[0].id);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    } finally {
      setLoading(false);
    }
  };

  const transformCategories = (flat: any[]) => {
    const topLevel = flat.filter(c => !c.parent_id);
    return topLevel.map(top => ({
      id: top.id,
      name: top.name,
      image: top.image_url || 'https://via.placeholder.com/400',
      subcategories: flat
        .filter(c => c.parent_id === top.id)
        .map(sub => ({
          id: sub.id,
          name: sub.name,
          image: sub.image_url || 'https://via.placeholder.com/400'
        }))
    }));
  }

  const activeCategory = categories.find(c => c.id === activeCategoryId) || categories[0];

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={activeColor} />
      </ThemedView>
    );
  }

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
            {categories.map((cat) => (
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
          {activeCategory ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainScroll}>
            <View style={styles.bannerContainer}>
              <Image 
                source={{ uri: activeCategory.subcategories[0]?.image || activeCategory.image }} 
                style={styles.categoryBanner}
              />
              <View style={styles.bannerOverlay}>
                <ThemedText style={styles.bannerTitle}>{activeCategory.name}</ThemedText>
                <ThemedText style={styles.bannerSubtitle}>Up to 50% Off</ThemedText>
              </View>
            </View>

            <View style={styles.subcategoriesGrid}>
              {activeCategory.subcategories.map((sub: any) => (
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
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>No categories found</ThemedText>
            </View>
          )}
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
