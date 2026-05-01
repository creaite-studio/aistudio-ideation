# アイデア出しワークスペース

## 役割

抽象的なアイデアから、具体的な要件・戦略・収益化計画まで一気通貫で扱う企画スペース。
アプリ開発・note記事・SNS発信など領域を問わず使用する。

## アイデアのフロー

```
brainstorm/ → research/ → personas/ → strategy/ → requirements/
  （発散）      （調査）    （対象）     （戦略）      （具体化）
```

`backlog/` はフロー全体を通じてアイデアを蓄積・管理する。

## フォルダ構成

```
ideation/
├── brainstorm/          ← アイデア発散セッションの記録
├── research/
│   ├── market/          ← 市場規模・競合・アプリ調査
│   ├── sns/             ← SNS調査・競合アカウント・バズ分析
│   └── trends/          ← トレンドキーワード・業界動向
├── personas/            ← ターゲットペルソナ定義
├── strategy/
│   ├── sns/             ← SNS運用戦略・フォロワー獲得計画
│   └── monetize/        ← 収益化ロードマップ・マネタイズ設計
├── requirements/        ← 要件定義・機能仕様・MVP設計
└── backlog/             ← カテゴリ別アイデア一覧
    ├── apps.md          ← SaaS・アプリアイデア
    └── content.md       ← note記事・SNSネタ候補
```

## スキルと出力先の対応

| スキル | 役割 | 出力先 | スキルファイル |
|-------|------|-------|-------------|
| `/multi-perspective-ideation` | 8専門家視点のブレスト | `brainstorm/YYYY-MM-DD-[テーマ].md` | `.claude/skills/multi-perspective-ideation/` |
| `/ideate` | アプリアイデア発散 | `brainstorm/YYYY-MM-DD-[テーマ].md` | `.claude/skills/multi-perspective-ideation/` |
| `/app-research` | アプリ市場調査 | `research/market/YYYY-MM-DD-[テーマ].md` | `.claude/skills/` |
| `/sns-research` | SNS市場・競合・ペルソナ調査 | `research/sns/` + `personas/` | `.claude/skills/sns-research/` |
| `/sns-strategy` | フォロワー獲得・収益化戦略 | `strategy/sns/` + `strategy/monetize/` | `.claude/skills/sns-strategy/` |

## フロー別の使い方

### アプリを企画したい場合
1. `/multi-perspective-ideation` でアイデア発散 → `brainstorm/`
2. `/app-research` で市場検証 → `research/market/`
3. ペルソナをまとめる → `personas/`
4. 要件定義を書く → `requirements/`

### SNS発信を始めたい / 強化したい場合
1. `/sns-research` で市場・競合調査 + ペルソナ設計 → `research/sns/` + `personas/`
2. `/sns-strategy` でフォロワー獲得・収益化計画 → `strategy/`

### note記事・コンテンツの方向性を決めたい場合
1. `/multi-perspective-ideation` でジャンル・切り口を発散 → `brainstorm/`
2. `/sns-research` でバズテーマを調査 → `research/sns/`
3. 投稿ネタをまとめる → `backlog/content.md`

## ファイル命名規則

- セッション: `YYYY-MM-DD-[テーマ].md`
- 調査: `YYYY-MM-DD-[プラットフォーム or テーマ].md`
- ペルソナ: `[ペルソナ名].md`（日付なし・上書き更新）
- 戦略: `YYYY-MM-DD-[プラットフォーム]-strategy.md`

## ルール

- アイデアには必ずタグを付ける: `#app` `#note` `#sns` `#video`
- 調査結果には出典 URL を必ず記載
- 同日付のファイルがある場合は追記（新規作成しない）
- ファイル操作前に必ず今日の日付を確認する
