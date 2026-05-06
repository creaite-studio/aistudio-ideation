# Ideation Workspace

抽象的なアイデアから、ペルソナ・SNS戦略・収益化計画・要件定義まで一気通貫で扱う企画スペース。
アプリ開発・note記事・SNS発信など領域を問わず使用する。

---

## ディレクトリ構成

調査結果や企画成果物はジャンル単位でまとめる。

```
ideation/
└── genres/
    ├── cross-genre-affiliate-sns/
    │   └── brainstorm/
    ├── horror-creative-tool/
    │   ├── brainstorm/
    │   ├── research/sns/
    │   ├── personas/
    │   ├── strategy/sns/
    │   ├── strategy/monetize/
    │   └── requirements/
    ├── mahjong/
    │   └── brainstorm/
    ├── darts/
    │   └── brainstorm/
    ├── spirituality/
    │   └── brainstorm/
    ├── adult/
    │   └── brainstorm/
    └── other-apps/
        └── brainstorm/
```

既存のトップレベル `content/`、`research/`、`strategy/` は公開コンテンツや横断的な調査・戦略に使う。個別ジャンルの企画成果物は `ideation/genres/` に置く。

---

## アイデアのフロー

各ジャンルディレクトリ内で以下の順に育てる。

```
brainstorm/ → research/ → personas/ → strategy/ → requirements/
  （発散）      （調査）    （対象定義）  （戦略立案）  （具体化）
```

### アプリを企画する場合

```
/multi-perspective-ideation  →  ideation/genres/[genre]/brainstorm/
/app-research                →  ideation/genres/[genre]/research/market/
（ペルソナを整理）             →  ideation/genres/[genre]/personas/
（要件を書く）                →  ideation/genres/[genre]/requirements/
```

### SNS発信を始める・強化する場合

```
/multi-perspective-ideation  →  ideation/genres/[genre]/brainstorm/
/sns-research                →  ideation/genres/[genre]/research/sns/ + ideation/genres/[genre]/personas/
/sns-strategy                →  ideation/genres/[genre]/strategy/sns/ + ideation/genres/[genre]/strategy/monetize/
```

---

## ファイル命名規則

| 種類 | パス | 命名規則 |
|-----|-----|---------|
| ブレストセッション | `ideation/genres/[genre]/brainstorm/` | `YYYY-MM-DD-[テーマ].md` |
| 市場調査 | `ideation/genres/[genre]/research/market/` | `YYYY-MM-DD-[テーマ].md` |
| SNS調査 | `ideation/genres/[genre]/research/sns/` | `YYYY-MM-DD-[プラットフォーム]-[ジャンル].md` |
| ペルソナ | `ideation/genres/[genre]/personas/` | `[ペルソナ名].md` |
| SNS戦略 | `ideation/genres/[genre]/strategy/sns/` | `YYYY-MM-DD-[プラットフォーム]-strategy.md` |
| 収益化計画 | `ideation/genres/[genre]/strategy/monetize/` | `YYYY-MM-DD-[プラットフォーム]-monetize.md` |
| 要件定義 | `ideation/genres/[genre]/requirements/` | `[プロダクト名]-[フェーズ].md` |

---

## ClaudeCode スキル

スキルファイルは `.claude/skills/[skill-name]/SKILL.md` に置く。

- `multi-perspective-ideation`: 多角的なブレスト
- `sns-research`: SNS市場・競合・ペルソナ調査
- `sns-strategy`: SNS戦略・収益化計画

保存時は必ず対象ジャンルを決めて、`ideation/genres/[genre]/...` に成果物を配置する。
