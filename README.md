# Ideation Workspace

抽象的なアイデアから、ペルソナ・SNS戦略・収益化計画・要件定義まで一気通貫で扱う企画スペース。
アプリ開発・note記事・SNS発信など領域を問わず使用する。

---

## ディレクトリ構成

```
ideation/
├── README.md            ← このファイル
├── CLAUDE.md            ← エージェント向けルール定義
├── brainstorm/          ← アイデア発散セッションの記録
├── research/
│   ├── market/          ← 市場規模・競合・アプリ調査
│   ├── sns/             ← SNS競合アカウント・バズ分析
│   └── trends/          ← トレンドキーワード・業界動向
├── personas/            ← ターゲットペルソナ定義
├── strategy/
│   ├── sns/             ← SNS運用戦略・フォロワー獲得計画
│   └── monetize/        ← 収益化ロードマップ・マネタイズ設計
├── requirements/        ← 要件定義・機能仕様・MVP設計
└── backlog/
    ├── apps.md          ← SaaS・アプリアイデア一覧
    └── content.md       ← note記事・SNSネタ候補一覧
```

---

## アイデアのフロー

```
brainstorm/ → research/ → personas/ → strategy/ → requirements/
  （発散）      （調査）    （対象定義）  （戦略立案）  （具体化）
```

`backlog/` はフロー全体を通じてアイデアを蓄積・管理する保管場所。

### アプリを企画する場合

```
/multi-perspective-ideation  →  brainstorm/
/app-research                →  research/market/
（ペルソナを整理）             →  personas/
（要件を書く）                →  requirements/
```

### SNS発信を始める・強化する場合

```
/multi-perspective-ideation  →  brainstorm/  ← SNS展開ブリーフも出力される
/sns-research                →  research/sns/ + personas/
/sns-strategy                →  strategy/sns/ + strategy/monetize/
```

### note・コンテンツの方向性を決める場合

```
/multi-perspective-ideation  →  brainstorm/
/sns-research                →  research/sns/
（投稿ネタをまとめる）         →  backlog/content.md
```

---

## 使用スキル

スキルファイルの配置場所: `.claude/skills/[スキル名]/SKILL.md`（プロジェクトルート直下）

### 1. multi-perspective-ideation

**役割:** 8人の仮想専門家がそれぞれの視点でアイデアを出し、融合・評価・深掘りまで行うブレストスキル。

**トリガー:** 「ブレスト」「アイデアを出して」「多角的に考えて」「brainstorm」「ideate」

**フェーズ:**

| フェーズ | 内容 | スキップ可 |
|---------|------|----------|
| Phase 0 | テーマ・制約・ペルソナ確認 | No |
| Phase 1 | 8専門家が各2〜3案を提案（計16〜24案） | No |
| Phase 2 | 異なる視点を融合してハイブリッドアイデア5〜8案を生成 | Yes |
| Phase 3 | 実現性・インパクト・新規性・コスト効率の4軸でスコアリング | Yes |
| Phase 4 | 上位アイデアのDeep Dive（ミニ提案書＋SNS展開ブリーフ） | Yes |

**8専門家のペルソナ:**

| ペルソナ | 着眼点 |
|---------|-------|
| クリエイティブ専門家 | 表現・体験・物語化 |
| 技術専門家 | 自動化・スケーラビリティ |
| ビジネス専門家 | 価値創造・収益モデル |
| 学術研究者 | エビデンス・理論的根拠 |
| 社会科学者 | 行動心理・インセンティブ設計 |
| ディスラプター | 前提破壊・逆張り |
| ユーモリスト | バイラル・拡散・共感 |
| 冒険家 | ムーンショット・大胆な構想 |

**Deep Dive の出力（Phase 4）:**
- Overview / Target / Implementation Steps / Risks & Mitigations / Success Metrics / First Action
- **SNS展開ブリーフ**（コンセプト一言・ターゲット・推奨プラットフォーム・SNS目的・差別化の軸）← `/sns-research` への引き継ぎ情報

**出力先:** `brainstorm/YYYY-MM-DD-[テーマ].md`

---

### 2. sns-research

**役割:** WebSearch を使ってSNSの市場・競合を調査し、ペルソナを設計する。`/sns-strategy` を使う前に必ず実行する。

**トリガー:** 「SNS調査」「競合分析」「ペルソナを作って」「市場を調べて」「バズ投稿を分析」

**フェーズ:**

