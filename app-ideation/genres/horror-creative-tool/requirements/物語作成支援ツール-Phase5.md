# 要件定義: 物語作成支援ツール Phase 5 — 書く場所もここになる

**日付:** 2026-05-03  
**前提:** Phase 4 リリース完了後  
**目標期間:** Phase 4 リリースから2〜3ヶ月  
**位置づけ:** Nolaに正面から踏み込む。設定資料を参照しながら執筆できる統合環境へ。  
**参照:** 物語作成支援ツール-ロードマップ.md

---

## 1. プロダクト概要

### What
Phase 3で実装したシーンメモを**本格的な執筆エディタ**に進化させ、ユーザーが「設定管理ツール」と「執筆ツール」を行き来する必要をなくす。書いた原稿のエクスポート・世界観グラフの公開機能も追加する。

### Why（解決する壁）
- これまでは「設定管理はこのツール、執筆はNola」という分断があった
- グラフを見ながら書けることで、伏線・知識状態と本文の整合性を取りやすくなる
- 完成した原稿のアウトプット（PDF・公開）まで完結することで、ツールが「書きはじめから書き終わりまで」をカバーする

### 差別化の一言
「書きながらグラフが見られる、唯一の創作ツール」

---

## 2. スコープ

### Phase 5に含むもの ✅
| 機能カテゴリ | 機能 |
|------------|------|
| 本格執筆エディタ | 縦書き・ルビ・傍点・自動字下げ対応のリッチテキストエディタ |
| マルチペイン表示 | 執筆エディタ × グラフ × 設定資料を同時表示 |
| エクスポート | 原稿PDF・原稿テキスト・設定資料集PDF・グラフ画像 |
| 世界観グラフ公開 | URLで読者に公開できる読み取り専用ビュー |
| ジャンル別テンプレート | ホラー・ファンタジー・ミステリーなど世界観の雛形 |

### Phase 5に含まないもの ❌
| 機能 | 後回し理由 |
|------|----------|
| AI執筆補助（本文生成） | 別フェーズで検討。執筆体験の質を最優先 |
| 共同編集（コラボ） | 個人利用に絞ったまま。需要を見て検討 |
| モバイル執筆アプリ | Web版で完結させる |
| 投稿サイト連携（カクヨム等） | プラットフォーム依存。スコープ外 |

---

## 3. 機能仕様

### 3-1. 本格執筆エディタ

```
基本機能:
- 縦書き / 横書きの切り替え
- ルビ振り（ショートカット or マークアップ）
- 傍点・強調
- 自動字下げ（段落頭の全角スペース）
- 文字数カウント・原稿用紙換算
- 自動保存（数秒間隔）
- 履歴機能（過去N件の編集を遡れる）
- ダークモード対応

エディタの実装方針:
- Tiptap または Lexical を採用（Markdownベースで拡張可能）
- 縦書き表示は CSS writing-mode を使用
```

### 3-2. マルチペイン表示

```
画面分割パターン:
- パターンA: 執筆エディタ（中央）+ グラフ（右）
- パターンB: 執筆エディタ（中央）+ 設定資料一覧（右）+ グラフ（左下）
- パターンC: 執筆エディタのみ（フルスクリーン）
- ユーザーがレイアウトをカスタマイズ可能（ドラッグでペイン幅変更）

設定資料の参照:
- 執筆中にキャラ名をクリック → そのキャラの詳細パネルが右に開く
- @キャラ名 でメンション → 自動的にキャラ参照リンクになる
```

### 3-3. エクスポート（有料機能）

```
原稿エクスポート:
- 形式: PDF・テキスト（.txt）・Word（.docx）
- 縦書きPDFも対応（投稿用フォーマット）
- 章ごと / 全話まとめての出力選択

設定資料集エクスポート:
- キャラクター情報・場所・組織・関係・伏線をまとめてPDF化
- 「読者向け公開資料」と「作者用全資料」の2種類を切り替え可
- 表紙ページの画像差し替え可

グラフ画像エクスポート:
- 現在のグラフをPNG/SVGで出力
- 解像度選択可（SNS投稿用・印刷用など）
```

### 3-4. 世界観グラフ公開（有料機能）

```
- プロジェクト単位で「公開URL」を生成可能
- 公開設定:
  - 公開する範囲（全エピソード / N話まで）
  - 表のグラフのみ（裏のグラフ・伏線は非公開）
  - パスワード保護の有無
- 公開ビュー:
  - 読者は読み取り専用でグラフを閲覧可能
  - キャラクタークリックで説明表示
  - 公開エピソードの範囲内に限定
- 利用シナリオ:
  - 連載のwiki代わりに読者へ公開
  - SNS投稿時の関係図リンク
```

### 3-5. ジャンル別テンプレート

