import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Clock, ShoppingCart, Plus, Shirt, WashingMachine, Waves } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const LAUNDRY_SERVICES = [
  { id: '1', name: 'Wash & Fold', price: '$2.50/kg', icon: WashingMachine, color: '#2196F3' },
  { id: '2', name: 'Dry Cleaning', price: '$5.00/item', icon: Shirt, color: '#9C27B0' },
  { id: '3', name: 'Ironing Only', price: '$1.50/item', icon: Waves, color: '#4CAF50' },
];

export default function LaundryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#03A9F4'; // Laundry blue
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">eLaundry</ThemedText>
        <TouchableOpacity style={styles.cartButton}>
          <ShoppingCart size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={[styles.promoCard, { backgroundColor: '#E1F5FE' }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.promoTitle}>Fresh & Clean</ThemedText>
            <ThemedText style={styles.promoSubtitle}>Free pickup and delivery for orders over $20.</ThemedText>
            <TouchableOpacity style={[styles.orderBtn, { backgroundColor: activeColor }]}>
              <ThemedText style={styles.orderBtnText}>Order Now</ThemedText>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1545173153-5dd73d1911cc?w=400' }} 
            style={styles.promoImage}
          />
        </View>

        {/* Services */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Our Services</ThemedText>
        </View>
        <View style={styles.servicesGrid}>
          {LAUNDRY_SERVICES.map(service => (
            <TouchableOpacity key={service.id} style={[styles.serviceCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <View style={[styles.iconCircle, { backgroundColor: service.color + '15' }]}>
                <service.icon size={28} color={service.color} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.serviceName}>{service.name}</ThemedText>
              <ThemedText style={styles.servicePrice}>{service.price}</ThemedText>
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: activeColor }]}>
                <Plus size={18} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Benefits */}
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9' }]}>
          <View style={styles.infoItem}>
            <Clock size={20} color={activeColor} />
            <View style={{ marginLeft: 15 }}>
              <ThemedText type="defaultSemiBold">24h Delivery</ThemedText>
              <ThemedText style={styles.infoText}>We return your clothes fresh in 24 hours.</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  cartButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40 },
  promoCard: { marginHorizontal: 20, borderRadius: 25, padding: 25, flexDirection: 'row', overflow: 'hidden', marginBottom: 30 },
  promoTitle: { color: '#01579B', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  promoSubtitle: { color: '#0288D1', fontSize: 12, marginBottom: 20 },
  orderBtn: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  orderBtnText: { color: '#fff', fontWeight: 'bold' },
  promoImage: { width: 120, height: 120, position: 'absolute', right: -20, bottom: -10, opacity: 0.8 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  servicesGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 15 },
  serviceCard: { flex: 1, padding: 15, borderRadius: 20, alignItems: 'center', elevation: 2, shadowOpacity: 0.05 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  serviceName: { fontSize: 12, textAlign: 'center', marginBottom: 4 },
  servicePrice: { fontSize: 11, opacity: 0.5, marginBottom: 12 },
  addBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  infoCard: { marginHorizontal: 20, padding: 20, borderRadius: 20, marginTop: 30 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 12, opacity: 0.6, marginTop: 2 },
});
