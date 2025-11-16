import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button, Card } from '../components';
import { theme } from '../theme';
import { useAuthStore } from '../store';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <Card style={styles.heroCard}>
            <Text style={styles.heroIcon}>📸</Text>
            <Text style={styles.heroTitle}>Create Your Listing</Text>
            <Text style={styles.heroSubtitle}>
              Take a photo and let AI generate an amazing listing description for you!
            </Text>
            <Button
              title="Take Photo"
              onPress={() => navigation.navigate('Camera')}
              size="large"
              fullWidth
            />
          </Card>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('History')}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>My Listings</Text>
                <Text style={styles.actionSubtitle}>View and manage your listings</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>How it Works</Text>

            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>1</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Take a Photo</Text>
                <Text style={styles.featureText}>
                  Snap a picture of the item you want to sell
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>2</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI Detection</Text>
                <Text style={styles.featureText}>
                  Our AI identifies the item and you can correct it if needed
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>3</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Perfect Listing</Text>
                <Text style={styles.featureText}>
                  Get an AI-generated title, description, and price suggestion
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>4</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Save & Share</Text>
                <Text style={styles.featureText}>
                  Save your listing and copy it to any marketplace
                </Text>
              </View>
            </View>
          </View>

          <Button title="Sign Out" onPress={handleSignOut} variant="outline" fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  heroCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  quickActions: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
    marginBottom: theme.spacing.sm,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  actionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  actionArrow: {
    fontSize: 24,
    color: theme.colors.text.disabled,
  },
  featuresSection: {
    marginBottom: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  featureNumber: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    lineHeight: 32,
    marginRight: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  featureText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});

export default HomeScreen;
