# 自動化コンテンツパイプライン 設計書

作成日: 2026-05-05
更新日: 2026-05-05
テーマ: ① 72 Micro-Seasons / ② Bungu（文具）/ ③ Japan Travel Guide（インドネシア向け）
ゴール: 月2〜3時間の戦略レビューのみで3テーマを並列運用

---

## 3テーマの役割分担

| テーマ | 言語 | 主戦場 | 収益モデル |
|-------|------|-------|----------|
| 72 Micro-Seasons | 英語 | Beehiiv + Substack | ニュースレター課金 |
| Bungu（文具） | 英語 | Ghost + Medium | アフィリエイト（SEO複利） |
| Japan Travel Guide | インドネシア語 | KaryaKarsa | 週次シリアル購読 |

---

## 全体アーキテクチャ

```
┌─────────────────────────────────────────────────┐
│              司令塔（オーケストレーター）              │
│         n8n + Claude API で全部隊を調整            │
└──────────────────┬──────────────────────────────┘
                   │
       ┌───────────▼───────────┐
       │      INPUT LAYER      │
       │  トレンド監視 / 読者信号  │
       └───────────┬───────────┘
                   │
       ┌───────────▼─────────────────────────┐
       │         PRODUCTION PIPELINE          │
       │  調査 → 企画 → 執筆 → 翻訳 → リパーパス │
       └───────────┬─────────────────────────┘
                   │
       ┌───────────▼───────────┐
       │   DISTRIBUTION LAYER  │
       │  投稿 + CRM（読者関係）  │
       └───────────┬───────────┘
                   │
       ┌───────────▼───────────┐
       │   OPTIMIZATION LAYER  │
       │  分析 + マネタイズ最適化  │
       └───────────┬───────────┘
                   │
                   └──→ 司令塔にフィードバック（ループ）
```

---

## ツールスタック

### Phase 1（月$19〜で起動）

| ツール | 用途 | コスト |
|-------|------|-------|
| Claude API (Sonnet 4.6) | 全AI処理 | ~$10（実使用量） |
| Ghost Pro Starter | Bungu SEOブログ | $9 |
| Beehiiv 無料プラン | 72候ニュースレター | $0（2,500人まで） |
| Substack | 発見・集客 | $0 |
| KaryaKarsa | Indonesia展開 | $0（手数料10%） |
| **合計** | | **~$19/月** |

### フルスタック（スケール後）

| レイヤー | ツール | 月額 | 自動化レベル |
|--------|-------|------|------------|
| オーケストレーション | n8n（セルフホスト） | $10 | ★★★★★ |
| AI全般 | Claude API (Sonnet 4.6) | ~$30 | ★★★★★ |
| ニュースレター | Beehiiv Scale | $42 | ★★★★★ |
| SEOブログ | Ghost Pro | $25 | ★★★★☆ |
| SNSスケジュール | Buffer | $18 | ★★★★☆ |
| デジタル販売 | Ko-fi Gold | $6 | ★★★☆☆ |
| 画像生成 | Ideogram API | $20 | ★★★★☆ |
| 分析 | Google Looker Studio | $0 | ★★★★☆ |
| Indonesia配信 | KaryaKarsa | $0（手数料10%） | ★★☆☆☆ |
| **合計** | | **~$151/月** | |

> **Perplexityは不要**: 調査はClaude + WebSearchで完結。
> **Amazon PA API**: ご自身で対応のため除外。
> **Substack**: APIが限定的なため自動化対象外。発見ツールとして手動運用。

---

## 各部隊の詳細設計

### 1. 司令塔（オーケストレーター）

**役割**: 3テーマのスケジューリング・優先度管理・ボトルネック検知

```
毎朝 9:00 → n8n が起動
  ├── 72候カレンダーを参照し「今日の候」を確認
  ├── Bungu記事の公開スケジュールを確認
  ├── KaryaKarsa用翻訳キューを確認
  └── 前日のKPI（ビュー・収益・開封率）をSlack通知
```

**人間がやること**: 週1回のSlack通知を3分確認するだけ

---

### 2. INPUT LAYER

#### 2a. トレンド監視部隊

