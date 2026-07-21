import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

function AppNavigation() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const firstSegment = segments[0] as string;
    const inAuthGroup = firstSegment === '(tabs)' || 
                        firstSegment === 'product' || 
                        firstSegment === 'scanner' || 
                        firstSegment === 'tasks' || 
                        firstSegment === 'notifications';
                        
    const inUnauthGroup = firstSegment === 'login' || firstSegment === 'register';

    if (!token && inAuthGroup) {
      router.replace('/login');
    } else if (token && inUnauthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, loading, segments]);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"         options={{ animation: 'fade' }} />
      <Stack.Screen name="login"         options={{ animation: 'fade' }} />
      <Stack.Screen name="register"      options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)"        options={{ animation: 'fade' }} />
      <Stack.Screen name="product/[id]"  options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="scanner"       options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen name="tasks"         options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigation />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

