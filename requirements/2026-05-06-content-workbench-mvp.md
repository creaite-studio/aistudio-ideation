# Content Workbench MVP 要件定義

作成日: 2026-05-06  
対象: note系プラットフォーム向け記事制作ワークベンチ（調査→企画→執筆→PF別調整）

---

## 1. 背景と目的

現状、調査・戦略・企画情報は Markdown ドキュメントとして蓄積されているが、以下が手作業で分散している。

- 記事本文の編集
- 記事内挿入画像の生成
- プラットフォーム別（Beehiiv / Ghost / X / Instagram / KaryaKarsa）でのタイトル・文面調整

本MVPの目的は、**既存ドキュメント資産を活かしつつ、記事制作のUIを最小コストで提供すること**。

---

## 2. スコープ

### 2.1 MVPで実装する範囲

1. 記事ワークスペース（一覧・編集・保存）
2. プラットフォーム別バリアント編集（タイトル/要約/投稿文）
3. 画像生成（1プロンプト→1画像）と本文挿入
4. 公開前チェックリスト（簡易品質ゲート）
5. ダッシュボード（件数の可視化）
6. Library（生成画像の一覧・検索・再利用）

### 2.2 MVPで実装しない範囲（将来拡張）

- 各プラットフォームへの自動投稿
- n8nによる完全自動オーケストレーション
- 高度な分析ダッシュボード（PV/開封率の自動取得）
- A/Bテスト自動最適化

---

## 3. 想定ユーザー

- 運用者本人（単一ユーザー）
- 目的: 既存リサーチを読みながら、短時間で記事を仕上げ、PF別に再構成する

---

## 4. ユースケース

### UC-01 記事を新規作成する
- ユーザーはテーマ（72ms / bungu / id-travel）を選ぶ
- ユーザーは本文Markdownを入力し保存する
- システムは記事IDを採番して保存する

### UC-02 既存記事を編集する
- ユーザーは一覧から記事を選択する
- ユーザーは本文・タグ・ステータスを更新する
- システムは更新日時を記録する

### UC-03 プラットフォーム別文面を作る
- ユーザーはPFタブ（Beehiiv/Ghost/X/Instagram/KaryaKarsa）を開く
- ユーザーはPF専用のタイトル・要約・CTA等を編集する
- システムはベース本文とは別にバリアントを保存する

### UC-04 画像を生成して本文に差し込む
- ユーザーは用途（アイキャッチ/挿絵等）とプロンプトを入力
- システムは画像を生成し、URLまたはファイル参照を返す
- ユーザーは本文へ挿入する

### UC-05 公開可否を確認する
- ユーザーはチェックリストを実行する
- システムは必須項目の充足状況を表示する
- ユーザーは `Ready to Post` 状態を確認する

---

## 5. 機能要件

## FR-01 記事一覧・検索・絞り込み
- テーマ、ステータス、対象PF、タグで絞り込みできること
- 更新日時降順で並ぶこと

## FR-02 記事編集
- Markdown本文の編集・保存ができること
- タイトル、タグ、ステータス（draft/review/published/archived）を編集できること
- 自動保存または明示保存を選べること（初期は明示保存）

## FR-03 プラットフォーム別バリアント
- 1記事に対し、以下フィールドを保持できること
  - Beehiiv: title, summary, cta
  - Ghost: title, seoDescription
  - X: hook, threadDraft
  - Instagram: slide1Hook, slideOutline, finalCta
  - KaryaKarsa: titleId, episodeSummaryId, halalNote, nextEpisodeHook


## FR-03b フィールド入力ガイド（はてなツールチップ）
- プラットフォーム別フィールドのラベル横に `?` アイコンを表示すること
- ユーザーが `?` アイコンにホバー（またはフォーカス）した際、説明ツールチップを表示すること
- ツールチップには「その項目に何を書くべきか」を1〜2文で明記すること
- キーボード操作時にも表示可能であること（アクセシビリティ対応）
- 各プラットフォームの説明文は設定ファイルから管理できること（将来の文言変更を容易化）

## FR-04 画像生成
- プロンプト、用途、比率を指定して画像を1枚生成できること
- 生成結果を記事に紐づけて保存できること
- 本文への挿入用マークダウン（`![alt](url)`）をワンクリックでコピーできること

## FR-05 公開チェックリスト
- 以下のチェック項目を判定できること
  - 本文文字数が最小値以上
  - タグが1つ以上
  - PF別必須項目が入力済み
  - CTAが入力済み（必要PFのみ）
  - KaryaKarsa選択時は halalNote と nextEpisodeHook が入力済み
- 判定結果を `Ready / Not Ready` で表示すること

## FR-06 ダッシュボード
- 記事総数、ステータス別件数、テーマ別件数を表示すること

---

## 6. 非機能要件

