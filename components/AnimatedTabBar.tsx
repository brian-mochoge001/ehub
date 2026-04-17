import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './themed-text';

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, height: 65 + insets.bottom }]}>
      <BlurView
        intensity={80}
        tint={colorScheme}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.tabsWrapper}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const label = options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabItem
                key={route.key}
                isFocused={isFocused}
                onPress={onPress}
                renderIcon={options.tabBarIcon}
                activeColor={activeColor}
                colorScheme={colorScheme}
                label={label}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

function TabItem({ isFocused, onPress, renderIcon, activeColor, colorScheme, label }: any) {
  const scale = useSharedValue(isFocused ? 1.05 : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.05 : 1, {
      damping: 20,
      stiffness: 600,
    });
  }, [isFocused, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        {renderIcon && renderIcon({
          focused: isFocused,
          color: isFocused ? activeColor : (colorScheme === 'light' ? '#666' : '#999'),
          size: 22,
        })}
        <ThemedText style={[
          styles.label, 
          { color: isFocused ? activeColor : (colorScheme === 'light' ? '#666' : '#999') }
        ]}>
          {label}
        </ThemedText>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  tabsWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});
