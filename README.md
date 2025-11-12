# TrackMe - Automated Time Tracking

<div align="center">

![TrackMe Logo](https://img.shields.io/badge/TrackMe-Time%20Tracker-blue?style=for-the-badge)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**An intelligent, cross-platform time tracking application that automatically monitors your activities with minimal user input.**

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🤖 Fully Automated Tracking
- **Zero-Touch Monitoring** - Tracks active applications every 3 seconds
- **Smart Idle Detection** - Automatically pauses when away from computer
- **Intelligent Categorization** - 100+ pre-built rules for automatic categorization
- **Project Detection** - Auto-detects projects from window titles and file paths

### 📋 Smart Check-Ins
- **Context-Aware Prompts** - Asks what you did when returning from idle
- **Quick-Select Options** - Pre-configured activity templates
- **Time-Based Suggestions** - Smart suggestions based on time of day and duration
- **Flexible Input** - Custom activities or quick selections

### 📊 Beautiful Analytics
- **Real-Time Dashboard** - See today's or this week's activity
- **Productivity Scoring** - Automatic scoring based on activity type
- **Top Apps Breakdown** - Visual charts of app usage
- **Activity Timeline** - Chronological view of your day

### 🔒 Privacy-First Design
- **Local Processing** - Categorization happens on your device
- **End-to-End Encryption** - All data encrypted in transit
- **Row Level Security** - Database-level data isolation
- **You Own Your Data** - Easy export and deletion

### 🌐 Multi-Platform
- ✅ **Desktop** - macOS, Windows, Linux (Electron)
- 🚧 **Mobile** - iOS & Android (Coming Soon)
- ☁️ **Cloud Sync** - Real-time sync via Supabase

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0
- [Supabase](https://supabase.com/) account (free tier works!)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/trackMe.git
cd trackMe

# Install dependencies
npm install

# Setup environment
cd apps/desktop
cp .env.example .env
# Edit .env and add your Supabase credentials

# Run the app
cd ../..
npm run desktop
```

### Detailed Setup

See [SETUP.md](SETUP.md) for detailed installation instructions, including:
- Supabase project setup
- Database schema application
- Platform-specific permissions
- Troubleshooting guide

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](SETUP.md) | Complete installation and setup guide |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick commands and tips |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Technical architecture overview |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to the project |
| [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) | Setup verification steps |

---

## 🏗️ Project Structure

```
trackme/
├── apps/
│   └── desktop/              # Electron + React desktop app
│       ├── electron/         # Main process (activity monitoring)
│       │   ├── main.ts
│       │   └── services/
│       │       ├── ActivityMonitor.ts
│       │       ├── CheckInService.ts
│       │       ├── CategorizationEngine.ts
│       │       └── SupabaseService.ts
│       └── src/              # Renderer process (React UI)
│           └── components/
├── packages/
│   ├── shared/               # Shared TypeScript types & utilities
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   └── database/             # Supabase SQL schema
│       └── schema.sql
└── scripts/                  # Build and utility scripts
```

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center"><b>Frontend</b></td>
    <td align="center"><b>Backend</b></td>
    <td align="center"><b>Tools</b></td>
  </tr>
  <tr>
    <td>
      • Electron<br>
      • React<br>
      • TypeScript<br>
      • Tailwind CSS<br>
      • Vite
    </td>
    <td>
      • Supabase<br>
      • PostgreSQL<br>
      • Row Level Security<br>
      • Real-time Subscriptions
    </td>
    <td>
      • active-win<br>
      • Zustand<br>
      • Recharts<br>
      • electron-store
    </td>
  </tr>
</table>

---

## 🎯 Key Features Explained

### Automatic Categorization

TrackMe includes 100+ pre-built categorization rules:

| Category | Apps | Productivity Score |
|----------|------|-------------------|
| 🟢 Development | VSCode, IntelliJ, Terminal, GitHub | 90-95 |
| 🔵 Communication | Slack, Teams, Email | 60-70 |
| 🟣 Meeting | Zoom, Google Meet | 75 |
| 🟡 Design | Figma, Photoshop | 90 |
| 🔴 Entertainment | YouTube, Netflix | 10-20 |

### Smart Check-Ins

When you return after being idle (default: 15+ minutes), TrackMe prompts you with:

- ☕ Quick-select buttons (Meeting, Lunch, Break, etc.)
- 🕐 Time adjustment controls
- ✏️ Custom activity input
- ⏭️ Snooze or skip options

---

## 📊 Screenshots

<details>
<summary><b>Click to view screenshots</b></summary>

### Dashboard
<!-- Add screenshot here -->
*Beautiful dashboard showing productivity stats, top apps, and timeline*

### Check-In Prompt
<!-- Add screenshot here -->
*Smart check-in prompt with quick-select options*

### System Tray
<!-- Add screenshot here -->
*Runs silently in system tray with quick stats*

</details>

---

## 🤝 Contributing

We love contributions! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🔧 Code contributions

Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Development Setup

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/trackMe.git
cd trackMe
npm install

# Setup Supabase (see SETUP.md)

# Run in development mode
npm run desktop

# Build shared package
npm run shared

# Test Supabase connection
npm run test:supabase
```

---

## 🗺️ Roadmap

### Phase 1: MVP (✅ Complete)
- ✅ Desktop activity tracking
- ✅ Smart check-ins
- ✅ Auto-categorization
- ✅ Dashboard with analytics
- ✅ Supabase sync

### Phase 2: Mobile (🚧 In Progress)
- [ ] React Native mobile app
- [ ] iOS Screen Time integration
- [ ] Android UsageStats integration
- [ ] Cross-device sync

### Phase 3: Advanced Features
- [ ] Machine learning for categorization
- [ ] Calendar integration
- [ ] Team features
- [ ] Weekly email reports
- [ ] Export to CSV/PDF
- [ ] Browser extension

### Phase 4: Integrations
- [ ] Jira integration
- [ ] GitHub integration
- [ ] Slack notifications
- [ ] Google Calendar sync
- [ ] Notion export

---

## 🔒 Privacy & Security

TrackMe takes your privacy seriously:

- ✅ **Local-First** - Categorization happens on your device
- ✅ **Encrypted** - All data encrypted in transit (HTTPS)
- ✅ **Row Level Security** - Database-level data isolation
- ✅ **No Third-Party Tracking** - No analytics or tracking
- ✅ **You Own Your Data** - Easy export and deletion
- ✅ **Open Source** - Code is transparent and auditable

See our [Privacy Policy](PRIVACY.md) for more details.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - For the amazing backend platform
- [Electron](https://www.electronjs.org/) - For cross-platform desktop apps
- [active-win](https://github.com/sindresorhus/active-win) - For window detection
- All our [contributors](https://github.com/YOUR_USERNAME/trackMe/graphs/contributors)

---

## 📞 Support

- 📖 [Documentation](SETUP.md)
- 💬 [GitHub Discussions](https://github.com/YOUR_USERNAME/trackMe/discussions)
- 🐛 [Issue Tracker](https://github.com/YOUR_USERNAME/trackMe/issues)
- 📧 Email: support@trackme.app

---

## ⭐ Star History

If you find TrackMe useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=YOUR_USERNAME/trackMe&type=Date)](https://star-history.com/#YOUR_USERNAME/trackMe&Date)

---

<div align="center">

**Built with ❤️ using TypeScript, React, and Electron**

[⬆ Back to Top](#trackme---automated-time-tracking)

</div>
