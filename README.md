# HotPotato 🔥🥔

HotPotato is a cross-platform mobile app that helps users create compelling marketplace listings using AI. Take a photo of any item, and HotPotato will automatically detect what it is, generate an attractive title and description, and suggest a fair price.

## Features

- 📸 **Camera Integration** - Take photos directly in the app or select from your gallery
- 🤖 **AI-Powered Detection** - Automatically identifies items in photos using GPT-4 Vision
- ✍️ **Smart Listing Generation** - Creates optimized titles, descriptions, and price suggestions
- 📋 **Listing Management** - Save and manage all your listings in one place
- 📱 **Cross-Platform** - Works on both iOS and Android
- 🔐 **User Authentication** - Secure user accounts with Supabase
- 💾 **Cloud Storage** - Images stored securely in Supabase Storage

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Supabase (Authentication, Database, Storage)
- **AI**: OpenRouter API (AI-agnostic, currently using GPT-4 Vision)
- **State Management**: Zustand
- **Navigation**: React Navigation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio for Android development
- Expo Go app on your physical device (optional)

## Installation

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd HotPotato
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your API keys:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

## Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key to the `.env` file

2. **Create Database Tables**

   Run the following SQL in the Supabase SQL editor:

   ```sql
   -- Create listings table
   CREATE TABLE listings (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     image_url TEXT NOT NULL,
     detected_item TEXT NOT NULL,
     confidence INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view their own listings"
     ON listings FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can create their own listings"
     ON listings FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own listings"
     ON listings FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own listings"
     ON listings FOR DELETE
     USING (auth.uid() = user_id);
   ```

3. **Create Storage Bucket**
   - Go to Storage in Supabase dashboard
   - Create a new bucket called `listings`
   - Make it public or configure appropriate policies

## OpenRouter Setup

1. **Get an API Key**
   - Go to [openrouter.ai](https://openrouter.ai)
   - Sign up for an account
   - Generate an API key
   - Add credits to your account
   - Copy the API key to your `.env` file

## Running the App

### Development Mode

Start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools in your browser. From there, you can:

- Press `i` to open in iOS Simulator (Mac only)
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your physical device

### Specific Platforms

Run on iOS:
```bash
npm run ios
```

Run on Android:
```bash
npm run android
```

Run on Web (limited functionality):
```bash
npm run web
```

## Project Structure

```
HotPotato/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── config/           # App configuration
│   │   └── env.ts
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/          # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── ItemDetectionScreen.tsx
│   │   ├── ListingCreationScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── services/         # API services
│   │   ├── supabase.ts
│   │   └── openrouter.ts
│   ├── store/            # State management
│   │   ├── authStore.ts
│   │   └── listingsStore.ts
│   ├── theme/            # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── app.config.js         # Expo configuration
├── App.tsx               # App entry point
├── package.json
└── tsconfig.json
```

## Usage Guide

### Creating a Listing

1. **Sign Up / Login**
   - Create a new account or log in with existing credentials

2. **Take a Photo**
   - Tap "Take Photo" on the home screen
   - Either capture a new photo or select from your gallery
   - Grant camera/photo permissions when prompted

3. **Verify Item Detection**
   - The AI will analyze the photo and detect the item
   - Review the detected item name
   - Edit if needed to be more specific

4. **Generate Listing**
   - Tap "Generate Listing"
   - AI will create a title, description, and price suggestion

5. **Edit and Save**
   - Review and edit the generated content
   - Adjust the price if needed
   - Tap "Save Listing" to save to your history

6. **Use Your Listing**
   - Copy the listing to clipboard
   - Paste into Facebook Marketplace, eBay, Craigslist, etc.

## Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted in your device settings
- On iOS: Settings > HotPotato > Camera
- On Android: Settings > Apps > HotPotato > Permissions

### API Errors
- Check that your `.env` file has the correct API keys
- Ensure you have credits in your OpenRouter account
- Verify your Supabase project is active

### Build Errors
- Try clearing cache: `expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure all peer dependencies are installed

## Future Enhancements

- [ ] Direct posting to marketplaces (Facebook, eBay)
- [ ] Pricing analytics based on similar items
- [ ] Multiple photo support
- [ ] Barcode/QR code scanning
- [ ] Custom AI model training on user's items
- [ ] Listing templates
- [ ] Analytics dashboard
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Expo team for the amazing framework
- Supabase for the backend infrastructure
- OpenRouter for AI API access
- The React Native community

---

Made with ❤️ using React Native and AI
