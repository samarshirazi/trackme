# TrackMe - Complete Setup Guide (Mobile + Desktop)

## 🎯 Overview

TrackMe now supports **both Desktop and Mobile** platforms!

### What's Included

**Desktop App (Electron)** ✅
- **Automatic tracking** - Monitors apps every 3 seconds
- **Smart check-ins** - When idle
- **100+ categorization rules**
- **System tray integration**
- **Platforms**: macOS, Windows, Linux

**Mobile App (React Native)** ✅
- **Manual activity logging**
- **Quick check-in templates**
- **View desktop activity**
- **Beautiful native UI**
- **Platforms**: iOS, Android

**Shared Backend (Supabase)**
- ✅ Both apps sync to same database
- ✅ Unified timeline across devices
- ✅ Real-time synchronization

---

## 📱 Mobile vs Desktop - What Gets Tracked?

### Desktop (Automatic) ✅
```
✅ Active applications (VSCode, Chrome, etc.)
✅ Window titles
✅ URLs (in browsers)
✅ File paths
✅ Idle time detection
✅ Auto-categorization
✅ Project detection
```

### Mobile (Manual + Future Automatic) 📱
```
✅ Manual check-ins (works now)
✅ Quick activity templates
✅ Custom activities
✅ View all activity (desktop + mobile)
🚧 Automatic app tracking (coming soon)
🚧 Screen Time API (iOS - planned)
🚧 UsageStats API (Android - planned)
```

---

## 🚀 Quick Start

### 1. Setup Supabase (One Time)

Both apps share the same backend:

1. Already done! Your Supabase project: `dozinjiiihlkmquouyop`
2. Database schema already created
3. Same credentials work for both apps

### 2. Setup Desktop App

```bash
cd apps/desktop
cp .env.example .env
# Edit .env with your Supabase credentials

# Install and run
cd ../..
npm install
npm run desktop
```

### 3. Setup Mobile App

```bash
cd apps/mobile
cp .env.example .env
# Edit .env with your Supabase credentials

# Install and run
npm install
npm start

# Then:
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

---

## 📊 Complete Daily View

With both apps, you get:

```
Your Complete Day:
├── 🖥️  Desktop (9am - 5pm): 8h 30m
│   ├── VSCode: 4h 15m (Development)
│   ├── Chrome: 2h 30m (Research)
│   ├── Slack: 1h 45m (Communication)
│
├── 📱 Mobile (5pm - 11pm): 3h 45m
│   ├── Instagram: 1h 15m (Social)
│   ├── YouTube: 1h 30m (Entertainment)
│   └── WhatsApp: 1h 00m (Communication)
│
├── ✏️  Manual Check-ins: 2h 15m
│   ├── Team Meeting: 1h 00m
│   ├── Lunch Break: 1h 00m
│   └── Gym: 15m

Total Tracked: 14h 30m
```

---

## 🎯 Typical Usage Flow

### Morning (Desktop)
1. Open laptop
2. TrackMe starts automatically
3. Tracks all work activities
4. Smart check-in if you took a break

### Evening (Mobile)
1. Open TrackMe mobile app
2. Quick log: "Gym - 60min"
3. View today's complete stats (desktop + mobile)
4. Check productivity score

### Throughout Day
- Desktop tracks automatically
- Mobile for manual entries
- Both sync instantly
- Unified dashboard

---

## 🔧 Setup Details

### Desktop Environment Variables

`apps/desktop/.env`:
```
VITE_SUPABASE_URL=https://dozinjiiihlkmquouyop.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Mobile Environment Variables

