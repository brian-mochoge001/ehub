import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, Search, Building2, Package, FileText, Globe } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

export default function B2BScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#455A64'; // Professional slate grey
  const isDark = colorScheme === 'dark';

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchB2B();
  }, []);

  const fetchB2B = async () => {
    try {
        setLoading(true);
        const data = await api.getServicesByType('b2b');
        setServices(data || []);
    } catch (err) {
        console.error('Failed to fetch B2B services:', err);
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
        <ThemedText type="subtitle" style={styles.headerTitle}>Wholesaler</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <Globe size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search for products or suppliers..." 
            placeholderTextColor="#888"
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          />
        </View>

        {/* Business Dashboard Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <FileText size={24} color="#2196F3" />
            <ThemedText style={styles.statValue}>12</ThemedText>
            <ThemedText style={styles.statLabel}>Active Quotes</ThemedText>
          </View>
          <View style={[styles.statItem, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <Package size={24} color="#4CAF50" />
            <ThemedText style={styles.statValue}>5</ThemedText>
            <ThemedText style={styles.statLabel}>In Transit</ThemedText>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Supplies & Equipment</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: '#2196F3' }}>See All</ThemedText></TouchableOpacity>
        </View>

        {/* Recent Quotes */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Suppliers & Wholesale</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: '#2196F3' }}>View All</ThemedText></TouchableOpacity>
        </View>

        {services.length > 0 ? services.map(service => (
          <TouchableOpacity key={service.id} style={[styles.quoteCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={styles.quoteInfo}>
              <ThemedText type="defaultSemiBold">{service.name}</ThemedText>
              <ThemedText style={styles.supplierText}>{service.business_name || 'Verified Wholesaler'}</ThemedText>
              <ThemedText style={styles.quoteDate}>{service.currency} {service.base_price}</ThemedText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
              <ThemedText style={[styles.statusText, { color: '#2E7D32' }]}>Available</ThemedText>
            </View>
          </TouchableOpacity>
        )) : (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ThemedText style={{ opacity: 0.5 }}>No wholesale services found</ThemedText>
            </View>
        )}

        {/* Vendor Promo */}
        <View style={[styles.vendorCard, { backgroundColor: activeColor }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.vendorTitle}>Become a Supplier</ThemedText>
            <ThemedText style={styles.vendorSubtitle}>Reach thousands of businesses across the region.</ThemedText>
            <TouchableOpacity style={styles.registerBtn}>
              <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>Register Now</ThemedText>
            </TouchableOpacity>
          </View>
          <Building2 size={60} color="rgba(255,255,255,0.2)" />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', backgroundColor: '#455A64', paddingTop: 50, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(180,180,180, 0.5)' },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginTop: 10, marginBottom: 25 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginBottom: 30 },
  statItem: { flex: 1, padding: 20, borderRadius: 20, alignItems: 'center', elevation: 2, shadowOpacity: 0.05 },
  statValue: { fontSize: 24, fontWeight: 'bold', marginVertical: 4 },
  statLabel: { fontSize: 11, opacity: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  catGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 30 },
  catCard: { flex: 1, paddingHorizontal: 6, paddingTop: 12, paddingBottom: 8, borderRadius: 20, alignItems: 'center', elevation: 2, shadowOpacity: 0.05 },
  catEmoji: { fontSize: 24, marginBottom: 8 },
  catName: { fontSize: 10, textAlign: 'center' },
  quoteCard: { flexDirection: 'row', marginHorizontal: 20, padding: 15, borderRadius: 20, marginBottom: 12, alignItems: 'center', elevation: 1 },
  quoteInfo: { flex: 1 },
  supplierText: { fontSize: 12, opacity: 0.6, marginVertical: 2 },
  quoteDate: { fontSize: 10, opacity: 0.4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  vendorCard: { flexDirection: 'row', marginHorizontal: 20, padding: 25, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  vendorTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  vendorSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginVertical: 12 },
  registerBtn: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
});
