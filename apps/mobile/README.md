# TrackMe Mobile App

React Native mobile application for iOS and Android time tracking.

## Features

- 📱 Manual activity logging
- 📊 View daily/weekly statistics
- 🔄 Sync with desktop app via Supabase
- ✅ Quick check-in templates
- 🎨 Beautiful, native UI

## Setup

### Prerequisites

- Node.js >= 18
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env and add your Supabase credentials

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Environment Variables

Create a `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Future Features

### iOS (Planned)
- Screen Time API integration
- Automatic app usage tracking
- Background tracking

### Android (Planned)
- UsageStatsManager integration
- Automatic app usage tracking
- Foreground service for tracking

## Current Limitations

Due to iOS and Android restrictions:
- ❌ Cannot automatically track all apps (OS limitation)
- ✅ Manual check-ins work perfectly
- ✅ Can view data from desktop app
- 🚧 Automatic tracking coming in future updates

## Tech Stack

- React Native / Expo
- TypeScript
- React Navigation
- Supabase (shared backend with desktop)
- Shared packages (@trackme/shared)

## Development

```bash
# Start Expo dev server
npm start

# Clear cache
npm start -- --clear

# Run on specific device
npm run ios -- --device "iPhone 15"
npm run android -- --device emulator-5554
```

## Building

```bash
# Build for iOS (requires Mac)
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

MIT
