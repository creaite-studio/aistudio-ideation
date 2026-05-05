# Bungu アフィリエイト商品リスト

記事ごとに貼るべきAmazonリンクをまとめたリスト。
Amazon APIで取得する際はここのASINまたは商品名を参照。

---

## Hobonichi Techo 系記事（bg-001 / bg-002 / bg-003）

| 商品名 | ASIN | 想定価格 | 優先度 |
|-------|------|---------|------|
| Hobonichi Techo Original A6（English版） | — | $28 | 必須 |
| Hobonichi Techo Cousin A5（English版） | — | $38 | 必須 |
| Hobonichi Techo Weeks | — | $22 | 高 |
| Hobonichi カバー（定番 / 人気デザイン） | — | $40〜80 | 高 |
| Tomoe River Paper A4（差し替え用） | — | $15 | 中 |

---

## 万年筆記事（bg-005）

| 商品名 | ASIN | 想定価格 | 優先度 |
|-------|------|---------|------|
| Pilot Metropolitan（入門・最推薦） | — | $20 | 必須 |
| Pilot Kakuno（入門・低価格） | — | $12 | 高 |
| Pilot Custom 74（中級） | — | $100 | 高 |
| Sailor Pro Gear（中〜上級） | — | $200 | 中 |
| Platinum Century 3776（上級） | — | $130 | 中 |
| Pilot Iroshizuku インク（人気カラー） | — | $28 | 高 |
| Kaco Edge コンバーター | — | $8 | 中 |

---

## 紙・ノート系記事（bg-006）

| 商品名 | ASIN | 想定価格 | 優先度 |
|-------|------|---------|------|
| Midori MD Notebook A5（無罫） | — | $16 | 必須 |
| Midori MD Notebook A5（方眼） | — | $16 | 高 |
| Kokuyo Campus Notebook | — | $8 | 高 |
| Stalogy 365 Notebook | — | $18 | 高 |
| Tomoe River Paper A4パック | — | $15 | 中 |
| Clairefontaine Age Bag（比較用） | — | $15 | 低 |

---

## ゲルペン・ボールペン記事（汎用・複数記事で使用）

| 商品名 | ASIN | 想定価格 | 優先度 |
|-------|------|---------|------|
| Uni-ball Jetstream 多色 | — | $12 | 必須 |
| Zebra Sarasa Clip 0.5mm | — | $10 | 高 |
| Pilot G2 セット | — | $10 | 高 |
| Pentel EnerGel | — | $8 | 中 |

---

## 文具店・カルチャー記事（bg-004 / bg-007）

| 商品名 | ASIN | 想定価格 | 優先度 |
|-------|------|---------|------|
| Midori Traveler's Notebook（スターターキット） | — | $55 | 必須 |
| MT マスキングテープ（セット） | — | $20 | 高 |
| Delfonics ロールペンケース | — | $25 | 中 |
| Penco Stationery セット | — | $15 | 中 |

---

## 消しゴム記事（bg-009）

| 商品名 | ASIN | 想定価格 | 優先度 |
|-------|------|---------|------|
| Tombow Mono Zero 消しゴム（ペン型） | — | $8 | 必須 |
| Hinodewashi Matomaru-kun | — | $5 | 高 |
| Seed Radar 消しゴム | — | $4 | 中 |
| Pentel Hi-Polymer | — | $6 | 中 |

---

## 鉛筆記事（汎用）

| 商品名 | ASIN | 想定価格 | 優先度 |
|-------|------|---------|------|
| Uni Mitsubishi Hi-Uni（12本セット） | — | $22 | 高 |
| Tombow Mono 100（12本セット） | — | $18 | 高 |
| Faber-Castell 9000（比較用） | — | $15 | 低 |

---

## 記事横断で毎回貼るもの（全記事共通）

| 商品名 | ASIN | 想定価格 | 理由 |
|-------|------|---------|-----|
| Hobonichi Techo Original A6 | — | $28 | 最も売れる・全記事で紹介可能 |
| Pilot Metropolitan | — | $20 | 入門者が必ず欲しがる |
| Midori MD Notebook A5 | — | $16 | 品質の象徴として紹介しやすい |

---

## ASINの入れ方

商品が確定したら `ASIN` 列に `B0XXXXXXXX` 形式で記入してください。
執筆部隊（Claude API）は記事生成時にこのファイルを参照し、
適切な箇所にアフィリエイトリンクのプレースホルダーを挿入します。

```
<!-- AFFILIATE: hobonichi-original-a6 -->
```

↑このフォーマットで記事中に埋め込み → あなたが実際のリンクに差し替え
