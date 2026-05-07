export type Theme = '72ms' | 'bungu' | 'id-travel';

export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived';

export type Platform = 'beehiiv' | 'ghost' | 'x' | 'instagram' | 'karyaKarsa';

export type PlatformVariants = {
  beehiiv?: { title: string; summary: string; cta: string };
  ghost?: { title: string; seoDescription: string };
  x?: { hook: string; threadDraft: string };
  instagram?: { slide1Hook: string; slideOutline: string; finalCta: string };
  karyaKarsa?: {
    titleId: string;
    episodeSummaryId: string;
    halalNote: string;
    nextEpisodeHook: string;
  };
};

export type ImagePurpose = 'hero' | 'inline' | 'carousel';
export type ImageRatio = '1:1' | '3:2' | '16:9';

export type ArticleImage = {
  id: string;
  prompt: string;
  purpose: ImagePurpose;
  ratio: ImageRatio;
  url: string;
  createdAt: string;
};

export type Article = {
  id: string;
  theme: Theme;
  status: ArticleStatus;
  baseTitle: string;
  baseBodyMd: string;
  tags: string[];
  platformVariants: PlatformVariants;
  images: ArticleImage[];
  createdAt: string;
  updatedAt: string;
};
