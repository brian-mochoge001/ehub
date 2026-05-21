import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ArrowLeft, Star, Package, Home, ShoppingBag, Activity, ToolCaseIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';

export default function BusinessProfilePage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    
    const [business, setBusiness] = useState<any>(null);
    const [vendorShops, setVendorShops] = useState<any[]>([]);
    const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchItemsForBusiness = async (businessId: string, type: string) => {
        switch (type) {
            case 'hotel':
            case 'apartment':
                return api.getBusinessProperties(businessId);
            case 'restaurant':
            case 'liquor':
            case 'grocery':
                return api.getBusinessProducts(businessId);
            default:
                return api.getBusinessServices(businessId);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const bizData = await api.getBusinessProfile(id as string);
            setBusiness(bizData);
            setSelectedShopId(id as string);

            const ownerShops = bizData.owner_id ? await api.getBusinessesByOwnerId(bizData.owner_id) : [];
            setVendorShops(ownerShops || [bizData]);

            const initialItems = await fetchItemsForBusiness(id as string, bizData.miniservice_type);
            setItems(initialItems || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const selectShop = async (shop: any) => {
        if (!shop || selectedShopId === shop.id) return;
        try {
            setLoading(true);
            setSelectedShopId(shop.id);
            const shopItems = await fetchItemsForBusiness(shop.id, shop.miniservice_type);
            setItems(shopItems || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
            </ThemedView>
        );
    }

    if (error || !business) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText>Error: {error || 'Business not found'}</ThemedText>
                <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
                    <ThemedText style={{ color: '#fff' }}>Retry</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const activeShop = vendorShops.find((shop) => shop.id === selectedShopId) || business;

    const getTabConfig = () => {
        const type = activeShop?.miniservice_type || business.miniservice_type;
        switch (type) {
            case 'hotel':
            case 'apartment':
                return { label: 'Rooms & Stays', icon: Home };
            case 'restaurant':
                return { label: 'Menu Items', icon: ShoppingBag };
            case 'liquor':
            case 'grocery':
                return { label: 'Products', icon: Package };
            case 'repair':
                return { label: 'Services', icon: ToolCaseIcon };
            case 'health':
                return { label: 'Consultations', icon: Activity };
            default:
                return { label: 'Offerings', icon: Package };
        }
    };

    const tabConfig = getTabConfig();

    return (
        <ThemedView style={styles.container}>
            <ImageBackground source={{ uri: business.banner_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' }} style={styles.banner}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
            </ImageBackground>

            <View style={styles.header}>
                <Image source={{ uri: activeShop.logo_url || 'https://via.placeholder.com/150' }} style={styles.logo} />
                <ThemedText type="title" style={styles.name}>{activeShop.name}</ThemedText>
                <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{activeShop.miniservice_type.toUpperCase()}</ThemedText>
                </View>
                <ThemedText style={styles.description}>{activeShop.description}</ThemedText>
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Star size={16} color="#FFD700" fill="#FFD700" />
                        <ThemedText style={styles.statText}>{activeShop.rating || 'New'}</ThemedText>
                    </View>
                    <View style={styles.stat}>
                        <ThemedText style={styles.statLabel}>Vendor</ThemedText>
                        <ThemedText style={styles.statText}>{business.owner_id ? 'Multiple shops' : 'Single shop'}</ThemedText>
                    </View>
                </View>
            </View>

            {vendorShops.length > 1 && (
                <View style={styles.shopSwitcher}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shopSwitcherContent}>
                        {vendorShops.map((shop) => (
                            <TouchableOpacity
                                key={shop.id}
                                style={[
                                    styles.shopChip,
                                    selectedShopId === shop.id ? styles.activeShopChip : null,
                                ]}
                                onPress={() => selectShop(shop)}
                            >
                                <ThemedText style={[styles.shopChipText, selectedShopId === shop.id && styles.activeShopChipText]} numberOfLines={1}>
                                    {shop.name}
                                </ThemedText>
                                <ThemedText style={[styles.shopTypeText, selectedShopId === shop.id && styles.activeShopChipText]}>
                                    {shop.miniservice_type}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <View style={styles.activeSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                    {vendorShops.find((shop) => shop.id === selectedShopId)?.miniservice_type === 'restaurant' ? 'Menu' : 'Offerings'}
                </ThemedText>
            </View>

            <FlatList
                data={items}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const activeShop = vendorShops.find((shop) => shop.id === selectedShopId) || business;
                    const isProperty = activeShop.miniservice_type === 'hotel' || activeShop.miniservice_type === 'apartment';

                    return (
                        <TouchableOpacity 
                            style={styles.card} 
                            onPress={() => {
                                if (isProperty) {
                                    router.push(`/properties/${item.id}` as any);
                                } else {
                                    router.push(`/shop/product/${item.id}` as any);
                                }
                            }}
                        >
                            <Image source={{ uri: item.image_url || item.image || item.banner_url || 'https://via.placeholder.com/150' }} style={styles.cardImage} />
                            <ThemedText style={styles.cardName} numberOfLines={1}>{item.name || item.title}</ThemedText>
                            <ThemedText style={styles.cardPrice}>{item.currency || 'Ksh'} {item.price || item.price_per_night || item.base_price || item.amount || '—'}</ThemedText>
                        </TouchableOpacity>
                    );
                }}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>No items available for this shop yet.</ThemedText>
                    </View>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    banner: { height: 200, justifyContent: 'flex-start', padding: 20 },
    backButton: { marginTop: 30, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', marginTop: -40, padding: 20 },
    logo: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff' },
    name: { marginTop: 10, textAlign: 'center' },
    badge: { backgroundColor: 'rgba(128,128,128,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 5 },
    badgeText: { fontSize: 10, fontWeight: 'bold', opacity: 0.6 },
    description: { textAlign: 'center', marginVertical: 8, opacity: 0.7, fontSize: 14 },
    statsRow: { flexDirection: 'row', gap: 20, marginTop: 5 },
    stat: { flexDirection: 'row', alignItems: 'center' },
    statText: { marginLeft: 5, fontWeight: 'bold' },
    tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#FF385C' },
    tabText: { fontWeight: '600', fontSize: 14 },
    shopSwitcher: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.12)' },
    shopSwitcherContent: { paddingHorizontal: 10 },
    shopChip: { marginRight: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(128,128,128,0.08)' },
    activeShopChip: { backgroundColor: '#FF385C' },
    shopChipText: { fontSize: 13, fontWeight: '600' },
    shopTypeText: { fontSize: 11, opacity: 0.7, marginTop: 2 },
    activeShopChipText: { color: '#fff' },
    activeSection: { paddingHorizontal: 20, paddingBottom: 10 },
    sectionTitle: { marginTop: 10 },
    list: { padding: 10 },
    card: { flex: 1, margin: 8, padding: 10, borderRadius: 15, backgroundColor: 'rgba(128,128,128,0.05)', elevation: 1 },
    cardImage: { width: '100%', height: 120, borderRadius: 10, marginBottom: 10 },
    cardName: { fontSize: 14, fontWeight: '500' },
    cardPrice: { fontWeight: 'bold', marginTop: 5, fontSize: 13 },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { opacity: 0.5 },
    retryButton: { marginTop: 20, backgroundColor: '#FF385C', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }
});
