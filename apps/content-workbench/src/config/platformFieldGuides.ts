import { Platform } from '../domain/article';

export type FieldGuide = {
  label: string;
  description: string;
  required?: boolean;
};

export const platformFieldGuides: Record<Platform, Record<string, FieldGuide>> = {
  beehiiv: {
    title: {
      label: 'Title',
      description: 'メール件名に相当する強い導入。対象読者と価値を短く明示します。',
      required: true,
    },
    summary: {
      label: 'Summary',
      description: '本文の要点を2〜3文で記載し、読むメリットを提示します。',
      required: true,
    },
    cta: {
      label: 'CTA',
      description: '読了後に取ってほしい行動を1文で書きます。',
      required: true,
    },
  },
  ghost: {
    title: {
      label: 'Title',
      description: '検索意図を含む記事タイトル。主キーワードを前半に置きます。',
      required: true,
    },
    seoDescription: {
      label: 'SEO Description',
      description: '検索結果向けの説明文。記事の結論と対象読者を含めます。',
      required: true,
    },
  },
  x: {
    hook: {
      label: 'Hook',
      description: '最初の1投稿。驚きや課題提起で続きを読みたくさせます。',
      required: true,
    },
    threadDraft: {
      label: 'Thread Draft',
      description: 'スレッド全体の下書き。1投稿1メッセージで簡潔に構成します。',
      required: true,
    },
  },
  instagram: {
    slide1Hook: {
      label: 'Slide 1 Hook',
      description: '1枚目の訴求。誰のどんな悩みに効く内容かを明示します。',
      required: true,
    },
    slideOutline: {
      label: 'Slide Outline',
      description: 'カルーセル全体の構成。各スライドの役割を箇条書きで整理します。',
      required: true,
    },
    finalCta: {
      label: 'Final CTA',
      description: '保存・コメント・プロフィール遷移などの行動を促します。',
      required: true,
    },
  },
  karyaKarsa: {
    titleId: {
      label: 'Title (ID)',
      description: 'インドネシア語タイトル。エピソードの主題が一目でわかる表現にします。',
      required: true,
    },
    episodeSummaryId: {
      label: 'Episode Summary (ID)',
      description: 'インドネシア語要約。今回の見どころを短く整理します。',
      required: true,
    },
    halalNote: {
      label: 'Halal Note',
      description: 'ハラール対応や配慮事項を必要に応じて明記します。',
      required: true,
    },
    nextEpisodeHook: {
      label: 'Next Episode Hook',
      description: '次回予告。継続課金・再訪問につながる問いや予告を入れます。',
      required: true,
    },
  },
};
