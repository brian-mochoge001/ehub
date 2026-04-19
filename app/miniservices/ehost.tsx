import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';
import { ArrowLeft, Search, Star, Heart, HeartIcon, MapPinHouse } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const FEATURED_STAYS = [
  { id: '1', title: 'Modern Studio Apartment', location: 'Westlands, Nairobi', price: 'Ksh 4,500/night', rating: 4.9, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' },
  { id: '2', title: 'Luxury Villa with Pool', location: 'Diani Beach', price: 'Ksh 15,000/night', rating: 4.8, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' },
];

const CATEGORIES = [
  { id: '1', name: 'Apartments', icon: '🏢' },
  { id: '2', name: 'Villas', icon: '🏡' },
  { id: '3', name: 'Cabins', icon: '🪑' },
  { id: '4', name: 'Hotels', icon: '🏨' },
  { id: '5', name: 'Lodges', icon: '🛏️' },
];

export default function HostScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF385C'; // Hosting pink/red
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Search Header Overlay */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={'#FF385C'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.searchBar, { backgroundColor: isDark ? '#222' : '#fff' }]}>
          <Search size={18} style={{ marginRight: 10 }} color={activeColor} />
          <View>
            <TextInput
              placeholder="Search your next stay..."
              placeholderTextColor={isDark ? '#888' : '#ddd'}
              style={[{ color: Colors[colorScheme].text }]}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton}>
          <HeartIcon size={20} color={'#FF385C'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1630699375019-c334927264df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} 
          style={styles.banner}
        >
          <View style={styles.bannerOverlay}>
            <ThemedText style={{ color: '#666', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>Not sure where to go? <ThemedText style={{ color: '#cc0027', fontSize: 24, fontWeight: 'bold' }}>Perfect.</ThemedText></ThemedText>
            <TouchableOpacity style={styles.flexibleBtn}>
              <ThemedText style={{ color: '#FF385C', fontWeight: 'bold' }}>I&apos;m flexible</ThemedText>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <ThemedText style={styles.catEmoji}>{cat.icon}</ThemedText>
              <ThemedText style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Stays */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Popular Stays</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        {FEATURED_STAYS.map(stay => (
          <TouchableOpacity key={stay.id} style={styles.stayCard}>
            <Image source={{ uri: stay.image }} style={styles.stayImage} />
            <TouchableOpacity style={styles.heartBtn}>
              <Heart size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.stayInfo}>
              <View style={styles.stayHeader}>
                <ThemedText type="defaultSemiBold" style={styles.stayTitle}>{stay.title}</ThemedText>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#000" fill="#000" />
                  <ThemedText style={styles.ratingText}>{stay.rating}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.stayLocation}>{stay.location}</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.stayPrice}>{stay.price}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}

        {/* Host Promo */}
        <View style={[styles.hostCard, { backgroundColor: isDark ? '#222' : '#f7f7f7' }]}>
          <View style={{ flex: 1 }}>
            <ThemedText type="subtitle">Become a Host</ThemedText>
            <ThemedText style={styles.hostSubtitle}>Earn extra income and unlock new opportunities by sharing your space.</ThemedText>
            <TouchableOpacity style={[styles.learnMoreBtn, { borderColor: Colors[colorScheme].text }]}>
              <ThemedText style={{ fontWeight: 'bold' }}>Learn More</ThemedText>
            </TouchableOpacity>
          </View>
          <MapPinHouse style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.4 }} size={150} color={activeColor} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 15 },
  backButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  searchBar: { flex: 1, height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, elevation: 5, shadowOpacity: 0.1, shadowRadius: 10 },
  scrollContent: { paddingBottom: 40 },
  banner: { justifyContent:'flex-end', alignItems:'center', height: 400 },
  bannerOverlay: { paddingBottom: 30, alignItems: 'center', maxWidth: '60%' },
  flexibleBtn: { backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, elevation: 2 },
  catList: { padding: 20, gap: 30, justifyContent: 'space-between', },
  catItem: { alignItems: 'center', opacity: 0.7 },
  catEmoji: { fontSize: 24, marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  stayCard: { marginHorizontal: 20, marginBottom: 30 },
  stayImage: { width: '100%', height: 250, borderRadius: 20 },
  heartBtn: { position: 'absolute', top: 15, right: 15 },
  stayInfo: { marginTop: 12 },
  stayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stayTitle: { fontSize: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, marginLeft: 4 },
  stayLocation: { fontSize: 14, opacity: 0.5, marginVertical: 4 },
  stayPrice: { fontSize: 16 },
  hostCard: { marginHorizontal: 20, padding: 25, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  hostSubtitle: { fontSize: 13, opacity: 0.6, marginVertical: 15 },
  learnMoreBtn: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
});
