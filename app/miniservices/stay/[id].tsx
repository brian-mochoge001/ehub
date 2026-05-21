import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Calendar, MapPin, Users } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function StayDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#FF385C'; // Hosting pink/red

  const stay = ALL_STAYS[typeof id === 'string' ? id : '1'] || ALL_STAYS['1'];
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (stay.images.length > 1) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= stay.images.length) nextIndex = 0;
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, stay.images.length]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Heart size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={stay.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} />
            )}
          />
          <View style={styles.pagination}>
            {stay.images.map((_: any, index: number) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  { backgroundColor: activeIndex === index ? '#fff' : 'rgba(255,255,255,0.5)' },
                  activeIndex === index && { width: 20 }
                ]} 
              />
            ))}
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.stayTitle}>{stay.title}</ThemedText>
            <ThemedText type="subtitle" style={[styles.stayPrice, { color: activeColor }]}>{stay.price}<ThemedText style={{ fontSize: 14 }}>/night</ThemedText></ThemedText>
          </View>

          <TouchableOpacity style={styles.merchantContainer} onPress={() => router.push(`/shop/merchant/${stay.vendor_id || '1'}` as any)}>
            <ThemedText style={styles.merchantLabel}>Hosted by </ThemedText>
            <ThemedText style={[styles.merchantName, { color: activeColor }]}>Tech Haven</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ratingRow} onPress={() => router.push(`/reviews/${id}` as any)}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} color="#FFD700" fill={s <= Math.floor(stay.rating) ? "#FFD700" : "transparent"} />
              ))}
            </View>
            <ThemedText style={styles.ratingText}>{stay.rating} (120 reviews)</ThemedText>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.amenitiesRow}>
            <View style={styles.amenityItem}>
              <Users size={20} color={Colors[colorScheme].text} />
              <ThemedText style={styles.amenityText}>{stay.guests} guests</ThemedText>
            </View>
            <View style={styles.amenityItem}>
              <ThemedText style={{ fontSize: 18 }}>🛏️</ThemedText>
              <ThemedText style={styles.amenityText}>{stay.bedrooms} bedrooms</ThemedText>
            </View>
            <View style={styles.amenityItem}>
              <ThemedText style={{ fontSize: 18 }}>🚿</ThemedText>
              <ThemedText style={styles.amenityText}>{stay.baths} baths</ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>About this space</ThemedText>
          <ThemedText style={styles.descriptionText}>{stay.description}</ThemedText>

          <View style={styles.divider} />
          
          <View style={styles.locationSection}>
             <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Where you&apos;ll be</ThemedText>
             <View style={styles.locationRow}>
                <MapPin size={20} color={activeColor} />
                <ThemedText style={styles.locationDetail}>{stay.location}</ThemedText>
             </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { borderTopColor: 'rgba(128,128,128,0.1)', backgroundColor: colorScheme === 'light' ? '#fff' : '#151718' }]}>
        <TouchableOpacity style={[styles.cartBtn, { borderColor: activeColor }]}>
          <ShoppingCart size={24} color={activeColor} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.bookBtn, { backgroundColor: activeColor }]}
          onPress={() => {}}
        >
          <ThemedText style={styles.bookBtnText}>Book Now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
  iconButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerRight: { flexDirection: 'row', gap: 10 },
  scrollContent: { paddingBottom: 100 },
  carouselContainer: { width: width, height: 300, backgroundColor: '#f0f0f0', position: 'relative' },
  carouselImage: { width: width, height: 300, resizeMode: 'cover' },
  pagination: { position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  infoContainer: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  stayTitle: { flex: 1, fontSize: 24, marginRight: 15 },
  stayPrice: { fontSize: 22, fontWeight: 'bold' },
  merchantContainer: { flexDirection: 'row', marginBottom: 15 },
  merchantLabel: { fontSize: 14, opacity: 0.7 },
  merchantName: { fontSize: 14, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  ratingText: { fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
  stars: { flexDirection: 'row', marginRight: 10 },
  locationText: { fontSize: 14, opacity: 0.7 },
  divider: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginVertical: 20 },
  amenitiesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  amenityItem: { alignItems: 'center', flex: 1, gap: 5 },
  amenityText: { fontSize: 12, opacity: 0.7 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  descriptionText: { fontSize: 15, opacity: 0.7, lineHeight: 22 },
  locationSection: { marginBottom: 20 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  locationDetail: { fontSize: 15, opacity: 0.8 },
  bottomBar: { flexDirection: 'row', padding: 20, paddingBottom: 35, borderTopWidth: 1, gap: 15 },
  cartBtn: { width: 60, height: 55, borderRadius: 18, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  bookBtn: { flex: 1, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  bookBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
