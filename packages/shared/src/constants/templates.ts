import { CheckInTemplate } from '../types';

// Pre-configured activity templates
export const DEFAULT_CHECKIN_TEMPLATES: Omit<CheckInTemplate, 'id' | 'user_id' | 'usage_count'>[] = [
  // Work Activities
  {
    name: 'Team Meeting',
    emoji: '👥',
    category: 'Meeting',
    productivity_score: 75,
    default_duration: 60,
    is_frequent: true,
    color: '#3B82F6'
  },
  {
    name: '1-on-1 Meeting',
    emoji: '🤝',
    category: 'Meeting',
    productivity_score: 80,
    default_duration: 30,
    is_frequent: true,
    color: '#3B82F6'
  },
  {
    name: 'Client Call',
    emoji: '📞',
    category: 'Communication',
    productivity_score: 85,
    default_duration: 45,
    is_frequent: true,
    color: '#8B5CF6'
  },
  {
    name: 'Phone Call',
    emoji: '☎️',
    category: 'Communication',
    productivity_score: 70,
    default_duration: 15,
    is_frequent: true,
    color: '#8B5CF6'
  },
  {
    name: 'Code Review',
    emoji: '👀',
    category: 'Development',
    productivity_score: 90,
    default_duration: 30,
    is_frequent: false,
    color: '#10B981'
  },
  {
    name: 'Planning/Brainstorming',
    emoji: '📝',
    category: 'Planning',
    productivity_score: 85,
    default_duration: 60,
    is_frequent: true,
    color: '#F59E0B'
  },
  {
    name: 'Reading/Research',
    emoji: '📚',
    category: 'Learning',
    productivity_score: 80,
    default_duration: 45,
    is_frequent: false,
    color: '#06B6D4'
  },
  {
    name: 'Workshop/Training',
    emoji: '🎓',
    category: 'Learning',
    productivity_score: 85,
    default_duration: 120,
    is_frequent: false,
    color: '#06B6D4'
  },

  // Breaks & Personal
  {
    name: 'Lunch Break',
    emoji: '🍽️',
    category: 'Break',
    productivity_score: 0,
    default_duration: 60,
    is_frequent: true,
    color: '#6B7280'
  },
  {
    name: 'Coffee Break',
    emoji: '☕',
    category: 'Break',
    productivity_score: 0,
    default_duration: 15,
    is_frequent: true,
    color: '#6B7280'
  },
  {
    name: 'Short Break',
    emoji: '🚶',
    category: 'Break',
    productivity_score: 0,
    default_duration: 10,
    is_frequent: true,
    color: '#6B7280'
  },
  {
    name: 'Commute',
    emoji: '🚗',
    category: 'Commute',
    productivity_score: 0,
    default_duration: 30,
    is_frequent: true,
    color: '#6B7280'
  },
  {
    name: 'Gym/Exercise',
    emoji: '💪',
    category: 'Personal',
    productivity_score: 0,
    default_duration: 60,
    is_frequent: false,
    color: '#EF4444'
  },

  // Administrative
  {
    name: 'Email/Inbox',
    emoji: '📧',
    category: 'Administrative',
    productivity_score: 60,
    default_duration: 30,
    is_frequent: true,
    color: '#F59E0B'
  },
  {
    name: 'Paperwork',
    emoji: '📄',
    category: 'Administrative',
    productivity_score: 50,
    default_duration: 45,
    is_frequent: false,
    color: '#F59E0B'
  },
  {
    name: 'Other',
    emoji: '🔹',
    category: 'Other',
    productivity_score: 50,
    default_duration: 30,
    is_frequent: true,
    color: '#6B7280'
  }
];
