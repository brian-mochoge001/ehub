import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { ArrowLeft, Search, MapPin, ChevronRight, Beer, Map, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import TaxiMap from '@/components/TaxiMap';

export default function LiquorScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF9800'; // Liquor Amber
  const isDark = colorScheme === 'dark';

  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | undefined>(undefined);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    fetchNearbyStores();
  }, []);

  const fetchNearbyStores = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is needed to find nearby liquor stores.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Note: We'll update the backend to support 'liquor' type in SearchGroceryStores logic
      // or a dedicated SearchLiquorStores logic. For now, using the shared business logic.
      const data = await api.getBusinesses({ type: 'liquor', limit: 20 });
      setStores(data || []);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={activeColor} />
            <ThemedText style={{ marginTop: 10 }}>Finding stores...</ThemedText>
        </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={{marginLeft: 15}}>eLiquor Delivery</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput placeholder="Search drinks or stores..." placeholderTextColor="#888" style={[styles.searchInput, { color: Colors[colorScheme].text }]} />
        </View>

        <View style={styles.promoCard}>
           <ThemedText style={styles.promoTitle}>Boda Delivery</ThemedText>
           <ThemedText style={styles.promoSub}>Cold drinks delivered in under 30 mins.</ThemedText>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Liquor Stores Near You</ThemedText>
        </View>

        {(stores || []).length > 0 ? (stores || []).map((store, index) => {
          return (
            <TouchableOpacity 
              key={store.id || index} 
              style={[styles.storeCard, { backgroundColor: isDark ? '#222' : '#fff' }]}
              onPress={() => router.push(`/shop/merchant/${store.id}` as any)}
            >
              <View style={styles.storeIcon}>
                  <Beer size={24} color={activeColor} />
              </View>
              <View style={styles.storeInfo}>
                <ThemedText type="defaultSemiBold">{store.name}</ThemedText>
                <ThemedText style={styles.distanceText}>Open now • Fast Boda delivery</ThemedText>
              </View>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
          );
        }) : (
          <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
            <Beer size={48} color="#ccc" />
            <ThemedText style={{ marginTop: 10 }}>No liquor stores available nearby</ThemedText>
          </View>
        )}
      </ScrollView>

      <View style={styles.ageWarning}>
         <ThemedText style={styles.warningText}>Must be 18+ to order. ID verification required on delivery.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  scrollContent: { paddingBottom: 100 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  promoCard: { marginHorizontal: 20, backgroundColor: '#333', padding: 20, borderRadius: 20, marginBottom: 25 },
  promoTitle: { color: '#FF9800', fontWeight: 'bold', fontSize: 18 },
  promoSub: { color: '#fff', fontSize: 12, marginTop: 5 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  storeCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2, shadowOpacity: 0.05 },
  storeIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 152, 0, 0.1)', justifyContent: 'center', alignItems: 'center' },
  storeInfo: { flex: 1, marginLeft: 15 },
  distanceText: { fontSize: 12, opacity: 0.5 },
  ageWarning: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000', padding: 10, alignItems: 'center' },
  warningText: { color: '#fff', fontSize: 10, fontWeight: '600' },
});
