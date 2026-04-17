import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft, Box, MapPin, Truck, History, ChevronRight, Navigation } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const RECENT_TRACKING = [
  { id: '1', number: 'SH-7721054', status: 'In Transit', location: 'Nairobi Hub', date: 'Oct 24, 2023' },
  { id: '2', number: 'SH-8812033', status: 'Delivered', location: 'Home', date: 'Oct 20, 2023' },
];

export default function DeliveryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#673AB7'; // Delivery purple
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">eDelivery</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <History size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tracking Card */}
        <View style={[styles.trackingCard, { backgroundColor: activeColor }]}>
          <ThemedText style={styles.trackingTitle}>Track your package</ThemedText>
          <ThemedText style={styles.trackingSubtitle}>Enter your tracking number to see status</ThemedText>
          <View style={styles.trackingInputRow}>
            <TextInput 
              placeholder="e.g. SH-0000000"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.trackingInput}
            />
            <TouchableOpacity style={styles.trackBtn}>
              <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>Track</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={[styles.actionIcon, { backgroundColor: '#E1F5FE' }]}>
              <Box size={24} color="#03A9F4" />
            </View>
            <ThemedText style={styles.actionLabel}>Send Package</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Truck size={24} color="#9C27B0" />
            </View>
            <ThemedText style={styles.actionLabel}>Pick Up</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Navigation size={24} color="#FF9800" />
            </View>
            <ThemedText style={styles.actionLabel}>Check Rates</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Recent Trackings */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recent Tracking</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>

        {RECENT_TRACKING.map(track => (
          <TouchableOpacity key={track.id} style={[styles.trackItem, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={[styles.boxIcon, { backgroundColor: activeColor + '15' }]}>
              <Box size={20} color={activeColor} />
            </View>
            <View style={styles.trackInfo}>
              <ThemedText type="defaultSemiBold">ID: {track.number}</ThemedText>
              <ThemedText style={styles.trackStatus}>{track.status} • {track.location}</ThemedText>
            </View>
            <View style={styles.trackDate}>
              <ThemedText style={styles.dateText}>{track.date}</ThemedText>
              <ChevronRight size={16} color="#888" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Map Promo */}
        <View style={[styles.mapPromo, { backgroundColor: isDark ? '#222' : '#f8f8f8' }]}>
          <View style={styles.mapInfo}>
            <ThemedText type="defaultSemiBold">Nearby Hubs</ThemedText>
            <ThemedText style={styles.mapSubtitle}>Find the nearest eDelivery drop-off point.</ThemedText>
            <TouchableOpacity style={[styles.findBtn, { backgroundColor: activeColor }]}>
              <ThemedText style={styles.findBtnText}>Open Map</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.mapPlaceholder}>
             <MapPin size={40} color={activeColor} />
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
  trackingCard: { marginHorizontal: 20, borderRadius: 25, padding: 25, marginBottom: 25 },
  trackingTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  trackingSubtitle: { color: '#fff', fontSize: 12, opacity: 0.8, marginBottom: 20 },
  trackingInputRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 8, alignItems: 'center' },
  trackingInput: { flex: 1, color: '#fff', paddingHorizontal: 12, height: 40 },
  trackBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 30 },
  actionCard: { flex: 1, padding: 15, borderRadius: 20, alignItems: 'center', elevation: 1, shadowOpacity: 0.02 },
  actionIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  trackItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 15, borderRadius: 20, marginBottom: 12, elevation: 1, shadowOpacity: 0.02 },
  boxIcon: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  trackInfo: { flex: 1 },
  trackStatus: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  trackDate: { alignItems: 'flex-end', gap: 5 },
  dateText: { fontSize: 11, opacity: 0.4 },
  mapPromo: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 25, padding: 20, alignItems: 'center', marginTop: 10 },
  mapInfo: { flex: 1 },
  mapSubtitle: { fontSize: 12, opacity: 0.5, marginVertical: 10 },
  findBtn: { alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  findBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  mapPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(103, 58, 183, 0.1)', justifyContent: 'center', alignItems: 'center' },
});