```
自動フロー（毎日）:
  72候: 72候カレンダーDBから自動取得（トレンド監視不要）
  Bungu: Reddit (r/notebooks, r/pens) のRSSを監視
         + Hobonichi公式サイトの新着情報
  Indonesia: Google Trends ID で「wisata jepang」監視
         + インドネシア旅行シーズンカレンダー参照
        ↓
  Claude API でスコアリング → トレンドキューに追加
```

#### 2b. 読者信号収集部隊

```
収集源:
  - Beehiiv: メール開封率・クリック率
  - Ghost: PV・滞在時間・コメント
  - KaryaKarsa: 購読者数・エピソード閲覧数
        ↓
  週次でClaude APIが3テーマ合算レポートを生成
```

---

### 3. PRODUCTION PIPELINE

#### 3a. 調査部隊（テーマ別）

**72 Micro-Seasons**
```
トリガー: 候の5日前に自動起動
        ↓
Claude + WebSearch で調査:
  - 候の意味・語源・歴史的背景
  - 関連する日本の行事・食材・風景
  - 海外のslow living / mindfulness文脈との接点
  - 競合記事3本の構成分析
```

**Bungu**
```
トリガー: Hobonichi新作発表 or Redditトレンド上位
        ↓
Claude + WebSearch で調査:
  - 製品情報・価格・スペック
  - コミュニティの実際の反応（Reddit）
  - 文化・歴史背景（日本在住の視点）
  - SEOキーワードの検索ボリューム確認
```

**Japan Travel Guide（Indonesia向け）**
```
トリガー: 週次（毎週月曜）に自動起動
        ↓
Claude + WebSearch で調査:
  - 今週取り上げるエリア・スポットの最新情報
  - インドネシア人旅行者のよくある疑問（Reddit ID, TripAdvisor）
  - ハラール対応情報（モスク・ハラール飲食店）
  - 旅行シーズン・混雑情報
```

#### 3b. 企画部隊

```
トリガー: 調査レポートの保存を検知
        ↓
Claude API で記事構成を生成:
  72候: タイトル案×3 / 見出し構成 / 季節関連商品リスト
  Bungu: SEOタイトル / H2構成 / アフィリ挿入箇所
  Indonesia: シリアルタイトル / エピソード構成 / ハラール情報箇所
        ↓
企画書を drafts/ に保存
```

**72候の自動スケジュール（企画ほぼ不要）**
```
72候は年間72本のテーマが暦で確定
→ 5日前に調査自動起動 → 3日前に執筆自動起動
→ 「何を書くか」の意思決定ゼロ
```

#### 3c. 執筆部隊

```
Claude API (Opus 4.7) で本文生成

72候 system prompt:
  「あなたは日本在住の日本人として、英語圏の読者に
   日本の季節の知恵を届けるライターです。一人称の
   体験を必ず含め、翻訳ではなくオリジナルの視点で。」

Bungu system prompt:
  「あなたは日本在住の文具愛好家です。英語圏の読者に
   日本の文具文化を紹介します。製品レビューには必ず
   実際に使った体験を含め、SEOキーワードを自然に入れて。」

Indonesia system prompt:
  「Anda adalah orang Jepang yang tinggal di Jepang.
   Tulis panduan wisata Jepang yang jujur dan personal
   untuk pembaca Indonesia. Selalu sertakan info halal.」

品質ゲート（自動評価）:
  □ 指定文字数内か
  □ 日本人の一次情報が含まれているか
  □ 各テーマの必須要素があるか
  → 80点以上で次工程へ / 以下は自動修正リトライ
```

#### 3d. 翻訳部隊（新設・Indonesia向け）

```
トリガー: 72候の英語記事が完成したことを検知
        ↓
Claude API で自動翻訳:
  英語 → インドネシア語（Bahasa Indonesia）
  翻訳方針:
    - 直訳ではなく意訳・ローカライズ
    - インドネシア人に馴染みのない概念は補足説明を追加
    - ハラール関連の注意点があれば加筆
        ↓
翻訳版を content/72-micro-seasons/repurposed/karyakarsa/ に保存
```

#### 3e. リパーパス部隊

