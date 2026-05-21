import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { ArrowLeft, Search, Bus, MapPin, Calendar, Users, X } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TravelScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF385C';
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const searchRoutes = async () => {
    if (!origin || !destination) return Alert.alert('Error', 'Please enter origin and destination');
    setLoading(true);
    try {
      const data = await api.getBusRoutes(origin, destination);
      setRoutes(data || []);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const bookTicket = async () => {
      try {
          await api.bookBusTicket({
              showtime_id: selectedRoute.id,
              seat_number: 'A1',
              total_amount: parseFloat(selectedRoute.price)
          });
          Alert.alert('Success', 'Ticket booked successfully!');
          setSelectedRoute(null);
      } catch(e) {
          Alert.alert('Error', 'Booking failed');
      }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}><ArrowLeft size={22} color={activeColor} /></TouchableOpacity>
        <View style={styles.searchFields}>
          <TextInput placeholder="Origin" value={origin} onChangeText={setOrigin} style={styles.input} />
          <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={styles.input} />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={searchRoutes}><Search size={20} color="#fff" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? <ActivityIndicator size="large" /> : routes.map(route => (
          <TouchableOpacity key={route.id} style={styles.card} onPress={() => setSelectedRoute(route)}>
            <Bus size={30} color={activeColor} />
            <View style={{flex: 1, marginLeft: 15}}>
              <ThemedText type="defaultSemiBold">{route.origin} → {route.destination}</ThemedText>
              <ThemedText style={{fontSize: 12, opacity: 0.6}}>{new Date(route.departure_time).toLocaleString()}</ThemedText>
            </View>
            <ThemedText style={{fontWeight: 'bold'}}>{route.currency} {route.price}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedRoute} transparent animationType="slide">
        <View style={styles.modal}>
          <ThemedText type="subtitle">Confirm Booking</ThemedText>
          <TouchableOpacity style={[styles.mainBtn, {backgroundColor: activeColor}]} onPress={bookTicket}><ThemedText style={{color: '#fff'}}>Pay & Book</ThemedText></TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedRoute(null)}><ThemedText>Cancel</ThemedText></TouchableOpacity>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    searchHeader: { flexDirection: 'row', padding: 20, alignItems: 'center', gap: 10 },
    iconBtn: { padding: 10 },
    searchFields: { flex: 1, gap: 5 },
    input: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 8 },
    searchBtn: { padding: 15, backgroundColor: '#FF385C', borderRadius: 10 },
    scrollContent: { padding: 20 },
    card: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10 },
    modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    mainBtn: { padding: 15, borderRadius: 10, width: 200, alignItems: 'center', margin: 20 }
});
