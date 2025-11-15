import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Clipboard,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Button, Input, Card } from '../components';
import { theme } from '../theme';
import { useAuthStore, useListingsStore } from '../store';
import supabaseService from '../services/supabase';

type ListingCreationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ListingCreation'
>;
type ListingCreationScreenRouteProp = RouteProp<RootStackParamList, 'ListingCreation'>;

interface ListingCreationScreenProps {
  navigation: ListingCreationScreenNavigationProp;
  route: ListingCreationScreenRouteProp;
}

const ListingCreationScreen: React.FC<ListingCreationScreenProps> = ({ navigation, route }) => {
  const { imageUri, detectedItem, aiGeneratedData } = route.params;
  const { user } = useAuthStore();
  const { addListing } = useListingsStore();

  const [title, setTitle] = useState(aiGeneratedData.title);
  const [description, setDescription] = useState(aiGeneratedData.description);
  const [price, setPrice] = useState(aiGeneratedData.suggestedPrice.toString());
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    return true;
  };

  const handleSaveListing = async () => {
    if (!validateForm() || !user) {
      return;
    }

    setIsSaving(true);

    // Upload image first
    const uploadResponse = await supabaseService.uploadImage(imageUri);

    if (!uploadResponse.success || !uploadResponse.data) {
      Alert.alert('Error', uploadResponse.error || 'Failed to upload image');
      setIsSaving(false);
      return;
    }

    // Create listing
    const success = await addListing({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image_url: uploadResponse.data,
      detected_item: detectedItem,
    });

    setIsSaving(false);

    if (success) {
      Alert.alert(
        'Success!',
        'Your listing has been saved! You can now copy it to any marketplace.',
        [
          {
            text: 'View Listings',
            onPress: () => navigation.navigate('History'),
          },
          {
            text: 'Create Another',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save listing. Please try again.');
    }
  };

  const handleCopyToClipboard = () => {
    const listingText = `${title}\n\nPrice: $${price}\n\n${description}`;
    Clipboard.setString(listingText);
    Alert.alert('Copied!', 'Listing has been copied to clipboard');
  };

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

            <View style={styles.aiLabel}>
              <Text style={styles.aiLabelText}>✨ AI Generated - Edit as needed</Text>
            </View>

            <Input
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter listing title"
              maxLength={80}
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter listing description"
              multiline
              numberOfLines={6}
              style={styles.descriptionInput}
            />

            <Input
              label="Price (USD)"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <View style={styles.actions}>
              <Button
                title="Save Listing"
                onPress={handleSaveListing}
                isLoading={isSaving}
                fullWidth
                size="large"
              />

              <Button
                title="Copy to Clipboard"
                onPress={handleCopyToClipboard}
                variant="outline"
                fullWidth
              />
            </View>
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
    height: 250,
  },
  aiLabel: {
    backgroundColor: theme.colors.info,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  aiLabelText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: theme.spacing.md,
  },
});

export default ListingCreationScreen;
