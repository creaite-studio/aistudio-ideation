# 要件定義: 物語作成支援ツール Phase 3 — 複数話をまたいで管理できる

**日付:** 2026-05-03  
**前提:** Phase 2 リリース完了後  
**目標期間:** Phase 2 リリースから2〜3ヶ月  
**位置づけ:** ★最大の差別化点。Nolaに存在しない領域。  
**参照:** 物語作成支援ツール-ロードマップ.md

---

## 1. プロダクト概要

### What
物語を**複数の話・章**に分割し、各話間にまたがる**伏線・知識状態・関係性の変化**を横断的に管理できるようにする。読者視点の関係図と作者視点の真実の関係図を分離して扱える。

### Why（解決する壁）
Q3で挙がった一番の課題：
- 各話が複雑に絡み合うため、「どの伏線をどの話で仕込んだか」「キャラAは3話時点でBの正体を知っているか」が頭で追えなくなる
- 既存ツール（Nolaを含む）はすべて「単一の物語を書く」前提で、シリーズや連作の横断管理機能がない

### 差別化の一言
「読者の知識と作者の知識を、話ごとに分けて管理できる」

---

## 2. スコープ

### Phase 3に含むもの ✅
| 機能カテゴリ | 機能 |
|------------|------|
| エピソード管理 | プロジェクト内に複数の「話/章」を作成・並び替え |
| エピソード編集 | 各話に登場キャラ・舞台・使用伏線をチェック式で紐付け |
| 伏線横断トラッカー | 伏線の「仕込み話」→「回収話」の管理。未回収一覧 |
| 表/裏グラフ切り替え | 「読者が知っている関係図」と「作者だけが知る真実」をボタンで切り替え |
| 知識状態管理 | 各キャラが「N話時点で何を知っているか」をフラグで管理 |
| シーンメモ（簡易エディタ） | 各話・各シーンにテキストメモ。執筆下地・矛盾チェック用 |

### Phase 3に含まないもの ❌
| 機能 | 後回し理由 |
|------|----------|
| 矛盾チェック自動化 | Phase 4のAI機能で実装 |
| 本格執筆エディタ | Phase 5で実装 |
| タイムライン横軸表示 | Phase 4.5で検討 |

---

## 3. 機能仕様

### 3-1. エピソード管理

```
- 設定項目:
  - タイトル（必須）
  - エピソード番号（自動採番・並び替え可）
  - あらすじ（任意・400字以内）
  - ステータス（未着手 / 執筆中 / 完了）
  - 公開日メモ（任意）
- 操作:
  - 新規作成・編集・削除
  - ドラッグでの並び替え
- 表示:
  - 画面上部にエピソードタブ。クリックで該当話のメモ・知識状態に移動
```

### 3-2. エピソード詳細

```
各エピソードに紐付ける項目:
- 登場キャラクター（チェックリスト式：プロジェクト内のキャラから選択）
- 主な舞台（場所ノードから選択）
- 仕込む伏線（後述の伏線トラッカーと連動）
- 回収する伏線（後述）
- シーンメモ（複数シーン作成可・各シーンにテキスト）
```

### 3-3. 伏線横断トラッカー

```
- 伏線エンティティ:
  - 名前（例:「Aの本当の素性」）
  - 説明（任意）
  - 仕込み話（エピソード参照）
  - 回収話（エピソード参照・未設定可）
  - 関連キャラ・場所・関係（複数選択可）
  - ステータス（未仕込 / 仕込済 / 回収済）
- 一覧画面:
  - 全伏線をテーブル表示
  - フィルター: 未回収のみ表示・特定エピソードに関連するもののみ
  - ソート: 仕込み話順・回収話順・登録日順
```

### 3-4. 表/裏グラフ切り替え

```
- グラフ右上にトグル: [表のグラフ] / [裏のグラフ]
- 表のグラフ:
  - 「読者がN話時点で知っている関係」のみ表示
  - エピソード選択ドロップダウンで「N話時点」を切り替え
- 裏のグラフ:
  - 全関係を表示（伏線・隠された関係・真の正体含む）
- 関係エッジに「表向きの関係」「裏の関係」のラベルを設定可
  - 例: 表「上司と部下」/ 裏「実の親子」
```

### 3-5. 知識状態管理

```
- データ構造:
  - キャラAは「Bの正体」を知っている / 知らない
  - キャラAは「事件Xの真相」を知っている / 知らない
- 各エピソードごとに状態が変化する（N話で初めて知る、など）
- 設定UI:
  - キャラクター詳細パネルに「知識状態」タブ追加
  - エピソードを選び、各「知識項目」に対して「知っている/知らない/未確定」をフラグ
- 「知識項目」マスタ管理:
  - プロジェクト内に「知識項目」を作成（例:「Bの正体」「事件Xの真相」）
  - 各項目に対し、各キャラ × 各エピソードの状態をマトリクスで管理
```

### 3-6. シーンメモ（簡易エディタ）

