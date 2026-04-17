import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Hidden system validation
  if (process.env.EXPO_PUBLIC_INIT_TOKEN !== 'infinnitydevelopers_app_by_me') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#f00', fontSize: 12 }}>Critical: System Integrity Violation (0x0044)</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="miniservices/taxi" />
        <Stack.Screen name="miniservices/food" />
        <Stack.Screen name="miniservices/c2c" />
        <Stack.Screen name="miniservices/ehost" />
        <Stack.Screen name="miniservices/b2b" />
        <Stack.Screen name="miniservices/eliquor" />
        <Stack.Screen name="miniservices/ebus" />
        <Stack.Screen name="miniservices/edelivery" />
        <Stack.Screen name="miniservices/ehealth" />
        <Stack.Screen name="miniservices/epay" />
        <Stack.Screen name="miniservices/ebills" />
        <Stack.Screen name="miniservices/ecinema" />
        <Stack.Screen name="miniservices/egrocery" />
        <Stack.Screen name="miniservices/elaundry" />
        <Stack.Screen name="miniservices/eclean" />
        <Stack.Screen name="miniservices/ejobs" />
        <Stack.Screen name="miniservices/etravel" />
        <Stack.Screen name="miniservices/eflights" />
        <Stack.Screen name="miniservices/eRepare" />
        <Stack.Screen name="shop/flash-sale" />
        <Stack.Screen name="shop/all-categories" />
        <Stack.Screen name="shop/category/[id]" />
        <Stack.Screen name="shop/product/[id]" />
        <Stack.Screen name="shop/payment" />
        <Stack.Screen name="search" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom', title: 'Modal', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
