import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft, Search, Building2, Package, FileText, Globe } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const B2B_CATEGORIES = [
  { id: '1', name: 'Industrial', icon: '⚙️' },
  { id: '2', name: 'Wholesale', icon: '📦' },
  { id: '3', name: 'Electronics', icon: '🔌' },
  { id: '4', name: 'Packaging', icon: '🗞️' },
];

const RECENT_QUOTES = [
  { id: '1', title: 'Bulk LED Monitors', supplier: 'Tech Corp', status: 'Pending', date: 'Oct 24, 2023' },
  { id: '2', title: 'Office Stationery', supplier: 'Stationery Hub', status: 'Approved', date: 'Oct 22, 2023' },
];

export default function B2BScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#455A64'; // Professional slate grey
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>eHub B2B</ThemedText>
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
        <View style={styles.catGrid}>
          {B2B_CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <ThemedText style={styles.catEmoji}>{cat.icon}</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Quotes */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Request Quotes</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: '#2196F3' }}>View All</ThemedText></TouchableOpacity>
        </View>

        {RECENT_QUOTES.map(quote => (
          <TouchableOpacity key={quote.id} style={[styles.quoteCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={styles.quoteInfo}>
              <ThemedText type="defaultSemiBold">{quote.title}</ThemedText>
              <ThemedText style={styles.supplierText}>{quote.supplier}</ThemedText>
              <ThemedText style={styles.quoteDate}>{quote.date}</ThemedText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: quote.status === 'Approved' ? '#E8F5E9' : '#FFF3E0' }]}>
              <ThemedText style={[styles.statusText, { color: quote.status === 'Approved' ? '#2E7D32' : '#E65100' }]}>{quote.status}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}

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
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
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