```
- 各エピソード内に「シーン」を複数作成
- 各シーンの設定項目:
  - シーン番号（自動採番）
  - タイトル（任意）
  - 登場キャラクター（チェックリスト）
  - 場所（場所ノード参照）
  - 本文メモ（テキストエリア・10,000字程度まで）
- これは本格執筆エディタではなく、あくまで構想・矛盾チェック用の下地
- Phase 4のAI矛盾チェック機能はこのシーンメモを読み込んで判定する
```

---

## 4. データモデル追加

```sql
-- エピソード
create table episodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  episode_number integer not null,
  title text not null,
  summary text,
  status text default 'not_started',  -- not_started | writing | done
  publish_memo text,
  created_at timestamptz default now()
);

-- 伏線
create table foreshadowings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  name text not null,
  description text,
  planted_episode_id uuid references episodes,
  resolved_episode_id uuid references episodes,
  status text default 'not_planted', -- not_planted | planted | resolved
  created_at timestamptz default now()
);

-- 伏線と関連エンティティの紐付け
create table foreshadowing_links (
  id uuid primary key default gen_random_uuid(),
  foreshadowing_id uuid references foreshadowings on delete cascade not null,
  entity_type text not null,  -- character | place | group | relationship
  entity_id uuid not null
);

-- エピソードに登場するキャラ・場所
create table episode_characters (
  episode_id uuid references episodes on delete cascade,
  character_id uuid references characters on delete cascade,
  primary key (episode_id, character_id)
);

create table episode_places (
  episode_id uuid references episodes on delete cascade,
  place_id uuid references places on delete cascade,
  primary key (episode_id, place_id)
);

-- 知識項目マスタ
create table knowledge_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- 知識状態（誰が・何を・いつ知っているか）
create table knowledge_states (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references characters on delete cascade not null,
  knowledge_item_id uuid references knowledge_items on delete cascade not null,
  episode_id uuid references episodes on delete cascade not null,
  state text not null,  -- known | unknown | undetermined
  unique (character_id, knowledge_item_id, episode_id)
);

-- シーン
create table scenes (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid references episodes on delete cascade not null,
  scene_number integer not null,
  title text,
  body text,
  place_id uuid references places,
  created_at timestamptz default now()
);

create table scene_characters (
  scene_id uuid references scenes on delete cascade,
  character_id uuid references characters on delete cascade,
  primary key (scene_id, character_id)
);

-- 関係エッジに「表/裏ラベル」を追加
alter table relationships add column public_label text;  -- 表向きのラベル
alter table relationships add column hidden_label text;  -- 裏の真実のラベル
alter table relationships add column reveal_episode_id uuid references episodes;  -- いつ明かされるか
```

---

## 5. UI設計の方向性

```
┌────────────────────────────────────────────────────────┐
│  [プロジェクト名] [エピソード▼] [表/裏 ▶]  [ダッシュボード]│
├────────────────────────────────────────────────────────┤
│  エピソードタブ: [1話] [2話] [3話] [4話] [+]              │
├────────┬──────────────────────────┬───────────────────┤
│        │                          │                   │
│ サイド │  グラフキャンバス        │ 詳細/エピソード   │
│ パネル │  （表または裏モード）      │ 知識状態           │
│        │                          │                   │
│ キャラ │                          │                   │
│ 場所   │                          │                   │
│ 組織   │                          │                   │
│ 伏線   │                          │                   │
│ シーン │                          │                   │
└────────┴──────────────────────────┴───────────────────┘
```

---

## 6. 設計上の検討事項

### 6-1. 表/裏グラフのデータ表現
- 関係エッジに「表のラベル」「裏のラベル」「明かされる話」を持たせる
- 表モードでは：「明かされる話 ≦ 現在話」なら裏ラベル、それ未満なら表ラベル
- 裏モードでは：常に裏ラベル + 全エッジ表示

### 6-2. 知識状態のデータ量
- キャラ数 × 知識項目数 × エピソード数のマトリクスになるためデータ量が膨らむ
- 「未確定」を初期値とし、変化があった時のみレコード作成する設計
- 一覧表示時はキャラ視点 / 知識項目視点の両方から見られるようにする

### 6-3. シーンメモの本格エディタ化への布石
- Phase 5で本格執筆エディタ化するため、scenes.bodyはMarkdown形式にしておく
- AI矛盾チェック（Phase 4）はこのbodyを読み込む

---

## 7. 開発ロードマップ（目安）

| Week | マイルストーン |
|------|-------------|
| 1〜2 | エピソード管理・シーンメモのCRUD・基本UI |
| 3〜4 | 伏線トラッカー・伏線一覧画面 |
| 5〜6 | 表/裏グラフ切り替え・関係エッジ拡張 |
| 7〜8 | 知識状態マトリクス・知識項目管理・UIブラッシュアップ |

---

## 8. 成功基準

| 指標 | 目標 |
|------|------|
| Phase 3リリースまでの期間 | Phase 2から3ヶ月以内 |
| エピソード機能を使うユーザー率 | 50%以上 |
| 伏線トラッカー利用ユーザー率 | 30%以上 |
| 「シリーズもの・連作の管理が楽になった」フィードバック | 10件以上 |
| この時点で有料プランの構想を確定（Phase 4で本格課金開始） | — |
