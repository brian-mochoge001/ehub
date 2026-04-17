import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bus, MapPin, Calendar, Clock, ChevronRight, Info, Heart } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const POPULAR_ROUTES = [
  { id: '1', from: 'Nairobi', to: 'Mombasa', price: 'Ksh1,500.00', time: '8h 30m' },
  { id: '2', from: 'Nairobi', to: 'Kisumu', price: 'Ksh1,500.00', time: '6h 45m' },
  { id: '3', from: 'Mombasa', to: 'Malindi', price: 'Ksh500.00', time: '2h 15m' },
];

export default function BusScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF5722'; // Bus orange
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: activeColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Bus Tickets</ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Heart size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Card */}
        <View style={[styles.searchCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
          <View style={styles.inputRow}>
            <View style={[styles.iconCircle, { backgroundColor: activeColor + '15' }]}>
              <MapPin size={20} color={activeColor} />
            </View>
            <View style={styles.inputInfo}>
              <ThemedText style={styles.inputLabel}>From</ThemedText>
              <ThemedText style={styles.inputValue}>Nairobi, Central Terminal</ThemedText>
            </View>
          </View>
          
          <View style={[styles.divider, { marginLeft: 60 }]} />
          
          <View style={styles.inputRow}>
            <View style={[styles.iconCircle, { backgroundColor: activeColor + '15' }]}>
              <MapPin size={20} color={activeColor} />
            </View>
            <View style={styles.inputInfo}>
              <ThemedText style={styles.inputLabel}>To</ThemedText>
              <ThemedText style={styles.inputValue}>Mombasa, Coastal Plaza</ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { marginLeft: 60 }]} />

          <View style={styles.dateRow}>
            <View style={styles.rowInput}>
              <Calendar size={18} color={activeColor} />
              <View style={{ marginLeft: 15 }}>
                <ThemedText style={styles.inputLabel}>Date</ThemedText>
                <ThemedText style={styles.inputValue}>24 Oct 2023</ThemedText>
              </View>
            </View>
            <View style={styles.rowInput}>
              <Bus size={18} color={activeColor} />
              <View style={{ marginLeft: 15 }}>
                <ThemedText style={styles.inputLabel}>Type</ThemedText>
                <ThemedText style={styles.inputValue}>Executive</ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.searchBtn, { backgroundColor: activeColor }]}>
            <ThemedText style={styles.searchBtnText}>Search Buses</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Popular Routes */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Popular Routes</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        {POPULAR_ROUTES.map(route => (
          <TouchableOpacity key={route.id} style={[styles.routeCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={styles.routeMain}>
              <View style={styles.cities}>
                <ThemedText type="defaultSemiBold">{route.from}</ThemedText>
                <ChevronRight size={14} color="#888" style={{ marginHorizontal: 10 }} />
                <ThemedText type="defaultSemiBold">{route.to}</ThemedText>
              </View>
              <ThemedText style={styles.priceText}>{route.price}</ThemedText>
            </View>
            <View style={styles.routeFooter}>
              <View style={styles.footerItem}>
                <Clock size={12} color="#888" />
                <ThemedText style={styles.footerText}>{route.time}</ThemedText>
              </View>
              <View style={styles.footerItem}>
                <Info size={12} color="#888" />
                <ThemedText style={styles.footerText}>Air Conditioned</ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: '#FFF3E0' }]}>
          <Info size={20} color="#FF9800" />
          <ThemedText style={styles.infoBannerText}>Book in advance to save up to 20% on tickets!</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  searchCard: { marginHorizontal: 20, marginTop: 20, borderRadius: 25, padding: 20, elevation: 4, shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, marginBottom: 30 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  inputInfo: { marginLeft: 20 },
  inputLabel: { fontSize: 10, opacity: 0.5, textTransform: 'uppercase' },
  inputValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginVertical: 5 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
  rowInput: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  searchBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  routeCard: { marginHorizontal: 20, padding: 18, borderRadius: 20, marginBottom: 12, elevation: 1, shadowOpacity: 0.02 },
  routeMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cities: { flexDirection: 'row', alignItems: 'center' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#FF5722' },
  routeFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.05)', paddingTop: 12, gap: 15 },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 11, color: '#888', marginLeft: 5 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 10, padding: 15, borderRadius: 15 },
  infoBannerText: { flex: 1, marginLeft: 12, fontSize: 12, color: '#E65100' },
});