## NFR-01 パフォーマンス
- 単一ユーザー運用で、主要画面の初期表示2秒以内を目標

## NFR-02 可用性
- ローカル運用を基本とし、アプリ再起動でデータが失われないこと

## NFR-03 保守性
- UI層とデータアクセス層を分離すること
- 将来のDB移行（Markdown→SQLite/Supabase）を容易にすること

## NFR-04 セキュリティ（MVP最小）
- 外部公開を前提としない
- APIキーは環境変数で管理し、リポジトリにコミットしない

---

## 7. 画面要件

## 7.1 Dashboard
- KPIカード（総数、draft/review/published）
- テーマ別件数
- 最近更新した記事リスト

## 7.2 Editor
- 左: 記事一覧
- 右: 本文エディタ + メタ情報
- 下部またはサイド: PF別タブ、公開チェック、画像生成

## 7.3 Library
- 生成画像の一覧
- 画像プロンプト履歴
- 記事への再挿入

---

## 8. データ要件

```ts
Article {
  id: string
  theme: '72ms' | 'bungu' | 'id-travel'
  status: 'draft' | 'review' | 'published' | 'archived'
  baseTitle: string
  baseBodyMd: string
  tags: string[]
  platformVariants: {
    beehiiv?: { title: string; summary: string; cta: string }
    ghost?: { title: string; seoDescription: string }
    x?: { hook: string; threadDraft: string }
    instagram?: { slide1Hook: string; slideOutline: string; finalCta: string }
    karyaKarsa?: { titleId: string; episodeSummaryId: string; halalNote: string; nextEpisodeHook: string }
  }
  images: Array<{
    id: string
    prompt: string
    purpose: 'hero' | 'inline' | 'carousel'
    ratio: '1:1' | '3:2' | '16:9'
    url: string
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}
```

---

## 9. 技術要件（実装方針）

- Frontend: Next.js + TypeScript + Tailwind
- Backend: Next.js Route Handlers
- Storage（MVP）: ローカルファイル（JSON/Markdown）
- Editor: Markdownベース（初期はシンプル実装）
- 画像生成: 外部画像生成APIを抽象化した1エンドポイント

---

## 10. 受け入れ基準（Acceptance Criteria）

1. 記事を新規作成し、再読込後も内容が保持される
2. 1記事に対しPF別バリアントを5種保存できる
3. 画像を生成し、本文にMarkdown形式で挿入できる
4. チェックリストが `Ready / Not Ready` を返す
5. ダッシュボードに最低3種類の集計が表示される
6. PF別フィールドに `?` ツールチップが表示され、hover/focusで説明を確認できる

---

## 11. 開発マイルストーン（2週間）

### Week 1
- 記事一覧・編集・保存
- タグ/ステータス管理
- PF別バリアント編集

### Week 2
- 画像生成連携
- 公開チェックリスト
- ダッシュボード
- 動作確認・軽微修正

---

## 12. リスクと対策

- リスク: MVP段階で機能を盛り込みすぎる
  - 対策: 「編集UI + PF調整 + 画像生成 + チェック」の4点に固定
- リスク: PF仕様変更への追従コスト
  - 対策: PF固有ロジックは設定ファイル化
- リスク: 保存形式の将来互換
  - 対策: Repository層を設けてDB移行容易化

---

## 13. 次アクション

1. 本要件を確定（変更点あれば反映）
2. 画面ワイヤー（3画面）を作成
3. リポジトリ内に `app/`（または `web/`）を作成して実装開始

---

## 14. 画面ワイヤー（テキスト）

### 14.1 Dashboard ワイヤー

```text
┌─────────────────────────────────────────────────────────────┐
│ Content Workbench / Dashboard                              │
├─────────────────────────────────────────────────────────────┤
│ [総記事数] [Draft] [Review] [Published]                    │
│   12        7        3         2                            │
├─────────────────────────────────────────────────────────────┤
│ テーマ別件数                                                │
│ - 72ms: 5   - bungu: 4   - id-travel: 3                    │
├─────────────────────────────────────────────────────────────┤
│ 最近更新した記事                                            │
│ 1) [draft] Frogs began to sing...        2026-05-06 10:12  │
│ 2) [review] Hobonichi setup...           2026-05-05 21:40  │
│ 3) [published] Tokyo halal spots...      2026-05-03 08:08  │
└─────────────────────────────────────────────────────────────┘
```

