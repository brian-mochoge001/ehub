import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CartPage() {
    const colorScheme = useColorScheme() ?? 'light';
    const router = useRouter();
    const [filter, setFilter] = useState('All');
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await api.getCart();
            setCartItems(data);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            await api.removeFromCart(id);
            setCartItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            alert('Failed to remove item');
        }
    };

    const filteredItems = filter === 'All' ? cartItems : cartItems.filter(i => i.item_type === filter);

    const subtotal = filteredItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
    const shipping = subtotal > 0 ? 0 : 0; // Free for now as per design
    const total = subtotal + shipping;

    if (loading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={Colors[colorScheme].text} />
                </TouchableOpacity>
                <ThemedText type="title">Universal Cart</ThemedText>
            </View>
            
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={filter}
                    onValueChange={(itemValue) => setFilter(itemValue)}
                    style={[styles.picker, { color: Colors[colorScheme].text }]}
                    dropdownIconColor={Colors[colorScheme].text}
                >
                    <Picker.Item label="All Saved Items" value="All" />
                    <Picker.Item label="Stays (eHost)" value="hotel" />
                    <Picker.Item label="Food" value="restaurant" />
                    <Picker.Item label="Products" value="ecommerce" />
                    <Picker.Item label="Groceries" value="grocery" />
                </Picker>
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
                        <View style={styles.cardContent}>
                            <View style={styles.itemInfo}>
                                <ThemedText type="defaultSemiBold" style={styles.itemName}>{item.name || 'Item'}</ThemedText>
                                <ThemedText style={styles.itemMeta}>{item.currency} {item.price} • Qty: {item.quantity || 1} • {item.item_type}</ThemedText>
                                <ThemedText style={styles.vendorName}>from {item.business_name}</ThemedText>
                            </View>
                            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
                                <Trash2 size={20} color="#FF6347" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <ShoppingBag size={64} color="#ccc" />
                        <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
                        <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)')}>
                            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Start Shopping</ThemedText>
                        </TouchableOpacity>
                    </View>
                }
            />

            {filteredItems.length > 0 && (
                <View style={[styles.footer, { borderTopColor: 'rgba(128,128,128,0.1)', backgroundColor: colorScheme === 'light' ? '#fff' : '#151718' }]}>
                    <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
                        <ThemedText style={styles.summaryValue}>Ksh {subtotal.toFixed(2)}</ThemedText>
                    </View>
                    <TouchableOpacity 
                        style={[styles.checkoutBtn, { backgroundColor: Colors[colorScheme].tint }]}
                        onPress={() => router.push('/shop/payment')}
                    >
                        <ThemedText style={styles.checkoutBtnText}>Checkout • Ksh {total.toFixed(2)}</ThemedText>
                    </TouchableOpacity>
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, gap: 15 },
    backBtn: { padding: 5 },
    pickerContainer: { marginHorizontal: 20, marginBottom: 20, backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 10 },
    picker: { height: 50, width: '100%' },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    card: { padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2, shadowOpacity: 0.1, shadowRadius: 5 },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16 },
    itemMeta: { fontSize: 14, opacity: 0.7, marginVertical: 4 },
    vendorName: { fontSize: 12, opacity: 0.5 },
    removeBtn: { padding: 10 },
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 18, opacity: 0.5, marginTop: 20 },
    shopBtn: { marginTop: 20, backgroundColor: '#0a7ea4', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
    footer: { padding: 20, paddingBottom: 35, borderTopWidth: 1 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    summaryLabel: { fontSize: 16, opacity: 0.6 },
    summaryValue: { fontSize: 16, fontWeight: 'bold' },
    checkoutBtn: { height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    checkoutBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
