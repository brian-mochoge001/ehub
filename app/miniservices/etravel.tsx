import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { ArrowLeft, Star, Compass, Heart, ChevronRight, Globe } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const POPULAR_TOURS = [
  { id: '1', title: 'Maasai Mara Safari', duration: '3 Days, 2 Nights', price: '$450', rating: 4.9, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600' },
  { id: '2', title: 'Mount Kenya Climbing', duration: '5 Days', price: '$600', rating: 4.8, image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600' },
];

const DESTINATIONS = [
  { id: '1', name: 'Coast', icon: '🏖️' },
  { id: '2', name: 'Safari', icon: '🦁' },
  { id: '3', name: 'Hiking', icon: '🥾' },
  { id: '4', name: 'Culture', icon: '🎭' },
];

export default function TravelScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF5722'; // Travel orange/red
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Hero Background */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800' }} 
        style={styles.hero}
      >
        <View style={styles.overlay}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>eTravel</ThemedText>
            <TouchableOpacity style={styles.iconButton}>
              <Compass size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.heroContent}>
            <ThemedText style={styles.heroTag}>ADVENTURE AWAITS</ThemedText>
            <ThemedText style={styles.heroTitleLarge}>Explore the beauty of the world</ThemedText>
            <TouchableOpacity style={[styles.exploreBtn, { backgroundColor: activeColor }]}>
              <ThemedText style={styles.exploreBtnText}>Start Exploring</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Destinations */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destList}>
          {DESTINATIONS.map(dest => (
            <TouchableOpacity key={dest.id} style={[styles.destCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <ThemedText style={styles.destEmoji}>{dest.icon}</ThemedText>
              <ThemedText style={styles.destName}>{dest.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Tours */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Popular Tours</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        {POPULAR_TOURS.map(tour => (
          <TouchableOpacity key={tour.id} style={[styles.tourCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <Image source={{ uri: tour.image }} style={styles.tourImage} />
            <TouchableOpacity style={styles.heartBtn}>
              <Heart size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.tourInfo}>
              <View style={styles.tourHeader}>
                <ThemedText type="defaultSemiBold" style={styles.tourTitle}>{tour.title}</ThemedText>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <ThemedText style={styles.ratingText}>{tour.rating}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.tourDuration}>{tour.duration}</ThemedText>
              <View style={styles.priceRow}>
                <ThemedText type="defaultSemiBold" style={[styles.tourPrice, { color: activeColor }]}>{tour.price}</ThemedText>
                <ThemedText style={styles.perPerson}>/person</ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Plan Trip Promo */}
        <ThemedView style={styles.planCard}>
          <Globe size={40} color="#1976D2" />
          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemedText type="defaultSemiBold" style={{ color: '#0D47A1' }}>Personalized Trip Plan</ThemedText>
            <ThemedText style={styles.planSubtitle}>Tell us your preferences and we&apos;ll create a custom itinerary for you.</ThemedText>
          </View>
          <ChevronRight size={20} color="#0D47A1" />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { height: 400, width: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40, justifyContent: 'space-between' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  heroContent: { },
  heroTag: { color: '#fff', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  heroTitleLarge: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 25, lineHeight: 40 },
  exploreBtn: { alignSelf: 'flex-start', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  exploreBtnText: { color: '#fff', fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  destList: { padding: 20, gap: 15 },
  destCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, elevation: 2, shadowOpacity: 0.05 },
  destEmoji: { fontSize: 20, marginRight: 8 },
  destName: { fontSize: 13, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  tourCard: { marginHorizontal: 20, borderRadius: 25, overflow: 'hidden', marginBottom: 25, elevation: 3, shadowOpacity: 0.1 },
  tourImage: { width: '100%', height: 200 },
  heartBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 20 },
  tourInfo: { padding: 20 },
  tourHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tourTitle: { fontSize: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, marginLeft: 4 },
  tourDuration: { fontSize: 12, opacity: 0.5, marginVertical: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  tourPrice: { fontSize: 18 },
  perPerson: { fontSize: 12, opacity: 0.5, marginLeft: 4 },
  planCard: { flexDirection: 'row', marginHorizontal: 20, padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10, backgroundColor: '#ff6e88' },
  planSubtitle: { fontSize: 11, opacity: 0.7, marginTop: 4, lineHeight: 16 },
});