`apps/mobile/.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://dozinjiiihlkmquouyop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: Use the **same credentials** for both!

---

## 📱 Mobile App Limitations (Current)

Due to iOS and Android restrictions:

### iOS
- ❌ Cannot automatically track other apps (Apple policy)
- ✅ Can use Screen Time API (limited data, future)
- ✅ Manual check-ins work perfectly

### Android
- ⚠️ Can use UsageStatsManager (limited)
- ⚠️ Requires user permission
- ✅ Manual check-ins work perfectly

### Why Manual Entry Works Best (For Now)

1. **No permission hassles** - Just log and go
2. **Works on all platforms** - iOS and Android
3. **Quick templates** - Tap and done
4. **Better for personal time** - You control what's tracked
5. **Automatic tracking coming** - In future updates

---

## 🚀 Running Both Apps

### Terminal 1 - Desktop
```bash
npm run desktop
```

### Terminal 2 - Mobile
```bash
cd apps/mobile
npm start
```

Now you have:
- ✅ Desktop tracking work automatically
- ✅ Mobile for manual entries
- ✅ Both syncing to Supabase
- ✅ Unified dashboard

---

## 📊 Seeing Combined Data

### On Desktop
1. Open desktop app
2. View dashboard
3. See both desktop sessions AND mobile check-ins
4. All merged in timeline

### On Mobile
1. Open mobile app
2. View dashboard
3. See desktop activity from today
4. See your manual entries
5. Complete picture!

---

## 🎨 Features Comparison

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Automatic Tracking** | ✅ Every 3s | 🚧 Coming |
| **Manual Check-ins** | ✅ When idle | ✅ Anytime |
| **Activity Timeline** | ✅ Full | ✅ Full |
| **Productivity Score** | ✅ Yes | ✅ Yes |
| **Top Apps** | ✅ Yes | ✅ Yes |
| **Categories** | ✅ Auto | ✅ Manual |
| **Projects** | ✅ Auto-detect | ✅ Manual |
| **Offline Mode** | ✅ Cache | ✅ Cache |
| **Background** | ✅ System tray | 🚧 Coming |

---

## 💡 Best Practices

### Use Desktop For
- ✅ Work hours (automatic tracking)
- ✅ Computer-based activities
- ✅ Detailed app/project tracking

### Use Mobile For
- ✅ Personal time
- ✅ Activities away from computer
- ✅ Meetings, gym, commute
- ✅ Quick check-ins
- ✅ Viewing daily summary

### Manual Check-ins (Both)
- ✅ When away from both devices
- ✅ Meetings in conference rooms
- ✅ Phone calls
- ✅ Break activities

---

## 🔮 Future Updates

### Mobile Automatic Tracking (v1.1)

**iOS:**
- Screen Time API integration
- Daily app usage summaries
- Requires user permission

**Android:**
- UsageStatsManager integration
- Real-time app tracking
- Foreground service

### Desktop Enhancements (v1.1)
- Screenshot capture (optional)
- Website title tracking
- Improved idle detection
- Calendar integration

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview |
| [SETUP.md](SETUP.md) | Desktop setup |
| [apps/mobile/README.md](apps/mobile/README.md) | Mobile setup |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick commands |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Technical details |

---

## 🆘 Troubleshooting

### Both Apps Not Syncing
1. Check internet connection
2. Verify Supabase credentials match
3. Check Supabase dashboard for errors

### Mobile App Not Showing Desktop Data
1. Verify you're logged in with same account
2. Check date/time filters
3. Pull to refresh

### Desktop App Not Tracking
1. Check permissions (macOS Screen Recording)
2. Verify app is not paused (system tray)
3. Check Supabase connection

---

## ✅ Success Checklist

- [ ] Supabase database schema applied
- [ ] Desktop app installed and running
- [ ] Mobile app running on phone/simulator
- [ ] Both using same Supabase credentials
- [ ] Logged in with same account on both
- [ ] Can see desktop activity on mobile
- [ ] Can log mobile activities
- [ ] Both syncing properly

---

## 🎉 You're All Set!

You now have:
- ✅ **Automatic desktop tracking**
- ✅ **Manual mobile logging**
- ✅ **Unified timeline**
- ✅ **Complete daily picture**
- ✅ **Cross-platform sync**

**Track your time everywhere!** 🚀

---

## 📞 Need Help?

- Desktop issues: See [SETUP.md](SETUP.md)
- Mobile issues: See [apps/mobile/README.md](apps/mobile/README.md)
- Supabase: See [SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md)
- General: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
