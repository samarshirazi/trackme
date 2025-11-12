# TrackMe Setup Guide

This guide will walk you through setting up the TrackMe time tracking application.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- A Supabase account (free tier is fine)

## Step 1: Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (desktop app, mobile app, shared packages).

## Step 2: Setup Supabase

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Note down your project URL and anon key

### 2.2 Setup Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the contents of `packages/database/schema.sql`
3. Paste and run the SQL in the editor
4. This will create all necessary tables, indexes, and Row Level Security policies

### 2.3 Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Enable Email authentication
3. Configure email templates if desired
4. For development, you may want to disable email confirmation

## Step 3: Configure Desktop App

1. Navigate to `apps/desktop/`
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Run the Desktop App

### Development Mode

```bash
npm run desktop
```

This will start the Vite development server and launch the Electron app.

### Build for Production

```bash
cd apps/desktop
npm run build
```

This will create distributable packages in `apps/desktop/release/`.

## Step 5: First Time Usage

1. Launch the app
2. Sign up with your email and password
3. Check your email for confirmation (if enabled)
4. Sign in
5. The app will start tracking automatically!

## Permissions Required

### macOS

The app requires the following permissions:

- **Screen Recording**: To detect active windows and applications
- **Accessibility**: To monitor keyboard/mouse activity for idle detection

You'll be prompted to grant these on first launch.

### Windows

No special permissions required.

### Linux

The app uses `xdotool` for window detection. Install it:

```bash
# Ubuntu/Debian
sudo apt-get install xdotool

# Fedora
sudo dnf install xdotool

# Arch
sudo pacman -S xdotool
```

## Features

### Automatic Tracking

- The app runs in the system tray
- It automatically tracks your active applications and windows
- Activities are categorized automatically
- Data syncs to Supabase in real-time

### Smart Check-Ins

- When you return after being idle (default: 15+ minutes), you'll be prompted
- Select from quick options or type a custom activity
- Check-ins are stored alongside automatic tracking

### Dashboard

- View today's or this week's activity
- See top apps, productivity score, and timeline
- All data is private and encrypted

## Troubleshooting

### "active-win" errors on macOS

Make sure you've granted Screen Recording permission:
1. System Preferences > Security & Privacy > Privacy > Screen Recording
2. Add the Electron app or Terminal (for development)
3. Restart the app

### Database connection errors

- Verify your `.env` file has the correct Supabase URL and key
- Check that the database schema has been applied
- Ensure RLS policies are enabled

### App not starting

- Check the console for errors
- Ensure Node.js version is >= 18
- Try removing `node_modules` and reinstalling: `rm -rf node_modules && npm install`

## Architecture

```
TrackMe/
├── apps/
│   └── desktop/          # Electron + React app
│       ├── electron/     # Main process (activity monitoring, system tray)
│       └── src/          # Renderer process (UI)
├── packages/
│   ├── shared/           # Shared types and utilities
│   └── database/         # Supabase schema
```

## Development Tips

### Hot Reload

The app supports hot reload in development mode. Changes to React components will update automatically.

### Debugging

- Main process logs: Check the terminal where you ran `npm run desktop`
- Renderer process: Use DevTools (opens automatically in dev mode)

### Database Changes

If you modify the schema:
1. Update `packages/database/schema.sql`
2. Run the SQL in Supabase SQL Editor
3. Update TypeScript types in `packages/shared/src/types/index.ts`

## Next Steps

- Configure check-in settings in the Settings tab
- Customize work hours for better productivity scoring
- Explore the dashboard to understand your time usage
- Set up the mobile app (coming soon) for complete coverage

## Support

For issues or questions:
- Check the GitHub Issues
- Read the documentation
- Join our Discord community

## License

MIT License - see LICENSE file for details
