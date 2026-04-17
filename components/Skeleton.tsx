import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const backgroundColor = colorScheme === 'dark' ? '#333' : '#e1e1e1';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ProductSkeleton() {
  return (
    <View style={styles.productSkeleton}>
      <Skeleton width="100%" height={150} borderRadius={20} />
      <View style={styles.skeletonInfo}>
        <Skeleton width="40%" height={10} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={14} style={{ marginBottom: 12 }} />
        <View style={styles.skeletonRow}>
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={12} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productSkeleton: {
    width: '48%',
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
  },
  skeletonInfo: {
    padding: 12,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
