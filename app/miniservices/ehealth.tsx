import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { ArrowLeft, Search, Plus, Calendar, Activity, Pill, User, ChevronRight, Bell } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'Doctors', icon: User, color: '#4CAF50' },
  { id: '2', name: 'Pharmacy', icon: Pill, color: '#2196F3' },
  { id: '3', name: 'Checkup', icon: Activity, color: '#FF9800' },
  { id: '4', name: 'Hospital', icon: Plus, color: '#F44336' },
];

const UPCOMING_APPOINTMENTS = [
  { id: '1', doctor: 'Dr. Sarah Wilson', specialty: 'Cardiologist', time: 'Tomorrow, 10:30 AM', image: 'https://medtreksinternational.com/wp-content/uploads/2021/02/Dr-Esther-scaled.jpg' },
];

export default function HealthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#2196F3';
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <User size={24} color={activeColor} />
          </View>
          <View>
            <ThemedText style={styles.welcomeText}>Good Morning</ThemedText>
            <ThemedText type="defaultSemiBold">John Doe</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search doctors, medicines..." 
            placeholderTextColor="#888"
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          />
        </View>

        {/* Health Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Activity size={20} color="#1976D2" />
            <ThemedText style={styles.statLabel}>Heart Rate</ThemedText>
            <ThemedText style={styles.statValue}>82 <ThemedText style={styles.statUnit}>bpm</ThemedText></ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F1F8E9' }]}>
            <Pill size={20} color="#388E3C" />
            <ThemedText style={styles.statLabel}>Water</ThemedText>
            <ThemedText style={styles.statValue}>1.5 <ThemedText style={styles.statUnit}>Litre</ThemedText></ThemedText>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                <cat.icon size={24} color={cat.color} />
              </View>
              <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Upcoming Appointment</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        
        {UPCOMING_APPOINTMENTS.map(app => (
          <TouchableOpacity key={app.id} style={[styles.appointmentCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <Image source={{ uri: app.image }} style={styles.doctorImage} />
            <View style={styles.appointmentInfo}>
              <ThemedText type="defaultSemiBold">{app.doctor}</ThemedText>
              <ThemedText style={styles.specialtyText}>{app.specialty}</ThemedText>
              <View style={styles.timeRow}>
                <Calendar size={14} color={activeColor} />
                <ThemedText style={styles.timeText}>{app.time}</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={[styles.chatBtn, { backgroundColor: activeColor }]}>
              <Bell size={18} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Health Article Promo */}
        <TouchableOpacity style={[styles.promoCard, { backgroundColor: activeColor }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.promoTitle}>How to stay healthy during pandemic</ThemedText>
            <ThemedText style={styles.promoSubtitle}>Read 10 tips from our specialists</ThemedText>
          </View>
          <ChevronRight size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  profileHeader: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(33, 150, 243, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  welcomeText: { fontSize: 12, opacity: 0.5 },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  scrollContent: { paddingBottom: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginBottom: 25 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginBottom: 25 },
  statCard: { flex: 1, padding: 15, borderRadius: 20 },
  statLabel: { fontSize: 12, opacity: 0.7, marginTop: 8, color: '#333' },
  statValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4, color: '#000' },
  statUnit: { fontSize: 12, fontWeight: 'normal' },
  categoriesGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 30 },
  categoryItem: { alignItems: 'center' },
  categoryIcon: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryName: { fontSize: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  appointmentCard: { marginHorizontal: 20, borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowOpacity: 0.05, shadowRadius: 5, marginBottom: 25 },
  doctorImage: { width: 60, height: 60, borderRadius: 30 },
  appointmentInfo: { flex: 1, marginLeft: 15 },
  specialtyText: { fontSize: 12, opacity: 0.5, marginVertical: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, marginLeft: 6, opacity: 0.7 },
  chatBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  promoCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center' },
  promoTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  promoSubtitle: { color: '#fff', fontSize: 12, opacity: 0.8 },
});
