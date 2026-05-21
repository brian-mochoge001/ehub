import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft, Calendar, Users, Plane, PlaneTakeoff, PlaneLanding, ChevronRight } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { Colors } from '@/constants/theme';

export default function FlightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#0288D1';
  const isDark = colorScheme === 'dark';

  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
        setLoading(true);
        const data = await api.getFlights();
        setFlights(data || []);
    } catch (err) {
        console.error('Failed to fetch flights:', err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={activeColor} />
        </ThemedView>
    );
  }

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

        {/* Available Flights */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Available Flights</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destList}>
          {flights.length > 0 ? flights.map(dest => (
            <TouchableOpacity key={dest.id} style={styles.destCard}>
              <View style={[styles.destImage, { backgroundColor: activeColor + '15', justifyContent: 'center', alignItems: 'center' }]}>
                <Plane size={40} color={activeColor} />
              </View>
              <View style={styles.destOverlay}>
                <View>
                  <ThemedText style={styles.destName}>{dest.origin} to {dest.destination}</ThemedText>
                  <ThemedText style={styles.destCountry}>{dest.airline_name} • {dest.flight_number}</ThemedText>
                  <ThemedText style={{ color: '#fff', fontSize: 10 }}>{new Date(dest.departure_time).toLocaleString()}</ThemedText>
                </View>
                <View style={styles.priceTag}>
                  <ThemedText style={styles.priceText}>{dest.currency} {dest.price}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          )) : (
              <View style={{ alignItems: 'center', padding: 20 }}>
                  <ThemedText style={{ opacity: 0.5 }}>No flights found</ThemedText>
              </View>
          )}
        </ScrollView>
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
});
