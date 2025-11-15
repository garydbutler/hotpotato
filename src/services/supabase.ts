import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import env from '../config/env';
import { Listing, User, ApiResponse } from '../types';
import { imageUriToBase64 } from '../utils/imageUtils';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      throw new Error('Supabase credentials are not configured');
    }

    this.client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }

  // Authentication Methods
  async signUp(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'No user data returned' };
      }

      return {
        success: true,
        data: {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      };
    }
  }

  async signIn(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'No user data returned' };
      }

      return {
        success: true,
        data: {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      };
    }
  }

  async signOut(): Promise<ApiResponse<null>> {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser();

      if (error || !user) {
        return { success: false, error: 'No authenticated user' };
      }

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user',
      };
    }
  }

  // Storage Methods
  async uploadImage(uri: string, bucket: string = 'listings'): Promise<ApiResponse<string>> {
    try {
      const user = await this.getCurrentUser();
      if (!user.success || !user.data) {
        return { success: false, error: 'User must be authenticated to upload images' };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${user.data.id}/${timestamp}.jpg`;

      // Read file as base64 (platform-aware)
      const base64 = await imageUriToBase64(uri);

      // Convert base64 to blob
      const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      // Upload to Supabase storage
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(filename, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = this.client.storage.from(bucket).getPublicUrl(data.path);

      return { success: true, data: publicUrl };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image upload failed',
      };
    }
  }

  // Listing Methods
  async createListing(listing: Omit<Listing, 'id' | 'created_at'>): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await this.client
        .from('listings')
        .insert([listing])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create listing',
      };
    }
  }

  async getListings(userId: string): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await this.client
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get listings',
      };
    }
  }

  async deleteListing(listingId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await this.client.from('listings').delete().eq('id', listingId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete listing',
      };
    }
  }
}

export default new SupabaseService();
