# Content Workbench

`requirements/2026-05-06-content-workbench-mvp.md` に基づく初期実装です。

## 起動方法

リポジトリルートから:

```powershell
npm run dev --workspace apps/content-workbench
```

またはアプリディレクトリから:

```powershell
cd apps/content-workbench
npm run dev
```

既定では `http://localhost:3000` で起動します。ポートを変える場合:

```powershell
$env:PORT=3001
npm run dev --workspace apps/content-workbench
```

## Codex CLI から使う場合

Codex Desktop で操作しづらい場合も、CLI では同じコマンドでUIサーバーを起動できます。

```powershell
cd C:\Users\Tatsuya Yamamoto\Desktop\IdeaVault\aistudio-ideation
npm run dev --workspace apps/content-workbench
```

起動後、ブラウザで `http://localhost:3000` を開いてください。

Codex app-server は別プロセスで起動します。

```powershell
npm run codex-app-server
```

## 現在含まれるもの

- 要件定義に沿った `Article` ドメインモデル
- ローカルJSON保存を行う `ArticleRepository`
- PF別入力ガイド（ツールチップ文言の設定）
- 公開チェックリスト判定のユースケース
- 外部依存なしで動くローカルHTTPサーバー
- Dashboard / Editor / Library の最小UI
- 記事保存、PF別バリアント編集、公開チェック、ChatGPT画像プロンプト作成、生成済み画像の取り込み

## データ保存先

既定では `apps/content-workbench/.data/articles/*.json` に保存します。
保存先を変える場合は `CONTENT_WORKBENCH_DATA_DIR` を指定します。

## ChatGPT画像生成ワークフロー

画像生成はAPI課金ではなく、ChatGPT Pro側の画像生成を使う前提です。

1. Editor の `ChatGPT Image Workflow` で用途・比率・画像ブリーフを入力する
2. `Compose Prompt` でChatGPT用プロンプトを整形する
3. `Copy for ChatGPT` でコピーし、ChatGPTに貼って画像生成する
4. 生成画像を保存し、`Attach generated image` からアップロードする
5. `Copy Markdown` で記事本文に挿入するMarkdownをコピーする

この方式では `gpt-image-2` をChatGPT UIから使い、アプリ側はプロンプト管理と生成済み画像の紐付けに専念します。

## AI連携について

調査・執筆・レビューは Codex app-server 連携で追加する想定です。画像生成は上記のChatGPT手動生成フローを使います。

## 次ステップ候補

1. `/api/ai/research` `/api/ai/draft` `/api/ai/review` の実装
2. 用途別プロンプトテンプレート（調査 / 執筆 / レビュー）の追加
3. Markdownプレビューと記事内画像挿入UIの強化
