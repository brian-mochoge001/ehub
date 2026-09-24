import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { ArrowLeft, Star, Play, Ticket, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@packages/components/themed-text';
import { ThemedView } from '@packages/components/themed-view';
import { api } from '@packages/services/api';

const { width, height } = Dimensions.get('window');
const ACTIVE_COLOR = '#E50914';

const TABS = {
  NOW_PLAYING: 'now_playing',
  COMING_SOON: 'coming_soon',
};

export default function CinemaScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS.NOW_PLAYING);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const [nowPlayingRes, comingSoonRes] = await Promise.all([
        api.getMovies(true),
        api.getMovies(false),
      ]);
      setMovies([...(nowPlayingRes.data || []), ...(comingSoonRes.data || [])]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const nowPlaying = movies.filter((m: any) => m.is_now_playing);
  const comingSoon = movies.filter((m: any) => !m.is_now_playing);

  const featuredMovie = nowPlaying[0] || { title: 'No Movies Available', genre: '', poster_url: 'https://via.placeholder.com/800' };

  const openTrailer = (url: string) => {
    setSelectedTrailer(url);
    setTrailerModalVisible(true);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={ACTIVE_COLOR} />
        </View>
      );
    }

    switch (activeTab) {
      case TABS.NOW_PLAYING:
        return (
          <View style={styles.moviesGrid}>
            {nowPlaying.length === 0 ? (
              <ThemedText style={styles.noMoviesText}>No movies now playing.</ThemedText>
            ) : (
              nowPlaying.map((movie: any) => (
                <View key={movie.id} style={styles.movieCard}>
                  <Image source={{ uri: movie.poster_url || 'https://via.placeholder.com/400' }} style={styles.posterImage} />
                  <ThemedText numberOfLines={1} style={styles.posterTitle}>
                    {movie.title}
                  </ThemedText>
                  <View style={styles.posterRating}>
                    <Star size={10} color="#FFD700" fill="#FFD700" />
                    <ThemedText style={styles.posterRatingText}>
                      {movie.rating || '0.0'}
                    </ThemedText>
                  </View>
                  {movie.trailer_url && (
                    <TouchableOpacity
                      style={styles.trailerBtn}
                      onPress={() => openTrailer(movie.trailer_url)}
                    >
                      <ThemedText style={styles.trailerBtnText}>Watch Trailer</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        );

      case TABS.COMING_SOON:
        return (
          <ScrollView contentContainerStyle={styles.comingSoonList}>
            {comingSoon.length === 0 ? (
              <ThemedText style={styles.noMoviesText}>No upcoming movies listed.</ThemedText>
            ) : (
              comingSoon.map((movie: any) => (
                <View key={movie.id} style={styles.smallMovieCard}>
                  <Image source={{ uri: movie.poster_url || 'https://via.placeholder.com/400' }} style={styles.smallPoster} />
                  <ThemedText numberOfLines={1} style={styles.smallMovieTitle}>
                    {movie.title}
                  </ThemedText>
                  <ThemedText style={styles.releaseDate}>
                    {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'TBA'}
                  </ThemedText>
                </View>
              ))
            )}
          </ScrollView>
        );
      
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
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
          source={{ uri: featuredMovie.poster_url }}
          style={styles.featured}
        >
          <View style={styles.overlay}>
            <ThemedText style={styles.genreText}>{featuredMovie.genre}</ThemedText>
            <ThemedText style={styles.movieTitle}>{featuredMovie.title}</ThemedText>
            <TouchableOpacity style={styles.bookBtn}>
              <Play size={18} color="#fff" fill="#fff" />
              <ThemedText style={styles.bookText}>Book Tickets</ThemedText>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* TABS */}
        <View style={styles.tabRow}>
          <Tab label="Now Playing" active={activeTab === TABS.NOW_PLAYING} onPress={() => setActiveTab(TABS.NOW_PLAYING)} />
          <Tab label="Coming Soon" active={activeTab === TABS.COMING_SOON} onPress={() => setActiveTab(TABS.COMING_SOON)} />
        </View>

        {/* CONTENT */}
        {renderContent()}
      </ScrollView>

      {/* Trailer Modal */}
      <Modal visible={trailerModalVisible} animationType="slide" transparent={true} onRequestClose={() => setTrailerModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setTrailerModalVisible(false)}>
            <X size={28} color="#fff" />
          </TouchableOpacity>
          {selectedTrailer && (
            <Video
              source={{ uri: selectedTrailer }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay
            />
          )}
        </View>
      </Modal>
    </ThemedView>
  );
}

/* TAB COMPONENT */
function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
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
  trailerBtn: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  trailerBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
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
  noMoviesText: {
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
    opacity: 0.5,
  },

  /* MODAL */
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  video: {
    width: width,
    height: height * 0.6,
  },
});
