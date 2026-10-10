import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { COLORS } from '@/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: COLORS.primary,
          headerTitleStyle: { color: COLORS.text },
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="detail/[id]"
          options={{ title: 'Detalle del libro', headerBackTitle: 'Catálogo' }}
        />
      </Stack>
    </>
  );
}
