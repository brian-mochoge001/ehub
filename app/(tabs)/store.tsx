import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Pressable, ActivityIndicator } from 'react-native';
import { Trash2, Plus, Minus, ShoppingCart, Package, ChevronRight, Store, ClipboardList, PlusCircle, MoreVertical, LogIn } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/services/auth-client';

const INITIAL_LISTINGS = [
  { id: '1', name: 'Samsung Galaxy S24 Ultra', price: 59999.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', status: 'Active' },
  { id: '2', name: 'HP Dragonfly Pro', price: 44999.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', status: 'Active' },
];

const INITIAL_CART = [
  { id: '1', name: 'Wireless Earbuds', price: 49.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
];

const INITIAL_ORDERS = [
  {
    id: '1',
    orderNumber: 'EH-90210',
    items: 'Wireless Earbuds',
    total: 49.99,
    status: 'Shipping',
    statusColor: '#4CAF50',
    date: 'Oct 24',
    estimatedDelivery: 'Oct 26',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    seller: 'TechWorld'
  },
  {
    id: '2',
    orderNumber: 'EH-90211',
    items: 'MacBook Air M3',
    total: 1299.00,
    status: 'Delivered',
    statusColor: '#2196F3',
    date: 'Oct 20',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    seller: 'Apple Store Official'
  },
];

export default function StoreScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const activeColor = Colors[colorScheme].tint;
  const cardBg = colorScheme === 'light' ? '#fff' : '#1A1C1E';
  const borderColor = colorScheme === 'light' ? '#F0F0F0' : '#2A2C2E';

  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'orders'>('shop');
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [orders] = useState(INITIAL_ORDERS);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 🛒 Cart logic
  const increaseQty = (id: string) => {
    setCartItems(items =>
      items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  };

  const decreaseQty = (id: string) => {
    setCartItems(items =>
      items.map(i =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(items => items.filter(i => i.id !== id));
  };

  // 🏪 Listings logic
  const removeListing = (id: string) => {
    setListings(items => items.filter(i => i.id !== id));
  };

  const markAsSold = (id: string) => {
    setListings(items =>
      items.map(i => i.id === id ? { ...i, status: 'Sold' } : i)
    );
  };

  // 🔄 Empty state
  const EmptyState = ({ icon: Icon, message, submessage }: any) => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconContainer, { backgroundColor: activeColor + '10' }]}>
        <Icon size={48} color={activeColor} />
      </View>
      <ThemedText style={styles.emptyTitle} type="subtitle">{message}</ThemedText>
      <ThemedText style={styles.emptySubtext}>{submessage}</ThemedText>
    </View>
  );

  // 🏪 Listings UI
  const renderListings = () => (
    <View style={styles.section}>
      <TouchableOpacity style={[styles.addListingBtn, { borderColor: activeColor }]}>
        <PlusCircle size={20} color={activeColor} />
        <ThemedText style={[styles.addListingText, { color: activeColor }]}>List a New Product</ThemedText>
      </TouchableOpacity>

      {listings.length ? listings.map(item => (
        <View key={item.id} style={[styles.itemCard, { backgroundColor: cardBg, borderColor }]}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />

          <View style={styles.itemInfo}>
            <View style={styles.itemHeader}>
              <ThemedText style={{ maxWidth: '90%' }} type="defaultSemiBold" numberOfLines={2}>{item.name}</ThemedText>
              <Pressable style={styles.moreBtn}>
                <MoreVertical size={18} color={Colors[colorScheme].icon} />
              </Pressable>
            </View>

            <ThemedText style={[styles.itemPrice, { color: activeColor }]}>
              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </ThemedText>

            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: item.status === 'Active' ? '#4CAF50' : '#757575' }]} />
              <ThemedText style={styles.statusText}>{item.status}</ThemedText>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryAction}>
                <ThemedText style={styles.actionText}>Edit</ThemedText>
              </TouchableOpacity>

              {item.status === 'Active' && (
                <TouchableOpacity style={styles.positiveAction} onPress={() => markAsSold(item.id)}>
                  <ThemedText style={styles.actionText}>Mark Sold</ThemedText>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.deleteAction} onPress={() => removeListing(item.id)}>
                <Trash2 size={16} color="#FF6347" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )) : (
        <EmptyState
          icon={Package}
          message="No active listings"
          submessage="Items you put up for sale will appear here."
        />
      )}
    </View>
  );

  // 🛒 Cart UI
  const renderCart = () => (
    <View style={styles.section}>
      {cartItems.length ? (
        <>
          {cartItems.map(item => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: cardBg, borderColor }]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />

              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.name}</ThemedText>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Trash2 size={18} color="#FF6347" />
                  </TouchableOpacity>
                </View>

                <ThemedText style={[styles.itemPrice, { color: activeColor }]}>
                  ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </ThemedText>

                <View style={styles.qtyRow}>
                  <View style={[styles.qtyControls, { backgroundColor: colorScheme === 'light' ? '#F5F5F5' : '#2A2C2E' }]}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQty(item.id)}>
                      <Minus size={14} color={Colors[colorScheme].text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.qtyText}>{item.quantity}</ThemedText>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQty(item.id)}>
                      <Plus size={14} color={Colors[colorScheme].text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <View style={[styles.summaryCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
              <ThemedText type="defaultSemiBold">${total.toFixed(2)}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
              <ThemedText type="defaultSemiBold" style={{ color: '#4CAF50' }}>FREE</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
            <View style={styles.summaryRow}>
              <ThemedText type="subtitle">Total</ThemedText>
              <ThemedText type="subtitle" style={{ color: activeColor }}>${total.toFixed(2)}</ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: activeColor }]}
              onPress={() => router.push('/shop/payment')}
            >
              <ShoppingCart size={20} color="#fff" style={{ marginRight: 8 }} />
              <ThemedText style={styles.checkoutBtnText}>Checkout</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <EmptyState
          icon={ShoppingCart}
          message="Your cart is empty"
          submessage="Browse the marketplace to find great deals!"
        />
      )}
    </View>
  );

  // 📦 Orders UI
  const renderOrders = () => (
    <View style={styles.section}>
      {orders.length ? orders.map(order => (
        <TouchableOpacity key={order.id} style={[styles.orderCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.orderTop}>
            <Image source={{ uri: order.image }} style={styles.orderImage} />
            <View style={styles.orderInfo}>
              <View style={styles.orderRow}>
                <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flex: 1 }}>{order.items}</ThemedText>
                <ChevronRight size={18} color={Colors[colorScheme].icon} />
              </View>

              <ThemedText style={styles.orderNumber}>{order.orderNumber}</ThemedText>

              <View style={styles.orderFooter}>
                <View style={styles.orderStatusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: order.statusColor }]} />
                  <ThemedText style={[styles.statusText, { color: order.statusColor }]}>{order.status}</ThemedText>
                </View>
                <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
              </View>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          <View style={styles.orderBottom}>
            <ThemedText style={styles.orderUserText}>
              Seller: <ThemedText type="defaultSemiBold">{order.seller}</ThemedText>
            </ThemedText>
            <ThemedText type="subtitle" style={{ color: activeColor }}>${order.total.toFixed(2)}</ThemedText>
          </View>
        </TouchableOpacity>
      )) : (
        <EmptyState
          icon={ClipboardList}
          message="No orders found"
          submessage="Your purchase history will appear here once you buy items."
        />
      )}
    </View>
  );

  if (isPending) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={activeColor} />
      </ThemedView>
    );
  }

  if (!session) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <ThemedText style={{ fontSize: 28, fontWeight: 'bold' }} type="title">My Store</ThemedText>
        </View>
        <View style={styles.guestContainer}>
          <View style={[styles.guestIconCircle, { backgroundColor: activeColor + '15' }]}>
            <Store size={60} color={activeColor} />
          </View>
          <ThemedText type="subtitle" style={styles.guestTitle}>Manage Your Store</ThemedText>
          <ThemedText style={styles.guestSubtitle}>Sign in to manage your listings, view your cart, and track your orders.</ThemedText>
          <TouchableOpacity 
            style={[styles.loginBtn, { backgroundColor: activeColor }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <LogIn size={20} color="#fff" />
            <ThemedText style={styles.loginBtnText}>Sign In / Sign Up</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">My Store</ThemedText>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colorScheme === 'light' ? '#F5F5F5' : '#2A2C2E' }]}>
          <Store size={22} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { borderBottomColor: borderColor }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('shop')}
          style={[styles.tab, activeTab === 'shop' && { borderBottomColor: activeColor }]}
        >
          <Package size={18} color={activeTab === 'shop' ? activeColor : Colors[colorScheme].icon} />
          <ThemedText style={[styles.tabText, activeTab === 'shop' && { color: activeColor, fontWeight: 'bold' }]}>
            My Shop
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('cart')}
          style={[styles.tab, activeTab === 'cart' && { borderBottomColor: activeColor }]}
        >
          <ShoppingCart size={18} color={activeTab === 'cart' ? activeColor : Colors[colorScheme].icon} />
          <View style={styles.tabLabelWithBadge}>
            <ThemedText style={[styles.tabText, activeTab === 'cart' && { color: activeColor, fontWeight: 'bold' }]}>
              Cart
            </ThemedText>
            {cartItems.length > 0 && (
              <View style={[styles.badge, { backgroundColor: activeColor }]}>
                <ThemedText style={styles.badgeText}>{cartItems.length}</ThemedText>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('orders')}
          style={[styles.tab, activeTab === 'orders' && { borderBottomColor: activeColor }]}
        >
          <ClipboardList size={18} color={activeTab === 'orders' ? activeColor : Colors[colorScheme].icon} />
          <ThemedText style={[styles.tabText, activeTab === 'orders' && { color: activeColor, fontWeight: 'bold' }]}>
            Orders
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'shop' && renderListings()}
        {activeTab === 'cart' && renderCart()}
        {activeTab === 'orders' && renderOrders()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
  },
  tabLabelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  scrollContent: { padding: 20, paddingBottom: 100 },
  section: { gap: 16 },

  addListingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 8,
  },
  addListingText: {
    fontSize: 16,
    fontWeight: '600',
  },

  itemCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemImage: { width: 100, height: 100, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#757575',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  secondaryAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#888',
  },
  positiveAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteAction: {
    marginLeft: 'auto',
    padding: 6,
  },
  moreBtn: {
    padding: 4,
  },

  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
  },

  summaryCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#757575',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
  checkoutBtn: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  orderCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  orderTop: {
    flexDirection: 'row',
    gap: 12,
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  orderInfo: {
    flex: 1,
    gap: 4,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orderNumber: {
    fontSize: 12,
    color: '#757575',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderUserText: {
    fontSize: 14,
    color: '#757575',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#757575',
    paddingHorizontal: 40,
  },
  
  // Guest Styles
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 100 },
  guestIconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  guestTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  guestSubtitle: { fontSize: 16, opacity: 0.6, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, gap: 10, width: '100%' },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