```
プロジェクト新規作成時にテンプレートを選択可能:
- 空のプロジェクト
- ホラー（探偵 + 被害者 + 不可解な現象 + 謎の組織のサンプル構成）
- ファンタジー（主人公 + 仲間 + 王国 + 魔法体系のサンプル）
- ミステリー（探偵 + 容疑者複数 + 事件現場のサンプル）
- 群像劇（主人公複数 + 共通舞台のサンプル）

テンプレートは編集可能で、自分のテンプレートとして保存もできる
```

---

## 4. データモデル追加

```sql
-- シーンの本文を拡張（Phase 3で作成済みのscenesテーブルを活用）
-- Phase 3: scenes.body は簡易メモ
-- Phase 5: scenes.body は本格的な原稿として運用
alter table scenes add column body_format text default 'plain';  -- plain | richtext
alter table scenes add column word_count integer default 0;
alter table scenes add column last_edited_at timestamptz default now();

-- 編集履歴
create table scene_revisions (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references scenes on delete cascade not null,
  body text not null,
  saved_at timestamptz default now()
);

-- エクスポート設定
create table export_settings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  format text not null,  -- pdf | txt | docx
  layout text default 'vertical',  -- vertical | horizontal
  cover_image_url text,
  font_size integer default 12,
  created_at timestamptz default now()
);

-- 公開設定
create table public_views (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  public_id text not null unique,  -- URLの公開ID（短縮IDなど）
  visible_episode_max integer,     -- N話まで公開
  show_hidden_graph boolean default false,
  password_hash text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- テンプレート
create table templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,  -- nullなら公式テンプレート
  name text not null,
  genre text,
  description text,
  template_data jsonb not null,  -- キャラ・場所・組織等の初期データ
  is_official boolean default false,
  created_at timestamptz default now()
);
```

---

## 5. 技術スタック追加

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| エディタ | Tiptap または Lexical | 拡張性が高くカスタムノード対応可 |
| PDF生成 | jsPDF + html2canvas または Puppeteer (Edge Function内) | 原稿・資料集のPDF出力 |
| グラフ画像化 | React Flow標準のtoSvg / toPng | グラフのエクスポート |

---

## 6. 設計上の検討事項

### 6-1. 縦書き対応
- Tiptap/Lexicalは横書き前提のため、CSSレベルでの縦書き表示は工夫が必要
- 行間・ルビの位置調整など、日本語特有の組版を意識する
- 投稿サイト（カクヨム・なろう）の縦書きプレビューを参考にする

### 6-2. 自動保存とコンフリクト
- 執筆中の自動保存は重要だが、複数タブで開いた場合のコンフリクトに注意
- **方針:** 同一ユーザー・同一シーンで複数タブを開いた場合、あとから保存した方が優先（警告表示）

### 6-3. 公開ビューのパフォーマンス
- 読者が大量にアクセスした場合、Supabaseのリードに負荷
- **方針:** 公開ビューはキャッシュ可能なStaticな描画にするか、CDN経由にする

### 6-4. データのバックアップ
- 原稿は失うわけにいかない資産
- **方針:** ユーザーが手動でJSONエクスポート可能にする・自動バックアップを設定

---

## 7. 開発ロードマップ（目安）

| Week | マイルストーン |
|------|-------------|
| 1〜2 | Tiptap/Lexicalの導入・基本エディタ実装・自動保存 |
| 3〜4 | 縦書き対応・ルビ・傍点・字下げ |
| 5 | マルチペイン表示・キャラ参照リンク |
| 6〜7 | エクスポート機能（PDF・テキスト・Word）|
| 8 | 世界観グラフ公開機能・公開ビューの整備 |
| 9 | ジャンル別テンプレート・UIブラッシュアップ |
| 10 | 全体最適化・バグ修正・正式リリース準備 |

---

## 8. 成功基準

| 指標 | 目標 |
|------|------|
| Phase 5リリースまでの期間 | Phase 4から3ヶ月以内 |
| 執筆エディタを実際に使うユーザー率 | 60%以上 |
| エクスポート機能の月間利用率 | 30%以上 |
| 公開ビューのページビュー（拡散効果） | 月10,000PV以上 |
| 月額有料収益 | 月50万円以上（500人 × 1,000円相当） |
| Nolaから乗り換えたユーザー | 50人以上 |

---

## 9. Phase 5以降の方向性（参考）

| 候補 | 検討タイミング |
|------|-------------|
| タイムライン横軸表示（Phase 4.5として保留中） | Phase 5完了後 |
| AI執筆補助（本文生成・文体提案） | ユーザーフィードバックを見て判断 |
| 共同編集（複数作者対応） | コミュニティが大きくなってから |
| モバイルアプリ（執筆特化） | Web版が安定してから |
| 投稿サイト連携（カクヨム・なろうへの公開） | プラットフォーム側のAPI次第 |
