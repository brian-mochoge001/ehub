import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { ArrowLeft, Star, Play, Ticket } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const ACTIVE_COLOR = '#E50914';

const TABS = {
  NOW_PLAYING: 'now_playing',
  COMING_SOON: 'coming_soon',
  THEATRES: 'theatres',
};

const NOW_PLAYING = [
  {
    id: '1',
    title: 'The Batman',
    rating: '4.8',
    genre: 'Action, Crime',
    image: 'https://i.pinimg.com/736x/ab/3d/63/ab3d6358c7ee93923de8caec086aa259.jpg',
  },
  {
    id: '2',
    title: 'Spider-Man: No Way Home',
    rating: '4.7',
    genre: 'Action, Adventure',
    image: 'https://i.pinimg.com/736x/dc/11/5f/dc115f3ed3016cc1a8cc666693e4215d.jpg',
  },
  {
    id: '3',
    title: 'John Wick 2',
    rating: '4.9',
    genre: 'Action, Thriller',
    image: 'https://i.pinimg.com/1200x/f3/f4/c6/f3f4c64663457d886bd7508b6950c433.jpg',
  },
  {
    id: '4',
    title: 'Avatar: The Way of Water',
    rating: '4.6',
    genre: 'Sci-Fi, Adventure',
    image: 'https://i.pinimg.com/736x/66/ec/b5/66ecb58a7db3308030eac58dbb3d39c3.jpg',
  },
  {
    id: '5',
    title: 'Black Panther: Wakanda Forever',
    rating: '4.5',
    genre: 'Action, Drama',
    image: 'https://i.pinimg.com/736x/59/00/a2/5900a20f0d4ae53621b6a6317841c90f.jpg',
  },
];

const COMING_SOON = [
  {
    id: '6',
    title: 'Dune: Part Two',
    date: 'Nov 03, 2023',
    image: 'https://i.pinimg.com/736x/b7/95/44/b795447414c34b18eddc91fdea0fffef.jpg',
  },
  {
    id: '7',
    title: 'The Marvels',
    date: 'Nov 10, 2023',
    image: 'https://i.pinimg.com/736x/7c/8f/e5/7c8fe5b2dace150805e7da2f97f990c8.jpg',
  },
  {
    id: '8',
    title: 'Deadpool 3',
    date: 'Dec 15, 2023',
    image: 'https://i.pinimg.com/736x/34/7f/2d/347f2d9e9bcb8263d06b18a24dcba67e.jpg',
  },
  {
    id: '9',
    title: 'Mission: Impossible 8',
    date: 'Jan 12, 2024',
    image: 'https://i.pinimg.com/1200x/7e/a3/99/7ea399e4b592a0b969d77916a93e001a.jpg',
  },
  {
    id: '10',
    title: 'Joker: Folie à Deux',
    date: 'Oct 04, 2024',
    image: 'https://i.pinimg.com/736x/81/ef/29/81ef29ee2e34adebee96caaba0184dec.jpg',
  },
];

export default function CinemaScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS.NOW_PLAYING);

  const featuredMovie = NOW_PLAYING[0];

  const renderContent = () => {
    switch (activeTab) {
      case TABS.NOW_PLAYING:
        return (
          <View style={styles.moviesGrid}>
            {NOW_PLAYING.map((movie) => (
              <TouchableOpacity key={movie.id} style={styles.movieCard}>
                <Image source={{ uri: movie.image }} style={styles.posterImage} />
                <ThemedText numberOfLines={1} style={styles.posterTitle}>
                  {movie.title}
                </ThemedText>
                <View style={styles.posterRating}>
                  <Star size={10} color="#FFD700" fill="#FFD700" />
                  <ThemedText style={styles.posterRatingText}>
                    {movie.rating}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );

      case TABS.COMING_SOON:
        return (
          <ScrollView
            contentContainerStyle={styles.comingSoonList}
          >
            {COMING_SOON.map((movie) => (
              <TouchableOpacity key={movie.id} style={styles.smallMovieCard}>
                <Image source={{ uri: movie.image }} style={styles.smallPoster} />
                <ThemedText numberOfLines={1} style={styles.smallMovieTitle}>
                  {movie.title}
                </ThemedText>
                <ThemedText style={styles.releaseDate}>
                  {movie.date}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case TABS.THEATRES:
        return (
          <View style={styles.emptyState}>
            <ThemedText style={{ opacity: 0.6 }}>
              Theatre listings coming soon
            </ThemedText>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>eCinema</ThemedText>

        <TouchableOpacity style={styles.iconButton}>
          <Ticket size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FEATURED */}
        <ImageBackground
          source={{ uri: featuredMovie.image }}
          style={styles.featured}
        >
          <View style={styles.overlay}>
            <ThemedText style={styles.genreText}>
              {featuredMovie.genre}
            </ThemedText>

            <ThemedText style={styles.movieTitle}>
              {featuredMovie.title}
            </ThemedText>

            <TouchableOpacity style={styles.bookBtn}>
              <Play size={18} color="#fff" fill="#fff" />
              <ThemedText style={styles.bookText}>Book Tickets</ThemedText>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* TABS */}
        <View style={styles.tabRow}>
          <Tab
            label="Now Playing"
            active={activeTab === TABS.NOW_PLAYING}
            onPress={() => setActiveTab(TABS.NOW_PLAYING)}
          />
          <Tab
            label="Coming Soon"
            active={activeTab === TABS.COMING_SOON}
            onPress={() => setActiveTab(TABS.COMING_SOON)}
          />
          <Tab
            label="Theatres"
            active={activeTab === TABS.THEATRES}
            onPress={() => setActiveTab(TABS.THEATRES)}
          />
        </View>

        {/* CONTENT */}
        {renderContent()}
      </ScrollView>
    </ThemedView>
  );
}

/* TAB COMPONENT */
function Tab({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tab, active && styles.activeTab]}
    >
      <ThemedText
        style={[styles.tabText, active && { color: ACTIVE_COLOR }]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1 },

  /* HEADER */
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  /* FEATURED */
  featured: {
    height: 450,
    justifyContent: 'flex-end',
  },

  overlay: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  genreText: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 12,
  },

  movieTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACTIVE_COLOR,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  bookText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },

  /* TABS */
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },

  tab: {
    paddingVertical: 12,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: ACTIVE_COLOR,
  },

  tabText: {
    color: '#888',
    fontWeight: '600',
  },

  /* GRID */
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },

  movieCard: {
    width: '47%',
    marginBottom: 20,
  },

  posterImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 8,
  },

  posterTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  posterRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  posterRatingText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.6,
  },

  /* COMING SOON */
  comingSoonList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  smallMovieCard: {
    width: '47%',
    marginBottom: 20,
  },

  smallPoster: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 6,
  },

  smallMovieTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  releaseDate: {
    fontSize: 11,
    opacity: 0.5,
  },

  /* EMPTY */
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
});