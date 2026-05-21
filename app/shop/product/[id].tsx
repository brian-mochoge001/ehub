import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator } from 'react-native';
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '@/services/api';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProductDetails(id as string);
      if (!data.images) {
        data.images = [data.image_url || data.image || 'https://via.placeholder.com/800'];
      }
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= product.images.length) nextIndex = 0;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, product?.images?.length]);

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

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={activeColor} />
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Product not found</ThemedText>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchProduct}>
           <ThemedText style={{ color: '#fff' }}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

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
            <ThemedText type="subtitle" style={[styles.productPrice, { color: activeColor }]}>{product.currency} {product.price}</ThemedText>
          </View>

          <TouchableOpacity style={styles.merchantContainer} onPress={() => router.push(`/shop/merchant/${product.business_id}` as any)}>
            <ThemedText style={styles.merchantLabel}>Sold by </ThemedText>
            <ThemedText style={[styles.merchantName, { color: activeColor }]}>{product.business_name || 'Verified Vendor'}</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ratingRow} onPress={() => router.push(`/reviews/${id}` as any)}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} color="#FFD700" fill={s <= Math.floor(product.rating || 0) ? "#FFD700" : "transparent"} />
              ))}
            </View>
            <ThemedText style={styles.ratingText}>{product.rating || '0.0'} ({product.review_count || 0} reviews)</ThemedText>
          </TouchableOpacity>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.descriptionText}>{product.description || 'No description available.'}</ThemedText>

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
              <ThemedText style={styles.benefitLabel}>Authentic</ThemedText>
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
        <TouchableOpacity style={[styles.cartBtn, { borderColor: activeColor }]} onPress={() => router.push('/cart')}>
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  retryBtn: { marginTop: 20, backgroundColor: '#0a7ea4', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
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
  merchantContainer: { flexDirection: 'row', marginBottom: 15 },
  merchantLabel: { fontSize: 14, opacity: 0.7 },
  merchantName: { fontSize: 14, fontWeight: 'bold' },
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
