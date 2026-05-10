# 物語作成支援ツール — MVP 詳細設計

**日付:** 2026-05-03  
**対象フェーズ:** MVP  
**参照:** 物語作成支援ツール-MVP.md / 物語作成支援ツール-ロードマップ.md

---

## 1. システムアーキテクチャ全体像

```
┌─────────────────────────────────┐
│         ブラウザ（React）         │
│                                  │
│  Pages → Components → Hooks     │
│              ↕                   │
│          Zustand Store           │
└──────────────┬───────────────────┘
               │ HTTPS
┌──────────────▼───────────────────┐
│           Supabase               │
│  ┌────────┐  ┌─────────────────┐ │
│  │  Auth  │  │   PostgreSQL     │ │
│  └────────┘  │  + Row Level     │ │
│              │    Security      │ │
│              └─────────────────┘ │
└──────────────────────────────────┘
               │
┌──────────────▼───────────────────┐
│           Vercel                 │
│  （フロントエンドのホスティング）    │
└──────────────────────────────────┘
```

**通信方式:** シンプルなCRUD（REST）。MVPではリアルタイム同期なし。  
**楽観的更新:** ノード位置など頻繁な更新はローカル状態を即時反映し、DBはデバウンス（1秒）で保存。

---

## 2. フォルダ構成

```
src/
├── pages/                        ← 画面単位のコンポーネント
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx         ← プロジェクト一覧
│   └── ProjectPage.tsx           ← グラフビュー（メイン画面）
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/
│   │   ├── ProjectCard.tsx
│   │   └── CreateProjectModal.tsx
│   ├── graph/
│   │   ├── GraphCanvas.tsx       ← React Flowのラッパー
│   │   ├── CharacterNode.tsx     ← カスタムノード
│   │   ├── RelationshipEdge.tsx  ← カスタムエッジ
│   │   └── GraphControls.tsx     ← ズーム・全体表示ボタン
│   ├── panels/
│   │   ├── SidePanel.tsx         ← 左：キャラクター一覧
│   │   ├── CharacterDetailPanel.tsx ← 右：キャラクター編集
│   │   └── RelationshipPanel.tsx    ← 右：関係編集
│   └── ui/                       ← 汎用UIパーツ
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Tag.tsx
│       └── Toast.tsx
│
├── stores/                       ← Zustand（状態管理）
│   ├── authStore.ts
│   ├── projectStore.ts
│   └── graphStore.ts
│
├── hooks/                        ← データ取得・操作ロジック
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useCharacters.ts
│   └── useRelationships.ts
│
├── lib/
│   └── supabase.ts               ← Supabaseクライアント初期化
│
├── types/
│   └── index.ts                  ← 共通型定義
│
└── App.tsx                       ← ルーティング定義
```

---

## 3. 画面フローと各画面の役割

```
/ (Landing)
  └─ 未ログイン時のトップ。コンセプト説明 + ログイン/登録ボタン

/login
  └─ メール・パスワードでログイン

/signup
  └─ メール・パスワードで新規登録

/dashboard
  └─ プロジェクト一覧。カード形式。新規作成ボタン。
     ※ 未ログイン時はログインページにリダイレクト

/project/:id
  └─ グラフビュー（メイン画面）
     ├─ 左サイドパネル: キャラクター一覧 + 追加ボタン
     ├─ 中央キャンバス: React Flowグラフ
     └─ 右詳細パネル: 選択中のノード/エッジの編集（選択時のみ表示）
```

---

## 4. メイン画面レイアウト（ProjectPage）

```
┌──────────────────────────────────────────────────────┐
│  ヘッダー: [プロジェクト名]          [ダッシュボードへ]  │
├────────────┬───────────────────────────┬─────────────┤
│            │                           │             │
│  サイド    │      グラフキャンバス      │  詳細パネル  │
│  パネル    │                           │（選択時のみ）│
│  (240px)  │  キャラクターノード群        │  (320px)   │
│           │  関係エッジ群               │             │
│ ─────── │                           │ キャラ or   │
│ キャラ①  │   [全体表示] [+] [-]       │ 関係の編集  │
│ キャラ②  │                           │             │
│ ─────── │                           │             │
│ [+追加]  │                           │             │
│           │                           │             │
└────────────┴───────────────────────────┴─────────────┘
```

---

## 5. コンポーネント設計

### 5-1. GraphCanvas（React Flowラッパー）

