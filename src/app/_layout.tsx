
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

const LumaTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#A99AE8',
    onPrimary: '#17151F',
    secondary: '#B8ADD9',
    background: '#111116',
    surface: '#1C1C25',
    surfaceVariant: '#292834',
    onSurface: '#F4F1FA',
    onSurfaceVariant: '#B5B0C2',
    outline: '#454253',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={LumaTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recommendations" />
      </Stack>
    </PaperProvider>
  );
}
