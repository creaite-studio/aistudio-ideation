# 記事テンプレート（フロントマター付き）

新規記事作成時はこのテンプレートをコピーして使う。
ファイル名: `YYYY-MM-DD-[theme]-[topic-slug].md`
例: `2026-05-10-72ms-kawazu-hajimete-naku.md`

---

```markdown
---
# ── 基本情報 ──────────────────────────────
id: "72ms-001"              # [theme prefix]-[3桁連番] 例: 72ms-001 / bg-001 / hk-001
theme: "72-micro-seasons"   # 72-micro-seasons | bungu | hakko
content_type: "article"     # article | guide | template | story | tutorial

# ── タイトル ───────────────────────────────
title_en: ""
title_jp: ""
subtitle_en: ""

# ── 72候専用（他テーマはスキップ） ────────────
ko_name_jp: "蛙始鳴"        # 候の名前（日本語）
ko_name_en: "Frogs Begin to Sing"
ko_number: 7                # 1〜72
season: "spring"            # spring | summer | autumn | winter
active_dates: "04/05-04/09" # 候が該当する期間（月/日）

# ── 日程 ───────────────────────────────────
created: "2026-05-05"
published: ""               # 公開日（未公開は空欄）
next_update: ""             # 毎年更新予定日（72候は毎年同時期）

# ── ステータス ─────────────────────────────
status: "draft"             # draft | review | published | archived

# ── プラットフォーム別ステータス ──────────────
platforms:
  beehiiv: "draft"          # draft | scheduled | published | n/a
  ghost: "draft"
  twitter: "draft"
  instagram: "draft"
  ko_fi: "n/a"
  karyakarsa: "n/a"
  medium: "n/a"

# ── リパーパス完了状況 ────────────────────────
repurposed:
  twitter_thread: false     # Twitterスレッド（8〜12ツイート）
  instagram_carousel: false # Instagramカルーセル（スライド5〜10枚）
  ko_fi_pdf: false          # Ko-fi PDFテンプレート
  tiktok_script: false      # TikTokスクリプト（60秒）
  karyakarsa_id: false      # インドネシア語翻訳版

# ── SEO ────────────────────────────────────
seo_keyword_primary: ""
seo_keywords_secondary: []
estimated_search_volume: "" # low | medium | high

# ── マネタイズ ─────────────────────────────
affiliate_links: []         # [{name: "", url: "", commission: ""}]
ko_fi_product_id: ""        # Ko-fi商品IDがあれば

# ── パフォーマンス（公開後に更新） ──────────────
metrics:
  views: 0
  email_open_rate: 0.0      # %
  email_click_rate: 0.0     # %
  social_impressions: 0
  revenue_usd: 0.0
  affiliate_clicks: 0
  affiliate_revenue_usd: 0.0

# ── タグ ───────────────────────────────────
tags: []
# 例: [spring, nature, frogs, mindfulness, slow-living]

# ── メモ ───────────────────────────────────
notes: ""
---

# [タイトル]

[本文をここに書く]
```

---

## IDプレフィックス一覧

| テーマ | プレフィックス | 例 |
|-------|-------------|-----|
| 72 Micro-Seasons | `72ms` | `72ms-001` |
| Bungu | `bg` | `bg-001` |
| Hakko | `hk` | `hk-001` |

## ファイル配置ルール

```
drafts/     ← 執筆中・レビュー中
published/  ← 公開済み（Ghost/Beehiivで公開後にここへ移動）
repurposed/ ← リパーパスコンテンツ（Twitter/Instagram/Ko-fi等）
  ├── twitter/
  ├── instagram/
  ├── ko-fi/
  └── tiktok/
```