| フェーズ | 内容 |
|---------|------|
| Phase 0 | `brainstorm/` の最新SNS展開ブリーフを自動読み込み。不足情報のみ確認 |
| Phase 1 | 市場調査（投稿量・トレンドテーマ・競合密度・参入余地） |
| Phase 2 | 競合分析（トップ3〜5アカウントのバズパターン・勝ち負けパターン） |
| Phase 3 | ペルソナ設計（デモグラフィック・感情的欲求・行動トリガー） |
| Phase 4 | 勝ちパターンサマリー・狙うべきニッチ TOP3・ファイル保存 |

**Phase 0 の自動連携:**
`brainstorm/` に SNS展開ブリーフ（`/multi-perspective-ideation` の Phase 4 出力）があれば自動で読み込み、コンセプト・ターゲット・プラットフォームを前提として調査を開始する。

**出力先:**
- 調査レポート → `research/sns/YYYY-MM-DD-[プラットフォーム]-[ジャンル].md`
- ペルソナ定義 → `personas/[ペルソナ名].md`

---

### 3. sns-strategy

**役割:** SNSのフォロワー獲得戦略・コンテンツ計画・収益化ロードマップを設計する。`/sns-research` の結果があると精度が上がる。

**トリガー:** 「SNS戦略」「フォロワー増やしたい」「収益化したい」「マネタイズ計画」「投稿計画を立てて」

**フェーズ:**

| フェーズ | 内容 |
|---------|------|
| Phase 0 | `research/sns/` と `personas/` の既存ファイルを読み込み。不足情報のみ確認 |
| Phase 1 | ポジショニング設計（コンセプト・発信3本柱・やらないこと） |
| Phase 2 | コンテンツ戦略（投稿ジャンル3種・投稿ネタ・バズテンプレ） |
| Phase 3 | フォロワー獲得プラン（フェーズ別戦略・最初の30日アクション・アルゴリズム対策） |
| Phase 4 | 収益化ロードマップ（段階別マネタイズ・商品アイデア3案・ファネル設計） |
| Phase 5 | 実行計画サマリー（今週・30日・90日の目標とKPI）・ファイル保存 |

**出力先:**
- SNS戦略 → `strategy/sns/YYYY-MM-DD-[プラットフォーム]-strategy.md`
- 収益化計画 → `strategy/monetize/YYYY-MM-DD-[プラットフォーム]-monetize.md`

---

### 4. ideate（補助）

**役割:** アプリに特化したアイデア生成。`/multi-perspective-ideation` より軽量で、テーマ指定なしで既存リサーチ結果を参照して動く。

**トリガー:** `/ideate` コマンド

**出力先:** `brainstorm/YYYY-MM-DD-[テーマ].md`

---

### 5. app-research（補助）

**役割:** アプリ市場の需要調査・競合スクリーニング。

**トリガー:** `/app-research` コマンド

**出力先:** `research/market/YYYY-MM-DD-[テーマ].md`

---

## スキルのインストール方法

スキルは以下のパスに配置することでプロジェクト内で有効化される。

```
[プロジェクトルート]/
└── .claude/
    └── skills/
        ├── multi-perspective-ideation/
        │   ├── SKILL.md
        │   └── references/
        │       └── personas.md
        ├── sns-research/
        │   └── SKILL.md
        └── sns-strategy/
            └── SKILL.md
```

`multi-perspective-ideation` は [nogataka/SkillLab](https://github.com/nogataka/SkillLab/tree/main/multi-perspective-ideation) をベースにSNS展開ブリーフを追加カスタマイズしたもの。

`sns-research` / `sns-strategy` はこのプロジェクト独自スキル。

---

## ファイル命名規則

| 種類 | パス | 命名規則 |
|-----|-----|---------|
| ブレストセッション | `brainstorm/` | `YYYY-MM-DD-[テーマ].md` |
| 市場調査 | `research/market/` | `YYYY-MM-DD-[テーマ].md` |
| SNS調査 | `research/sns/` | `YYYY-MM-DD-[プラットフォーム]-[ジャンル].md` |
| ペルソナ | `personas/` | `[ペルソナ名].md`（日付なし・上書き更新） |
| SNS戦略 | `strategy/sns/` | `YYYY-MM-DD-[プラットフォーム]-strategy.md` |
| 収益化計画 | `strategy/monetize/` | `YYYY-MM-DD-[プラットフォーム]-monetize.md` |
| 要件定義 | `requirements/` | `YYYY-MM-DD-[プロダクト名].md` |

---

## バックログの管理

### apps.md（アプリ・SaaSアイデア）

ステータス管理:

```
💡 idea      → 思いついたレベル
🔍 research  → 調査・検証中
📋 planning  → 企画中（pm/ に昇格準備）
✅ shipped   → リリース・公開済み
🚫 archived  → 見送り（理由を記載）
```

### content.md（note記事・SNSネタ）

同様のステータスでジャンル・媒体ごとに管理。
