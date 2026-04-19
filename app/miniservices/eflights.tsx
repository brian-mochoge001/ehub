import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Calendar, Users, Plane, PlaneTakeoff, PlaneLanding, ChevronRight } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const POPULAR_DESTINATIONS = [
  { id: '1', name: 'Zanzibar', country: 'Tanzania', image: 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=400', price: '$250' },
  { id: '2', name: 'Cape Town', country: 'South Africa', image: 'https://i.pinimg.com/1200x/e7/d1/15/e7d115e4ab425c2334e11a6432ec4830.jpg', price: '$450' },
  { id: '3', name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', price: '$680' },
];

export default function FlightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#0288D1';
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Background Header */}
      <View style={[styles.blueHeader, { backgroundColor: activeColor }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Find Your Flight</ThemedText>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Booking Card */}
        <View style={[styles.bookingCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.activeTab, { borderBottomColor: activeColor }]}>
              <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>One Way</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <ThemedText style={{ color: '#888' }}>Round Trip</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <ThemedText style={{ color: '#888' }}>Multi-City</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputItem}>
              <PlaneTakeoff size={18} color={activeColor} />
              <View style={styles.inputTextContainer}>
                <ThemedText style={styles.inputLabel}>From</ThemedText>
                <ThemedText style={styles.inputValue}>Nairobi (NBO)</ThemedText>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#eee' }]} />
            <View style={styles.inputItem}>
              <PlaneLanding size={18} color={activeColor} />
              <View style={styles.inputTextContainer}>
                <ThemedText style={styles.inputLabel}>To</ThemedText>
                <ThemedText style={styles.inputValue}>Mombasa (MBA)</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.rowInput, { borderRightWidth: 1, borderColor: isDark ? '#333' : '#eee' }]}>
              <Calendar size={18} color={activeColor} />
              <View style={styles.inputTextContainer}>
                <ThemedText style={styles.inputLabel}>Departure</ThemedText>
                <ThemedText style={styles.inputValue}>24 Oct 2023</ThemedText>
              </View>
            </View>
            <View style={styles.rowInput}>
              <Users size={18} color={activeColor} />
              <View style={styles.inputTextContainer}>
                <ThemedText style={styles.inputLabel}>Passengers</ThemedText>
                <ThemedText style={styles.inputValue}>1 Adult</ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.searchBtn, { backgroundColor: activeColor }]}>
            <ThemedText style={styles.searchBtnText}>Search Flights</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Popular Destinations */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Popular Destinations</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destList}>
          {POPULAR_DESTINATIONS.map(dest => (
            <TouchableOpacity key={dest.id} style={styles.destCard}>
              <Image source={{ uri: dest.image }} style={styles.destImage} />
              <View style={styles.destOverlay}>
                <View>
                  <ThemedText style={styles.destName}>{dest.name}</ThemedText>
                  <ThemedText style={styles.destCountry}>{dest.country}</ThemedText>
                </View>
                <View style={styles.priceTag}>
                  <ThemedText style={styles.priceText}>From {dest.price}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Travel Deals */}
        <TouchableOpacity style={[styles.dealCard, { backgroundColor: isDark ? '#222' : '#f0f9ff' }]}>
          <View style={styles.dealIcon}>
            <Plane size={24} color={activeColor} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <ThemedText type="defaultSemiBold">Last Minute Deals!</ThemedText>
            <ThemedText style={styles.dealText}>Save up to 40% on international flights booked today.</ThemedText>
          </View>
          <ChevronRight size={20} color="#888" />
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blueHeader: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40, paddingHorizontal: 20 },
  bookingCard: { marginTop: 20, borderRadius: 25, padding: 20, elevation: 5, shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, marginBottom: 30 },
  tabContainer: { flexDirection: 'row', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
  tab: { paddingVertical: 10, marginRight: 20 },
  activeTab: { paddingVertical: 10, marginRight: 20, borderBottomWidth: 3 },
  inputGroup: { borderRadius: 15, borderWidth: 1, borderColor: 'rgba(128,128,128,0.1)', overflow: 'hidden', marginBottom: 15 },
  inputItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  inputTextContainer: { marginLeft: 15 },
  inputLabel: { fontSize: 10, opacity: 0.5, textTransform: 'uppercase' },
  inputValue: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  divider: { height: 1 },
  rowInputs: { flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(128,128,128,0.1)', borderRadius: 15, marginBottom: 20 },
  rowInput: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 15 },
  searchBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  destList: { gap: 15, paddingBottom: 10 },
  destCard: { width: 220, height: 280, borderRadius: 25, overflow: 'hidden' },
  destImage: { width: '100%', height: '100%' },
  destOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end' },
  destName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  destCountry: { color: '#fff', fontSize: 12, opacity: 0.8 },
  priceTag: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  priceText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  dealCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginTop: 10 },
  dealIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(2, 136, 209, 0.1)', justifyContent: 'center', alignItems: 'center' },
  dealText: { fontSize: 12, opacity: 0.6, marginTop: 4 },
});
