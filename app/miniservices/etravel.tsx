import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Star,
  Heart,
  Compass,
  MapPin,
} from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const TOURS = [
  {
    id: '1',
    title: 'Maasai Mara Safari',
    location: 'Maasai Mara',
    price: '$450',
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600',
  },
  {
    id: '2',
    title: 'Mount Kenya Climb',
    location: 'Mount Kenya',
    price: '$600',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600',
  },
];

const CATEGORIES = [
  { id: '1', name: 'Safari', icon: '🦁' },
  { id: '2', name: 'Beach', icon: '🏖️' },
  { id: '3', name: 'Hiking', icon: '🥾' },
  { id: '4', name: 'Culture', icon: '🎭' },
  { id: '5', name: 'City', icon: '🏙️' },
  { id: '6', name: 'Zoos', icon: '🦒'},
  { id: '7', name: 'Culinary', icon: '🍜'},
  { id: '8', name: 'Cruising', icon: '🚢'},
  { id: '9', name: 'Sky Diving', icon: '🪂'},
  { id: '10', name: 'Skiing', icon: '⛷️'},
];

export default function TravelScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const activeColor = '#FF385C';

  return (
    <ThemedView style={styles.container}>
      {/* SEARCH HEADER */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color={activeColor} />
        </TouchableOpacity>

        <View
          style={[
            styles.searchBar,
            { backgroundColor: isDark ? '#222' : '#fff' },
          ]}
        >
          <Search size={18} color={activeColor} />
          <TextInput
            placeholder="Search destinations..."
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            style={{
              marginLeft: 10,
              flex: 1,
              color: Colors[colorScheme].text,
            }}
          />
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Heart size={20} color={activeColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* BANNER */}
        <ImageBackground
          source={{
            uri: 'https://i.pinimg.com/736x/88/eb/7c/88eb7ce0125d1620801446a7141df2d7.jpg',
          }}
          style={styles.banner}
        >
          <View style={styles.bannerOverlay}>
            <ThemedText style={styles.bannerText}>
              Not sure where to go?
              <ThemedText style={styles.bannerHighlight}>
                {' '}Explore.
              </ThemedText>
            </ThemedText>

            <TouchableOpacity style={styles.flexBtn}>
              <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>
                I&apos;m flexible
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* CATEGORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <ThemedText style={styles.catEmoji}>
                {cat.icon}
              </ThemedText>
              <ThemedText style={styles.catName}>
                {cat.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SECTION */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Popular Tours</ThemedText>
          <ThemedText style={{ color: activeColor }}>
            View All
          </ThemedText>
        </View>

        {/* TOUR CARDS */}
        {TOURS.map((tour) => (
          <TouchableOpacity key={tour.id} style={styles.card}>
            <Image source={{ uri: tour.image }} style={styles.cardImage} />

            <TouchableOpacity style={styles.heartBtn}>
              <Heart size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle}>
                  {tour.title}
                </ThemedText>

                <View style={styles.ratingRow}>
                  <Star size={14} color="#000" fill="#000" />
                  <ThemedText style={styles.ratingText}>
                    {tour.rating}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={14} color="#777" />
                <ThemedText style={styles.locationText}>
                  {tour.location}
                </ThemedText>
              </View>

              <ThemedText style={styles.price}>
                {tour.price}
                <ThemedText style={styles.perPerson}>
                  {' '} / person
                </ThemedText>
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}

        {/* PROMO */}
        <View
          style={[
            styles.promoCard,
            { backgroundColor: isDark ? '#222' : '#f7f7f7' },
          ]}
        >
          <View style={{ flex: 1 }}>
            <ThemedText type="subtitle">
              Plan Your Trip
            </ThemedText>

            <ThemedText style={styles.promoText}>
              Get personalized itineraries based on your travel style.
            </ThemedText>

            <TouchableOpacity style={styles.learnBtn}>
              <ThemedText style={{ fontWeight: 'bold' }}>
                Start Planning
              </ThemedText>
            </TouchableOpacity>
          </View>

          <Compass
            size={120}
            color={activeColor}
            style={styles.promoIcon}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchHeader: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },

  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBar: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  banner: {
    height: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  bannerOverlay: {
    alignItems: 'center',
    paddingBottom: 30,
    maxWidth: '70%',
  },

  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#fff',
  },

  bannerHighlight: {
    fontSize: 24,
    fontWeight: 900,
    color: '#ffb8c5',
  },

  flexBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
  },

  catList: {
    padding: 20,
    justifyContent: 'space-between',
    gap: 25,
  },

  catItem: {
    alignItems: 'center',
    opacity: 0.7,
  },

  catEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },

  catName: {
    fontSize: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 30,
  },

  cardImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },

  heartBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
  },

  cardInfo: {
    marginTop: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    marginLeft: 4,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },

  locationText: {
    marginLeft: 4,
    fontSize: 13,
    opacity: 0.6,
  },

  price: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  perPerson: {
    fontSize: 12,
    opacity: 0.6,
  },

  promoCard: {
    margin: 20,
    padding: 25,
    borderRadius: 25,
    overflow: 'hidden',
  },

  promoText: {
    fontSize: 13,
    opacity: 0.6,
    marginVertical: 15,
  },

  learnBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  promoIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.2,
  },
});