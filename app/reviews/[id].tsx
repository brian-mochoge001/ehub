import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ArrowLeft, Star, ArrowUpDown } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';

export default function ReviewsPage() {
    const { id, type } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const activeColor = Colors[colorScheme].tint;

    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'newest' | 'highest' | 'lowest'>('newest');

    useEffect(() => {
        if (id) {
            fetchReviews();
        }
    }, [id]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await api.getReviewsByTarget(id as string, type as string || 'product');
            setReviews(data || []);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const sortedReviews = useMemo(() => {
        let sorted = [...reviews];
        if (sortOrder === 'highest') return sorted.sort((a, b) => b.rating - a.rating);
        if (sortOrder === 'lowest') return sorted.sort((a, b) => a.rating - b.rating);
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [reviews, sortOrder]);

    if (loading) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={activeColor} />
            </ThemedView>
        );
    }
    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={Colors[colorScheme].text} />
                </TouchableOpacity>
                <ThemedText type="subtitle">Ratings & Reviews</ThemedText>
                <TouchableOpacity onPress={() => setSortOrder(prev => prev === 'highest' ? 'lowest' : 'highest')}>
                    <ArrowUpDown size={20} color={Colors[colorScheme].text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={sortedReviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.row}>
                            <ThemedText style={styles.userName}>{item.user}</ThemedText>
                            <View style={styles.stars}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color="#FFD700" fill={s <= item.rating ? "#FFD700" : "transparent"} />)}
                            </View>
                        </View>
                        <ThemedText>{item.comment}</ThemedText>
                        <ThemedText style={styles.date}>{item.date}</ThemedText>
                    </View>
                )}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 40 },
    reviewCard: { padding: 15, borderRadius: 12, backgroundColor: 'rgba(128,128,128,0.05)', marginBottom: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    userName: { fontWeight: 'bold' },
    stars: { flexDirection: 'row' },
    date: { fontSize: 12, opacity: 0.5, marginTop: 5 }
});
