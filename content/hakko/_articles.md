# Hakko / Japanese Fermentation 記事一覧

← `content/_index.md` に戻る

---

## 調査・企画部隊の設計

### 企画の自動化ソース

**① 季節カレンダー（部分自動化）**
```
1〜2月: 味噌仕込みシーズン  → 「今年の味噌を仕込もう」
5〜6月: 梅仕込みシーズン   → 「梅シロップ・梅酒・梅味噌」
7〜8月: 夏の発酵          → 「ぬか漬け夏管理・塩麹で夏料理」
秋:    新米シーズン        → 「ご飯で作る甘酒」
```

**② 難易度別シリーズ（コンテンツ設計を先に固定）**
```
Level 1: 塩麹     → 3日で完成・道具ほぼ不要
Level 2: 甘酒     → 8時間・炊飯器で作れる
Level 3: 味噌     → 6ヶ月・年1回の仕込み体験
Level 4: 醤油     → 1年・本格的な発酵体験
Level 5: 蔵元訪問  → 「職人に会いに行く」体験記

→ シリーズ構造があるので「次に何を書くか」が自動決定
→ 読者をLevel 1から5へ段階的に引き上げる設計
```

### 調査フロー（Perplexity必須の理由）

```
「味噌は腸内環境を改善する」と書く場合:

  Claude + WebSearch:
    一般情報は取れるが引用が曖昧
    「研究によると...」レベルで信頼性が低い

  Perplexity API:
    「A 2023 study published in Journal of Nutritional
     Science (doi:10.xxxx) found that...」
    査読論文・大学研究を正確に引用できる

海外読者は健康クレームに敏感 → 引用の質が信頼性・権威性に直結
```

```
Hakko 調査フロー:
  ① Perplexity API → 科学的エビデンスを引用付きで収集
  ② Claude + WebSearch → 日本の蔵元・産地・文化背景を調査
  ③ Claude が両方を統合 → 「科学×文化」の記事構成を生成

追加コスト: Perplexity API $20/月
```

---

## 収益構造

```
主役: ワークショップ（高単価・スケールしやすい）
  「オンライン味噌仕込みワークショップ」
  $49/人 × 月20人 = $980/月
  Zoom開催 + Claude APIでQ&A自動対応
  録画版を$29で常時販売 → パッシブ収益化

電子書籍:
  「The Japanese Home Fermentation Guide」$18
  Ko-fi / Gumroad で販売
  全Levelをカバーした完全版

アフィリエイト（補助）:
  味噌仕込み容器 $25 × 4% = $1.00
  重石セット     $15 × 4% = $0.60
  ※単価が低いため補助的位置づけ

Beehiiv 有料購読:
  発酵コミュニティ（季節レシピ・Q&A）$9/月
  コアファンの囲い込み
```

---

## コンテンツカレンダー（季節ベース）

| 時期 | トピック | Level | 優先度 |
|------|---------|-------|------|
| 1〜2月 | 味噌仕込みガイド | 3 | 高 |
| 3月 | 塩麹の作り方（入門） | 1 | 高 |
| 4月 | 甘酒入門 | 2 | 高 |
| 5〜6月 | 梅仕込みシリーズ | 2 | 高 |
| 7〜8月 | ぬか漬け夏管理 | 2 | 中 |
| 9月 | 新米で甘酒 | 2 | 中 |
| 10月 | 醤油を知る | 4 | 中 |
| 通年 | 蔵元訪問記・麹の科学 | 5 | 低 |

---

## 想定トピック候補

| Level | タイトル案(EN) | 優先度 | 記事ID |
|-------|-------------|------|-------|
| 1 | Shio koji: the simplest Japanese fermentation you can start today | 高 | hk-001 |
| 1 | Koji: the Japanese ingredient changing the world's kitchens | 高 | hk-002 |
| 2 | How to make amazake: Japan's ancient energy drink | 高 | hk-003 |
| 3 | How to make miso at home: a complete guide | 高 | hk-004 |
| 3 | Why Japanese miso tastes different from region to region | 中 | hk-005 |
| 4 | What makes Japanese soy sauce different | 中 | hk-006 |
| 2 | Nukadoko: the living jar that's been in Japanese homes for centuries | 中 | hk-007 |
| 5 | Inside a Japanese sake brewery: what I saw and smelled | 低 | hk-008 |
| 科学 | The science behind Japanese fermentation: what research says | 低 | hk-009 |

---

## 記事一覧

| ID | タイトル(EN) | Level | ステータス | 公開日 | PV | 収益($) |
|----|------------|-------|----------|--------|-----|--------|
| — | — | — | *(記事はまだありません)* | — | — | — |

---

## リパーパス状況

| 記事ID | Beehiiv | Ghost | Twitter | Instagram | Ko-fi | Workshop |
|-------|---------|-------|---------|-----------|-------|---------|
| — | — | — | — | — | — | — |
