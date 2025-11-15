# HotPotato Setup Guide

Follow these steps to get HotPotato up and running on your machine.

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] npm or yarn installed
- [ ] Code editor (VS Code recommended)
- [ ] Expo Go app installed on your phone (optional)

## Step 1: Install Dependencies

Open a terminal in the HotPotato directory and run:

```bash
npm install
```

This will install all required packages.

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill in the details:
   - **Name**: HotPotato (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine for development
6. Click "Create new project"
7. Wait 2-3 minutes for your project to be set up

### 2.2 Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** (gear icon)
2. Click on **API** in the left sidebar
3. Copy the following values:
   - **Project URL** (under "Project API keys")
   - **anon public** key (under "Project API keys")

### 2.3 Set Up Database

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### 2.4 Set Up Storage

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Enter bucket details:
   - **Name**: `listings`
   - **Public bucket**: Toggle ON (or configure policies as needed)
4. Click **Create bucket**

## Step 3: Set Up OpenRouter

### 3.1 Create OpenRouter Account

1. Go to [openrouter.ai](https://openrouter.ai)
2. Click "Sign In" or "Get Started"
3. Sign up with Google or email

### 3.2 Add Credits

1. Go to your OpenRouter dashboard
2. Click on "Credits" or "Billing"
3. Add at least $5 in credits (this will last a long time for testing)

### 3.3 Generate API Key

1. In OpenRouter dashboard, go to "API Keys"
2. Click "Create API Key"
3. Give it a name (e.g., "HotPotato Development")
4. Copy the API key (you won't be able to see it again!)

## Step 4: Configure Environment Variables

1. In the HotPotato project directory, locate the `.env` file
2. Open it in your code editor
3. Replace the placeholder values with your actual credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

4. Save the file

**IMPORTANT**: Never commit the `.env` file to git. It's already in `.gitignore`.

## Step 5: Verify Installation

Run a quick check to ensure everything is set up:

```bash
npm start
```

You should see:
- Expo DevTools open in your browser
- A QR code in the terminal
- No error messages about missing dependencies

If you see any errors, check the troubleshooting section below.

## Step 6: Run the App

### Option A: On Physical Device (Recommended)

1. Install "Expo Go" app on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Make sure your phone and computer are on the same WiFi network

3. Open Expo Go app

4. Scan the QR code from the terminal:
   - iOS: Use Camera app to scan
   - Android: Use Expo Go app to scan

5. The app should load on your device

### Option B: On Simulator/Emulator

**For iOS (Mac only)**:
```bash
npm run ios
```

**For Android**:
1. Start Android Studio
2. Open AVD Manager
3. Start an emulator
4. Run:
```bash
npm run android
```

## Step 7: Test the App

1. **Sign Up**
   - Open the app
   - Click "Sign Up"
   - Enter email and password
   - Click "Create Account"
   - You should be logged in

2. **Take a Photo**
   - Click "Take Photo" on home screen
   - Grant camera permissions when prompted
   - Take a photo of any item
   - Wait for AI detection (this may take 5-10 seconds)

3. **Verify Detection**
   - Check the detected item name
   - Edit if needed
   - Click "Generate Listing"

4. **Review Listing**
   - Check the AI-generated title and description
   - Verify the suggested price
   - Make any edits
   - Click "Save Listing"

5. **View History**
   - Go to "My Listings" from home screen
   - You should see your saved listing
   - Try copying it to clipboard

## Troubleshooting

### "Network request failed" or "CORS error"
- Check that your `.env` file has the correct Supabase URL
- Verify you're using the correct API keys
- Make sure your Supabase project is not paused

### "Insufficient credits" from OpenRouter
- Add more credits to your OpenRouter account
- Check your API key is correct

### Camera not working
- Grant camera permissions in device settings
- On iOS: Settings > HotPotato > Camera
- On Android: Settings > Apps > HotPotato > Permissions

### "Module not found" errors
- Delete `node_modules` folder
- Run `npm install` again
- Try `expo start -c` to clear cache

### Expo DevTools not opening
- Check if port 19000 is already in use
- Try running with a different port: `expo start --port 19001`

### Build errors on iOS
- Make sure you have Xcode installed (Mac only)
- Run `npx pod-install` in the ios folder (if it exists)

### Build errors on Android
- Make sure Android Studio is installed
- Verify ANDROID_HOME environment variable is set
- Check that you have Android SDK installed

## Next Steps

Once the app is running successfully:

1. **Customize the theme** in `src/theme/colors.ts`
2. **Add more features** from the README's "Future Enhancements" list
3. **Configure app icons** in `assets/` folder
4. **Set up app store listings** when ready to publish

## Getting Help

- Check the main [README.md](./README.md) for detailed documentation
- Review error messages carefully - they often contain solutions
- Search for errors on Stack Overflow or Expo forums
- Open an issue in the GitHub repository

## Important Security Notes

- Never commit `.env` file to version control
- Keep your API keys secret
- Use environment-specific API keys for production
- Enable MFA on your Supabase and OpenRouter accounts
- Regularly rotate your API keys

---

Congratulations! You're now ready to start developing with HotPotato! 🎉
