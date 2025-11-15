import { create } from 'zustand';
import { Listing } from '../types';
import supabaseService from '../services/supabase';

interface ListingsState {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchListings: (userId: string) => Promise<void>;
  addListing: (listing: Omit<Listing, 'id' | 'created_at'>) => Promise<boolean>;
  deleteListing: (listingId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  isLoading: false,
  error: null,

  fetchListings: async (userId: string) => {
    set({ isLoading: true, error: null });

    const response = await supabaseService.getListings(userId);

    if (response.success && response.data) {
      set({
        listings: response.data,
        isLoading: false,
        error: null,
      });
    } else {
      set({
        error: response.error || 'Failed to fetch listings',
        isLoading: false,
      });
    }
  },

  addListing: async (listing: Omit<Listing, 'id' | 'created_at'>) => {
    set({ isLoading: true, error: null });

    const response = await supabaseService.createListing(listing);

    if (response.success && response.data) {
      set((state) => ({
        listings: [response.data!, ...state.listings],
        isLoading: false,
        error: null,
      }));
      return true;
    } else {
      set({
        error: response.error || 'Failed to create listing',
        isLoading: false,
      });
      return false;
    }
  },

  deleteListing: async (listingId: string) => {
    set({ isLoading: true, error: null });

    const response = await supabaseService.deleteListing(listingId);

    if (response.success) {
      set((state) => ({
        listings: state.listings.filter((l) => l.id !== listingId),
        isLoading: false,
        error: null,
      }));
      return true;
    } else {
      set({
        error: response.error || 'Failed to delete listing',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
