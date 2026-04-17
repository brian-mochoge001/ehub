import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const ALL_PRODUCTS: Record<string, any> = {
  '1': { 
    name: 'Wireless Earbuds', 
    price: '$49.99', 
    rating: 4.8, 
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    ],
    description: 'Experience true freedom with our latest wireless earbuds. Features noise cancellation, 24-hour battery life, and superior sound quality.' 
  },
  '2': { 
    name: 'Smart Watch', 
    price: '$129.99', 
    rating: 4.5, 
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    ],
    description: 'Stay connected and track your fitness with this sleek smart watch. Includes heart rate monitoring, GPS, and water resistance.' 
  },
  '3': { 
    name: 'Premium Backpack', 
    price: '$79.00', 
    rating: 4.7, 
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
    ],
    description: 'A durable and stylish backpack for your daily commute or weekend adventures. Features multiple compartments and a padded laptop sleeve.' 
  },
  '4': { 
    name: 'Coffee Maker', 
    price: '$89.00', 
    rating: 4.6, 
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    ],
    description: 'Brew the perfect cup of coffee every morning with our easy-to-use coffee maker. Programmable settings and high-quality filter.' 
  },
};

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const product = ALL_PRODUCTS[typeof id === 'string' ? id : '1'] || ALL_PRODUCTS['1'];
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Autoplay Logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (product.images.length > 1) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= product.images.length) nextIndex = 0;
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, product.images.length]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header Overlay */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].icon} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={22} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Heart size={22} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={product.images}
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
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {product.images.map((_: any, index: number) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  { backgroundColor: activeIndex === index ? activeColor : 'rgba(255,255,255,0.5)' },
                  activeIndex === index && { width: 20 }
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Thumbnails */}
        <View style={styles.thumbnailsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailsScroll}>
            {product.images.map((img: string, index: number) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => scrollToImage(index)}
                style={[
                  styles.thumbnailWrapper, 
                  activeIndex === index && { borderColor: activeColor, borderWidth: 2 }
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.productName}>{product.name}</ThemedText>
            <ThemedText type="subtitle" style={[styles.productPrice, { color: activeColor }]}>{product.price}</ThemedText>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} color="#FFD700" fill={s <= Math.floor(product.rating) ? "#FFD700" : "transparent"} />
              ))}
            </View>
            <ThemedText style={styles.ratingText}>{product.rating} (120 reviews)</ThemedText>
          </View>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.descriptionText}>{product.description}</ThemedText>

          <View style={styles.divider} />

          {/* Benefits */}
          <View style={styles.benefitsRow}>
            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: activeColor + '15' }]}>
                <Truck size={20} color={activeColor} />
              </View>
              <ThemedText style={styles.benefitLabel}>Free Delivery</ThemedText>
            </View>
            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: '#4CAF5015' }]}>
                <ShieldCheck size={20} color="#4CAF50" />
              </View>
              <ThemedText style={styles.benefitLabel}>2 Year Warranty</ThemedText>
            </View>
            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: '#FF634715' }]}>
                <RotateCcw size={20} color="#FF6347" />
              </View>
              <ThemedText style={styles.benefitLabel}>7 Days Return</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { borderTopColor: 'rgba(128,128,128,0.1)', backgroundColor: colorScheme === 'light' ? '#fff' : '#151718' }]}>
        <TouchableOpacity style={[styles.cartBtn, { borderColor: activeColor }]}>
          <ShoppingCart size={24} color={activeColor} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.buyBtn, { backgroundColor: activeColor }]}
          onPress={() => router.push('/shop/payment')}
        >
          <ThemedText style={styles.buyBtnText}>Buy Now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
  iconButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerRight: { flexDirection: 'row', gap: 10 },
  scrollContent: { paddingBottom: 100 },
  carouselContainer: { width: width, height: width, backgroundColor: '#f0f0f0', position: 'relative' },
  carouselImage: { width: width, height: width, resizeMode: 'cover' },
  pagination: { position: 'absolute', bottom: 40, alignSelf: 'center', flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  thumbnailsContainer: { margin: 20, paddingHorizontal: 20 },
  thumbnailsScroll: { gap: 10 },
  thumbnailWrapper: { width: 60, height: 60, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f0f0f0' },
  thumbnailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoContainer: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'inherit' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  productName: { flex: 1, fontSize: 24, marginRight: 15 },
  productPrice: { fontSize: 22 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  stars: { flexDirection: 'row', marginRight: 10 },
  ratingText: { fontSize: 14, opacity: 0.5 },
  divider: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginVertical: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 10 },
  descriptionText: { fontSize: 15, opacity: 0.7, lineHeight: 22 },
  benefitsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  benefitItem: { alignItems: 'center', flex: 1 },
  benefitIcon: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  benefitLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  bottomBar: { flexDirection: 'row', padding: 20, paddingBottom: 35, borderTopWidth: 1, gap: 15 },
  cartBtn: { width: 60, height: 55, borderRadius: 18, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  buyBtn: { flex: 1, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  buyBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