**役割:** React Flowの初期化・イベントハンドリングを一括管理

```
主なイベント処理:
- onNodeClick       → selectedNodeId をストアに保存 → 詳細パネル表示
- onEdgeClick       → selectedEdgeId をストアに保存 → 詳細パネル表示
- onNodeDragStop    → updateNodePosition(id, {x, y}) ※デバウンス1秒
- onConnect         → 2ノード間のエッジ作成フローを開始（モーダル表示）
- onPaneClick       → 選択解除 → 詳細パネルを閉じる

カスタムノード/エッジの登録:
- nodeTypes = { character: CharacterNode }
- edgeTypes = { relationship: RelationshipEdge }
```

### 5-2. CharacterNode（カスタムノード）

**役割:** キャラクター1人分のノードUI

```
表示内容:
- 上部カラーバー（character.colorで変わる）
- キャラクター名（太字）
- 属性タグ（最大2個、overflow分は「+N」表示）
- 伏線フラグがONの場合: ノード枠を点線 + 薄い赤背景

ハンドル（接続点）:
- 上下左右にReact Flowのハンドルを配置（エッジ接続の起点・終点になる）
```

### 5-3. RelationshipEdge（カスタムエッジ）

**役割:** キャラクター間の関係1本分のエッジUI

```
表示内容:
- ラベル（relationship.label）を線の中央に表示
- direction = 'both'  → 両端矢印
- direction = 'one'   → 片方向矢印
- is_foreshadowing = true → 点線スタイル

クリック:
- selectedEdgeId をセット → RelationshipPanel表示
```

### 5-4. SidePanel（左パネル）

**役割:** キャラクター一覧 + 追加操作

```
表示:
- プロジェクト内のキャラクター全件を名前一覧で表示
- 各行クリックでグラフ内の対応ノードをフォーカス（中央表示）
- 「+キャラクターを追加」ボタン → CharacterFormモーダルを開く
```

### 5-5. CharacterDetailPanel（右パネル）

**役割:** 選択中キャラクターの詳細表示・編集

```
フィールド:
- 名前（テキスト入力・必須）
- 説明（テキストエリア・任意）
- アイコンカラー（カラーピッカー）
- 属性タグ（タグ入力・複数可）
- 伏線フラグ（チェックボックス）
- メモ（テキストエリア・任意）

操作ボタン:
- 保存（updateCharacter）
- 削除（確認ダイアログ → deleteCharacter）
```

### 5-6. RelationshipPanel（右パネル）

**役割:** 選択中関係の詳細表示・編集

```
フィールド:
- ラベル（テキスト入力）
- 方向性（双方向 / 一方向 のトグル）
- 伏線フラグ（チェックボックス）
- メモ（テキストエリア・任意）

操作ボタン:
- 保存（updateRelationship）
- 削除（deleteRelationship）
```

---

## 6. 状態管理設計（Zustand）

### authStore

```typescript
interface AuthStore {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>   // アプリ起動時にセッション復元
}
```

### projectStore

```typescript
interface ProjectStore {
  projects: Project[]
  loading: boolean
  fetchProjects: () => Promise<void>
  createProject: (data: CreateProjectInput) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
}
```

### graphStore

```typescript
interface GraphStore {
  // React Flow形式のノード・エッジ
  nodes: Node<CharacterNodeData>[]
  edges: Edge<RelationshipEdgeData>[]

  // 選択状態
  selectedNodeId: string | null
  selectedEdgeId: string | null

  loading: boolean

  // 初期化
  fetchGraph: (projectId: string) => Promise<void>

  // キャラクター操作
  addCharacter: (data: CreateCharacterInput) => Promise<void>
  updateCharacter: (id: string, data: UpdateCharacterInput) => Promise<void>
  deleteCharacter: (id: string) => Promise<void>
  updateNodePosition: (id: string, pos: {x: number, y: number}) => Promise<void>

  // 関係操作
  addRelationship: (data: CreateRelationshipInput) => Promise<void>
  updateRelationship: (id: string, data: UpdateRelationshipInput) => Promise<void>
  deleteRelationship: (id: string) => Promise<void>

  // 選択状態
  selectNode: (id: string | null) => void
  selectEdge: (id: string | null) => void
}
```

---

## 7. 型定義

