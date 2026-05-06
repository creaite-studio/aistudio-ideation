# 要件定義: 物語作成支援ツール Phase 2 — 世界が立体化する

**日付:** 2026-05-03  
**前提:** MVP リリース完了後  
**目標期間:** MVP リリースから1〜2ヶ月  
**参照:** 物語作成支援ツール-ロードマップ.md

---

## 1. プロダクト概要

### What
キャラクターだけだったグラフに、**場所・組織（陣営）** をノードとして追加し、人物・場所・組織が立体的に絡み合う世界観を1枚のグラフで管理できるようにする。

### Why（解決する壁）
- MVPで「人物の関係」は見えるようになったが、登場人物が増えると「誰がどの場所に住んでいるか」「どの組織に属しているか」が頭の中で混乱する
- 場所や組織を別のドキュメントで管理すると、人物との関係が分散してしまう

### 差別化の一言
「人物だけでなく、世界そのものをグラフで見渡せる」

---

## 2. スコープ

### Phase 2に含むもの ✅
| 機能カテゴリ | 機能 |
|------------|------|
| 場所ノード | 舞台・地名のノード追加・編集・削除 |
| 組織ノード | 陣営・組織のノード追加・編集・削除 |
| 関係エッジ拡張 | キャラ↔場所（住む・訪れる）・キャラ↔組織（所属）・組織↔組織（対立・同盟）など |
| ノード種別フィルター | グラフに表示するノード種別を絞り込める（キャラのみ・場所のみ・全種別） |
| サイドパネル拡張 | キャラクター以外のノード一覧もタブで切り替え表示 |

### Phase 2に含まないもの ❌
| 機能 | 後回し理由 |
|------|----------|
| タイムライン | Phase 4.5以降に保留 |
| エピソード管理 | Phase 3で実装 |
| ノードの自動レイアウト | Phase 5以降の改善項目 |

---

## 3. 機能仕様

### 3-1. 場所ノード

```
- 設定項目:
  - 名前（必須）
  - 説明（任意・400字以内）
  - 種別タグ（任意・複数可：例「都市」「廃墟」「森」）
  - メモ（任意・自由記述）
  - アイコンカラー（識別用）
  - 伏線フラグ（場所自体が伏線になる場合）
- ノードの形状: キャラクターと区別するため「角丸四角形」で表示
```

### 3-2. 組織・陣営ノード

```
- 設定項目:
  - 名前（必須）
  - 説明（任意）
  - 種別タグ（任意・例「家」「企業」「教団」「敵対組織」）
  - メンバー一覧（自動：このグループに所属するキャラクターを表示）
  - メモ（任意）
  - アイコンカラー
  - 伏線フラグ
- ノードの形状: 「八角形」または「ひし形」で表示
```

### 3-3. 関係エッジの拡張

```
- 既存: キャラ↔キャラ
- 追加:
  - キャラ↔場所（ラベル例:「住んでいる」「訪れた」「死亡した場所」）
  - キャラ↔組織（ラベル例:「所属」「元メンバー」「裏切り者」）
  - 場所↔場所（ラベル例:「隣接」「地下道で繋がっている」）
  - 組織↔組織（ラベル例:「対立」「同盟」「傘下」）
  - 場所↔組織（ラベル例:「拠点」「占拠中」）
```

### 3-4. ノード種別フィルター

```
- グラフ上部に種別フィルターのトグル
  - [全表示] [キャラのみ] [場所のみ] [組織のみ]
  - 複数選択可（例: キャラ+組織のみ表示）
- フィルターした状態で関連するエッジのみ表示
```

### 3-5. サイドパネル拡張

```
- タブ切り替え:
  - キャラクター（既存）
  - 場所（新規）
  - 組織（新規）
- 各タブでノードの一覧表示・追加ボタン
```

---

## 4. データモデル追加

```sql
-- 場所
create table places (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  name text not null,
  description text,
  color text default '#10b981',
  pos_x float default 0,
  pos_y float default 0,
  memo text,
  is_foreshadowing boolean default false,
  created_at timestamptz default now()
);

-- 組織
create table groups (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  name text not null,
  description text,
  color text default '#f59e0b',
  pos_x float default 0,
  pos_y float default 0,
  memo text,
  is_foreshadowing boolean default false,
  created_at timestamptz default now()
);

-- タグ（places, groups用に汎用化）
create table place_tags (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places on delete cascade not null,
  tag_name text not null
);

create table group_tags (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups on delete cascade not null,
  tag_name text not null
);

-- 関係エッジを汎用化（既存relationshipsをマイグレーション）
-- source_typeとtarget_typeでノード種別を識別
alter table relationships add column source_type text default 'character';
alter table relationships add column target_type text default 'character';
-- source_id/target_idは引き続きUUIDで、種別と組み合わせて参照
```

---

## 5. 設計上の検討事項

### 5-1. 既存のrelationshipsテーブルとの整合性
MVPでは `source_id/target_id` が `characters` のIDだったが、Phase 2では場所・組織も対象にする必要がある。
- **方針:** `source_type/target_type` カラムを追加し、ID + 種別でノードを識別する
- 外部キー制約は維持できなくなるため、アプリケーション側で整合性を担保する

### 5-2. ノード種別の追加への拡張性
Phase 2で3種類になったが、将来「アイテム」「イベント」など追加する可能性がある。
- **方針:** 新しいノード種別追加時にテーブルを増やす設計（テーブル数は増えるが、各ノード固有のカラムを柔軟に持てる）

### 5-3. UI/UX
- ノード種別が増えると視覚的に混乱しやすい
- **方針:** 形状 + デフォルトカラーで種別を区別（キャラ=円・青系、場所=角丸四角・緑系、組織=八角形・橙系）

---

## 6. 開発ロードマップ（目安）

| Week | マイルストーン |
|------|-------------|
| 1 | データモデルマイグレーション・places/groupsのCRUD実装 |
| 2 | カスタムノード（PlaceNode・GroupNode）実装・サイドパネルのタブ化 |
| 3 | エッジの種別拡張・ノード種別フィルター・UIブラッシュアップ |

---

## 7. 成功基準

| 指標 | 目標 |
|------|------|
| Phase 2リリースまでの期間 | MVPから6週間以内 |
| アクティブユーザーの場所/組織ノード作成率 | 60%以上 |
| 「世界観の管理がしやすくなった」フィードバック | 5件以上 |
