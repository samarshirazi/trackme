import {
  ActivityContext,
  DEFAULT_CATEGORIZATION_RULES,
  URL_CATEGORIZATION_RULES,
  isWorkHours
} from '@trackme/shared';

export class CategorizationEngine {
  private appRules: typeof DEFAULT_CATEGORIZATION_RULES;
  private urlRules: typeof URL_CATEGORIZATION_RULES;

  constructor() {
    this.appRules = [...DEFAULT_CATEGORIZATION_RULES];
    this.urlRules = [...URL_CATEGORIZATION_RULES];
  }

  async categorize(context: ActivityContext): Promise<string> {
    // 1. Try URL-based categorization first (for browsers)
    if (context.url) {
      const urlCategory = this.categorizeByUrl(context.url);
      if (urlCategory) {
        return urlCategory;
      }
    }

    // 2. Try app-based categorization
    const appCategory = this.categorizeByApp(context.appName);
    if (appCategory) {
      return appCategory;
    }

    // 3. Try title-based categorization
    if (context.title) {
      const titleCategory = this.categorizeByTitle(context.title);
      if (titleCategory) {
        return titleCategory;
      }
    }

    // 4. Default fallback
    return 'Uncategorized';
  }

  private categorizeByApp(appName: string): string | null {
    for (const rule of this.appRules) {
      const regex = new RegExp(rule.app_pattern, 'i');
      if (regex.test(appName)) {
        return rule.category;
      }
    }
    return null;
  }

  private categorizeByUrl(url: string): string | null {
    for (const rule of this.urlRules) {
      const regex = new RegExp(rule.pattern, 'i');
      if (regex.test(url)) {
        return rule.category;
      }
    }
    return null;
  }

  private categorizeByTitle(title: string): string | null {
    // Check for common patterns in window titles
    const titleLower = title.toLowerCase();

    // Development indicators
    if (
      titleLower.includes('github') ||
      titleLower.includes('gitlab') ||
      titleLower.includes('stackoverflow') ||
      titleLower.includes('.js') ||
      titleLower.includes('.ts') ||
      titleLower.includes('.py') ||
      titleLower.includes('.java')
    ) {
      return 'Development';
    }

    // Meeting indicators
    if (
      titleLower.includes('zoom') ||
      titleLower.includes('meet') ||
      titleLower.includes('teams') ||
      titleLower.includes('meeting')
    ) {
      return 'Meeting';
    }

    // Communication indicators
    if (
      titleLower.includes('slack') ||
      titleLower.includes('discord') ||
      titleLower.includes('message')
    ) {
      return 'Communication';
    }

    return null;
  }

  getProductivityScore(context: ActivityContext, category: string): number {
    // Get base score from category rules
    let baseScore = 50; // Default

    // Check URL rules first
    if (context.url) {
      for (const rule of this.urlRules) {
        const regex = new RegExp(rule.pattern, 'i');
        if (regex.test(context.url)) {
          baseScore = rule.productivity_score;
          break;
        }
      }
    }

    // Check app rules
    for (const rule of this.appRules) {
      const regex = new RegExp(rule.app_pattern, 'i');
      if (regex.test(context.appName)) {
        baseScore = rule.productivity_score;
        break;
      }
    }

    // Adjust based on time of day
    const adjustedScore = this.adjustScoreByTimeOfDay(baseScore, category, context.timeOfDay);

    return adjustedScore;
  }

  private adjustScoreByTimeOfDay(baseScore: number, category: string, timeOfDay: number): number {
    const now = new Date();
    const inWorkHours = isWorkHours(now);

    // Communication and social media are less productive outside work hours
    if (!inWorkHours && (category === 'Communication' || category === 'Social Media')) {
      return Math.max(0, baseScore - 30);
    }

    // Entertainment during work hours is less "acceptable"
    if (inWorkHours && category === 'Entertainment') {
      return Math.max(0, baseScore - 10);
    }

    return baseScore;
  }

  detectProject(context: ActivityContext): string | null {
    // Try to extract project from window title
    if (context.title) {
      // Common patterns:
      // "ProjectName - VSCode"
      // "src/projectname/file.ts"
      // "JIRA-123: Task name"

      // Pattern 1: "Something - Editor"
      const dashPattern = /^(.+?)\s*[-–]\s*(VSCode|Visual Studio Code|IntelliJ|PyCharm|Xcode)/i;
      const dashMatch = context.title.match(dashPattern);
      if (dashMatch) {
        return this.cleanProjectName(dashMatch[1]);
      }

      // Pattern 2: JIRA-style ticket
      const jiraPattern = /^([A-Z]+-\d+)/;
      const jiraMatch = context.title.match(jiraPattern);
      if (jiraMatch) {
        return jiraMatch[1];
      }
    }

    // Try to extract from file path
    if (context.title && context.title.includes('/')) {
      const pathParts = context.title.split('/');
      // Look for project-like directory names
      for (let i = pathParts.length - 1; i >= 0; i--) {
        const part = pathParts[i];
        // Skip common directories
        if (
          !['src', 'lib', 'dist', 'build', 'node_modules', 'public'].includes(part) &&
          part.length > 2 &&
          !part.includes('.')
        ) {
          return this.cleanProjectName(part);
        }
      }
    }

    // Try to extract from URL
    if (context.url) {
      // GitHub repository: github.com/user/repo
      const githubPattern = /github\.com\/[^/]+\/([^/]+)/i;
      const githubMatch = context.url.match(githubPattern);
      if (githubMatch) {
        return this.cleanProjectName(githubMatch[1]);
      }

      // GitLab repository
      const gitlabPattern = /gitlab\.com\/[^/]+\/([^/]+)/i;
      const gitlabMatch = context.url.match(gitlabPattern);
      if (gitlabMatch) {
        return this.cleanProjectName(gitlabMatch[1]);
      }
    }

    return null;
  }

  private cleanProjectName(name: string): string {
    // Remove common suffixes and clean up
    return name
      .replace(/\.(js|ts|jsx|tsx|py|java|cpp|c|go|rs|rb)$/i, '')
      .replace(/^~/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Allow adding custom rules (learned rules)
  addCustomRule(appPattern: string, category: string, productivityScore: number) {
    this.appRules.push({
      app_pattern: appPattern,
      category,
      productivity_score: productivityScore,
      confidence: 0.8,
      is_learned: true
    });
  }
}
