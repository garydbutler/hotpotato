import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Listing } from '../types';
import { Card, LoadingSpinner, ErrorMessage } from '../components';
import { theme } from '../theme';
import { useAuthStore, useListingsStore } from '../store';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { listings, isLoading, error, fetchListings, deleteListing } = useListingsStore();

  useEffect(() => {
    if (user) {
      fetchListings(user.id);
    }
  }, [user]);

  const handleCopyListing = (listing: Listing) => {
    const listingText = `${listing.title}\n\nPrice: $${listing.price}\n\n${listing.description}`;
    Clipboard.setString(listingText);
    Alert.alert('Copied!', 'Listing has been copied to clipboard');
  };

  const handleDeleteListing = (listing: Listing) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteListing(listing.id);
            if (!success) {
              Alert.alert('Error', 'Failed to delete listing');
            }
          },
        },
      ]
    );
  };

  const renderListing = ({ item }: { item: Listing }) => (
    <Card style={styles.listingCard}>
      <View style={styles.listingContent}>
        <Image source={{ uri: item.image_url }} style={styles.listingImage} resizeMode="cover" />

        <View style={styles.listingDetails}>
          <Text style={styles.listingTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.listingPrice}>${item.price.toFixed(2)}</Text>

          <Text style={styles.listingDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.listingActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCopyListing(item)}
            >
              <Text style={styles.actionButtonText}>📋 Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteListing(item)}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  if (isLoading && listings.length === 0) {
    return <LoadingSpinner fullScreen message="Loading your listings..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => user && fetchListings(user.id)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Listings Yet</Text>
          <Text style={styles.emptyText}>
            Create your first listing by taking a photo of an item you want to sell!
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.createButtonText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={() => user && fetchListings(user.id)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  listingCard: {
    marginBottom: theme.spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  listingContent: {
    flexDirection: 'row',
  },
  listingImage: {
    width: 120,
    height: 120,
  },
  listingDetails: {
    flex: 1,
    padding: theme.spacing.md,
  },
  listingTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  listingPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  listingDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  listingActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  deleteButtonText: {
    color: theme.colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default HistoryScreen;
