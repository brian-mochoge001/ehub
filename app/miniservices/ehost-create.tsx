import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@packages/components/themed-text';
import { ThemedView } from '@packages/components/themed-view';
import { Colors } from '@packages/constants/theme';
import { useColorScheme } from '@packages/hooks/use-color-scheme';
import { api } from '@packages/services/api';

export default function CreateListingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF385C';
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_id: '1', // Should be dynamically fetched from user profile
    title: '',
    description: '',
    price_per_night: '',
    type: 'apartment',
    number_of_guests: '1',
    number_of_bedrooms: '1',
  });

  const handleSubmit = async () => {
    if (!form.title || !form.price_per_night) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.createPropertyListing({
        ...form,
        price_per_night: parseFloat(form.price_per_night),
        number_of_guests: parseInt(form.number_of_guests),
        number_of_bedrooms: parseInt(form.number_of_bedrooms),
      });
      Alert.alert('Success', 'Property listed successfully!');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color={Colors[colorScheme].text} /></TouchableOpacity>
        <ThemedText type="subtitle">List Your Property</ThemedText>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={activeColor} /> : <Save size={24} color={activeColor} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput style={styles.input} placeholder="Title" value={form.title} onChangeText={(v) => setForm({...form, title: v})} />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={form.description} onChangeText={(v) => setForm({...form, description: v})} multiline />
        <TextInput style={styles.input} placeholder="Price per night (Ksh)" value={form.price_per_night} onChangeText={(v) => setForm({...form, price_per_night: v})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Property Type (e.g., apartment)" value={form.type} onChangeText={(v) => setForm({...form, type: v})} />
        <TextInput style={styles.input} placeholder="Guests" value={form.number_of_guests} onChangeText={(v) => setForm({...form, number_of_guests: v})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Bedrooms" value={form.number_of_bedrooms} onChangeText={(v) => setForm({...form, number_of_bedrooms: v})} keyboardType="numeric" />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    scrollContent: { padding: 20 },
    input: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 15, marginBottom: 15 },
    textArea: { height: 100 }
});
