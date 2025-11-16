# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HotPotato is a React Native mobile app (iOS/Android) that uses AI to help users create marketplace listings. Users take photos of items, and the app uses GPT-4 Vision (via OpenRouter) to detect items, generate titles/descriptions, and suggest prices.

## Development Commands

### Running the App

```bash
# Start development server with tunnel (default)
npm start

# Run on iOS (Mac only)
npm run ios

# Run on Android (requires Android Studio setup)
npm run android

# Run on web (limited functionality)
npm run web

# Clear cache and start fresh
npx expo start --clear
```

### Build Commands

For Android builds on Windows, ensure environment variables are set:
```bash
export JAVA_HOME="C:/Program Files/Java/jdk-17"
export ANDROID_HOME="C:/Users/[USERNAME]/AppData/Local/Android/Sdk"
npx expo run:android
```

## Environment Setup

The app requires a `.env` file (copy from `.env.example`) with:
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` - Supabase project credentials
- `OPENROUTER_API_KEY` - OpenRouter API key for AI features
- `OPENROUTER_MODEL` - AI model to use (default: `google/gemini-2.0-flash-exp:free`)

Environment variables are loaded via `app.config.js` using `dotenv` and accessed through `expo-constants` in `src/config/env.ts`.

## Architecture

### State Management - Zustand Stores

The app uses Zustand for global state with two main stores:

1. **authStore** (`src/store/authStore.ts`) - Manages authentication state
   - Handles sign in/up/out operations
   - Tracks current user and authentication status
   - Listens to Supabase auth state changes

2. **listingsStore** (`src/store/listingsStore.ts`) - Manages listing data
   - CRUD operations for listings
   - Local cache of user's listings
   - Syncs with Supabase database

### Navigation Flow

Stack-based navigation (`src/navigation/AppNavigator.tsx`) with conditional rendering:

**Unauthenticated Stack:**
- Login → Signup

**Authenticated Stack:**
- Home → Camera → ItemDetection → ListingCreation
- Home → History

Navigation uses React Navigation Native Stack Navigator. Auth state from `authStore` determines which stack renders.

### Service Layer Architecture

**SupabaseService** (`src/services/supabase.ts`)
- Singleton service for all Supabase interactions
- Handles auth (signIn, signUp, signOut, getCurrentUser)
- Manages image uploads to Supabase Storage
- CRUD operations for listings table
- Auth state listener for real-time auth changes

**OpenRouterService** (`src/services/openrouter.ts`)
- Singleton service for AI/vision API calls
- `detectItem()` - Analyzes image, returns item name + confidence
- `generateListing()` - Creates title, description, price from image + item name
- Converts images to base64 data URLs for API transmission
- Parses JSON responses from AI model

### Image Handling

Image utilities (`src/utils/imageUtils.ts`) provide platform-aware image processing:
- `imageUriToBase64()` - Converts image URIs to base64 (web uses Blob API, native uses FileSystem)
- `getImageDataUrl()` - Creates data URLs for AI vision APIs

Images are captured via `expo-camera` or `expo-image-picker`, processed locally, then uploaded to Supabase Storage.

### Data Flow for Creating Listings

1. User takes photo (CameraScreen)
2. Image passed to ItemDetectionScreen → calls OpenRouterService.detectItem()
3. User verifies/edits detected item name
4. ItemDetectionScreen → ListingCreationScreen with image + item name
5. ListingCreationScreen calls OpenRouterService.generateListing()
6. User edits generated title/description/price
7. Save uploads image to Supabase Storage via SupabaseService.uploadImage()
8. Create listing record via SupabaseService.createListing()
9. Update listingsStore and navigate to Home

### Database Schema

The Supabase `listings` table structure:
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- title: TEXT
- description: TEXT
- price: DECIMAL(10, 2)
- image_url: TEXT
- detected_item: TEXT
- confidence: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

Row Level Security (RLS) policies ensure users can only access their own listings.

### TypeScript Types

All types defined in `src/types/index.ts`:
- Database types: `User`, `Listing`
- AI types: `AIDetectionResult`, `AIGeneratedListing`
- Navigation: `RootStackParamList` (typed navigation params)
- API: `ApiResponse<T>` (standard response wrapper)
- OpenRouter: `OpenRouterRequest`, `OpenRouterResponse`

## Platform-Specific Considerations

### Permissions
- Camera/photo library permissions configured in `app.config.js`
- iOS: NSCameraUsageDescription, NSPhotoLibraryUsageDescription
- Android: CAMERA, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE

### Image Processing
- Web platform uses Blob API and FileReader
- Native platforms use expo-file-system
- Both paths converge to base64 for AI API calls

## Common Issues

### API Key Errors
- Verify `.env` file exists and contains valid keys
- Ensure OpenRouter account has credits
- Check Supabase project is active and URL/key match

### Android Build Issues
- On Windows, must set JAVA_HOME and ANDROID_HOME before building
- Use JDK 17 (not 18+)
- Ensure Android SDK is installed via Android Studio

### Auth State Not Persisting
- Auth state listener is set up in AppNavigator useEffect
- Supabase session persists automatically
- Check console logs with `[AuthStore]` and `[Supabase]` prefixes for debugging

### Image Upload Failures
- Images must be converted to base64 before upload
- Check Supabase Storage bucket exists and has proper policies
- Verify bucket name matches in SupabaseService.uploadImage() (default: 'listings')

## Supabase Setup Requirements

New Supabase projects need:
1. Create `listings` table with schema above
2. Enable RLS on `listings` table
3. Add RLS policies for SELECT, INSERT, UPDATE, DELETE (user_id = auth.uid())
4. Create Storage bucket named `listings`
5. Configure bucket policies (public or authenticated access)
