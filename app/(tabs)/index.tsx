import React, { useState } from 'react';
import { StyleSheet, ScrollView, FlatList, View, Image, TouchableOpacity } from 'react-native';
import { Search, Bell, Star, Wallet, CreditCard, Send, Plus, Car, Utensils, LayoutGrid, Smartphone, Shirt, House, Footprints, Dumbbell, MapPinHouse } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { ProductSkeleton } from '@/components/Skeleton';

const MINISERVICES = [
  { id: 'etaxi', name: 'eTaxi', icon: Car, color: '#FFD700', route: '/miniservices/taxi' },
  { id: 'efood', name: 'eFood', icon: Utensils, color: '#FF6347', route: '/miniservices/food' },
  { id: 'ehost', name: 'eHost', icon: MapPinHouse, color: '#4169E1', route: '/miniservices/ehost' },
  { id: 'more', name: 'More', icon: LayoutGrid, color: '#708090', route: '/services' },
];

const FLASH_SALES = [
  { id: '1', name: 'MacBook Pro M3', price: '180,000', discount: '15% OFF', image: 'https://p.turbosquid.com/ts-thumb/Er/pVXRH9/f5/render9/jpg/1698836482/600x600/fit_q87/884035449414a1d9d55583f603f6eeba72f2b135/render9.jpg' },
  { id: '2', name: 'iPhone 15 Pro', price: '119,999', discount: '10% OFF', image: 'https://alephksa.com/cdn/shop/files/iPhone_15_Pro_Natural_Titanium_PDP_Image_Position-1__en-ME.jpg?v=1694758467&width=1445' },
  { id: '3', name: 'Sony WH-1000XM5', price: '25,999', discount: '20% OFF', image: 'https://fortresselectronics.co.ke/wp-content/uploads/2024/07/SONY-WH-1000XM5-WIRELESS-NOISE-CANCELING-HEADPHONES.jpg' },
];

const CATEGORIES = [
  { id: '1', name: 'Electronics', icon: Smartphone },
  { id: '2', name: 'Fashion', icon: Shirt },
  { id: '3', name: 'Home', icon: House },
  { id: '4', name: 'Shoes', icon: Footprints },
  { id: '5', name: 'Fitness', icon: Dumbbell },
  { id: '6', name: 'Beauty', icon: Star },
];

const PRODUCTS = [
  { id: '1', name: 'Wireless Earbuds', price: '2,499.99', rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: '2', name: 'Smart Watch', price: '12,999.99', rating: 4.5, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { id: '3', name: 'Premium Backpack', price: '1,199.00', rating: 4.7, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: '4', name: 'Coffee Maker', price: '19,999.00', rating: 4.6, image: 'https://www.ramtons.com/media/catalog/product/r/m/rm193_1_.png' },
  { id: '5', name: 'Gaming Mouse', price: '1,499.99', rating: 4.9, image: 'https://images-na.ssl-images-amazon.com/images/I/61AcT0ZuO3L._UL500_.jpg' },
  { id: '6', name: 'Yoga Mat', price: '1,299.00', rating: 4.7, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  // Infinite Scroll State
  const [displayProducts, setDisplayProducts] = useState(PRODUCTS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const moreProducts = PRODUCTS.map(p => ({
        ...p,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setDisplayProducts(prev => [...prev, ...moreProducts]);
      setIsLoadingMore(false);
    }, 1500);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>Hello, User</ThemedText>
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
            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Ksh <ThemedText style={styles.walletBalance}>12,250.50</ThemedText></ThemedText>
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
      <View style={styles.servicesGrid}>
        {MINISERVICES.map(service => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.serviceItem}
            onPress={() => router.push(service.route as any)}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : '#333'}]}>
              <service.icon size={28} color={service.color} />
            </View>
            <ThemedText style={styles.serviceNameText}>{service.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

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
        {FLASH_SALES.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.flashSaleCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
            onPress={() => router.push(`/shop/product/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.flashSaleImage} />
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>{item.discount}</ThemedText>
            </View>
            <View style={styles.flashSaleInfo}>
              <ThemedText numberOfLines={1} style={styles.flashSaleName}>{item.name}</ThemedText>
              <ThemedText style={{ fontWeight: '500', fontSize: 12, color: Colors[colorScheme].text }}>Ksh <ThemedText style={{ color: Colors[colorScheme].tint }}>{item.price}</ThemedText></ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Categories</ThemedText>
        <TouchableOpacity onPress={() => router.push('/shop/all-categories')}>
          <ThemedText style={{ color: Colors[colorScheme].tint }}>See All</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.categoryItem}
            onPress={() => router.push(`/shop/category/${cat.name}`)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: colorScheme === 'light' ? '#fff' : '#333' }]}>
              <cat.icon size={24} color={Colors[colorScheme].tint} />
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

  const renderProduct = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}
      onPress={() => router.push(`/shop/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <TouchableOpacity style={styles.wishlistIcon}>
        <Star size={16} color="#fff" />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <ThemedText numberOfLines={1} style={styles.productName}>{item.name}</ThemedText>
        <View style={styles.priceRow}>
          <ThemedText style={{ fontWeight: '500', fontSize: 12 }}>Ksh <ThemedText style={{ color: Colors[colorScheme].tint }}>{item.price}</ThemedText></ThemedText>
          <View style={styles.ratingRow}>
            <Star size={10} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={displayProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        windowSize={5} // Keeps 1 visible + 2 above + 2 below. Purges older items.
        maxToRenderPerBatch={8}
        initialNumToRender={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 224, // Calculated height of featured product card
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
});