### 14.2 Editor ワイヤー

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ Content Workbench / Editor                                                │
├───────────────────────┬───────────────────────────────────────────────────┤
│ 記事一覧              │ 記事編集エリア                                   │
│ [検索]                │ タイトル: [________________________]             │
│ [theme filter]        │ テーマ: (72ms v) ステータス: (draft v)          │
│ [status filter]       │ タグ: [#72ms] [#spring] [+]                      │
│-----------------------│---------------------------------------------------│
│ - Frogs began...      │ 本文(Markdown)                                    │
│ - Best Hobonichi...   │ ┌───────────────────────────────────────────────┐ │
│ - Tokyo halal...      │ │ # Heading                                      │ │
│                       │ │ text...                                        │ │
│                       │ └───────────────────────────────────────────────┘ │
│                       │ [保存] [下書き保存] [チェック実行]               │
├───────────────────────┴───────────────────────────────────────────────────┤
│ PFタブ: [Beehiiv] [Ghost] [X] [Instagram] [KaryaKarsa]                    │
│ - Beehiiv: title(?) / summary(?) / cta(?)                                  │
│ - Ghost: title(?) / seoDescription(?)                                      │
│ - X: hook(?) / threadDraft(?)                                              │
│ - Instagram: slide1Hook(?) / slideOutline(?) / finalCta(?)                │
│ - KaryaKarsa: titleId(?) / episodeSummaryId(?) / halalNote(?) / nextEpisodeHook(?) │
├───────────────────────────────────────────────────────────────────────────┤
│ 画像生成: [用途 v] [比率 v] [prompt___________________] [生成] [挿入]     │
└───────────────────────────────────────────────────────────────────────────┘
```

### 14.3 Library ワイヤー

```text
┌─────────────────────────────────────────────────────────────┐
│ Content Workbench / Library                                │
├─────────────────────────────────────────────────────────────┤
│ [検索: prompt / 記事名] [用途 filter] [比率 filter]         │
├─────────────────────────────────────────────────────────────┤
│ [thumb] prompt: spring mist in japan... [コピーMD] [再利用] │
│ [thumb] prompt: hobonichi desk setup...   [コピーMD] [再利用] │
│ [thumb] prompt: halal ramen tokyo...      [コピーMD] [再利用] │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. 実装タスク分解（Issue粒度）

### Epic A: プロジェクト初期セットアップ

- A-1: Next.js + TypeScript + Tailwind プロジェクトを作成
- A-2: ディレクトリ構成定義（`app/`, `components/`, `lib/`, `types/`）
- A-3: ESLint/Prettier設定と基本スクリプト整備
- A-4: `.env.local.example` 作成（APIキー雛形）

### Epic B: データ層（MVP: ローカル保存）

- B-1: `Article` 型定義（要件の型に準拠）
- B-2: Repository層実装（read/write/list/update）
- B-3: JSON/Markdown永続化ロジック実装
- B-4: 例外ケース（ファイル不存在/破損）ハンドリング

### Epic C: Editor機能

- C-1: 記事一覧パネル実装（検索/絞り込み）
- C-2: 本文Markdownエディタ実装
- C-3: メタ情報編集（title/theme/status/tags）
- C-4: 保存アクション（作成/更新）実装
- C-5: 更新日時表示

### Epic D: プラットフォーム別バリアント

- D-1: PFタブUI実装（Beehiiv/Ghost/X/Instagram/KaryaKarsa）
- D-2: PFごとの入力フォーム実装
- D-3: 記事本体とPFバリアントの同時保存
- D-4: 未入力必須項目のインライン警告
- D-5: 各フィールドの `?` ツールチップ実装（hover/focus対応）
- D-6: ツールチップ文言を設定ファイル化

### Epic E: 画像生成

- E-1: 画像生成APIラッパー実装（`POST /api/images/generate`）
- E-2: 生成フォーム（用途・比率・prompt）実装
- E-3: 生成結果の保存（images配列へ紐づけ）
- E-4: Markdown挿入文字列コピー機能

### Epic F: 公開チェックリスト

- F-1: チェックルール定義（文字数/タグ/PF必須/CTA）
- F-2: チェック実行ロジック実装
- F-3: `Ready / Not Ready` バッジ表示
- F-4: 未達項目のUIフィードバック

### Epic G: Dashboard / Library

- G-1: ステータス別件数集計
- G-2: テーマ別件数集計
- G-3: 最近更新記事一覧
- G-4: 画像ライブラリ一覧・検索・再利用

### Epic H: 品質担保

- H-1: 型チェック・Lint通過
- H-2: Repository層のユニットテスト
- H-3: 主要ユースケースの手動E2Eチェック
- H-4: READMEにローカル実行手順を追加

---

## 16. 実装順序（推奨）

1. Epic A + B（骨組みと永続化）
2. Epic C（記事編集の最短価値）
3. Epic D（PF別調整）
4. Epic F（公開判定）
5. Epic E（画像生成）
6. Epic G（可視化と再利用）
7. Epic H（品質仕上げ）

---

## 17. Definition of Done（MVP）

- UC-01〜UC-05 が手動テストで一通り完了する
- 受け入れ基準 1〜6 を満たす
- 主要画面（Dashboard/Editor/Library）が遷移できる
- 保存データが再起動後も保持される
- 実装手順と起動手順がREADMEに記載される
