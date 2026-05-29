import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Platform, RefreshControl, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import EventSource from 'react-native-event-source';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/services/auth-client';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TaxiMap from '@/components/TaxiMap';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Colors } from '@/constants/theme';
import {
  ArrowLeft,
  Navigation,
  Package,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Bell,
  RefreshCw,
  X,
  Phone,
} from 'lucide-react-native';

export default function DriverScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  const isDark = colorScheme === 'dark';

  const [driverStatus, setDriverStatus] = useState<string>('offline');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'requests'>('tasks');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  const queryClient = useQueryClient();

  const driverTasksQuery = useQuery({
    queryKey: ['driverTasks'],
    queryFn: api.getDriverTasks,
    enabled: driverStatus === 'online',
    staleTime: 1000 * 60,
  });

  const rideRequestsQuery = useQuery({
    queryKey: ['rideRequests'],
    queryFn: api.getRideRequests,
    staleTime: 1000 * 20,
  });

  const deliveryRequestsQuery = useQuery({
    queryKey: ['deliveryRequests'],
    queryFn: api.getDeliveryRequests,
    staleTime: 1000 * 20,
  });

  const tasks = driverTasksQuery.data || [];
  const requests = [...(rideRequestsQuery.data || []), ...(deliveryRequestsQuery.data || [])];

  const updateStatusMutation = useMutation({
    mutationFn: api.updateStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
    },
  });

  const acceptRideMutation = useMutation({
    mutationFn: api.acceptRideRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
    },
  });

  const acceptDeliveryMutation = useMutation({
    mutationFn: api.acceptDeliveryRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
    },
  });

  const declineRideMutation = useMutation({
    mutationFn: api.declineRideRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
    },
  });

  const declineDeliveryMutation = useMutation({
    mutationFn: api.declineDeliveryRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
    },
  });

  useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription | null = null;
    let es: any = null;

    const startLocationWatch = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted' || !isMounted) return;

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      if (!isMounted) return;

      const coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      setCurrentLocation(coords);
      await api.updateLocation(coords.longitude, coords.latitude);

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 10000, distanceInterval: 10 },
        async position => {
          if (!isMounted) return;
          const nextLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setCurrentLocation(nextLocation);
          try {
            await api.updateLocation(nextLocation.longitude, nextLocation.latitude);
          } catch (error) {
            console.error('Unable to push driver location:', error);
          }
        }
      );
    };

    const loadDriverData = async () => {
      try {
        const driver = await api.getDriverLocation();
        if (!isMounted) return;
        setDriverStatus(driver.status || 'offline');
        await queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
      } catch (error) {
        console.error('Driver dashboard load failed:', error);
      }
    };

    const initSSE = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !isMounted) return;

        const token = await user.getIdToken();
        if (!isMounted) return;

        const base = process.env.EXPO_PUBLIC_API_URL || 'https://ehubgo.onrender.com/api/v1';
        const url = `${base}/ws/driver`;

        es = new EventSource(url, { headers: { Authorization: `Bearer ${token}` } });

        es.onmessage = (e: any) => {
          if (!isMounted) return;
          try {
            const payload = JSON.parse(e.data);
            if (payload?.type === 'delivery_request' || payload?.type === 'ride_request' || payload?.type === 'delivery_assigned') {
              queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
            }
          } catch (err) {
            console.warn('Unable to parse SSE payload:', err);
          }
        };

        es.onerror = (err: any) => {
          console.warn('SSE error', err);
        };
      } catch (err) {
        console.warn('Failed to init SSE', err);
      }
    };

    loadDriverData();
    startLocationWatch();
    initSSE();

    return () => {
      isMounted = false;
      if (subscription) subscription.remove();
      if (es) {
        try {
          es.close();
        } catch (e) {
          console.warn('Error closing EventSource:', e);
        }
      }
    };
  }, [queryClient]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['driverTasks', 'rideRequests', 'deliveryRequests'] });
    setRefreshing(false);
  };

  const toggleStatus = async () => {
    setUpdatingStatus(true);
    try {
      const nextStatus = driverStatus === 'online' ? 'offline' : 'online';
      await updateStatusMutation.mutateAsync(nextStatus);
      setDriverStatus(nextStatus);
    } catch (error) {
      console.error('Unable to update status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const acceptRequest = async (reqId: string, serviceType?: string) => {
    setActionLoading(reqId);
    try {
      if (serviceType === 'delivery') {
        await acceptDeliveryMutation.mutateAsync(reqId);
      } else {
        await acceptRideMutation.mutateAsync(reqId);
      }
    } catch (error) {
      console.error('Accept request failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const declineRequest = async (reqId: string, serviceType?: string) => {
    setActionLoading(reqId);
    try {
      if (serviceType === 'delivery') {
        await declineDeliveryMutation.mutateAsync(reqId);
      } else {
        await declineRideMutation.mutateAsync(reqId);
      }
    } catch (error) {
      console.error('Decline request failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenMap = (task: any) => {
    setSelectedTask(task);
    setShowMap(true);
  };

  const isLoading = driverTasksQuery.isLoading;
  const isFetchingRequests = rideRequestsQuery.isFetching || deliveryRequestsQuery.isFetching;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle">Driver Hub</ThemedText>
        <TouchableOpacity style={styles.iconButton} onPress={onRefresh}>
          <RefreshCw size={20} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.statusBanner, { backgroundColor: driverStatus === 'online' ? '#4CAF5020' : '#88820' }]}>
        <View style={styles.statusInfo}>
          <View style={[styles.statusIndicator, { backgroundColor: driverStatus === 'online' ? '#4CAF50' : '#888' }]} />
          <ThemedText style={styles.statusLabel}>
            You are currently <ThemedText style={{ fontWeight: 'bold' }}>{driverStatus.toUpperCase()}</ThemedText>
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: driverStatus === 'online' ? '#FF5252' : '#4CAF50' }]}
          onPress={toggleStatus}
          disabled={updatingStatus}
        >
          {updatingStatus ? <ActivityIndicator size="small" color="#fff" /> : (
            <ThemedText style={styles.toggleText}>{driverStatus === 'online' ? 'Go Offline' : 'Go Online'}</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && { borderBottomColor: activeColor, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('tasks')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'tasks' && { color: activeColor, fontWeight: 'bold' }]}>Active Tasks ({tasks.length})</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && { borderBottomColor: activeColor, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('requests')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'requests' && { color: activeColor, fontWeight: 'bold' }]}>Available ({requests.length})</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || isFetchingRequests} onRefresh={onRefresh} colors={[activeColor]} />}
      >
        {activeTab === 'tasks' ? (
          <View style={styles.listContainer}>
            {isLoading ? (
              <ActivityIndicator style={{ marginTop: 40 }} color={activeColor} />
            ) : tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <ShieldCheck size={64} color="#ccc" />
                <ThemedText style={styles.emptyTitle}>No Active Tasks</ThemedText>
                <ThemedText style={styles.emptySub}>Switch to &apos;Available&apos; to find new work.</ThemedText>
              </View>
            ) : (
              tasks.map(task => (
                <View key={task.id} style={[styles.card, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.typeBadge}>
                      {task.service_type === 'delivery' ? <Package size={14} color="#fff" /> : <Navigation size={14} color="#fff" />}
                      <ThemedText style={styles.typeText}>{task.service_type || 'Ride'}</ThemedText>
                    </View>
                    <ThemedText style={styles.priceText}>{task.currency} {task.total_amount}</ThemedText>
                  </View>

                  <ThemedText style={styles.customerName}>{task.customer_name}</ThemedText>

                  <View style={styles.locationContainer}>
                    <View style={styles.locRow}>
                      <MapPin size={14} color="#4CAF50" />
                      <ThemedText style={styles.locText} numberOfLines={1}>Pickup: {task.pickup_location?.latitude?.toFixed(4)}, {task.pickup_location?.longitude?.toFixed(4)}</ThemedText>
                    </View>
                    <View style={[styles.locLine, { backgroundColor: isDark ? '#444' : '#eee' }]} />
                    <View style={styles.locRow}>
                      <MapPin size={14} color="#FF5252" />
                      <ThemedText style={styles.locText} numberOfLines={1}>Dropoff: {task.dropoff_location?.latitude?.toFixed(4)}, {task.dropoff_location?.longitude?.toFixed(4)}</ThemedText>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.statusRow}>
                      <Clock size={14} color="#888" />
                      <ThemedText style={styles.timeText}>{task.status?.toUpperCase()}</ThemedText>
                    </View>
                    <TouchableOpacity 
                      style={[styles.actionBtn, { backgroundColor: activeColor }]}
                      onPress={() => handleOpenMap(task)}
                    > 
                      <ThemedText style={styles.btnText}>Open Map</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {requests.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={64} color="#ccc" />
                <ThemedText style={styles.emptyTitle}>Looking for requests...</ThemedText>
                <ThemedText style={styles.emptySub}>Requests near you will appear here instantly.</ThemedText>
              </View>
            ) : (
              requests.map(req => (
                <View key={req.id} style={[styles.card, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.distanceText}>{req.distance_m ? `${Math.round(req.distance_m)}m away` : 'Near you'}</ThemedText>
                    <ThemedText style={styles.priceText}>{req.currency} {req.total_amount}</ThemedText>
                  </View>

                  <ThemedText style={styles.customerName}>{req.customer_name || 'Incoming Request'}</ThemedText>

                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={[styles.requestBtn, { backgroundColor: '#4CAF50' }]}
                      onPress={() => acceptRequest(req.id, req.service_type)}
                      disabled={actionLoading === req.id}
                    >
                      {actionLoading === req.id ? <ActivityIndicator size="small" color="#fff" /> : (
                        <>
                          <CheckCircle2 size={18} color="#fff" />
                          <ThemedText style={styles.btnText}>Accept</ThemedText>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.requestBtn, { backgroundColor: '#FF5252' }]}
                      onPress={() => declineRequest(req.id, req.service_type)}
                      disabled={actionLoading === req.id}
                    >
                      <XCircle size={18} color="#fff" />
                      <ThemedText style={styles.btnText}>Decline</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Navigation Modal */}
      <Modal visible={showMap} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMap(false)} style={styles.modalCloseBtn}>
              <X size={24} color={Colors[colorScheme].text} />
            </TouchableOpacity>
            <ThemedText type="defaultSemiBold">Navigation</ThemedText>
            <View style={{ width: 40 }} />
          </View>
          <View style={{ flex: 1 }}>
            <TaxiMap 
              userLocation={selectedTask?.pickup_location}
              encodedPolyline={selectedTask?.polyline}
              showNearby={false}
              driverMode="motorbike"
            />
          </View>
          <View style={[styles.modalFooter, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
             <ThemedText style={{ marginBottom: 10 }}>Customer: {selectedTask?.customer_name}</ThemedText>
             <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: '#4CAF50' }]}>
                <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Arrived at Pickup</ThemedText>
             </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 50 : 70 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.05)' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.05)' },
  statusBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, marginHorizontal: 20, borderRadius: 16, marginBottom: 20 },
  statusInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  statusLabel: { fontSize: 13 },
  toggleButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  toggleText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)', marginBottom: 10 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 14, color: '#888' },
  scrollContent: { paddingBottom: 40 },
  listContainer: { paddingHorizontal: 20, paddingTop: 10 },
  card: { borderRadius: 20, padding: 20, marginBottom: 15, elevation: 4, shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  priceText: { fontSize: 18, fontWeight: '800' },
  customerName: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
  locationContainer: { marginBottom: 15 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  locText: { fontSize: 13, opacity: 0.6, flex: 1 },
  locLine: { width: 1, height: 15, marginLeft: 6, marginVertical: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.05)', paddingTop: 15 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { fontSize: 11, fontWeight: 'bold', color: '#888' },
  actionBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  distanceText: { fontSize: 12, color: '#888', fontWeight: '500' },
  requestActions: { flexDirection: 'row', gap: 10, marginTop: 5 },
  requestBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, opacity: 0.5 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  emptySub: { fontSize: 14, textAlign: 'center', marginTop: 5, paddingHorizontal: 40 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
  modalCloseBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  modalFooter: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 },
  mainActionBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
});