```
トリガー: 完成記事の保存を検知
        ↓
Claude APIが5フォーマットを並列生成:

  ① Beehiivニュースレター版（72候・要約+CTA）
  ② Substack Notes用抜粋（1〜3段落・毎日投稿）
  ③ Twitterスレッド（8〜12ツイート）
  ④ Instagramカルーセル（スライド構成 5〜8枚）
  ⑤ Ko-fi PDFガイド（季節特集・テンプレート）

  ＋ KaryaKarsaエピソード（翻訳部隊から自動連携）
        ↓
各フォーマットを repurposed/ に保存
Ideogram APIで各フォーマット用の画像を自動生成
```

---

### 4. DISTRIBUTION LAYER

#### 4a. 投稿部隊

**72 Micro-Seasons（5日サイクル）**
```
Day 0（候の初日）:
  6:00  → Beehiiv ニュースレター送信
  8:00  → Substack Notes に抜粋投稿
  12:00 → Twitterスレッド投稿（リンクはリプライに）
  18:00 → Instagram カルーセル投稿

Day 2:
  → Ko-fi PDFをアップロード・Beehiivで告知

Day 4（次の候の前日）:
  → 「次の候」ティーザー投稿（Twitter + Instagram）
```

**Bungu（週次）**
```
月曜:
  8:00  → Ghost 記事公開
  12:00 → Beehiiv ニュースレター送信（記事紹介）
木曜:
  → Twitterスレッド（記事の核心部分を抜粋）
  → Instagram カルーセル（デスクセットアップ系）
```

**Japan Travel Guide / KaryaKarsa（週次）**
```
木曜:
  → KaryaKarsa 新エピソード公開
  → TikTok（Indonesia向け）で告知動画
  ※ KaryaKarsa APIが限定的なため、
    n8nからWebhookで半自動投稿 or 週1回の手動確認
```

**API接続**
```
Ghost API     → 記事自動公開
Beehiiv API   → ニュースレター送信
Buffer API    → Twitter / Instagram スケジュール投稿
KaryaKarsa    → Webhook or 手動（月1回の確認工数）
Ko-fi         → 手動（月数回）
```

#### 4b. 読者関係部隊（CRM）

**72候・Beehiiv自動シーケンス**
```
購読直後:
  Day 0: ウェルカムメール（日本人の自己紹介）
  Day 3: 「なぜ72候なのか」ストーリーメール
  Day 7: 最初の有料コンテンツ案内
継続購読者:
  毎月: 翌月の候カレンダーPDF送付
  毎季: 季節特集（春夏秋冬）有料号の案内
離脱防止:
  30日未開封 → リエンゲージメントメール
  90日未開封 → 解除確認メール
```

**KaryaKarsa読者向け**
```
新規購読者: 歓迎メッセージ（インドネシア語）
毎週: エピソード公開の通知
月次: 「先月の人気エピソード」まとめ投稿
```

---

### 5. OPTIMIZATION LAYER

#### 5a. 分析部隊

```
週次自動レポート（毎週月曜朝）:
┌──────────────────────────────────────┐
│       先週のパフォーマンスサマリー          │
├──────────────┬───────────────────────┤
│ 72候         │ Beehiiv開封率・Ko-fi売上  │
│ Bungu        │ Ghost PV・アフィリ収益    │
│ Indonesia    │ KaryaKarsa購読者数・閲覧  │
├──────────────┴───────────────────────┤
│ 今週のベスト: 蛙始鳴（開封率42%）          │
│ 要改善: 土潤溽暑（開封率18%・原因分析付き）  │
└──────────────────────────────────────┘
```

#### 5b. マネタイズ最適化部隊

```
月次で自動実行:
  □ アフィリエイトリンクCTR確認 → 低いリンクを差し替え候補化
  □ Ko-fi PDFの価格帯分析 → 売れ筋価格を調整
  □ KaryaKarsaの無料/有料エピソード比率の最適化
  □ 季節商品の告知タイミング最適化
```

---

## コスト vs 収益シミュレーション

### コスト

```
【Phase 1 最小構成】
  Claude API（実使用量）:  ~$10
  Ghost Pro Starter:        $9
  ─────────────────────────
  合計:                    ~$19/月

【フルスタック（スケール後）】
  n8n サーバー（VPS）:  $10
  Claude API:           $30
  Beehiiv Scale:        $42
  Ghost Pro:            $25
  Buffer:               $18
  Ko-fi Gold:           $6
  Ideogram API:         $20
  ─────────────────────────
  合計:                $151/月
```

