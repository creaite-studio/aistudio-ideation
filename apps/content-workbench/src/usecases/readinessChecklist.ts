import { Article, Platform } from '../domain/article';
import { platformFieldGuides } from '../config/platformFieldGuides';

export type ChecklistResult = {
  ready: boolean;
  checks: Array<{ id: string; passed: boolean; message: string }>;
};

const MIN_BODY_LENGTH = 300;

function hasRequiredPlatformFields(article: Article, selectedPlatforms: Platform[]): boolean {
  return selectedPlatforms.every((platform) => {
    const fields = platformFieldGuides[platform];
    const variant = article.platformVariants[platform];

    if (!fields || !variant) return false;

    return Object.entries(fields)
      .filter(([, guide]) => guide.required)
      .every(([field]) => {
        const value = (variant as Record<string, string | undefined>)[field];
        return typeof value === 'string' && value.trim().length > 0;
      });
  });
}

export function evaluateReadiness(article: Article, selectedPlatforms: Platform[]): ChecklistResult {
  const checks = [
    {
      id: 'body-length',
      passed: article.baseBodyMd.trim().length >= MIN_BODY_LENGTH,
      message: `本文が${MIN_BODY_LENGTH}文字以上ある`,
    },
    {
      id: 'tag-exists',
      passed: article.tags.length > 0,
      message: 'タグが1つ以上ある',
    },
    {
      id: 'platform-required-fields',
      passed: hasRequiredPlatformFields(article, selectedPlatforms),
      message: '対象PFの必須項目が入力済み',
    },
  ];

  return {
    ready: checks.every((check) => check.passed),
    checks,
  };
}