```typescript
// types/index.ts

export interface Project {
  id: string
  user_id: string
  title: string
  genre?: string
  memo?: string
  created_at: string
}

export interface Character {
  id: string
  project_id: string
  name: string
  description?: string
  color: string          // HEXカラーコード（例: '#6366f1'）
  pos_x: number
  pos_y: number
  memo?: string
  is_foreshadowing: boolean
  tags: string[]
  created_at: string
}

export interface Relationship {
  id: string
  project_id: string
  source_id: string
  target_id: string
  label?: string
  direction: 'both' | 'one'
  is_foreshadowing: boolean
  memo?: string
  created_at: string
}

// React Flowのカスタムデータ型
export interface CharacterNodeData {
  character: Character
}

export interface RelationshipEdgeData {
  relationship: Relationship
}

// フォーム入力型
export type CreateProjectInput = Pick<Project, 'title' | 'genre' | 'memo'>
export type CreateCharacterInput = Pick<Character, 'name' | 'description' | 'color' | 'memo' | 'is_foreshadowing' | 'tags'>
export type UpdateCharacterInput = Partial<CreateCharacterInput>
export type CreateRelationshipInput = Pick<Relationship, 'source_id' | 'target_id' | 'label' | 'direction' | 'is_foreshadowing' | 'memo'>
export type UpdateRelationshipInput = Partial<Pick<Relationship, 'label' | 'direction' | 'is_foreshadowing' | 'memo'>>
```

---

## 8. データフロー（主要な操作）

### キャラクター追加

```
1. SidePanelの「+追加」ボタンをクリック
2. CharacterFormモーダルを表示
3. フォーム送信 → graphStore.addCharacter(data)
4. Supabase INSERT → 返ってきたCharacterオブジェクト
5. CharacterをReact FlowのNodeに変換してnodesに追加
6. グラフが再レンダリング → 新ノードが出現
```

### エッジ作成（ノード間をドラッグ）

```
1. ノードのハンドルから別ノードのハンドルへドラッグ
2. React FlowのonConnect発火
3. RelationshipFormモーダルを表示（ラベル・方向性を入力）
4. フォーム送信 → graphStore.addRelationship(data)
5. Supabase INSERT → 返ってきたRelationshipオブジェクト
6. RelationshipをReact FlowのEdgeに変換してedgesに追加
```

### ノード位置保存

```
1. ノードをドラッグして放す
2. React FlowのonNodeDragStop発火
3. ローカルのnodes状態を即時更新（楽観的更新）
4. 1秒のデバウンス後にSupabase UPDATE（pos_x, pos_y）
```

---

## 9. SupabaseのDB → React Flowノード/エッジへの変換

React Flowが要求する形式とDBの形式が異なるため、変換関数を用意する。

```typescript
// DBのCharacter → React FlowのNode
function toNode(character: Character): Node<CharacterNodeData> {
  return {
    id: character.id,
    type: 'character',
    position: { x: character.pos_x, y: character.pos_y },
    data: { character },
  }
}

// DBのRelationship → React FlowのEdge
function toEdge(rel: Relationship): Edge<RelationshipEdgeData> {
  return {
    id: rel.id,
    type: 'relationship',
    source: rel.source_id,
    target: rel.target_id,
    markerEnd: rel.direction === 'both' ? { type: MarkerType.ArrowClosed } : undefined,
    markerStart: rel.direction === 'both' ? { type: MarkerType.ArrowClosed } : undefined,
    style: rel.is_foreshadowing ? { strokeDasharray: '5,5' } : {},
    data: { relationship: rel },
  }
}
```

---

## 10. エラーハンドリング方針

| エラー種別 | 対応 |
|-----------|------|
| ネットワークエラー | Toastで「保存に失敗しました。再試行してください」を表示 |
| 認証エラー（401） | `/login` にリダイレクト |
| 権限エラー（403） | 「このプロジェクトにアクセスできません」をToastで表示 |
| バリデーションエラー | フォーム内にインラインエラーメッセージを表示 |

---

## 11. 実装順序（Week別）

| Week | 実装内容 |
|------|---------|
| 1 | Supabase設定・認証（Login/Signup）・ルーティング・DashboardPage（プロジェクトCRUD） |
| 2 | ProjectPage骨格・SidePanel・GraphCanvas（React Flow初期化）・CharacterNodeの表示 |
| 3 | キャラクターCRUD・CharacterDetailPanel・onConnect（エッジ作成）・RelationshipEdge表示 |
| 4 | RelationshipPanel・ノード位置保存・伏線フラグのビジュアル・Vercelデプロイ・UIブラッシュアップ |
