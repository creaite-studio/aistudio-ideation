# Bungu / Japanese Stationery 記事一覧

← `content/_index.md` に戻る

---

## 調査・企画部隊の設計

### 企画の自動化ソース

**① Hobonichiカレンダー（毎年固定）**
```
6月:  翌年カバー先行発表 → レビュー・比較記事
8月:  予約開始         → 「初心者向け選び方ガイド」
10月: 一般販売開始      → 「セットアップ方法」「使い始め方」
```

**② Reddit トレンド監視（週次自動）**
```
監視対象:
  r/notebooks / r/pens / r/Journaling / r/hobonichi
        ↓
Claude APIが週次でトップスレッドをスコアリング
→ 企画候補リストに自動追加
```

### 調査フロー
```
① Claude + WebSearch  → 文化・歴史背景（例: なぜ日本の文具は精密なのか）
② Amazon PA API      → 製品情報・価格・レビュー数・アフィリエイトリンク生成
③ Reddit API         → コミュニティの実際の反応・よくある質問
        ↓
「この製品は$45、レビュー1,240件、先週Redditで23スレッド言及」
まで自動で把握できる状態にする
```

### 追加ツール
- Amazon PA API（無料、売上に応じた報酬）
- Reddit API（無料枠で十分）

---

## コンテンツカレンダー（Hobonichiベース）

| 時期 | トピック | コンテンツタイプ | 優先度 |
|------|---------|--------------|------|
| 6月 | 新カバー発表レビュー | 速報+比較 | 高 |
| 8月 | 初心者向け選び方 | ガイド | 高 |
| 9月 | 来年の計画術 | How-to | 高 |
| 10月 | セットアップ完全ガイド | チュートリアル | 高 |
| 通年 | 文具店巡り・万年筆・紙 | 文化エッセイ | 中 |

---

## 収益構造

```
主役: アフィリエイト（SEO資産が蓄積するほど複利）
  Hobonichi Techo A6    $28  × 4% = $1.12/冊
  Pilot 万年筆          $160 × 4% = $6.40/本
  Midori Traveler's     $55  × 4% = $2.20/冊
  マスキングテープセット  $20  × 4% = $0.80

月50転換 → $50〜200/月
記事50本蓄積時 → $500〜1,500/月（SEO複利）

副収益: Ko-fi「Hobonichi セットアップPDF」$8
```

---

## 想定トピック候補

| カテゴリ | タイトル案(EN) | 優先度 | 記事ID |
|--------|-------------|------|-------|
| Hobonichi | Why Hobonichi Techo is different from any planner | 高 | bg-001 |
| Hobonichi | Hobonichi Techo for beginners: complete setup guide | 高 | bg-002 |
| Hobonichi | Hobonichi covers 2027: full comparison | 高 | bg-003 |
| 文具店 | Tokyo stationery shops worth the pilgrimage | 中 | bg-004 |
| 万年筆 | Japanese fountain pen culture explained | 中 | bg-005 |
| 紙 | Why Japanese paper (washi) feels different | 中 | bg-006 |
| 文化 | Why Japanese stationery is engineered differently | 中 | bg-007 |
| MT | The MT tape obsession: a cultural deep-dive | 低 | bg-008 |
| 消しゴム | Japanese erasers: where engineering meets art | 低 | bg-009 |

---

## 記事一覧

| ID | タイトル(EN) | トピック | ステータス | 公開日 | PV | 収益($) |
|----|------------|---------|----------|--------|-----|--------|
| — | — | *(記事はまだありません)* | — | — | — | — |

---

## リパーパス状況

| 記事ID | Beehiiv | Ghost | Twitter | Instagram | Ko-fi | Amazon |
|-------|---------|-------|---------|-----------|-------|--------|
| — | — | — | — | — | — | — |
