import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { ArrowLeft, Search, Wrench, Laptop, Smartphone, Tv, Home, History, ChevronRight, Star, Clock } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const REPAIR_CATEGORIES = [
  { id: '1', name: 'Mobile', icon: Smartphone, color: '#2196F3' },
  { id: '2', name: 'Laptop', icon: Laptop, color: '#673AB7' },
  { id: '3', name: 'TV & Audio', icon: Tv, color: '#F44336' },
  { id: '4', name: 'Home Appl.', icon: Home, color: '#FF9800' },
];

const EXPERT_REPAIRERS = [
  { id: '1', name: 'Tech Fix Solutions', specialty: 'Mobile & Laptop', rating: 4.9, reviews: 120, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { id: '2', name: 'Home Care Pro', specialty: 'Appliances', rating: 4.7, reviews: 85, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400' },
];

export default function RepairScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF9800'; // Repair orange
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">eRepare Services</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <History size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            placeholder="What needs fixing?" 
            placeholderTextColor="#888"
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          />
        </View>

        {/* Promo */}
        <View style={[styles.promoCard, { backgroundColor: '#FF9800' }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.promoTitle}>Screen Cracked?</ThemedText>
            <ThemedText style={styles.promoSubtitle}>Get it fixed in 1 hour at your doorstep.</ThemedText>
            <TouchableOpacity style={styles.bookNowBtn}>
              <ThemedText style={{ color: '#FF9800', fontWeight: 'bold' }}>Book Repair</ThemedText>
            </TouchableOpacity>
          </View>
          <Smartphone size={80} color="rgba(255,255,255,0.2)" style={styles.promoIcon} />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Categories</ThemedText>
        </View>
        <View style={styles.catGrid}>
          {REPAIR_CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <View style={[styles.iconCircle, { backgroundColor: cat.color + '15' }]}>
                <cat.icon size={28} color={cat.color} />
              </View>
              <ThemedText style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Experts */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Certified Experts</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        {EXPERT_REPAIRERS.map(repairer => (
          <TouchableOpacity key={repairer.id} style={[styles.repairerCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <Image source={{ uri: repairer.image }} style={styles.repairerImage} />
            <View style={styles.repairerInfo}>
              <ThemedText type="defaultSemiBold">{repairer.name}</ThemedText>
              <ThemedText style={styles.specialtyText}>{repairer.specialty}</ThemedText>
              <View style={styles.ratingRow}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <ThemedText style={styles.ratingText}>{repairer.rating} ({repairer.reviews} reviews)</ThemedText>
              </View>
            </View>
            <ChevronRight size={20} color="#888" />
          </TouchableOpacity>
        ))}

        {/* Benefits */}
        <View style={styles.benefitsRow}>
          <View style={styles.benefitItem}>
            <Clock size={20} color={activeColor} />
            <ThemedText style={styles.benefitText}>Quick Service</ThemedText>
          </View>
          <View style={styles.benefitItem}>
            <Wrench size={20} color={activeColor} />
            <ThemedText style={styles.benefitText}>Genuine Parts</ThemedText>
          </View>
          <View style={styles.benefitItem}>
            <Star size={20} color={activeColor} />
            <ThemedText style={styles.benefitText}>Warranty</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  scrollContent: { paddingBottom: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginBottom: 25 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  promoCard: { marginHorizontal: 20, borderRadius: 25, padding: 25, flexDirection: 'row', overflow: 'hidden', marginBottom: 30 },
  promoTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  promoSubtitle: { color: '#fff', fontSize: 12, opacity: 0.9, marginBottom: 20 },
  bookNowBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  promoIcon: { position: 'absolute', right: -10, bottom: -10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  catGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30 },
  catItem: { alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: '500' },
  repairerCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 15, borderRadius: 20, marginBottom: 12, elevation: 1, shadowOpacity: 0.02 },
  repairerImage: { width: 60, height: 60, borderRadius: 15 },
  repairerInfo: { flex: 1, marginLeft: 15 },
  specialtyText: { fontSize: 12, opacity: 0.5, marginVertical: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, opacity: 0.6, marginLeft: 5 },
  benefitsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingHorizontal: 20 },
  benefitItem: { alignItems: 'center', gap: 8 },
  benefitText: { fontSize: 10, opacity: 0.5 },
});
