import { CategorizationRule } from '../types';

// Pre-built categorization rules for common applications
export const DEFAULT_CATEGORIZATION_RULES: Omit<CategorizationRule, 'id' | 'user_id' | 'usage_count'>[] = [
  // Development Tools
  {
    app_pattern: '^(Visual Studio Code|Code|VSCode|code)$',
    category: 'Development',
    productivity_score: 95,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|GoLand|CLion)$',
    category: 'Development',
    productivity_score: 95,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Xcode|Android Studio|Eclipse)$',
    category: 'Development',
    productivity_score: 95,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Terminal|iTerm|iTerm2|Hyper|Alacritty|kitty)$',
    category: 'Development',
    productivity_score: 90,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Sublime Text|Atom|Vim|Emacs|Notepad\\+\\+)$',
    category: 'Development',
    productivity_score: 95,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Docker|Docker Desktop)$',
    category: 'Development',
    productivity_score: 85,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Postman|Insomnia)$',
    category: 'Development',
    productivity_score: 85,
    confidence: 1.0,
    is_learned: false
  },

  // Design Tools
  {
    app_pattern: '^(Figma|Sketch|Adobe XD)$',
    category: 'Design',
    productivity_score: 90,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Adobe Photoshop|Photoshop)$',
    category: 'Design',
    productivity_score: 90,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Adobe Illustrator|Illustrator)$',
    category: 'Design',
    productivity_score: 90,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Canva)$',
    category: 'Design',
    productivity_score: 85,
    confidence: 1.0,
    is_learned: false
  },

  // Communication
  {
    app_pattern: '^(Slack)$',
    category: 'Communication',
    productivity_score: 70,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Microsoft Teams|Teams)$',
    category: 'Communication',
    productivity_score: 70,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Discord)$',
    category: 'Communication',
    productivity_score: 60,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Zoom|zoom.us)$',
    category: 'Meeting',
    productivity_score: 75,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Google Meet|Meet)$',
    category: 'Meeting',
    productivity_score: 75,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Skype)$',
    category: 'Communication',
    productivity_score: 70,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(WhatsApp|Telegram|Signal)$',
    category: 'Communication',
    productivity_score: 40,
    confidence: 1.0,
    is_learned: false
  },

  // Email
  {
    app_pattern: '^(Mail|Outlook|Thunderbird|Mailspring)$',
    category: 'Email',
    productivity_score: 65,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Gmail)$',
    category: 'Email',
    productivity_score: 65,
    confidence: 1.0,
    is_learned: false
  },

  // Browsers - Base category (will be refined by URL)
  {
    app_pattern: '^(Google Chrome|Chrome|Chromium)$',
    category: 'Browsing',
    productivity_score: 50,
    confidence: 0.5,
    is_learned: false
  },
  {
    app_pattern: '^(Safari)$',
    category: 'Browsing',
    productivity_score: 50,
    confidence: 0.5,
    is_learned: false
  },
  {
    app_pattern: '^(Firefox|Mozilla Firefox)$',
    category: 'Browsing',
    productivity_score: 50,
    confidence: 0.5,
    is_learned: false
  },
  {
    app_pattern: '^(Microsoft Edge|Edge)$',
    category: 'Browsing',
    productivity_score: 50,
    confidence: 0.5,
    is_learned: false
  },

  // Productivity Tools
  {
    app_pattern: '^(Notion)$',
    category: 'Productivity',
    productivity_score: 85,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Obsidian|Roam Research)$',
    category: 'Productivity',
    productivity_score: 85,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Evernote|OneNote)$',
    category: 'Productivity',
    productivity_score: 80,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Trello|Asana|Jira|Linear)$',
    category: 'Project Management',
    productivity_score: 85,
    confidence: 1.0,
    is_learned: false
  },

  // Office Suite
  {
    app_pattern: '^(Microsoft Word|Word)$',
    category: 'Documents',
    productivity_score: 80,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Microsoft Excel|Excel)$',
    category: 'Spreadsheets',
    productivity_score: 80,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Microsoft PowerPoint|PowerPoint)$',
    category: 'Presentations',
    productivity_score: 80,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Google Docs|Docs)$',
    category: 'Documents',
    productivity_score: 80,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Google Sheets|Sheets)$',
    category: 'Spreadsheets',
    productivity_score: 80,
    confidence: 1.0,
    is_learned: false
  },

  // Entertainment
  {
    app_pattern: '^(Spotify|Apple Music|Music)$',
    category: 'Entertainment',
    productivity_score: 20,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Netflix|Hulu|Disney\\+|Prime Video)$',
    category: 'Entertainment',
    productivity_score: 10,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Steam|Epic Games|PlayStation|Xbox)$',
    category: 'Gaming',
    productivity_score: 5,
    confidence: 1.0,
    is_learned: false
  },

  // Social Media
  {
    app_pattern: '^(Twitter|X)$',
    category: 'Social Media',
    productivity_score: 15,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Facebook)$',
    category: 'Social Media',
    productivity_score: 15,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(Instagram)$',
    category: 'Social Media',
    productivity_score: 15,
    confidence: 1.0,
    is_learned: false
  },
  {
    app_pattern: '^(LinkedIn)$',
    category: 'Social Media',
    productivity_score: 50,
    confidence: 1.0,
    is_learned: false
  },

  // File Management
  {
    app_pattern: '^(Finder|Windows Explorer|Explorer)$',
    category: 'File Management',
    productivity_score: 60,
    confidence: 1.0,
    is_learned: false
  }
];

