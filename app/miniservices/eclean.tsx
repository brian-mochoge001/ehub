import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Star, ChevronRight, Home, Sparkles, Building2, LayoutGrid } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

export default function CleanScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#4CAF50'; // Eco green
  const isDark = colorScheme === 'dark';

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCleaningServices();
  }, []);

  const fetchCleaningServices = async () => {
    try {
        setLoading(true);
        const data = await api.getServicesByType('cleaning');
        setServices(data || []);
    } catch (err) {
        console.error('Failed to fetch cleaning services:', err);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">eClean</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <LayoutGrid size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={[styles.heroCard, { backgroundColor: activeColor }]}>
          <View style={styles.heroInfo}>
            <ThemedText style={styles.heroTitle}>Professional Cleaning Services</ThemedText>
            <ThemedText style={styles.heroSubtitle}>Book a trusted cleaner in minutes.</ThemedText>
            <TouchableOpacity style={styles.heroBtn}>
              <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>Book Now</ThemedText>
            </TouchableOpacity>
          </View>
          <Sparkles size={80} color="rgba(255,255,255,0.2)" style={styles.heroIcon} />
        </View>

        {/* Services List */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Our Services</ThemedText>
        </View>
        
        {services.length > 0 ? services.map(service => (
          <TouchableOpacity key={service.id} style={[styles.serviceRow, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={[styles.iconBox, { backgroundColor: activeColor + '15' }]}>
              <Sparkles size={24} color={activeColor} />
            </View>
            <View style={styles.serviceInfo}>
              <ThemedText type="defaultSemiBold">{service.name}</ThemedText>
              <ThemedText style={styles.servicePrice}>{service.currency} {service.base_price}</ThemedText>
            </View>
            <ChevronRight size={20} color="#888" />
          </TouchableOpacity>
        )) : (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ThemedText style={{ opacity: 0.5 }}>No services available</ThemedText>
            </View>
        )}

        {/* Reviews Section */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Trusted by Customers</ThemedText>
        </View>
        <View style={[styles.reviewCard, { backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9' }]}>
          <View style={styles.ratingRow}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingValue}>4.9/5</ThemedText>
            <ThemedText style={styles.reviewCount}>(2.5k reviews)</ThemedText>
          </View>
          <ThemedText style={styles.reviewText}>&quot;Best cleaning service I&apos;ve ever used. The cleaners were professional and efficient!&quot;</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40 },
  heroCard: { marginHorizontal: 20, borderRadius: 25, padding: 25, flexDirection: 'row', overflow: 'hidden', marginBottom: 30 },
  heroInfo: { flex: 1, zIndex: 1 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  heroSubtitle: { color: '#fff', fontSize: 13, opacity: 0.9, marginBottom: 20 },
  heroBtn: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  heroIcon: { position: 'absolute', right: -10, bottom: -10 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15, marginTop: 10 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 18, borderRadius: 20, marginBottom: 12, elevation: 1, shadowOpacity: 0.02 },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  serviceInfo: { flex: 1 },
  servicePrice: { fontSize: 12, opacity: 0.5, marginTop: 4 },
  reviewCard: { marginHorizontal: 20, padding: 20, borderRadius: 20, marginTop: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ratingValue: { marginLeft: 8, fontWeight: 'bold' },
  reviewCount: { marginLeft: 5, fontSize: 12, opacity: 0.5 },
  reviewText: { fontSize: 13, fontStyle: 'italic', opacity: 0.7, lineHeight: 20 },
});
