import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput, Platform, FlatList, Modal, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { ArrowLeft, Search, SlidersHorizontal, Star, ShoppingCart, X, Check } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProductSkeleton } from '@/components/Skeleton';
import { api } from '@/services/api';

const CATEGORY_FILTERS = ['All', 'Electronics', 'Fashion', 'Home', 'Fitness'];

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState(typeof q === 'string' ? q : '');
  const [tempCategory, setTempCategory] = useState('All');
  const [appliedCategory, setAppliedCategory] = useState('All');
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, any[]>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Infinite Scroll State
  const [displayResults, setDisplayResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadMetaData();
  }, []);

  async function loadMetaData() {
      try {
          const attrData = await api.getAttributes();
          setAttributes(attrData || []);
          for (const attr of attrData || []) {
              const values = await api.getAttributeValues(attr.id);
              setAttributeValues(prev => ({ ...prev, [attr.id]: values || [] }));
          }
      } catch (e) {
          console.error(e);
      }
  }

  useEffect(() => {
    fetchResults();
  }, [searchQuery, appliedCategory, appliedMinPrice, appliedMaxPrice, activeFilters]);

  const fetchResults = async () => {
    try {
        setLoading(true);
        const params: Record<string, string> = { q: searchQuery };
        if (appliedCategory !== 'All') params.category = appliedCategory;
        if (appliedMinPrice) params.min_price = appliedMinPrice;
        if (appliedMaxPrice) params.max_price = appliedMaxPrice;
        
        // Add dynamic filters
        const attrs = JSON.stringify(activeFilters);
        if (attrs !== '{}') params.attributes = attrs;
        
        const filtered = await api.filterProducts(params);
        setDisplayResults(filtered || []);
    } catch (err) {
        console.error('Failed to fetch search results:', err);
    } finally {
        setLoading(false);
    }
  };


  const loadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    // Simulate more data
    setTimeout(() => {
        setIsLoadingMore(false);
    }, 1000);
  };

  const applyFilters = () => {
    setAppliedCategory(tempCategory);
    setAppliedMinPrice(tempMinPrice);
    setAppliedMaxPrice(tempMaxPrice);
    setIsFilterVisible(false);
  };

  const resetFilters = () => {
    setTempCategory('All');
    setTempMinPrice('');
    setTempMaxPrice('');
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: isDark ? '#222' : '#fff' }]}
      onPress={() => router.push(`/shop/product/${item.id}`)}
    >
      <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ThemedText style={styles.categoryLabel}>{item.category_name || 'Generic'}</ThemedText>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.productName}>{item.name}</ThemedText>
        <View style={styles.priceRow}>
          <ThemedText style={[styles.productPrice, { color: activeColor }]}>{item.currency} {item.price}</ThemedText>
          <View style={styles.ratingRow}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <ThemedText style={styles.ratingText}>{item.rating || '0.0'}</ThemedText>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.addToCartBtn, { backgroundColor: activeColor }]}
        onPress={() => api.addToCart(item.business_id, item.id, 'ecommerce', 1)}
      >
        <ShoppingCart size={18} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const hasActiveFilters = appliedCategory !== 'All' || appliedMinPrice !== '' || appliedMaxPrice !== '';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }}
        >
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
          <Search size={18} color="#888" style={styles.searchIcon} />
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..." 
            placeholderTextColor="#888"
            autoFocus={!q}
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterVisible(true)}>
          <SlidersHorizontal size={22} color={activeColor} />
          {hasActiveFilters && <View style={[styles.filterDot, { backgroundColor: activeColor }]} />}
        </TouchableOpacity>
      </View>

      <View style={styles.resultsInfo}>
        <ThemedText style={styles.resultsText}>
          {displayResults.length} {displayResults.length === 1 ? 'result' : 'results'} found
        </ThemedText>
      </View>

      {loading ? (
          <View style={styles.skeletonFooter}>
            <ProductSkeleton />
            <ProductSkeleton />
          </View>
      ) : (
        <FlatList
            data={displayResults}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            windowSize={5}
            maxToRenderPerBatch={8}
            initialNumToRender={10}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
            length: 240,
            offset: 240 * Math.floor(index / 2),
            index,
            })}
            ListFooterComponent={
            isLoadingMore ? (
                <View style={styles.skeletonFooter}>
                <ProductSkeleton />
                <ProductSkeleton />
                </View>
            ) : null
            }
            ListEmptyComponent={
            <View style={styles.emptyState}>
                <Search size={60} color="#888" style={{ marginBottom: 20, opacity: 0.5 }} />
                <ThemedText style={styles.emptyTitle}>No results found</ThemedText>
                <ThemedText style={styles.emptySubtitle}>Try searching for something else or change your filters.</ThemedText>
            </View>
            }
        />
      )}

      {/* iOS Style Filter Sheet (Custom Implementation for Cross-Platform) */}
      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsFilterVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.filterSheet, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
              >
                <View style={styles.sheetHeader}>
                  <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                    <ThemedText style={{ color: activeColor }}>Cancel</ThemedText>
                  </TouchableOpacity>
                  <ThemedText type="defaultSemiBold">Filter & Sort</ThemedText>
                  <TouchableOpacity onPress={applyFilters}>
                    <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>Apply</ThemedText>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
                  {attributes.map((attr) => {
                    const attrKey = attr.name.toLowerCase();
                    const values = attributeValues[attr.id] || [];

                    return (
                      <React.Fragment key={attr.id}>
                        <ThemedText style={styles.sheetSectionTitle}>{attr.name}</ThemedText>
                        <View style={styles.categoryGrid}>
                          {values.map((val) => (
                            <TouchableOpacity
                              key={val.id || `${attr.id}-${val.value}`}
                              style={[
                                styles.categoryTag,
                                { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' },
                                activeFilters[attrKey] === val.value && { backgroundColor: activeColor + '20', borderColor: activeColor, borderWidth: 1 }
                              ]}
                              onPress={() => {
                                const newFilters = {...activeFilters};
                                newFilters[attrKey] = val.value;
                                setActiveFilters(newFilters);
                              }}
                            >
                              <ThemedText style={[
                                styles.categoryTagText,
                                activeFilters[attrKey] === val.value && { color: activeColor, fontWeight: 'bold' }
                              ]}>{val.value}</ThemedText>
                              {activeFilters[attrKey] === val.value && <Check size={14} color={activeColor} style={{ marginLeft: 4 }} />}
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View style={styles.sheetDivider} />
                      </React.Fragment>
                    );
                  })}

                  <ThemedText style={styles.sheetSectionTitle}>Price Range ($)</ThemedText>
                  <View style={styles.priceInputRow}>
                    <View style={styles.priceInputContainer}>
                      <ThemedText style={styles.priceInputLabel}>Min</ThemedText>
                      <TextInput 
                        placeholder="0.00"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={tempMinPrice}
                        onChangeText={setTempMinPrice}
                        style={[styles.priceInput, { color: Colors[colorScheme].text, borderColor: isDark ? '#333' : '#ddd' }]}
                      />
                    </View>
                    <View style={styles.priceInputSeparator} />
                    <View style={styles.priceInputContainer}>
                      <ThemedText style={styles.priceInputLabel}>Max</ThemedText>
                      <TextInput 
                        placeholder="Any"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={tempMaxPrice}
                        onChangeText={setTempMaxPrice}
                        style={[styles.priceInput, { color: Colors[colorScheme].text, borderColor: isDark ? '#333' : '#ddd' }]}
                      />
                    </View>
                  </View>

                  <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                    <ThemedText style={{ color: '#FF6347', textAlign: 'center' }}>Reset All Filters</ThemedText>
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15, gap: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 45 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  filterButton: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)', position: 'relative' },
  filterDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: '#fff' },
  resultsInfo: { paddingHorizontal: 20, marginBottom: 15 },
  resultsText: { fontSize: 14, opacity: 0.6 },
  listContent: { paddingHorizontal: 15, paddingBottom: 40 },
  columnWrapper: { justifyContent: 'space-between' },
  productCard: { width: '48%', borderRadius: 20, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10, position: 'relative' },
  productImage: { width: '100%', height: 160 },
  productInfo: { padding: 12 },
  categoryLabel: { fontSize: 10, opacity: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  productName: { fontSize: 14, marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, marginLeft: 3, color: '#888' },
  addToCartBtn: { position: 'absolute', bottom: 12, right: 12, width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, opacity: 0.5, textAlign: 'center', lineHeight: 20 },
  loaderContainer: { paddingVertical: 20, alignItems: 'center' },
  skeletonFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 20,  alignItems: 'center' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  filterSheet: { borderTopLeftRadius: 25, borderTopRightRadius: 25, maxHeight: '80%', paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(128,128,128,0.2)' },
  sheetContent: { padding: 20 },
  sheetSectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  categoryTag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  categoryTagText: { fontSize: 14 },
  sheetDivider: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginVertical: 25 },
  priceInputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceInputContainer: { flex: 1 },
  priceInputLabel: { fontSize: 12, opacity: 0.5, marginBottom: 6 },
  priceInput: { height: 45, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, fontSize: 14 },
  priceInputSeparator: { width: 15, height: 1, backgroundColor: '#888', marginHorizontal: 15, marginTop: 20 },
  resetBtn: { marginTop: 40, padding: 15 },
});
