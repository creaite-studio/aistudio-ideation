# aistudio-ideation — 72 Micro-Seasons

## 作業開始前に必ず読むこと

1. `shared/BRAND.md` — 世界観・トーン
2. `shared/AUDIENCE.md` — ターゲット・ペイン
3. `shared/BUSINESS_MODEL.md` — 収益導線
4. `STRATEGY.md` — 戦略の北極星

---

## ディレクトリ構成

```
aistudio-ideation/
├── shared/              変わらない基盤（全作業の前提）
├── STRATEGY.md          戦略憲法
├── CONTENT_SYSTEM.md    コンテンツ体系
│
├── plan/                企画・調査（コンテンツを生み出すインプット）
│   ├── research/        市場・競合・読者の生声・トレンド
│   ├── angles/          コンテンツ柱・切り口・フック・アイデア
│   ├── roles/           ブレスト用ペルソナ（戦略家・調査員・編集者 等）
│   └── monetization/    オファー設計・収益導線詳細
│
├── create/              型・制作・発信
│   ├── formats/         投稿フォーマット（carousel / reel / newsletter 等）
│   ├── scripts/         実際の原稿
│   ├── campaigns/       キャンペーン管理
│   ├── assets/          ビジュアルガイドライン・プロンプト
│   └── checks/          発信前チェック（brand / hook / platform / ethics）
│
├── measure/             検証・改善（フィードバックループ）
│   ├── hypotheses/      仮説（active / validated / failed）
│   ├── analytics/       数字振り返り・KPI
│   └── workflows/       運用フロー・月次振り返り
│
├── content/             コンテンツ資産（72候の記事・リパーパス）
└── archives/            過去資料
```

---

## 作業別ガイド

### アイデア出し・企画
1. `plan/roles/` でペルソナを選ぶ（戦略家・調査員・編集者 等）
2. `plan/angles/content-pillars.md` でどの柱に属するか確認
3. `plan/angles/hook-bank.md` でフックを選ぶ
4. `plan/angles/idea-backlog.md` にストック

### 調査
- 市場・競合: `plan/research/market/` `plan/research/competitors/`
- SNS・読者: `plan/research/sns/` `plan/research/audience-voices/`
- トレンド: `plan/research/trends/`

### 投稿制作
1. `measure/workflows/idea-to-post.md` を参照
2. `create/formats/` から対象フォーマットを選ぶ
3. `create/scripts/` に原稿を書く
4. `create/checks/` を全項目確認してから発信

### 仮説検証
1. `measure/hypotheses/active.md` に仮説を立てる
2. 結果に応じて `validated.md` / `failed.md` へ移動
3. 学びを `plan/angles/hook-bank.md` に反映

### 収益化
- オファー全体: `plan/monetization/offer-map.md`
- 無料→有料導線: `plan/monetization/free-to-paid-ladder.md`
- KPI目標: `measure/analytics/metrics.md`

---

## スキルと出力先

| スキル | 役割 | 出力先 |
|--------|------|-------|
| `/multi-perspective-ideation` | 多角的ブレスト | `plan/angles/idea-backlog.md` |
| `/sns-research` | SNS市場・競合・ペルソナ調査 | `plan/research/sns/` + `plan/research/audience-voices/` |
| `/sns-strategy` | フォロワー獲得・収益化戦略 | `measure/hypotheses/active.md` + `plan/monetization/` |

---

## ルール
- ファイル操作の前に必ず今日の日付を確認する
- 同日付・同テーマのファイルがある場合は追記を優先する
- 調査結果には出典 URL を必ず記載する
- 意思決定は `shared/DECISIONS.md` に記録する
