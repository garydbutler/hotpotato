import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Convert image URI to base64 string
 * Handles both web and native platforms
 */
export const imageUriToBase64 = async (uri: string): Promise<string> => {
  if (Platform.OS === 'web') {
    // On web, fetch the blob and convert to base64
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Remove the data:image/...;base64, prefix
          const base64 = base64data.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to convert image to base64 on web');
    }
  } else {
    // On native, use FileSystem
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }
};

/**
 * Get image data URL for AI processing
 */
export const getImageDataUrl = async (uri: string): Promise<string> => {
  const base64 = await imageUriToBase64(uri);
  return `data:image/jpeg;base64,${base64}`;
};
