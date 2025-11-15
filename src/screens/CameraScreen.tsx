import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button, LoadingSpinner, Card } from '../components';
import { theme } from '../theme';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

interface CameraScreenProps {
  navigation: CameraScreenNavigationProp;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to select photos!'
          );
        }
      }
    })();
  }, []);

  // On web, show image picker interface instead of camera
  if (Platform.OS === 'web') {
    const pickImageWeb = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          navigation.navigate('ItemDetection', { imageUri: result.assets[0].uri });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webContainer}>
          <Card style={styles.webCard}>
            <Text style={styles.webIcon}>📸</Text>
            <Text style={styles.webTitle}>Select Image</Text>
            <Text style={styles.webText}>
              Camera is not available on web. Please select an image from your computer.
            </Text>
            <Button
              title="Choose Image"
              onPress={pickImageWeb}
              size="large"
              fullWidth
            />
            <Button
              title="Back to Home"
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
            />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  if (!cameraPermission) {
    return <LoadingSpinner fullScreen message="Loading camera..." />;
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>📸</Text>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            HotPotato needs access to your camera to take photos of items you want to sell.
          </Text>
          <Button title="Grant Permission" onPress={requestCameraPermission} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
        });
        navigation.navigate('ItemDetection', { imageUri: photo.uri });
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        navigation.navigate('ItemDetection', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={setCameraRef}>
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
              <Text style={styles.iconButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text style={styles.galleryButtonText}>🖼️</Text>
              <Text style={styles.galleryButtonLabel}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.text.primary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  permissionIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  permissionTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 24,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
  },
  galleryButton: {
    alignItems: 'center',
  },
  galleryButtonText: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  galleryButtonLabel: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.text.inverse,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  placeholder: {
    width: 60,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  webCard: {
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
  },
  webIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  webTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  webText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});

export default CameraScreen;
