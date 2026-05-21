import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { 
  ArrowLeft, 
  Wallet, 
  Send, 
  Plus, 
  History, 
  QrCode, 
  Smartphone, 
  Star, 
  ChevronRight, 
  Zap, 
  Droplets, 
  Wifi, 
  Tv, 
  Phone, 
  CreditCard,
  Pin
} from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

const QUICK_TRANSFERS = [
  { id: '1', name: 'Alex', avatar: 'https://i.pravatar.cc/100?u=alex' },
  { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/100?u=sarah' },
  { id: '3', name: 'Mike', avatar: 'https://i.pravatar.cc/100?u=mike' },
  { id: '4', name: 'Emma', avatar: 'https://i.pravatar.cc/100?u=emma' },
];

const BILL_CATEGORIES = [
  { id: '1', name: 'Electricity', icon: Zap, color: '#FFD700' },
  { id: '2', name: 'Water', icon: Droplets, color: '#2196F3' },
  { id: '3', name: 'Internet', icon: Wifi, color: '#4CAF50' },
  { id: '4', name: 'Television', icon: Tv, color: '#F44336' },
  { id: '5', name: 'Mobile', icon: Phone, color: '#9C27B0' },
  { id: '6', name: 'Credit Card', icon: CreditCard, color: '#607D8B' },
];

export default function PayScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#4CAF50';
  const isDark = colorScheme === 'dark';

  const [activeTab, setActiveTab] = useState<'payments' | 'bills'>('payments');
  const [balance, setBalance] = useState<string>('0.00');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [walletData, billsData] = await Promise.all([
        api.getWalletBalance(),
        api.getBills()
      ]);
      setBalance(walletData.balance || '0.00');
      setBills(billsData || []);
      // Mock transactions for now
      setTransactions([
        { id: '1', title: 'Starbucks Coffee', category: 'Food', amount: '-$5.50', date: 'Today, 09:30 AM', icon: '☕' },
        { id: '2', title: 'Salary Deposit', category: 'Income', amount: '+$3,200.00', date: 'Yesterday', icon: '💰' },
        { id: '3', title: 'Netflix Sub', category: 'Entertainment', amount: '-$12.99', date: 'Oct 22, 2023', icon: '📺' },
      ]);
    } catch (err) {
      console.error('Failed to load ePay data:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const togglePin = (id: string) => {
    setPinnedItems(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const renderPaymentTab = () => (
    <View style={styles.tabContent}>
      {/* Quick Transfer */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Quick Transfer</ThemedText>
        <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        <TouchableOpacity style={styles.addTransfer}>
          <View style={[styles.addIcon, { borderColor: Colors[colorScheme].text }]}>
            <Plus size={20} color={Colors[colorScheme].text} />
          </View>
          <ThemedText style={styles.listLabel}>Add</ThemedText>
        </TouchableOpacity>
        {QUICK_TRANSFERS.map(user => (
          <TouchableOpacity key={user.id} style={styles.transferItem}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <ThemedText style={styles.listLabel}>{user.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
      </View>
      <View style={styles.verticalList}>
        {transactions.map(tx => (
          <TouchableOpacity key={tx.id} style={[styles.listItem, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={styles.listIconContainer}>
              <ThemedText style={styles.txEmoji}>{tx.icon}</ThemedText>
            </View>
            <View style={styles.listInfo}>
              <ThemedText type="defaultSemiBold">{tx.title}</ThemedText>
              <ThemedText style={styles.listSub}>{tx.date}</ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={{ color: tx.amount.startsWith('+') ? activeColor : Colors[colorScheme].text }}>
              {tx.amount}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBillsTab = () => (
    <View style={styles.tabContent}>
      {/* Pinned Bills */}
      {pinnedItems.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Pinned Bills</ThemedText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {bills.filter(b => pinnedItems.includes(b.id)).map(bill => {
              const cat = BILL_CATEGORIES.find(c => c.name === bill.category) || BILL_CATEGORIES[0];
              return (
                <TouchableOpacity key={bill.id} style={[styles.pinnedCard, { backgroundColor: cat.color + '20' }]}>
                  <cat.icon size={24} color={cat.color} />
                  <ThemedText style={styles.pinnedTitle} numberOfLines={1}>{bill.biller_name}</ThemedText>
                  <ThemedText style={styles.pinnedAmount}>{bill.currency} {bill.amount_due}</ThemedText>
                  <TouchableOpacity style={styles.pinBtn} onPress={() => togglePin(bill.id)}>
                    <Pin size={12} color={cat.color} fill={cat.color} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Pay New Bill</ThemedText>
      </View>
      <View style={styles.categoriesGrid}>
        {BILL_CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.id} style={styles.gridItem}>
            <View style={[styles.gridCircle, { backgroundColor: cat.color + '15' }]}>
              <cat.icon size={24} color={cat.color} />
            </View>
            <ThemedText style={styles.gridLabel}>{cat.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Due Bills */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Upcoming Bills</ThemedText>
      </View>
      <View style={styles.verticalList}>
        {bills.length > 0 ? bills.map(bill => {
          const cat = BILL_CATEGORIES.find(c => c.name === bill.category);
          const Icon = cat?.icon || CreditCard;
          return (
            <TouchableOpacity key={bill.id} style={[styles.listItem, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <View style={[styles.listIconContainer, { backgroundColor: (cat?.color || '#888') + '15' }]}>
                <Icon size={20} color={cat?.color || '#888'} />
              </View>
              <View style={styles.listInfo}>
                <ThemedText type="defaultSemiBold">{bill.biller_name}</ThemedText>
                <ThemedText style={styles.listSub}>Due: {new Date(bill.due_date).toLocaleDateString()}</ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 5 }}>
                <ThemedText type="defaultSemiBold" style={{ color: bill.status === 'paid' ? '#4CAF50' : '#FF5252' }}>
                  {bill.currency} {bill.amount_due}
                </ThemedText>
                <TouchableOpacity onPress={() => togglePin(bill.id)}>
                  <Pin size={14} color={pinnedItems.includes(bill.id) ? activeColor : '#ccc'} fill={pinnedItems.includes(bill.id) ? activeColor : 'transparent'} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }) : (
          <ThemedText style={styles.emptyText}>No bills found.</ThemedText>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">ePay & Bills</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <QrCode size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[activeColor]} />}
      >
        {/* Balance Card */}
        <View style={styles.cardContainer}>
          <View style={[styles.mainCard, { backgroundColor: isDark ? '#1a5f7a' : '#0a7ea4' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardLabel}>Wallet Balance</ThemedText>
              <Wallet size={20} color="rgba(255,255,255,0.6)" />
            </View>
            <ThemedText style={styles.balanceText}>Ksh {balance}</ThemedText>
            <View style={styles.cardNumberContainer}>
              <ThemedText style={styles.cardNumber}>**** **** **** 4242</ThemedText>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png' }} 
                style={styles.cardLogo}
              />
            </View>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'payments' && styles.activeTabButton]} 
            onPress={() => setActiveTab('payments')}
          >
            <ThemedText style={[styles.tabButtonText, activeTab === 'payments' && styles.activeTabButtonText]}>Payments</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'bills' && styles.activeTabButton]} 
            onPress={() => setActiveTab('bills')}
          >
            <ThemedText style={[styles.tabButtonText, activeTab === 'bills' && styles.activeTabButtonText]}>Bills</ThemedText>
          </TouchableOpacity>
        </View>

        {loading ? <ActivityIndicator style={{ marginTop: 40 }} color={activeColor} /> : 
         activeTab === 'payments' ? renderPaymentTab() : renderBillsTab()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 50 : 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.05)' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.05)' },
  scrollContent: { paddingBottom: 40 },
  cardContainer: { paddingHorizontal: 20, marginBottom: 25 },
  mainCard: { height: 180, borderRadius: 24, padding: 25, justifyContent: 'space-between', elevation: 8, shadowOpacity: 0.2, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  balanceText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  cardNumberContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNumber: { color: '#fff', fontSize: 14, letterSpacing: 2, opacity: 0.8 },
  cardLogo: { width: 40, height: 25, resizeMode: 'contain', opacity: 0.9 },
  tabSwitcher: { flexDirection: 'row', backgroundColor: 'rgba(128,128,128,0.05)', marginHorizontal: 20, borderRadius: 14, padding: 4, marginBottom: 25 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#fff', elevation: 2, shadowOpacity: 0.1, shadowRadius: 4 },
  tabButtonText: { fontSize: 14, fontWeight: '600', color: '#888' },
  activeTabButtonText: { color: '#000' },
  tabContent: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  horizontalList: { paddingLeft: 20, paddingRight: 10, marginBottom: 25 },
  transferItem: { alignItems: 'center', marginRight: 20 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginBottom: 8 },
  listLabel: { fontSize: 12, opacity: 0.7, fontWeight: '500' },
  addTransfer: { alignItems: 'center', marginRight: 20 },
  addIcon: { width: 56, height: 56, borderRadius: 28, borderStyle: 'dashed', borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginBottom: 8, opacity: 0.5 },
  verticalList: { paddingHorizontal: 20 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 1, shadowOpacity: 0.02 },
  listIconContainer: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(128,128,128,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  txEmoji: { fontSize: 22 },
  listInfo: { flex: 1 },
  listSub: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, marginBottom: 15 },
  gridItem: { width: '25%', alignItems: 'center', marginBottom: 20 },
  gridCircle: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  pinnedCard: { width: 130, padding: 15, borderRadius: 20, marginRight: 12, position: 'relative' },
  pinnedTitle: { fontSize: 13, fontWeight: '700', marginTop: 10 },
  pinnedAmount: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  pinBtn: { position: 'absolute', top: 12, right: 12 },
  emptyText: { textAlign: 'center', opacity: 0.5, marginTop: 20 },
});
