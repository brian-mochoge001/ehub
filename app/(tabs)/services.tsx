import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MoveRight, Store } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const FEATURED_SERVICES = [
  {
    id: 'food',
    name: 'eFood',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400',
    description: 'Food delivery',
    route: '/miniservices/food',
  },
  {
    id: 'taxi',
    name: 'eTaxi',
    image: 'https://images.unsplash.com/photo-1638295402326-274099bfa11a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Safe rides',
    route: '/miniservices/taxi',
  },
  {
    id: 'c2c',
    name: 'C2C',
    image: 'https://cdn.ceoworld.biz/wp-content/uploads/2022/02/10-Things-To-Convince-Someone-To-Buy-Your-Products.jpg',
    description: 'Peer marketplace',
    route: '/miniservices/c2c',
  },
  {
    id: 'ehost',
    name: 'eHost',
    image: 'https://images.unsplash.com/photo-1702014862053-946a122b920d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Stay & hosting',
    route: '/miniservices/ehost',
  },
];

const ALL_SERVICES = [
  { id: 'b2b', name: 'B2B', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=400', route: '/miniservices/b2b' },
  { id: 'eliquor', name: 'eLiquor', image: 'https://images.unsplash.com/photo-1570566965181-f1cde4b96d65?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/eliquor' },
  { id: 'ebus', name: 'eBus', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400', route: '/miniservices/ebus' },
  { id: 'edelivery', name: 'eDelivery', image: 'https://images.unsplash.com/photo-1620455800201-7f00aeef12ed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/edelivery' },
  { id: 'ehealth', name: 'eHealth', image: 'https://images.unsplash.com/photo-1666887360921-85952a86894f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/ehealth' },
  { id: 'epay', name: 'ePay', image: 'https://images.unsplash.com/photo-1758519291442-6a34815b0ae3?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/epay' },
  { id: 'ebills', name: 'eBills', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400', route: '/miniservices/ebills' },
  { id: 'ecinema', name: 'eCinema', image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1179&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/ecinema' },
  { id: 'egrocery', name: 'eGrocery', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/egrocery' },
  { id: 'elaundry', name: 'eLaundry', image: 'https://images.unsplash.com/photo-1610305401607-8745a10c75dd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/elaundry' },
  { id: 'eclean', name: 'eClean', image: 'https://plus.unsplash.com/premium_photo-1663047397245-2ddad26c5dd7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/eclean' },
  { id: 'ejobs', name: 'eJobs', image: 'https://images.unsplash.com/photo-1635350736475-c8cef4b21906?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/ejobs' },
  { id: 'etravel', name: 'eTravel', image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/etravel' },
  { id: 'eflights', name: 'eFlights', image: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?q=80&w=1198&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/eflights' },
  { id: 'eRepare', name: 'eRepare', image: 'https://images.unsplash.com/photo-1659456553707-14712bb27032?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', route: '/miniservices/eRepare' },
];


export default function ServicesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Services</ThemedText>
        <ThemedText style={styles.subtitle}>
          All your needs in one place
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Featured */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Featured Services
        </ThemedText>

        <View style={styles.featuredContainer}>
          {FEATURED_SERVICES.map(service => (
            <TouchableOpacity
              key={service.id}
              style={[styles.featuredCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
              onPress={() => router.push(service.route as any)}
            >
              <Image source={{ uri: service.image }} style={styles.cardImage} />
              <ThemedText style={styles.cardTitle}>
                {service.name}
              </ThemedText>
              <ThemedText style={styles.cardSubtitle}>
                {service.description}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          More Services
        </ThemedText>

        <View style={styles.grid}>
          {ALL_SERVICES.map(service => (
            <TouchableOpacity
              key={service.id}
              style={[styles.gridCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
              onPress={() => router.push(service.route as any)}
            >
              <Image source={{ uri: service.image }} style={styles.gridImage} />

              <ThemedText style={styles.gridText}>
                {service.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo */}
        <View style={styles.promoCard}>
          <View style={{ flex: 1 }}>
            <ThemedText type="subtitle">Become a Vendor</ThemedText>
            <ThemedText style={styles.promoText}>
              Sell your products and services on eHub.
            </ThemedText>

            <TouchableOpacity style={styles.promoButton}>
              <ThemedText style={{ color: '#999' }}>
                Learn More
              </ThemedText>
              <MoveRight color="#999" size={20} />
            </TouchableOpacity>
          </View>

          <Store size={150} style={styles.promoIcon} />
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },

  header: { paddingHorizontal: 20 },
  subtitle: { opacity: 0.6, marginTop: 4 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
  sectionTitle: { marginVertical: 20 },

  featuredContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  featuredCard: {
    width: '48%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  cardImage: {
    width: '100%',
    height: 100,
  },

  cardTitle: { fontWeight: '600', marginTop: 5, textAlign: 'center' },
  cardSubtitle: { fontSize: 11, textAlign: 'center', marginBottom: 5 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridCard: {
    width: '31%',
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  gridImage: {
    width: '100%',
    height: 80,
  },

  gridText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
  },

  moreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },

  promoCard: {
    marginTop: 10,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#0D47A1',
  },

  promoText: { marginVertical: 8, fontSize: 13 },

  promoButton: {
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  promoIcon: {
    position: 'absolute',
    right: -50,
    bottom: -30,
    opacity: 0.5,
    color: '#fff',
  },
});