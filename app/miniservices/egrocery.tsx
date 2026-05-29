import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { ArrowLeft, Search, ShoppingCart, Star, Plus, MapPin, ChevronRight, Leaf, Store, Map, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import TaxiMap from '@/components/TaxiMap';

export default function GroceryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#2E7D32'; 
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
        Alert.alert('Permission Denied', 'Location access is needed to find nearby grocery stores.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      const data = await api.getGroceryStores(latitude, longitude, 5000);
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
        </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={{marginLeft: 15}}>Nearby Grocery Stores</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <TextInput placeholder="Search stores..." placeholderTextColor="#888" style={[styles.searchInput, { color: Colors[colorScheme].text }]} />
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Stores near you</ThemedText>
        </View>

        {(stores || []).length > 0 ? (stores || []).map((item, index) => {
          const store = item?.business;
          if (!store) return null;
          return (
            <TouchableOpacity 
              key={store.id || index} 
              style={[styles.storeCard, { backgroundColor: isDark ? '#222' : '#fff' }]}
              onPress={() => router.push(`/miniservices/grocery-store?id=${store.id}` as any)}
            >
              <View style={styles.storeIcon}>
                  <Store size={24} color={activeColor} />
              </View>
              <View style={styles.storeInfo}>
                <ThemedText type="defaultSemiBold">{store.name}</ThemedText>
                <ThemedText style={styles.distanceText}>{(store.distance / 1000).toFixed(1)} km away</ThemedText>
              </View>
              <TouchableOpacity onPress={() => setSelectedRoute(item.polyline)} style={{ padding: 10 }}>
                 <Map size={20} color={activeColor} />
              </TouchableOpacity>
              <ChevronRight size={20} color="#888" />
            </TouchableOpacity>
          );
        }) : (
          <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
            <Store size={48} color="#ccc" />
            <ThemedText style={{ marginTop: 10 }}>No stores found in your area</ThemedText>
          </View>
        )}
      </ScrollView>

      <Modal visible={!!selectedRoute} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ height: '70%', backgroundColor: isDark ? '#1a1a1a' : '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
            <View style={styles.modalHeader}>
              <ThemedText type="defaultSemiBold">Fastest Road Route</ThemedText>
              <TouchableOpacity onPress={() => setSelectedRoute(null)}><X size={24} color={Colors[colorScheme].text} /></TouchableOpacity>
            </View>
            <TaxiMap 
              userLocation={userLocation}
              encodedPolyline={selectedRoute || ''}
              showNearby={false}
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  scrollContent: { paddingBottom: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  storeCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2, shadowOpacity: 0.05 },
  storeIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(46, 125, 50, 0.1)', justifyContent: 'center', alignItems: 'center' },
  storeInfo: { flex: 1, marginLeft: 15 },
  distanceText: { fontSize: 12, opacity: 0.5 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
});
