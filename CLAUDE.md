# aistudio-ideation — エージェント指示

## 作業開始前に必ず読むこと

1. `shared/BRAND.md` — 世界観・トーン
2. `shared/AUDIENCE.md` — ターゲット・ペイン
3. `shared/BUSINESS_MODEL.md` — 収益導線
4. `STRATEGY.md` — 戦略の北極星
5. `CONTENT_SYSTEM.md` — コンテンツ体系

---

## ディレクトリ構成

```
aistudio-ideation/
├── shared/            ブランド・顧客・事業の共通記憶（全作業の前提）
├── STRATEGY.md        戦略憲法（北極星）
├── CONTENT_SYSTEM.md  コンテンツ体系・プラットフォーム方針
│
├── briefs/            ブランド・オーディエンス・オファー・プラットフォームのブリーフ
├── research/          市場・SNS・競合・読者の生声・トレンド調査
├── angles/            企画の切り口（柱・フック・アイデアバックログ・季節角度）
├── formats/           投稿・ニュースレター・商品ページのフォーマット定義
│
├── review-checks/     ブランド・フック・プラットフォーム・収益・倫理チェック
├── roles/             エージェントロール定義（戦略家・調査員・編集者・SNSプランナー等）
│
├── hypotheses/        SNS仮説検証ログ（active / validated / failed）
├── analytics/         数字の振り返り（週次・月次・KPI）
├── monetization/      収益化設計（オファーマップ・導線・価格）
├── workflows/         運用手順（アイデア→投稿・月次振り返り等）
│
├── campaigns/         キャンペーン管理（実施中・テンプレ）
├── scripts/           脚本・原稿（reels / tiktok / newsletter）
├── assets/            ビジュアルガイドライン・プロンプト
│
├── content/           コンテンツ資産（72-micro-seasons / bungu / hakko / id-travel）
├── app-ideation/      アプリ系アイデア（genres/ + backlog）
└── archives/          過去の戦略メモ・見送りアイデア
```

---

## 作業別ガイド

### アイデア出し・企画
1. `angles/content-pillars.md` でどの柱に属するか確認
2. `angles/hook-bank.md` でフックを選ぶ
3. `angles/idea-backlog.md` に追加
4. キャンペーン化する場合は `campaigns/` へ

### 調査
- 市場・アプリ: `research/market/`
- SNS・競合: `research/sns/` + `research/competitors/`
- 読者の生声: `research/audience-voices/`
- トレンド: `research/trends/`

### SNS戦略・仮説検証
1. `hypotheses/active.md` に仮説を立てる
2. 結果に応じて `validated.md` / `failed.md` へ移動
3. 学びを `angles/hook-bank.md` に反映

### 投稿制作
`workflows/idea-to-post.md` を必ず参照する。
制作後は `review-checks/` を全項目チェックしてから公開。

### 収益化
- 全オファー: `monetization/offer-map.md`
- 無料→有料の導線: `monetization/free-to-paid-ladder.md`
- 収益目標: `analytics/metrics.md`

---

## スキルと出力先

| スキル | 役割 | 出力先 |
|--------|------|-------|
| `/multi-perspective-ideation` | 8専門家視点のブレスト | `angles/idea-backlog.md` |
| `/sns-research` | SNS市場・競合・ペルソナ調査 | `research/sns/` + `research/audience-voices/` |
| `/sns-strategy` | フォロワー獲得・収益化戦略 | `hypotheses/active.md` + `monetization/` |

---

## ルール

- ファイル操作の前に必ず今日の日付を確認する
- 同日付・同テーマのファイルがある場合は追記を優先する
- 調査結果には出典 URL を必ず記載する
- 意思決定は `shared/DECISIONS.md` に記録する
