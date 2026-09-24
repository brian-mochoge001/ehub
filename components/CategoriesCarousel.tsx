import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { ALL_SERVICES } from '../app/(tabs)/services';

const { width } = Dimensions.get('window');

export const CategoriesCarousel = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const displayedCategories = ALL_SERVICES.slice(0, 6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>Categories</ThemedText>
        <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
          <ThemedText style={{ color: colorScheme === 'light' ? '#0a7ea4' : '#6495ED' }}>See All</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        snapToInterval={width * 0.22 + 15}
        decelerationRate="fast"
      >
        {displayedCategories.map((cat, index) => (
          <TouchableOpacity 
            key={cat.id} 
            style={[styles.catItem, { marginLeft: index === 0 ? 20 : 0 }]}
            onPress={() => router.push(cat.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#333' : '#fff' }]}>
              <Image source={{ uri: cat.image }} style={styles.catImage} contentFit="cover" />
            </View>
            <ThemedText style={styles.catName}>{cat.name}</ThemedText>
          </TouchableOpacity>
        ))}
        {/* More Button */}
        <TouchableOpacity 
            style={styles.moreItem}
            onPress={() => router.push('/(tabs)/services')}
        >
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#333' : '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <ThemedText style={{fontSize: 20}}>...</ThemedText>
            </View>
            <ThemedText style={styles.catName}>More</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  header: { paddingHorizontal: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingRight: 20 },
  catItem: { alignItems: 'center', marginRight: 15, width: width * 0.22 },
  moreItem: { alignItems: 'center', width: width * 0.22 },
  iconWrapper: { width: 65, height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, overflow: 'hidden' },
  catImage: { width: '100%', height: '100%' },
  catName: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