// URL patterns for browser categorization
export const URL_CATEGORIZATION_RULES: Array<{
  pattern: string;
  category: string;
  productivity_score: number;
}> = [
  // Development
  { pattern: 'github\\.com', category: 'Development', productivity_score: 90 },
  { pattern: 'gitlab\\.com', category: 'Development', productivity_score: 90 },
  { pattern: 'stackoverflow\\.com', category: 'Development', productivity_score: 85 },
  { pattern: 'stackexchange\\.com', category: 'Development', productivity_score: 85 },
  { pattern: 'dev\\.to', category: 'Development', productivity_score: 80 },
  { pattern: 'medium\\.com.*programming', category: 'Development', productivity_score: 80 },
  { pattern: 'localhost', category: 'Development', productivity_score: 95 },
  { pattern: '127\\.0\\.0\\.1', category: 'Development', productivity_score: 95 },

  // Documentation
  { pattern: 'docs\\.', category: 'Learning', productivity_score: 85 },
  { pattern: 'documentation', category: 'Learning', productivity_score: 85 },
  { pattern: 'readthedocs', category: 'Learning', productivity_score: 85 },
  { pattern: 'npmjs\\.com', category: 'Development', productivity_score: 85 },

  // Communication
  { pattern: 'slack\\.com', category: 'Communication', productivity_score: 70 },
  { pattern: 'teams\\.microsoft\\.com', category: 'Communication', productivity_score: 70 },
  { pattern: 'discord\\.com', category: 'Communication', productivity_score: 60 },
  { pattern: 'zoom\\.us', category: 'Meeting', productivity_score: 75 },
  { pattern: 'meet\\.google\\.com', category: 'Meeting', productivity_score: 75 },

  // Email
  { pattern: 'mail\\.google\\.com', category: 'Email', productivity_score: 65 },
  { pattern: 'outlook\\.office\\.com', category: 'Email', productivity_score: 65 },
  { pattern: 'outlook\\.live\\.com', category: 'Email', productivity_score: 65 },

  // Project Management
  { pattern: 'trello\\.com', category: 'Project Management', productivity_score: 85 },
  { pattern: 'asana\\.com', category: 'Project Management', productivity_score: 85 },
  { pattern: 'jira\\.', category: 'Project Management', productivity_score: 85 },
  { pattern: 'linear\\.app', category: 'Project Management', productivity_score: 85 },
  { pattern: 'notion\\.so', category: 'Productivity', productivity_score: 85 },

  // Social Media
  { pattern: 'twitter\\.com', category: 'Social Media', productivity_score: 15 },
  { pattern: 'x\\.com', category: 'Social Media', productivity_score: 15 },
  { pattern: 'facebook\\.com', category: 'Social Media', productivity_score: 15 },
  { pattern: 'instagram\\.com', category: 'Social Media', productivity_score: 15 },
  { pattern: 'linkedin\\.com', category: 'Social Media', productivity_score: 50 },
  { pattern: 'reddit\\.com', category: 'Social Media', productivity_score: 20 },

  // Entertainment
  { pattern: 'youtube\\.com', category: 'Entertainment', productivity_score: 20 },
  { pattern: 'netflix\\.com', category: 'Entertainment', productivity_score: 10 },
  { pattern: 'twitch\\.tv', category: 'Entertainment', productivity_score: 10 },
  { pattern: 'spotify\\.com', category: 'Entertainment', productivity_score: 20 },

  // News
  { pattern: 'news\\.', category: 'News', productivity_score: 30 },
  { pattern: 'nytimes\\.com', category: 'News', productivity_score: 30 },
  { pattern: 'bbc\\.', category: 'News', productivity_score: 30 },

  // Shopping
  { pattern: 'amazon\\.', category: 'Shopping', productivity_score: 10 },
  { pattern: 'ebay\\.', category: 'Shopping', productivity_score: 10 },
  { pattern: 'shop', category: 'Shopping', productivity_score: 10 }
];
