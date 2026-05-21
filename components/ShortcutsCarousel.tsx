import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Car, Utensils, LayoutGrid, Smartphone, MapPinHouse, Pill, Truck, Ticket, House } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const MINISERVICES = [
  { id: 'etaxi', name: 'eTaxi', icon: Car, color: '#FFD700', route: '/miniservices/taxi', bg: ['#FFF8DC', '#FFD700'] },
  { id: 'efood', name: 'eFood', icon: Utensils, color: '#FF6347', route: '/miniservices/food', bg: ['#FFE4E1', '#FF6347'] },
  { id: 'egrocery', name: 'eGrocery', icon: Truck, color: '#4CAF50', route: '/miniservices/egrocery', bg: ['#E8F5E9', '#4CAF50'] },
  { id: 'ehealth', name: 'eHealth', icon: Pill, color: '#00BCD4', route: '/miniservices/ehealth', bg: ['#E0F7FA', '#00BCD4'] },
  { id: 'ehost', name: 'eHost', icon: MapPinHouse, color: '#4169E1', route: '/miniservices/stay', bg: ['#E6E6FA', '#4169E1'] },
  { id: 'ecinema', name: 'eCinema', icon: Ticket, color: '#9C27B0', route: '/miniservices/ecinema', bg: ['#F3E5F5', '#9C27B0'] },
  { id: 'more', name: 'More', icon: LayoutGrid, color: '#708090', route: '/services', bg: ['#F5F5F5', '#708090'] },
];

export const ShortcutsCarousel = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>Mini-Services</ThemedText>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        snapToInterval={width * 0.22 + 15}
        decelerationRate="fast"
      >
        {MINISERVICES.map((service, index) => {
          const Icon = service.icon;
          return (
            <TouchableOpacity 
              key={service.id} 
              style={[styles.serviceItem, { marginLeft: index === 0 ? 20 : 0 }]}
              onPress={() => router.push(service.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#333' : '#fff' }]}>
                <View style={[styles.iconBg, { backgroundColor: service.bg[0] }]} />
                <Icon size={28} color={service.color} style={{ zIndex: 2 }} />
              </View>
              <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingRight: 20,
  },
  serviceItem: {
    alignItems: 'center',
    marginRight: 15,
    width: width * 0.22,
  },
  iconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  iconBg: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.5,
    zIndex: 1,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
