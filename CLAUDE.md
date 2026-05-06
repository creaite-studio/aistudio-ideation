# アイデア出しワークスペース

## 役割

抽象的なアイデアから、具体的な要件・戦略・収益化計画まで一気通貫で扱う企画スペース。
アプリ開発・note記事・SNS発信など領域を問わず使用する。

## 基本方針

調査結果・戦略・要件定義などの成果物は、機能別のトップレベルではなくジャンル別に整理する。

```
ideation/genres/[genre]/
├── brainstorm/          ← アイデア発散セッションの記録
├── research/
│   ├── market/          ← 市場規模・競合・アプリ調査
│   ├── sns/             ← SNS調査・競合アカウント・バズ分析
│   └── trends/          ← トレンドキーワード・業界動向
├── personas/            ← ターゲットペルソナ定義
├── strategy/
│   ├── sns/             ← SNS運用戦略・フォロワー獲得計画
│   └── monetize/        ← 収益化ロードマップ・マネタイズ設計
└── requirements/        ← 要件定義・機能仕様・MVP設計
```

既存ジャンル:

- `cross-genre-affiliate-sns`: アフィリエイト×SNSの横断ブレスト
- `horror-creative-tool`: ホラー創作・物語作成支援ツール
- `mahjong`: 麻雀
- `darts`: ダーツ
- `spirituality`: 占い・スピリチュアル
- `adult`: アダルト
- `other-apps`: その他アプリ案

## アイデアのフロー

```
brainstorm/ → research/ → personas/ → strategy/ → requirements/
  （発散）      （調査）    （対象）     （戦略）      （具体化）
```

## スキルと出力先の対応

| スキル | 役割 | 出力先 |
| --- | --- | --- |
| `/multi-perspective-ideation` | 8専門家視点のブレスト | `ideation/genres/[genre]/brainstorm/` |
| `/ideate` | アプリアイデア発散 | `ideation/genres/[genre]/brainstorm/` |
| `/app-research` | アプリ市場調査 | `ideation/genres/[genre]/research/market/` |
| `/sns-research` | SNS市場・競合・ペルソナ調査 | `ideation/genres/[genre]/research/sns/` + `ideation/genres/[genre]/personas/` |
| `/sns-strategy` | フォロワー獲得・収益化戦略 | `ideation/genres/[genre]/strategy/sns/` + `ideation/genres/[genre]/strategy/monetize/` |

## ルール

- 成果物を保存する前に対象ジャンルを決める。
- ジャンルが未定の場合は `cross-genre-affiliate-sns` や `other-apps` などの横断・その他ジャンルに置く。
- アイデアには必ずタグを付ける: `#app` `#note` `#sns` `#video`
- 調査結果には出典 URL を必ず記載する。
- 同日付・同テーマのファイルがある場合は追記を優先し、重複ファイルを増やさない。
- ファイル操作前に必ず今日の日付を確認する。
