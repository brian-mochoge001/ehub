import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import { ArrowLeft, Search, Star, Heart, HeartIcon, MapPinHouse } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api'; // Assuming api.ts is correctly aliased

// Assume Stay type based on api.getProperties response structure and schema.sql
interface Stay {
  id: string;
  title: string;
  location: string;
  rating: number;
  price_per_night: number;
  currency: string;
  image_urls?: string[];
  number_of_bedrooms?: number;
  number_of_guests?: number;
  type?: string;
  description?: string;
  // Add other relevant properties as needed
}

const CATEGORIES = [
  { id: '1', name: 'Apartments', icon: '🏢' },
  { id: '2', name: 'Villas', icon: '🏡' },
  { id: '3', name: 'Cabins', icon: '🪵' },
  { id: '4', name: 'Hotels', icon: '🏨' },
  { id: '5', name: 'Lodges', icon: '🛏️' },
];

export default function HostScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF385C'; // Hosting pink/red
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stays, setStays] = useState<Stay[]>([]); // State for stays data

  // State for booking details
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  useEffect(() => {
    fetchStays();
  }, [searchQuery]);

  const fetchStays = async () => {
    try {
        setLoading(true);
        // Pass city query to the API if available
        const data = await api.getProperties({ city: searchQuery || undefined });
        setStays(data || []);
    } catch (err) {
        console.error('Failed to fetch stays:', err);
    } finally {
        setLoading(false);
    }
  };

  // Placeholder function for initiating booking
  const handleBookNow = async (stayId: string) => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    setIsBookingLoading(true);
    try {
      const bookingDetails = {
        property_id: stayId,
        check_in_date: checkInDate.toISOString(),
        check_out_date: checkOutDate.toISOString(),
        number_of_guests: numberOfGuests,
      };

      await api.bookProperty(bookingDetails);
      alert("Booking successful!");
    } catch (err: any) {
      console.error('Booking failed:', err);
      alert(`Booking failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsBookingLoading(false);
    }
  };

  // Placeholder for date calculation logic
  const calculateTotalPrice = (stayPricePerNight: number, checkIn: Date | null, checkOut: Date | null) => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * stayPricePerNight;
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
      {/* Search Header Overlay */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={'#FF385C'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.searchBar, { backgroundColor: isDark ? '#222' : '#fff' }]}>
          <Search size={18} style={{ marginRight: 10 }} color={activeColor} />
          <TextInput
            placeholder="Search destination..."
            placeholderTextColor={isDark ? '#888' : '#ddd'}
            style={[{ color: Colors[colorScheme].text, flex: 1 }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/cart')}>
          <HeartIcon size={20} color={'#FF385C'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1630699375019-c334927264df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} 
          style={styles.banner}
        >
          <View style={styles.bannerOverlay}>
            <ThemedText style={{ color: '#666', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>Not sure where to go? <ThemedText style={{ color: '#cc0027', fontSize: 24, fontWeight: 'bold' }}>Perfect.</ThemedText></ThemedText>
            <TouchableOpacity style={styles.flexibleBtn}>
              <ThemedText style={{ color: '#FF385C', fontWeight: 'bold' }}>I&apos;m flexible</ThemedText>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <ThemedText style={styles.catEmoji}>{cat.icon}</ThemedText>
              <ThemedText style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Stays */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Popular Stays</ThemedText>
          {/* Navigation to a "See All" screen for properties could be added here */}
          <TouchableOpacity onPress={() => router.push('/properties')}><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>

        {stays.length > 0 ? stays.map(stay => (
          <TouchableOpacity 
            key={stay.id} 
            style={styles.stayCard}
            // Navigate to a dedicated page for property details and booking, passing stay ID
            onPress={() => router.push({ pathname: '/properties/[id]/book', params: { id: stay.id } } as any)} 
          >
            <Image source={{ uri: stay.image_urls?.[0] || 'https://via.placeholder.com/400' }} style={styles.stayImage} />
            
            {/* Heart button for Wishlist - functionality to be implemented */}
            <TouchableOpacity style={styles.heartBtn}>
              <Heart size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.stayInfo}>
              <View style={styles.stayHeader}>
                <ThemedText type="defaultSemiBold" style={styles.stayTitle}>{stay.title}</ThemedText>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#000" fill="#000" />
                  <ThemedText style={styles.ratingText}>{stay.rating || '0.0'}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.stayLocation}>{stay.location || 'Location unknown'}</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.stayPrice}>{stay.currency} {stay.price_per_night}</ThemedText>

              {/* Booking Actions & Details - This section is a conceptual placeholder for the booking flow */}
              {/* In a full implementation, this would likely be on a dedicated property details/booking page */}
              <View style={styles.bookingActionsPlaceholder}>
                {/* Date selection UI would go here */}
                {/* Example: DatePicker components for checkInDate and checkOutDate */}
                <ThemedText style={styles.bookingPlaceholderText}>Check-in: {checkInDate ? checkInDate.toLocaleDateString() : 'Select Date'}</ThemedText>
                <ThemedText style={styles.bookingPlaceholderText}>Check-out: {checkOutDate ? checkOutDate.toLocaleDateString() : 'Select Date'}</ThemedText>

                {/* Guest selection UI would go here */}
                <View style={styles.guestSelector}>
                  <ThemedText>Guests: </ThemedText>
                  <TextInput
                    keyboardType="number-pad"
                    value={numberOfGuests.toString()}
                    onChangeText={(text) => setNumberOfGuests(parseInt(text) || 1)}
                    style={styles.guestInput}
                  />
                </View>

                {/* Button to trigger booking */}
                <TouchableOpacity 
                  style={styles.bookNowButton} 
                  onPress={() => {
                    // Calculate total price when booking is initiated (or when dates change)
                    const calculatedPrice = calculateTotalPrice(stay.price_per_night, checkInDate, checkOutDate);
                    setTotalPrice(calculatedPrice); // Update state if needed for display before booking call

                    // Simulate navigation to a confirmation step or trigger booking directly
                    if (checkInDate && checkOutDate) {
                        handleBookNow(stay.id); // Pass stay.id to the booking function
                    } else {
                        alert("Please select check-in and check-out dates.");
                    }
                  }}
                  disabled={isBookingLoading || !checkInDate || !checkOutDate} // Disable if loading or dates not selected
                >
                  <ThemedText style={styles.bookNowButtonText}>
                    {isBookingLoading ? 'Booking...' : 'Book Now'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )) : (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ThemedText style={{ opacity: 0.5 }}>No stays available</ThemedText>
            </View>
        )}


        {/* Host Promo */}
        <View style={[styles.hostCard, { backgroundColor: isDark ? '#222' : '#f7f7f7' }]}>
          <View style={{ flex: 1 }}>
            <ThemedText type="subtitle">Become a Host</ThemedText>
            <ThemedText style={styles.hostSubtitle}>Earn extra income and unlock new opportunities by sharing your space.</ThemedText>
            <TouchableOpacity style={[styles.learnMoreBtn, { borderColor: Colors[colorScheme].text }]}>
              <ThemedText style={{ fontWeight: 'bold' }}>Learn More</ThemedText>
            </TouchableOpacity>
          </View>
          <MapPinHouse style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.4 }} size={150} color={activeColor} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: { position: 'absolute', top: 50, zIndex: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 15 },
  backButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  searchBar: { flex: 1, height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, elevation: 5, shadowOpacity: 0.1, shadowRadius: 10 },
  scrollContent: { paddingBottom: 40 },
  banner: { justifyContent:'flex-end', alignItems:'center', height: 400 },
  bannerOverlay: { paddingBottom: 30, alignItems: 'center', maxWidth: '60%' },
  flexibleBtn: { backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, elevation: 2 },
  catList: { padding: 20, gap: 30, justifyContent: 'space-between', },
  catItem: { alignItems: 'center', opacity: 0.7 },
  catEmoji: { fontSize: 24, marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  stayCard: { marginHorizontal: 20, marginBottom: 30, backgroundColor: '#fff', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  stayImage: { width: '100%', height: 250, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  heartBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.7)', padding: 8, borderRadius: 20 },
  stayInfo: { padding: 15 },
  stayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stayTitle: { fontSize: 16, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, marginLeft: 4 },
  stayLocation: { fontSize: 14, opacity: 0.5, marginVertical: 4 },
  stayPrice: { fontSize: 16, fontWeight: 'bold' },
  hostCard: { marginHorizontal: 20, padding: 25, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  hostSubtitle: { fontSize: 13, opacity: 0.6, marginVertical: 15 },
  learnMoreBtn: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  // Styles for booking elements (placeholders)
  bookingActionsPlaceholder: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow wrapping if needed
    gap: 10,
  },
  bookingPlaceholderText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    flexBasis: '100%', // Take full width for text placeholder
    textAlign: 'center',
  },
  // Placeholder styles for date picker and guest input (would need actual components)
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  guestSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  guestInput: {
    width: 50,
    textAlign: 'center',
  },
  bookNowButton: {
    backgroundColor: '#FF385C',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookNowButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  }
});
