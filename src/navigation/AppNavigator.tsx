import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../store';
import { LoadingSpinner } from '../components';
import supabaseService from '../services/supabase';

// Import screens (we'll create these next)
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ItemDetectionScreen from '../screens/ItemDetectionScreen';
import ListingCreationScreen from '../screens/ListingCreationScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuth, setUser, setAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log('[AppNavigator] Setting up auth...');
    checkAuth();

    // Set up auth state listener
    const { data: authListener } = supabaseService.onAuthStateChange((event, session) => {
      console.log('[AppNavigator] Auth event:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('[AppNavigator] User signed in:', session.user.email);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at,
        });
        setAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        console.log('[AppNavigator] User signed out');
        setUser(null);
        setAuthenticated(false);
      }
    });

    // Handle deep links for OAuth callback
    const handleDeepLink = async (event: { url: string }) => {
      console.log('[AppNavigator] Deep link received:', event.url);

      if (event.url.includes('auth/callback')) {
        // Extract tokens from hash fragment (after #)
        const hashPart = event.url.split('#')[1];
        if (!hashPart) {
          console.log('[AppNavigator] No hash fragment in URL');
          return;
        }

        // Parse the hash fragment as query parameters
        const params = new URLSearchParams(hashPart);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        console.log('[AppNavigator] OAuth callback tokens:', {
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token
        });

        if (access_token && refresh_token) {
          try {
            // Set the session using the tokens from the URL
            const { data, error } = await supabaseService.client.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              console.error('[AppNavigator] Error setting session:', error);
            } else {
              console.log('[AppNavigator] Session set successfully:', data.user?.email);
            }
          } catch (error) {
            console.error('[AppNavigator] Exception setting session:', error);
          }
        }
      }
    };

    // Listen for deep links when app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('[AppNavigator] Initial URL:', url);
        handleDeepLink({ url });
      }
    });

    // Cleanup listeners on unmount
    return () => {
      console.log('[AppNavigator] Cleaning up auth listener');
      authListener?.subscription?.unsubscribe();
      subscription?.remove();
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  const linking = {
    prefixes: ['hotpotato://'],
    config: {
      screens: {
        Login: 'auth/callback',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FF6B35',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Welcome to HotPotato' }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'HotPotato' }}
            />
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              options={{ title: 'Take Photo' }}
            />
            <Stack.Screen
              name="ItemDetection"
              component={ItemDetectionScreen}
              options={{ title: 'Verify Item' }}
            />
            <Stack.Screen
              name="ListingCreation"
              component={ListingCreationScreen}
              options={{ title: 'Create Listing' }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ title: 'My Listings' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
