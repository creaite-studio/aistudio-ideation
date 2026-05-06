# Content Workbench MVP 要件定義

作成日: 2026-05-06  
対象: note系プラットフォーム向け記事制作ワークベンチ（調査→企画→執筆→PF別調整）

---

## 1. 背景と目的

現状、調査・戦略・企画情報は Markdown ドキュメントとして蓄積されているが、以下が手作業で分散している。

- 記事本文の編集
- 記事内挿入画像の生成
- プラットフォーム別（Beehiiv / Ghost / X / Instagram）でのタイトル・文面調整

本MVPの目的は、**既存ドキュメント資産を活かしつつ、記事制作のUIを最小コストで提供すること**。

---

## 2. スコープ

### 2.1 MVPで実装する範囲

1. 記事ワークスペース（一覧・編集・保存）
2. プラットフォーム別バリアント編集（タイトル/要約/投稿文）
3. 画像生成（1プロンプト→1画像）と本文挿入
4. 公開前チェックリスト（簡易品質ゲート）
5. ダッシュボード（件数の可視化）

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
- ユーザーはPFタブ（Beehiiv/Ghost/X/Instagram）を開く
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
2. 1記事に対しPF別バリアントを4種保存できる
3. 画像を生成し、本文にMarkdown形式で挿入できる
4. チェックリストが `Ready / Not Ready` を返す
5. ダッシュボードに最低3種類の集計が表示される

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
