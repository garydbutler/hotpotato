require('dotenv').config();

export default {
  expo: {
    name: 'HotPotato',
    slug: 'HotPotato',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    owner: process.env.EXPO_ACCOUNT_OWNER || undefined,
    scheme: 'hotpotato',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription:
          'HotPotato needs access to your camera to take photos of items you want to sell.',
        NSPhotoLibraryUsageDescription:
          'HotPotato needs access to your photo library to select photos of items you want to sell.',
      },
      bundleIdentifier: 'com.hotpotato.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
      package: 'com.hotpotato.app',
    },
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
      eas: {
        projectId: '9370730b-5814-42ce-8a3b-2d495e4e403d',
      },
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission:
            'HotPotato needs access to your camera to take photos of items you want to sell.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'HotPotato needs access to your photo library to select photos of items you want to sell.',
        },
      ],
      'expo-web-browser',
    ],
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      enabled: false,
      fallbackToCacheTimeout: 0,
    },
  },
};
