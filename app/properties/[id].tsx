import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform, FlatList, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { ArrowLeft, Bed, Bath, Users, Wifi, Utensils, Parking, Snowflake, Droplet, MapPin, Star, CheckCircle, XCircle, Clock, Calendar as CalendarIcon, Minus, Plus } from 'lucide-react-native';

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { id } = useLocalSearchParams();
  const activeColor = Colors[colorScheme].tint;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (id) {
        fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
        setLoading(true);
      const data = await api.getProperty(id as string);
      setProperty(data);
    } catch (err) {
        console.error('Failed to fetch property:', err);
    } finally {
        setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      Alert.alert('Incomplete', 'Please select check-in and check-out dates.');
      return;
    }

    try {
      const res = await api.bookProperty({
        property_id: id,
        check_in_date: new Date(checkIn).toISOString(),
        check_out_date: new Date(checkOut).toISOString(),
        number_of_guests: guests
      });
      // assume success if no error thrown
      Alert.alert('Success', 'Booking request submitted!');
      setShowBookingModal(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred.');
    }
  };

  if (loading) {
    return (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={activeColor} />
        </ThemedView>
    );
  }

  if (!property) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Property not found.</ThemedText>
      </ThemedView>
    );
  }

  const renderAmenity = (IconComponent: React.ElementType, label: string, hasAmenity: boolean) => (
    <View style={styles.amenityItem}>
      {hasAmenity ? (
        <CheckCircle size={20} color={activeColor} />
      ) : (
        <XCircle size={20} color="#888" />
      )}
      <ThemedText style={[styles.amenityText, !hasAmenity && { textDecorationLine: 'line-through', opacity: 0.6 }]}>{label}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageCarouselContainer}>
          <FlatList
            data={property.image_urls}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} />
            )}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={[styles.infoContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title" style={styles.propertyTitle}>{property.title}</ThemedText>
          <ThemedText style={styles.propertyType}>{getPropertyTypeDisplay(property.type)}</ThemedText>
          <View style={styles.ratingRow}>
            <Star size={18} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{property.rating} ({property.number_of_guests * 5} reviews)</ThemedText>
          </View>
          <ThemedText style={styles.descriptionText}>{property.description}</ThemedText>

          <View style={styles.keyDetailsContainer}>
            <View style={styles.keyDetailItem}>
              <Users size={20} color={activeColor} />
              <ThemedText style={styles.keyDetailText}>{property.number_of_guests} Guests</ThemedText>
            </View>
            <View style={styles.keyDetailItem}>
              <Bed size={20} color={activeColor} />
              <ThemedText style={styles.keyDetailText}>{property.number_of_beds} Beds</ThemedText>
            </View>
            <View style={styles.keyDetailItem}>
              <Bath size={20} color={activeColor} />
              <ThemedText style={styles.keyDetailText}>{property.number_of_bathrooms} Baths</ThemedText>
            </View>
          </View>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Amenities</ThemedText>
          <View style={styles.amenitiesGrid}>
            {renderAmenity(Wifi, 'Wi-Fi', property.has_wifi)}
            {renderAmenity(Utensils, 'Kitchen', property.has_kitchen)}
            {renderAmenity(Parking, 'Parking', property.has_parking)}
            {renderAmenity(Droplet, 'Pool', property.has_pool)}
            {renderAmenity(Snowflake, 'A/C', property.has_ac)}
          </View>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Location</ThemedText>
          <View style={styles.locationContainer}>
            <MapPin size={20} color={activeColor} />
            <ThemedText style={styles.locationText}>{property.addressText}</ThemedText>
          </View>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Availability</ThemedText>
          <View style={styles.availabilityContainer}>
            <View style={styles.availabilityItem}>
              <ThemedText style={styles.availabilityLabel}>Check-in:</ThemedText>
              <ThemedText style={styles.availabilityValue}>{property.check_in_time}</ThemedText>
            </View>
            <View style={styles.availabilityItem}>
              <ThemedText style={styles.availabilityLabel}>Check-out:</ThemedText>
              <ThemedText style={styles.availabilityValue}>{property.check_out_time}</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: Colors[colorScheme].background }]}>
        <ThemedText style={styles.priceDisplay}>
          <ThemedText type="subtitle">Ksh {property.price_per_night.toFixed(2)}</ThemedText> / night
        </ThemedText>
        <TouchableOpacity style={[styles.bookNowButton, { backgroundColor: activeColor }]} onPress={() => setShowBookingModal(true)}>
          <ThemedText style={styles.bookNowButtonText}>Book Now</ThemedText>
        </TouchableOpacity>
      </View>

      <Modal visible={showBookingModal} animationType="slide" transparent={true}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>Select Dates</ThemedText>
          <Calendar
            onDayPress={(day: any) => {
              if (!checkIn || (checkIn && checkOut)) {
                setCheckIn(day.dateString);
                setCheckOut('');
              } else {
                setCheckOut(day.dateString);
              }
            }}
            markedDates={{
              [checkIn]: { selected: true, selectedColor: activeColor },
              [checkOut]: { selected: true, selectedColor: activeColor },
            }}
          />
          <View style={styles.guestSelector}>
            <ThemedText>Guests:</ThemedText>
            <TouchableOpacity onPress={() => setGuests(Math.max(1, guests - 1))}><Minus size={20} /></TouchableOpacity>
            <ThemedText>{guests}</ThemedText>
            <TouchableOpacity onPress={() => setGuests(guests + 1)}><Plus size={20} /></TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.bookNowButton, { backgroundColor: activeColor, marginTop: 20 }]} onPress={handleBook}>
            <ThemedText style={styles.bookNowButtonText}>Confirm Booking</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowBookingModal(false)}><ThemedText>Cancel</ThemedText></TouchableOpacity>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageCarouselContainer: { width: '100%', height: 300 },
  carouselImage: { width: '100%', height: 300, resizeMode: 'cover' },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 20, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  infoContainer: { padding: 20 },
  propertyTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  propertyType: { fontSize: 16, opacity: 0.7, marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  ratingText: { fontSize: 14, marginLeft: 5, fontWeight: 'bold' },
  descriptionText: { fontSize: 16, opacity: 0.8, lineHeight: 24, marginBottom: 20 },
  keyDetailsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)', paddingBottom: 20 },
  keyDetailItem: { alignItems: 'center', width: '30%' },
  keyDetailText: { marginTop: 5, fontSize: 14, opacity: 0.8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 15 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: 10 },
  amenityText: { marginLeft: 10, fontSize: 14 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  locationText: { marginLeft: 10, fontSize: 16, opacity: 0.8 },
  availabilityContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 30 },
  availabilityItem: { width: '48%', marginBottom: 10 },
  availabilityLabel: { fontSize: 12, opacity: 0.6, marginBottom: 2 },
  availabilityValue: { fontSize: 14, fontWeight: 'bold' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.1)', paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  priceDisplay: { flexDirection: 'row', alignItems: 'baseline' },
  bookNowButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 15 },
  bookNowButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 40, justifyContent: 'center' },
  modalTitle: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  guestSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 20 },
});

const getPropertyTypeDisplay = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};
