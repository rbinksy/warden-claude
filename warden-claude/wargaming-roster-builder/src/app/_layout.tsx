import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../global.css';
import { initializeApp } from '../lib/initialization';
import { AppProviders } from '../providers/AppProviders';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    const initializeAppAsync = async () => {
      try {
        // Initialize the app (database, notifications, etc.)
        await initializeApp();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        // Hide splash screen once initialization is complete
        await SplashScreen.hideAsync();
      }
    };

    initializeAppAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppProviders>
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen 
                name="(tabs)" 
                options={{ 
                  headerShown: false,
                  gestureEnabled: false 
                }} 
              />
              <Stack.Screen 
                name="auth" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal' 
                }} 
              />
              <Stack.Screen 
                name="units/[id]" 
                options={{ 
                  presentation: 'modal',
                  title: 'Unit Details',
                  headerStyle: {
                    backgroundColor: '#1f2937',
                  },
                  headerTintColor: '#f9fafb',
                }} 
              />
              <Stack.Screen 
                name="camera" 
                options={{ 
                  presentation: 'fullScreenModal',
                  headerShown: false,
                  gestureEnabled: false 
                }} 
              />
            </Stack>
          </AppProviders>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}