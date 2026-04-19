import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions, Platform, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ArrowLeft, Bed, Bath, Users, Wifi, Utensils, Parking, Snowflake, Droplet, MapPin, Star, CheckCircle, XCircle, Clock } from 'lucide-react-native';

const MOCK_PROPERTIES = [
  {
    id: 'prop1',
    host_id: 'host1',
    title: 'Cozy Apartment in City Center',
    description: 'A charming 1-bedroom apartment perfect for a city getaway. Walking distance to major attractions.',
    addressText: '101 Urban St, Nairobi',
    latitude: -1.286389,
    longitude: 36.817223,
    price_per_night: 5000.00,
    currency: 'Ksh',
    number_of_guests: 2,
    number_of_bedrooms: 1,
    number_of_beds: 1,
    number_of_bathrooms: 1.0,
    type: 'apartment',
    total_rooms: 3,
    has_wifi: true,
    has_kitchen: true,
    has_parking: false,
    has_pool: false,
    has_ac: true,
    image_urls: [
      'https://images.unsplash.com/photo-1570129477488-c492519920d1?w=500&q=80',
      'https://images.unsplash.com/photo-1502672260266-de66fc525f48?w=500&q=80',
      'https://images.unsplash.com/photo-1493809804286-90f9689e3a63?w=500&q=80',
    ],
    available_from: '2024-08-01',
    available_to: '2024-09-30',
    check_in_time: '15:00',
    check_out_time: '11:00',
    rating: 4.7, // Added for display purposes
  },
  {
    id: 'prop2',
    host_id: 'host2',
    title: 'Spacious Family House with Garden',
    description: 'Large house with 4 bedrooms, a beautiful garden, and a patio. Ideal for families.',
    addressText: '202 Green Ave, Karen',
    latitude: -1.3175,
    longitude: 36.7032,
    price_per_night: 12000.00,
    currency: 'Ksh',
    number_of_guests: 8,
    number_of_bedrooms: 4,
    number_of_beds: 5,
    number_of_bathrooms: 2.5,
    type: 'house',
    total_rooms: 7,
    has_wifi: true,
    has_kitchen: true,
    has_parking: true,
    has_pool: true,
    has_ac: false,
    image_urls: [
      'https://images.unsplash.com/photo-1564013799919-ab68b8b0e791?w=500&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba38135?w=500&q=80',
      'https://images.unsplash.com/photo-1522703816551-dd1a46e14704?w=500&q=80',
    ],
    available_from: '2024-07-15',
    available_to: '2024-08-15',
    check_in_time: '16:00',
    check_out_time: '10:00',
    rating: 4.9,
  },
];

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { id } = useLocalSearchParams();
  const activeColor = Colors[colorScheme].tint;

  const property = MOCK_PROPERTIES.find(p => p.id === id);

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
        {/* Image Carousel */}
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
          {/* Floating Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>


        {/* Property Info */}
        <View style={[styles.infoContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title" style={styles.propertyTitle}>{property.title}</ThemedText>
          <ThemedText style={styles.propertyType}>{getPropertyTypeDisplay(property.type)}</ThemedText>
          <View style={styles.ratingRow}>
            <Star size={18} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{property.rating} ({property.number_of_guests * 5} reviews)</ThemedText>
          </View>
          <ThemedText style={styles.descriptionText}>{property.description}</ThemedText>

          {/* Key Details */}
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

          {/* Amenities */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>Amenities</ThemedText>
          <View style={styles.amenitiesGrid}>
            {renderAmenity(Wifi, 'Wi-Fi', property.has_wifi)}
            {renderAmenity(Utensils, 'Kitchen', property.has_kitchen)}
            {renderAmenity(Parking, 'Parking', property.has_parking)}
            {renderAmenity(Droplet, 'Pool', property.has_pool)}
            {renderAmenity(Snowflake, 'A/C', property.has_ac)}
            {/* Add more amenities as needed */}
          </View>

          {/* Location */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>Location</ThemedText>
          <View style={styles.locationContainer}>
            <MapPin size={20} color={activeColor} />
            <ThemedText style={styles.locationText}>{property.addressText}</ThemedText>
          </View>

          {/* Availability */}
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
            <View style={styles.availabilityItem}>
              <ThemedText style={styles.availabilityLabel}>Dates:</ThemedText>
              <ThemedText style={styles.availabilityValue}>{property.available_from} to {property.available_to}</ThemedText>
            </View>
          </View>

          {/* Host Info (Placeholder) */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>Host</ThemedText>
          <TouchableOpacity onPress={() => {/* Navigate to host profile */ Alert.alert('Host Profile', 'Host profile coming soon!'); }}>
            <ThemedText style={[styles.hostName, { color: activeColor }]}>View Host Profile</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Fixed Bottom Button */}
      <View style={[styles.bottomBar, { backgroundColor: Colors[colorScheme].background }]}>
        <ThemedText style={styles.priceDisplay}>
          <ThemedText type="subtitle">Ksh {property.price_per_night.toFixed(2)}</ThemedText> / night
        </ThemedText>
        <TouchableOpacity style={[styles.bookNowButton, { backgroundColor: activeColor }]}>
          <ThemedText style={styles.bookNowButtonText}>Book Now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageCarouselContainer: {
    width: '100%',
    height: 300,
  },
  carouselImage: {
    width: Dimensions.get('window').width, // Full width
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  infoContainer: {
    padding: 20,
    marginTop: -30, // Overlap with the image carousel
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  propertyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertyType: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: 20,
  },
  keyDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
    paddingBottom: 20,
  },
  keyDetailItem: {
    alignItems: 'center',
    width: '30%',
  },
  keyDetailText: {
    marginTop: 5,
    fontSize: 14,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Two columns
    marginBottom: 10,
  },
  amenityText: {
    marginLeft: 10,
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    opacity: 0.8,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  availabilityItem: {
    width: '48%',
    marginBottom: 10,
  },
  availabilityLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  availabilityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  hostName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.1)',
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bookNowButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Helper function for property type display
const getPropertyTypeDisplay = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};
