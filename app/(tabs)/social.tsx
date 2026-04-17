import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MessageCircle, Bell, Search, Package, Info, Tag } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const MESSAGES = [
  { id: '1', user: 'Alex Driver', text: 'I am arriving in 2 minutes.', time: '10:30 AM', unread: true, avatar: 'AD' },
  { id: '2', user: 'Support Team', text: 'How was your last experience?', time: 'Yesterday', unread: false, avatar: 'ST' },
  { id: '3', user: 'Emma Watson', text: 'Thanks for the gift!', time: '2 days ago', unread: false, avatar: 'EW' },
  { id: '4', name: 'John Doe', text: 'Is the item still available?', time: '3 days ago', unread: false, avatar: 'JD' },
];

const NOTIFICATIONS = [
  { id: '1', title: 'Order Delivered', body: 'Your package from eHub Store has been delivered.', time: '1 hour ago', type: 'order', icon: Package, color: '#4CAF50' },
  { id: '2', title: 'Taxi Arriving', body: 'Your driver is nearby. Look for a white Toyota.', time: '2 hours ago', type: 'taxi', icon: Info, color: '#FFD700' },
  { id: '3', title: 'Promo Alert', body: 'Get 20% off your next ride this weekend!', time: '5 hours ago', type: 'promo', icon: Tag, color: '#FF6347' },
];

export default function SocialScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [activeTab, setActiveTab] = useState<'inbox' | 'notifications'>('inbox');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Social</ThemedText>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={22} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => setActiveTab('inbox')}
          style={[styles.tab, activeTab === 'inbox' && { borderBottomColor: Colors[colorScheme].tint, borderBottomWidth: 3 }]}
        >
          <View style={styles.tabLabel}>
            <MessageCircle size={20} color={activeTab === 'inbox' ? Colors[colorScheme].tint : '#888'} />
            <ThemedText style={[styles.tabText, activeTab === 'inbox' && { color: Colors[colorScheme].tint, fontWeight: '700' }]}>Inbox</ThemedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('notifications')}
          style={[styles.tab, activeTab === 'notifications' && { borderBottomColor: Colors[colorScheme].tint, borderBottomWidth: 3 }]}
        >
          <View style={styles.tabLabel}>
            <Bell size={20} color={activeTab === 'notifications' ? Colors[colorScheme].tint : '#888'} />
            <ThemedText style={[styles.tabText, activeTab === 'notifications' && { color: Colors[colorScheme].tint, fontWeight: '700' }]}>Alerts</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'inbox' ? (
          <View style={styles.listContainer}>
            {MESSAGES.map(msg => (
              <TouchableOpacity key={msg.id} style={[styles.itemCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
                <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
                  <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: 'bold' }}>{msg.avatar}</ThemedText>
                </View>
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.userName}>{msg.user || msg.name}</ThemedText>
                    <ThemedText style={styles.timeText}>{msg.time}</ThemedText>
                  </View>
                  <View style={styles.msgPreviewRow}>
                    <ThemedText numberOfLines={1} style={[styles.msgText, msg.unread && { fontWeight: 'bold', color: Colors[colorScheme].text }]}>
                      {msg.text}
                    </ThemedText>
                    {msg.unread && <View style={[styles.unreadDot, { backgroundColor: Colors[colorScheme].tint }]} />}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {NOTIFICATIONS.map(note => (
              <TouchableOpacity key={note.id} style={[styles.itemCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
                <View style={[styles.iconCircle, { backgroundColor: note.color + '15' }]}>
                  <note.icon size={22} color={note.color} />
                </View>
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.noteTitle}>{note.title}</ThemedText>
                    <ThemedText style={styles.timeText}>{note.time}</ThemedText>
                  </View>
                  <ThemedText style={styles.noteBody}>{note.body}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  iconButton: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(128,128,128,0.1)' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabLabel: { flexDirection: 'row', alignItems: 'center' },
  tabText: { marginLeft: 10, fontSize: 14, color: '#888' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  listContainer: { paddingBottom: 20 },
  itemCard: { flexDirection: 'row', borderRadius: 20, padding: 15, marginBottom: 12, elevation: 1, shadowOpacity: 0.03, shadowRadius: 3, alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  userName: { fontSize: 15 },
  noteTitle: { fontSize: 14 },
  timeText: { fontSize: 11, opacity: 0.5 },
  msgPreviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  msgText: { flex: 1, fontSize: 13, opacity: 0.7 },
  noteBody: { fontSize: 13, opacity: 0.7, lineHeight: 18 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 10 },
});
