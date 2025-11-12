# Contributing to TrackMe

Thank you for your interest in contributing to TrackMe! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ✨ Add new features
- 🧪 Write tests
- 🎨 Improve UI/UX

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- A Supabase account (free tier is fine)

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/trackMe.git
   cd trackMe
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Create a Supabase project
   - Run `packages/database/schema.sql` in SQL Editor
   - Copy `.env.example` to `.env` in `apps/desktop/`
   - Add your Supabase credentials

4. **Run the App**
   ```bash
   npm run desktop
   ```

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Test Supabase connection
npm run test:supabase

# Build shared package
npm run shared

# Run the app
npm run desktop
```

### 4. Commit Your Changes

Follow conventional commit format:

```bash
git commit -m "feat: add project detection from URLs"
git commit -m "fix: resolve idle time detection bug"
git commit -m "docs: update setup guide"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots (if UI changes)
- Testing steps

## 🏗️ Project Structure

```
trackMe/
├── apps/
│   └── desktop/          # Electron + React desktop app
│       ├── electron/     # Main process (Node.js)
│       │   ├── main.ts
│       │   └── services/
│       └── src/          # Renderer process (React)
│           └── components/
├── packages/
│   ├── shared/           # Shared TypeScript types & utils
│   └── database/         # Supabase SQL schema
└── scripts/              # Build and utility scripts
```

## 💻 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types from `packages/shared`

```typescript
// Good
interface ActivityData {
  appName: string;
  duration: number;
}

// Avoid
const data: any = { ... };
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props
- Add prop documentation

```typescript
interface ButtonProps {
  /** The button label */
  label: string;
  /** Click handler */
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `ActivityMonitor.tsx`)
- Utilities: `camelCase.ts` (e.g., `timeUtils.ts`)
- Types: `index.ts` in types folder
- Services: `PascalCase.ts` (e.g., `SupabaseService.ts`)

### Comments

- Add JSDoc comments for functions
- Explain "why", not "what"
- Add TODO comments for future work

```typescript
/**
 * Categorizes an activity based on app name and context
 * @param context - Activity context with app, title, URL
 * @returns Category string (e.g., "Development", "Meeting")
 */
async function categorize(context: ActivityContext): Promise<string> {
  // Check URL patterns first for browsers
  // ...
}
```

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR:

- [ ] App starts without errors
- [ ] Can sign up and log in
- [ ] Activity tracking works
- [ ] Check-in prompts appear
- [ ] Dashboard displays data correctly
- [ ] Settings can be changed
- [ ] App syncs to Supabase
- [ ] No console errors

### Automated Tests (Coming Soon)

We're working on adding:
- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug is already reported
2. Try the latest version
3. Check the documentation

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., macOS 14.0]
 - Node version: [e.g., 18.0.0]
 - App version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or use cases.
```

## 📚 Documentation

Help improve our docs:

- Fix typos or unclear explanations
- Add examples
- Create tutorials
- Translate to other languages

Documentation files:
- `README.md` - Project overview
- `SETUP.md` - Installation guide
- `QUICK_REFERENCE.md` - Quick start
- `PROJECT_SUMMARY.md` - Technical details

## 🔍 Code Review Process

Pull requests will be reviewed for:

1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it clean and maintainable?
3. **Testing** - Is it tested?
4. **Documentation** - Is it documented?
5. **Style** - Does it follow conventions?

Reviews typically take 1-3 days. Be patient and responsive to feedback!

## 🎯 Priority Areas

We especially welcome contributions in:

1. **Mobile App** (React Native) - Not yet implemented
2. **Automated Tests** - Unit, integration, E2E
3. **Machine Learning** - Better categorization
4. **Integrations** - Calendar, Jira, GitHub, etc.
5. **Settings UI** - More customization options
6. **Performance** - Optimization and profiling
7. **Accessibility** - Better keyboard navigation, screen readers

## 🤝 Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## 📞 Getting Help

- 💬 GitHub Discussions - Ask questions
- 🐛 GitHub Issues - Report bugs
- 📧 Email - For security issues
- 📖 Documentation - Check the docs first

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Given a shoutout on social media (if desired)

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TrackMe! 🚀

Your contributions help make time tracking better for everyone.
