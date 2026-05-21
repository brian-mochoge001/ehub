import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Search, Bell, Star, Wallet, CreditCard, Send, Plus, LayoutGrid, Smartphone, Shirt, House, Footprints, Dumbbell } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { ProductSkeleton } from '@/components/Skeleton';
import { useSession } from '@/services/auth-client';
import { api } from '@/services/api';
import { ShortcutsCarousel } from '@/components/ShortcutsCarousel';

const CATEGORIES = [
  { id: '1', name: 'Electronics', icon: Smartphone },
  { id: '2', name: 'Fashion', icon: Shirt },
  { id: '3', name: 'Home', icon: House },
  { id: '4', name: 'Shoes', icon: Footprints },
  { id: '5', name: 'Fitness', icon: Dumbbell },
  { id: '6', name: 'Beauty', icon: Star },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const { data: session } = useSession();

  // Data State
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [featured, flash, cats, walletData] = await Promise.all([
        api.getFeaturedProducts(PAGE_SIZE, 0),
        api.getFlashSaleProducts(),
        api.getCategories(),
        api.getWalletBalance().catch(() => null)
      ]);
      setFeaturedProducts(featured);
      setFlashSales(flash);
      setCategories(cats);
      setWallet(walletData);
      
      if (featured.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setPage(1);
    } catch (err) {
      console.error('Failed to fetch home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
        const offset = page * PAGE_SIZE;
        const more = await api.getFeaturedProducts(PAGE_SIZE, offset);
        
        if (more.length === 0) {
            setHasMore(false);
        } else {
            // Prevent duplicates just in case
            setFeaturedProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueMore = more.filter((p: any) => !existingIds.has(p.id));
                return [...prev, ...uniqueMore];
            });
            setPage(prev => prev + 1);
            
            if (more.length < PAGE_SIZE) {
                setHasMore(false);
            }
        }
    } catch (err) {
        console.error('Failed to load more products:', err);
    } finally {
        setIsLoadingMore(false);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>Hello, {session?.user.displayName || 'Guest'}</ThemedText>
          <ThemedText type="title">eHub Mall</ThemedText>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      {/* Wallet Section */}
      <View style={[styles.walletCard, { backgroundColor: colorScheme === 'light' ? '#0a7ea4' : '#1a5f7a' }]}>
        <View style={styles.walletHeader}>
          <View>
            <ThemedText style={styles.walletLabel}>eHub Wallet</ThemedText>
            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Ksh <ThemedText style={styles.walletBalance}>{wallet?.balance || '0.00'}</ThemedText></ThemedText>
          </View>
          <View style={styles.pointsBadge}>
            <ThemedText style={styles.pointsText}>850 pts</ThemedText>
          </View>
        </View>
        <View style={styles.walletActions}>
          <TouchableOpacity style={styles.walletActionItem}>
            <View style={styles.actionIconCircle}><Plus size={20} color="#fff" /></View>
            <ThemedText style={styles.actionLabel}>Top Up</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletActionItem}>
            <View style={styles.actionIconCircle}><Send size={20} color="#fff" /></View>
            <ThemedText style={styles.actionLabel}>Pay</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletActionItem}>
            <View style={styles.actionIconCircle}><CreditCard size={20} color="#fff" /></View>
            <ThemedText style={styles.actionLabel}>Cards</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletActionItem}>
            <View style={styles.actionIconCircle}><Wallet size={20} color="#fff" /></View>
            <ThemedText style={styles.actionLabel}>History</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Miniservices Quick Access */}
      <ShortcutsCarousel />

      {/* Search Bar */}
      <TouchableOpacity 
        activeOpacity={0.8}
        style={[styles.searchContainer, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a' }]}
        onPress={() => router.push('/search')}
      >
        <Search size={20} color="#888" style={styles.searchIcon} />
        <ThemedText style={{ color: '#888', flex: 1 }}>Search products, services...</ThemedText>
      </TouchableOpacity>

      {/* Flash Sales */}
      {flashSales.length > 0 && (
        <>
            <View style={styles.sectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText type="subtitle">Flash Sales</ThemedText>
                <View style={styles.timerBadge}>
                    <ThemedText style={styles.timerText}>02:45:12</ThemedText>
                </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/shop/flash-sale')}>
                <ThemedText style={{ color: Colors[colorScheme].tint }}>See All</ThemedText>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flashSalesList}>
                {flashSales.map(item => (
                <TouchableOpacity 
                    key={item.id} 
                    style={[styles.flashSaleCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
                    onPress={() => router.push(`/shop/product/${item.id}`)}
                >
                    <View style={styles.flashSaleImageContainer}>
                      <Image 
                        source={{ uri: item.image_urls?.[0] || 'https://via.placeholder.com/150' }} 
                        style={styles.flashSaleImage} 
                        contentFit="cover"
                        transition={200}
                      />
                    </View>
                    <View style={styles.discountBadge}>
                    <ThemedText style={styles.discountText}>{item.discount_percentage}% OFF</ThemedText>
                    </View>
                    <View style={styles.flashSaleInfo}>
                    <ThemedText numberOfLines={1} style={styles.flashSaleName}>{item.name}</ThemedText>
                    <ThemedText style={{ fontWeight: '500', fontSize: 12, color: Colors[colorScheme].text }}>Ksh <ThemedText style={{ color: Colors[colorScheme].tint }}>{item.price}</ThemedText></ThemedText>
                    </View>
                </TouchableOpacity>
                ))}
            </ScrollView>
        </>
      )}

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Categories</ThemedText>
        <TouchableOpacity onPress={() => router.push('/shop/all-categories')}>
          <ThemedText style={{ color: Colors[colorScheme].tint }}>See All</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
        {categories.map(cat => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.categoryItem}
            onPress={() => router.push(`/shop/category/${cat.name}`)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: colorScheme === 'light' ? '#fff' : '#333' }]}>
                {cat.image_url ? (
                    <Image source={{ uri: cat.image_url }} style={{ width: '100%', height: '100%', borderRadius: 30 }} />
                ) : (
                    <LayoutGrid size={24} color={Colors[colorScheme].tint} />
                )}
            </View>
            <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Products Title */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Personalized for You</ThemedText>
        <TouchableOpacity><ThemedText style={{ color: Colors[colorScheme].tint }}>See All</ThemedText></TouchableOpacity>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
      onPress={() => router.push(`/shop/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.image_urls?.[0] || 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
          contentFit="cover"
          transition={200}
        />
        <TouchableOpacity style={[styles.wishlistIcon, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }]}>
          <Star size={16} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <ThemedText numberOfLines={1} style={styles.productName}>{item.name}</ThemedText>
        <View style={styles.priceRow}>
          <ThemedText style={{ fontWeight: '500', fontSize: 12 }}>{item.currency} <ThemedText style={{ color: Colors[colorScheme].tint }}>{item.price}</ThemedText></ThemedText>
          <View style={styles.ratingRow}>
            <Star size={10} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.loaderContainer}>
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
            </View>
        </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={featuredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        windowSize={5}
        maxToRenderPerBatch={8}
        initialNumToRender={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 224,
          offset: 224 * Math.floor(index / 2),
          index,
        })}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.skeletonFooter}>
              <ProductSkeleton />
              <ProductSkeleton />
            </View>
          ) : <View style={{ height: 100 }} />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  welcomeText: { fontSize: 14, opacity: 0.6 },
  scrollContent: { paddingBottom: 200 },
  iconButton: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(128,128,128,0.1)' },
  walletCard: { marginHorizontal: 20, borderRadius: 25, padding: 20, marginBottom: 25, elevation: 5, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  walletLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  walletBalance: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  pointsBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pointsText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  walletActions: { flexDirection: 'row', justifyContent: 'space-between' },
  walletActionItem: { alignItems: 'center' },
  actionIconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { color: '#fff', fontSize: 12, fontWeight: '500' },
  servicesGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 25 },
  serviceItem: { alignItems: 'center' },
  serviceIconContainer: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 1 },
  serviceNameText: { fontSize: 12, fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20, marginHorizontal: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20 },
  timerBadge: { backgroundColor: '#FF6347', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
  timerText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  flashSalesList: { paddingLeft: 20, paddingRight: 20, marginBottom: 25 },
  flashSaleCard: { width: 140, borderRadius: 20, marginRight: 15, overflow: 'hidden', elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  flashSaleImage: { width: '100%', height: 100 },
  discountBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FF6347', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  flashSaleInfo: { padding: 10 },
  flashSaleName: { fontSize: 12, fontWeight: '600' },
  flashSalePrice: { fontSize: 14, fontWeight: 'bold', color: '#0a7ea4', marginTop: 2 },
  categoriesList: { paddingLeft: 20, paddingRight: 20, marginBottom: 25 },
  categoryItem: { alignItems: 'center', marginRight: 20 },
  categoryIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2, shadowOpacity: 0.1, shadowRadius: 5 },
  categoryName: { fontSize: 12, fontWeight: '500' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  productCard: { width: '48%', borderRadius: 20, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  productImage: { width: '100%', height: 150 },
  wishlistIcon: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.2)', padding: 5, borderRadius: 10 },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#0a7ea4' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, marginLeft: 3, color: '#888' },
  flatListContent: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 20 },
  skeletonFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  loaderContainer: { paddingVertical: 20, alignItems: 'center' },
  recentOrdersList: { paddingLeft: 20, paddingRight: 20, marginBottom: 25 },
  orderCard: { width: 160, borderRadius: 20, padding: 15, marginRight: 15, elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  orderBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#4CAF5015', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  orderBadgeText: { fontSize: 8, fontWeight: 'bold', color: '#4CAF50' },
  orderId: { fontSize: 13, fontWeight: 'bold', marginBottom: 5 },
  orderAmount: { fontSize: 12, opacity: 0.8 },
  orderDate: { fontSize: 10, opacity: 0.5, marginTop: 5 },
});
