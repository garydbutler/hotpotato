import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../store';
import { LoadingSpinner } from '../components';

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
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
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