### 収益目標（月）

**① 72 Micro-Seasons（ニュースレター課金）**
```
Phase 1（3ヶ月後）:
  Beehiiv有料購読 × 50人 × $9    = $450
  Ko-fi季節PDF × 15本 × $5       = $75
  小計:                           $525

Phase 2（6ヶ月後）:
  有料購読 × 200人 × $9           = $1,800
  Ko-fi デジタル商品              = $200
  小計:                           $2,000
```

**② Bungu（アフィリエイト・SEO複利）**
```
Phase 1（記事10本）:
  Amazonアフィリ 月50転換 × 平均$2 = $100

Phase 2（記事30本）:
  Amazonアフィリ 月300転換 × 平均$2 = $600
  Ko-fi セットアップPDF × 20本      = $160
  小計:                              $760
```

**③ Japan Travel Guide（KaryaKarsa・Indonesia）**
```
Phase 1（エピソード10本・購読者100人）:
  KaryaKarsa購読 × 100人 × $1.5 = $150
  ※ Rp25,000/月 ≈ $1.5

Phase 2（購読者500人）:
  KaryaKarsa購読 × 500人 × $1.5 = $750
  単話購入（バックナンバー）        = $100
  小計:                            $850
```

**合算目標**
```
Phase 1（3ヶ月後）:
  $525 + $100 + $150 - $19 = 月+$756

Phase 2（6ヶ月後）:
  $2,000 + $760 + $850 - $151 = 月+$3,459

Phase 3（1年後）:
  スポンサー・コラボ追加で月$6,000+
```

---

## 人間がやること（あなたの仕事）

```
毎日: 0分（完全自動）

毎週: 10分
  ├── Slack週次レポートを確認（5分）
  └── KaryaKarsaエピソード投稿の確認（5分）
      ※ KaryaKarsa APIが限定的なため週1回の手動確認

毎月: 2〜3時間
  ├── 月次KPIレビュー（3テーマ合算）
  ├── マネタイズ調整の最終承認
  ├── Japan Travel Guideの翌月テーマ確認
  └── 新テーマ追加の判断

初期セットアップ: 40〜60時間（一回限り）
  ├── n8n フロー構築（3テーマ分）
  ├── 各ツールのAPI連携
  ├── Claude プロンプト設計（テーマ別）
  ├── 72候データベース登録
  ├── KaryaKarsaアカウント開設・初期設定
  └── 各プラットフォームのアカウント開設
```

---

## Phase 別ロードマップ

```
Phase 1（月1〜2）: 72候 で基盤確立
  - 72 Micro-Seasons のみ・手動でパイプライン確認
  - Beehiiv無料プラン + Ghost Starter + Substack Notes
  - 目標: 購読者100人・月+$200

Phase 2（月3〜4）: 自動化 & Bungu追加
  - n8n で主要フローを自動化
  - Bungu記事を週1〜2本ペースで開始
  - Twitter / Instagram 展開開始
  - 目標: 購読者300人・月+$800

Phase 3（月5〜6）: Indonesia展開
  - KaryaKarsa開設・旅行ガイドシリアル開始
  - 72候のインドネシア語自動翻訳フローを稼働
  - TikTok（Indonesia向け）追加
  - 目標: 3テーマ合算 月+$1,500

Phase 4（月7〜）: SEO複利 & 最適化
  - 3テーマフル稼働・記事資産50本超
  - Bunguアフィリがオーガニック検索から複利収益
  - KaryaKarsa購読者500人突破
  - 法人スポンサー・コラボ開始
  - 目標: 月+$5,000
```

---

## 関連ファイル

- コンテンツ管理: `content/_index.md`
- 記事テンプレート: `content/_templates/article-frontmatter.md`
- 72候カレンダー: `content/72-micro-seasons/_calendar.md`
- 文具アフィリ商品: `content/bungu/_affiliate-products.md`
- Indonesia市場調査: `research/sns/2026-05-05-indonesia-japan-market.md`
- プラットフォーム戦略: `strategy/sns/2026-05-05-platform-content-strategy.md`
