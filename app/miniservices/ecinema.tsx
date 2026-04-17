import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { ArrowLeft, Star, Play, Ticket } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

const NOW_PLAYING = [
  { id: '1', title: 'The Batman', rating: '4.8', genre: 'Action, Crime', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600' },
  { id: '2', title: 'Spider-Man', rating: '4.7', genre: 'Action, Adventure', image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600' },
];

const COMING_SOON = [
  { id: '3', title: 'Dune: Part Two', date: 'Nov 03, 2023', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400' },
  { id: '4', title: 'The Marvels', date: 'Nov 10, 2023', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400' },
];

export default function CinemaScreen() {
  const router = useRouter();
  const activeColor = '#E50914';

  return (
    <ThemedView style={styles.container}>
      {/* Featured Header */}
      <View style={styles.featuredSection}>
        <ImageBackground 
          source={{ uri: NOW_PLAYING[0].image }} 
          style={styles.featuredImage}
        >
          <View style={styles.overlay}>
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <ThemedText style={styles.headerTitle}>eCinema</ThemedText>
              <TouchableOpacity style={styles.ticketBtn}>
                <Ticket size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.featuredInfo}>
              <View style={styles.genreRow}>
                <ThemedText style={styles.genreText}>{NOW_PLAYING[0].genre}</ThemedText>
                <View style={styles.dot} />
                <View style={styles.ratingRow}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <ThemedText style={styles.ratingText}>{NOW_PLAYING[0].rating}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.movieTitle}>{NOW_PLAYING[0].title}</ThemedText>
              <TouchableOpacity style={[styles.bookBtn, { backgroundColor: activeColor }]}>
                <Play size={18} color="#fff" fill="#fff" />
                <ThemedText style={styles.bookBtnText}>Book Tickets</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Categories / Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.activeTab, { borderBottomColor: activeColor }]}>
            <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>Now Playing</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <ThemedText style={{ color: '#888' }}>Coming Soon</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <ThemedText style={{ color: '#888' }}>Theatres</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Movies Grid */}
        <View style={styles.moviesGrid}>
          {NOW_PLAYING.map(movie => (
            <TouchableOpacity key={movie.id} style={styles.movieCard}>
              <Image source={{ uri: movie.image }} style={styles.posterImage} />
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.posterTitle}>{movie.title}</ThemedText>
              <View style={styles.posterRating}>
                <Star size={10} color="#FFD700" fill="#FFD700" />
                <ThemedText style={styles.posterRatingText}>{movie.rating}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coming Soon */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Coming Soon</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.comingSoonList}>
          {COMING_SOON.map(movie => (
            <TouchableOpacity key={movie.id} style={styles.smallMovieCard}>
              <Image source={{ uri: movie.image }} style={styles.smallPoster} />
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.smallMovieTitle}>{movie.title}</ThemedText>
              <ThemedText style={styles.releaseDate}>{movie.date}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  featuredSection: { height: 400, width: '100%' },
  featuredImage: { width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 20, paddingTop: 50, justifyContent: 'space-between', paddingBottom: 30 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  ticketBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  featuredInfo: { },
  genreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  genreText: { color: '#fff', fontSize: 12, opacity: 0.8 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff', marginHorizontal: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#fff', fontSize: 12, marginLeft: 4 },
  movieTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  bookBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  scrollContent: { paddingBottom: 40 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, marginBottom: 25, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
  tab: { paddingVertical: 10, marginRight: 25 },
  activeTab: { paddingVertical: 10, marginRight: 25, borderBottomWidth: 3 },
  moviesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  movieCard: { width: '47%', marginBottom: 20 },
  posterImage: { width: '100%', height: 220, borderRadius: 20, marginBottom: 10 },
  posterTitle: { fontSize: 14 },
  posterRating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  posterRatingText: { fontSize: 12, opacity: 0.6, marginLeft: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  comingSoonList: { paddingLeft: 20, paddingRight: 10 },
  smallMovieCard: { width: 140, marginRight: 15 },
  smallPoster: { width: '100%', height: 180, borderRadius: 15, marginBottom: 8 },
  smallMovieTitle: { fontSize: 13 },
  releaseDate: { fontSize: 11, opacity: 0.5, marginTop: 2 },
});
