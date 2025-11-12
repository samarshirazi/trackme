# TrackMe Quick Start

## 1. Install Dependencies

```bash
npm install
```

## 2. Setup Supabase

1. Create account at https://supabase.com
2. Create a new project
3. Go to SQL Editor and run the schema from `packages/database/schema.sql`
4. Get your project URL and anon key from Settings > API

## 3. Configure Environment

```bash
cd apps/desktop
cp .env.example .env
# Edit .env and add your Supabase credentials
```

## 4. Run the App

```bash
cd ../..
npm run desktop
```

## 5. Create Account

1. Sign up in the app
2. Start tracking automatically!

## What Gets Tracked?

- **Desktop**: Active applications, window titles, time spent
- **Manual Check-ins**: Activities when away from computer
- **Categories**: Auto-categorized as Development, Communication, etc.
- **Productivity Score**: Calculated based on activity type

## Privacy

- All data is encrypted
- Only you can see your data (enforced by Supabase RLS)
- Sensitive window titles can be filtered
- Can pause tracking anytime

## Tips

- The app runs in your system tray
- Green dot = actively tracking
- Yellow dot = paused
- Check dashboard to see your day!
