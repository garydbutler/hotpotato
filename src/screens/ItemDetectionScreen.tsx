import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Button, Input, Card, LoadingSpinner, ErrorMessage } from '../components';
import { theme } from '../theme';
import openRouterService from '../services/openrouter';

type ItemDetectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ItemDetection'
>;
type ItemDetectionScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetection'>;

interface ItemDetectionScreenProps {
  navigation: ItemDetectionScreenNavigationProp;
  route: ItemDetectionScreenRouteProp;
}

const ItemDetectionScreen: React.FC<ItemDetectionScreenProps> = ({ navigation, route }) => {
  const { imageUri } = route.params;

  const [isDetecting, setIsDetecting] = useState(true);
  const [detectedItem, setDetectedItem] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    detectItem();
  }, []);

  const detectItem = async () => {
    setIsDetecting(true);
    setError('');

    const response = await openRouterService.detectItem(imageUri);

    if (response.success && response.data) {
      setDetectedItem(response.data.detectedItem);
      setConfidence(response.data.confidence);
      setIsDetecting(false);
    } else {
      setError(response.error || 'Failed to detect item');
      setIsDetecting(false);
    }
  };

  const handleGenerateListing = async () => {
    if (!detectedItem.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    setIsGenerating(true);

    const response = await openRouterService.generateListing(detectedItem.trim(), imageUri);

    setIsGenerating(false);

    if (response.success && response.data) {
      navigation.navigate('ListingCreation', {
        imageUri,
        detectedItem: detectedItem.trim(),
        aiGeneratedData: response.data,
      });
    } else {
      Alert.alert('Error', response.error || 'Failed to generate listing');
    }
  };

  if (isDetecting) {
    return <LoadingSpinner fullScreen message="Analyzing your item with AI..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Card style={styles.imageCard}>
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
            </Card>

            {error ? (
              <ErrorMessage message={error} onRetry={detectItem} />
            ) : (
              <>
                <Card style={styles.detectionCard}>
                  <Text style={styles.detectionTitle}>AI Detection Result</Text>

                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceLabel}>Confidence:</Text>
                    <View style={styles.confidenceBar}>
                      <View
                        style={[
                          styles.confidenceFill,
                          { width: `${confidence}%` },
                          confidence >= 70 && styles.confidenceHigh,
                          confidence >= 40 && confidence < 70 && styles.confidenceMedium,
                          confidence < 40 && styles.confidenceLow,
                        ]}
                      />
                    </View>
                    <Text style={styles.confidenceText}>{confidence}%</Text>
                  </View>

                  <Input
                    label="Item Name"
                    value={detectedItem}
                    onChangeText={setDetectedItem}
                    placeholder="e.g., iPhone 13 Pro"
                  />

                  <Text style={styles.helpText}>
                    Review the detected item name above. You can edit it if needed.
                  </Text>
                </Card>

                <Button
                  title="Generate Listing"
                  onPress={handleGenerateListing}
                  isLoading={isGenerating}
                  fullWidth
                  size="large"
                />

                <Button
                  title="Retake Photo"
                  onPress={() => navigation.goBack()}
                  variant="outline"
                  fullWidth
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  imageCard: {
    padding: 0,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
  },
  detectionCard: {
    marginBottom: theme.spacing.md,
  },
  detectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  confidenceContainer: {
    marginBottom: theme.spacing.lg,
  },
  confidenceLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  confidenceHigh: {
    backgroundColor: theme.colors.success,
  },
  confidenceMedium: {
    backgroundColor: theme.colors.warning,
  },
  confidenceLow: {
    backgroundColor: theme.colors.error,
  },
  confidenceText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
});

export default ItemDetectionScreen;
