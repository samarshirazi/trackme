# TrackMe - Quick Reference Card

## 🚀 Getting Started (5 Minutes)

### 1. Install
```bash
npm install
```

### 2. Supabase Setup
1. Go to https://supabase.com → Create project
2. Copy `packages/database/schema.sql` to SQL Editor → Run
3. Get URL & Key from Settings → API
4. Add to `apps/desktop/.env`

### 3. Run
```bash
npm run desktop
```

## 📱 Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run desktop` | Run desktop app (dev mode) |
| `npm run shared` | Build shared package |
| `cd apps/desktop && npm run build` | Build for production |

## 🎯 Key Features

### Automatic Tracking
- ✅ Monitors every 3 seconds
- ✅ Auto-categorizes apps
- ✅ Detects idle time (5+ min)
- ✅ Syncs every 30 seconds

### Smart Check-Ins
- ⏰ Triggers after 15+ min idle (configurable)
- 💡 Smart suggestions based on time/duration
- ⏭️ Can skip or snooze (30 min)

### Categories
- 🟢 Development (95): VSCode, IntelliJ, GitHub
- 🟣 Communication (70): Slack, Teams, Email
- 🔵 Meeting (75): Zoom, Google Meet
- 🟡 Administrative (60): Email, Paperwork
- ⚪ Break (0): Lunch, Coffee
- 🔴 Entertainment (20): YouTube, Netflix

## 🔧 Configuration

### Environment Variables
```bash
# apps/desktop/.env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### Check-In Settings (Defaults)
- Idle threshold: 15 minutes
- Periodic interval: 2 hours (disabled by default)
- Notification method: popup
- Remember activities: true

## 🎨 Dashboard Tabs

### Today
- Total time tracked
- Productive time (score >= 70)
- Productivity percentage
- Top 5 apps
- Recent activity timeline

### Week
- Same as Today but for current week (Mon-Sun)

### Settings
- Check-in configuration
- Privacy settings
- About information

## 🔒 Privacy

- ✅ All data encrypted (HTTPS)
- ✅ Row Level Security (your eyes only)
- ✅ Local processing (categorization on device)
- ✅ Pause tracking anytime
- ✅ Can disable URL/title tracking

## 🐛 Troubleshooting

### macOS Permission Denied
```
System Preferences → Security & Privacy
→ Privacy → Screen Recording
→ Add Electron/Terminal
→ Restart app
```

### Database Error
- Check `.env` has correct Supabase URL & key
- Verify `schema.sql` was run successfully
- Check RLS policies are enabled

### App Won't Start
```bash
rm -rf node_modules
npm install
```

### No Activities Showing
- Check if tracking is paused (system tray)
- Verify Supabase connection
- Check browser console for errors

## 📊 Data Structure

### Automatic Tracking
```typescript
{
  app_name: "Visual Studio Code",
  window_title: "main.ts - VSCode",
  category: "Development",
  productivity_score: 95,
  duration_seconds: 3600
}
```

### Manual Check-In
```typescript
{
  activity_type: "Team Meeting",
  category: "Meeting",
  productivity_score: 75,
  duration_minutes: 60,
  is_meeting: true
}
```

## 🎯 Productivity Scoring

| Score | Category | Examples |
|-------|----------|----------|
| 90-100 | Highly Productive | Development, Design |
| 70-89 | Productive | Communication, Meetings |
| 50-69 | Neutral | Email, Admin |
| 20-49 | Low Productivity | Browsing, News |
| 0-19 | Unproductive | Social Media, Entertainment |

## 🔗 Useful Links

- 📚 [Full Setup Guide](./SETUP.md)
- 📖 [Project Summary](./PROJECT_SUMMARY.md)
- 💾 [Database Schema](./packages/database/schema.sql)
- 🌐 [Supabase Dashboard](https://supabase.com)

## 💡 Tips

1. **First Day**: Just let it run! Review dashboard in the evening
2. **Check-Ins**: Be honest - it helps improve productivity insights
3. **Categories**: Edit in Settings if auto-categorization is wrong
4. **Privacy**: Pause before sharing screen
5. **Patterns**: Look for time sinks after a week of data

## 🆘 Support

- 🐛 Issues: GitHub Issues
- 📧 Questions: Check SETUP.md
- 💬 Community: Discord (coming soon)

## 📈 What to Track Next

After a week of data:
1. Review top time-consuming apps
2. Check productivity trends
3. Identify time sinks
4. Set goals for improvement
5. Customize categories for your workflow

---

**Version**: 1.0.0
**License**: MIT
**Made with**: ❤️ and TypeScript
