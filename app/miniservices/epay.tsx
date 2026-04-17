import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Wallet, Send, Plus, History, QrCode, Smartphone } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const QUICK_TRANSFERS = [
  { id: '1', name: 'Alex', avatar: 'https://i.pravatar.cc/100?u=alex' },
  { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/100?u=sarah' },
  { id: '3', name: 'Mike', avatar: 'https://i.pravatar.cc/100?u=mike' },
  { id: '4', name: 'Emma', avatar: 'https://i.pravatar.cc/100?u=emma' },
];

const TRANSACTIONS = [
  { id: '1', title: 'Starbucks Coffee', category: 'Food', amount: '-$5.50', date: 'Today, 09:30 AM', icon: '☕' },
  { id: '2', title: 'Salary Deposit', category: 'Income', amount: '+$3,200.00', date: 'Yesterday', icon: '💰' },
  { id: '3', title: 'Netflix Sub', category: 'Entertainment', amount: '-$12.99', date: 'Oct 22, 2023', icon: '📺' },
];

export default function PayScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#4CAF50'; // Money green
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">ePay Wallet</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <QrCode size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Card Section */}
        <View style={styles.cardContainer}>
          <View style={[styles.mainCard, { backgroundColor: isDark ? '#1a5f7a' : '#0a7ea4' }]}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardLabel}>Available Balance</ThemedText>
              <Wallet size={20} color="rgba(255,255,255,0.6)" />
            </View>
            <ThemedText style={styles.balanceText}>$12,750.50</ThemedText>
            <View style={styles.cardNumberContainer}>
              <ThemedText style={styles.cardNumber}>**** **** **** 4242</ThemedText>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png' }} 
                style={styles.cardLogo}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionCircle, { backgroundColor: activeColor + '15' }]}>
              <Plus size={24} color={activeColor} />
            </View>
            <ThemedText style={styles.actionText}>Top Up</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionCircle, { backgroundColor: '#2196F315' }]}>
              <Send size={24} color="#2196F3" />
            </View>
            <ThemedText style={styles.actionText}>Transfer</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionCircle, { backgroundColor: '#FF980015' }]}>
              <Smartphone size={24} color="#FF9800" />
            </View>
            <ThemedText style={styles.actionText}>Pay Bill</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionCircle, { backgroundColor: '#607D8B15' }]}>
              <History size={24} color="#607D8B" />
            </View>
            <ThemedText style={styles.actionText}>History</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Quick Transfer */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Quick Transfer</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.transferList}>
          <TouchableOpacity style={styles.addTransfer}>
            <View style={[styles.addIcon, { borderColor: Colors[colorScheme].text }]}>
              <Plus size={20} color={Colors[colorScheme].text} />
            </View>
            <ThemedText style={styles.transferName}>Add</ThemedText>
          </TouchableOpacity>
          {QUICK_TRANSFERS.map(user => (
            <TouchableOpacity key={user.id} style={styles.transferItem}>
              <Image source={{ uri: user.avatar }} style={styles.transferAvatar} />
              <ThemedText style={styles.transferName}>{user.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recent Transactions</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>View All</ThemedText></TouchableOpacity>
        </View>

        <View style={styles.transactionList}>
          {TRANSACTIONS.map(tx => (
            <TouchableOpacity key={tx.id} style={[styles.txItem, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <View style={styles.txIconContainer}>
                <ThemedText style={styles.txEmoji}>{tx.icon}</ThemedText>
              </View>
              <View style={styles.txInfo}>
                <ThemedText type="defaultSemiBold">{tx.title}</ThemedText>
                <ThemedText style={styles.txDate}>{tx.date}</ThemedText>
              </View>
              <ThemedText type="defaultSemiBold" style={{ color: tx.amount.startsWith('+') ? activeColor : Colors[colorScheme].text }}>
                {tx.amount}
              </ThemedText>
            </TouchableOpacity>
          ))}
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
  cardContainer: { paddingHorizontal: 20, marginBottom: 30 },
  mainCard: { height: 200, borderRadius: 25, padding: 25, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  balanceText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  cardNumberContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNumber: { color: '#fff', fontSize: 16, letterSpacing: 2 },
  cardLogo: { width: 50, height: 30, resizeMode: 'contain' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 30 },
  actionItem: { alignItems: 'center' },
  actionCircle: { width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  transferList: { paddingLeft: 20, paddingRight: 10, marginBottom: 30 },
  transferItem: { alignItems: 'center', marginRight: 20 },
  transferAvatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 },
  transferName: { fontSize: 12, opacity: 0.7 },
  addTransfer: { alignItems: 'center', marginRight: 20 },
  addIcon: { width: 60, height: 60, borderRadius: 30, borderStyle: 'dashed', borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  transactionList: { paddingHorizontal: 20 },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 1, shadowOpacity: 0.02 },
  txIconContainer: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(128,128,128,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  txEmoji: { fontSize: 20 },
  txInfo: { flex: 1 },
  txDate: { fontSize: 12, opacity: 0.5, marginTop: 2 },
});
