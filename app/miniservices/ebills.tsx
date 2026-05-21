import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Zap, Droplets, Wifi, Tv, Phone, CreditCard, ChevronRight, History } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

const BILL_CATEGORIES = [
  { id: '1', name: 'Electricity', icon: Zap, color: '#FFD700' },
  { id: '2', name: 'Water', icon: Droplets, color: '#2196F3' },
  { id: '3', name: 'Internet', icon: Wifi, color: '#4CAF50' },
  { id: '4', name: 'Television', icon: Tv, color: '#F44336' },
  { id: '5', name: 'Mobile', icon: Phone, color: '#9C27B0' },
  { id: '6', name: 'Credit Card', icon: CreditCard, color: '#607D8B' },
];

export default function BillsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  const isDark = colorScheme === 'dark';

  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
        setLoading(true);
        const data = await api.getBills();
        setBills(data || []);
    } catch (err) {
        console.error('Failed to fetch bills:', err);
    } finally {
        setLoading(false);
    }
  };

  const totalUnpaid = bills.filter(b => b.status === 'unpaid').reduce((sum, b) => sum + parseFloat(b.amount_due), 0);

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
        <ThemedText type="subtitle">Bill Payments</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <History size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1a5f7a' : '#0a7ea4' }]}>
          <ThemedText style={styles.balanceLabel}>Total Unpaid Amount</ThemedText>
          <ThemedText style={styles.balanceValue}>Ksh {totalUnpaid.toFixed(2)}</ThemedText>
          <View style={styles.cardFooter}>
            <ThemedText style={styles.dueText}>{bills.filter(b => b.status === 'unpaid').length} bills due</ThemedText>
            <TouchableOpacity style={styles.payAllBtn}>
              <ThemedText style={styles.payAllText}>Pay All</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Grid */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Select Category</ThemedText>
        <View style={styles.grid}>
          {BILL_CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.gridItem}>
              <View style={[styles.iconCircle, { backgroundColor: cat.color + '15' }]}>
                <cat.icon size={28} color={cat.color} />
              </View>
              <ThemedText style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Your Bills</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>

        {bills.length > 0 ? bills.map(bill => (
          <TouchableOpacity key={bill.id} style={[styles.billItem, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={[styles.billIcon, { backgroundColor: (BILL_CATEGORIES.find(c => c.name === bill.category)?.color || activeColor) + '15' }]}>
               {React.createElement(BILL_CATEGORIES.find(c => c.name === bill.category)?.icon || CreditCard, { size: 20, color: BILL_CATEGORIES.find(c => c.name === bill.category)?.color || activeColor })}
            </View>
            <View style={styles.billInfo}>
              <ThemedText type="defaultSemiBold">{bill.biller_name}</ThemedText>
              <ThemedText style={styles.billDate}>{new Date(bill.due_date).toLocaleDateString()}</ThemedText>
            </View>
            <View style={styles.billAmount}>
              <ThemedText type="defaultSemiBold" style={{ color: bill.status === 'paid' ? '#4CAF50' : '#FF6347' }}>{bill.currency} {bill.amount_due}</ThemedText>
              <ChevronRight size={16} color="#888" />
            </View>
          </TouchableOpacity>
        )) : (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ThemedText style={{ opacity: 0.5 }}>No bills found</ThemedText>
            </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 25 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  scrollContent: { paddingBottom: 40 },
  balanceCard: { marginHorizontal: 20, borderRadius: 25, padding: 25, marginBottom: 30, elevation: 5, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  balanceValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  dueText: { color: '#fff', fontSize: 12, opacity: 0.9 },
  payAllBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  payAllText: { color: '#0a7ea4', fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { paddingHorizontal: 20, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, marginBottom: 20 },
  gridItem: { width: '33.33%', alignItems: 'center', marginBottom: 25 },
  iconCircle: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  billItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 15, borderRadius: 20, marginBottom: 12, elevation: 1, shadowOpacity: 0.02 },
  billIcon: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  billInfo: { flex: 1 },
  billDate: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  billAmount: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
