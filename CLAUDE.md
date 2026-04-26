# Claude Code へのガイド

このファイルはClaude Code（AIエージェント）が最初に読む引き継ぎ文書です。
作業を始める前に必ず `docs/TODO.md` を確認し、未完了の自分担当タスクから着手してください。

## プロジェクト概要

個人目標管理Webアプリ（OKRトラッカー）の開発プロジェクトです。
- フレームワーク: Next.js 16 (App Router) + TypeScript
- スタイリング: Tailwind CSS v4 + shadcn/ui
- バックエンド: Supabase（予定）

## ディレクトリ構成

Next.js プロジェクトはリポジトリルートに直接配置されています
（Vercel が自動検出できるようにするため。`web/` サブディレクトリは廃止）。

```
ai-solo-company/
├── docs/
│   ├── TODO.md            # 全エージェント共通のタスクリスト（最重要）
│   ├── REQUIREMENTS.md    # 要件定義
│   └── DATABASE_SCHEMA.md # DB設計
├── agents/
│   └── claude-code-role.md # Claude Codeの役割定義
├── src/
│   ├── app/                # App Router のページ群
│   ├── components/ui/      # shadcn/ui コンポーネント
│   └── lib/
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
└── CLAUDE.md / AGENTS.md
```

## 出力ルール

### URL は必ず全文で出すこと

作業完了時に提示する URL（デプロイ URL、プレビュー URL、PR URL、Issue URL、
ドキュメント URL など）は、**省略せず全文をそのまま貼り付ける**こと。

- 悪い例: 「Vercel のプレビュー URL で確認できます」
- 悪い例: 「[こちら](https://...)」のようにリンクテキストだけ表示
- 悪い例: `https://example.vercel.app/...`（末尾を `...` で省略）
- 良い例: `https://ai-solo-company-lwcp.vercel.app/rikkunshito` をそのまま全文で記載

対象となる主な URL:

- Vercel の本番 / プレビュー URL（例: `https://<project>.vercel.app/<path>`）
- GitHub の PR / Issue / コミット URL
- Supabase / 外部ダッシュボードへのリンク
- 生成したドキュメントやデモページの URL

ユーザーがそのままコピーしてブラウザに貼れる形で（クエリパラメータや
ハッシュも含めて）記載すること。Markdown のリンク記法を使う場合でも、
URL 本文も併記する：

```
デプロイ URL: https://ai-solo-company-lwcp.vercel.app/rikkunshito
（[リンク](https://ai-solo-company-lwcp.vercel.app/rikkunshito)）
```

### 完了報告のテンプレート

タスク完了時は、以下の情報を全文で記載すること:

1. 何をしたか（1〜3行）
2. 関連 URL（デプロイ URL / PR URL / コミット URL を**全文**で）
3. 残課題があれば箇条書きで

## あなた（Claude Code）の担当タスク

`docs/TODO.md` のPhase 3（バックエンド・インフラ構築）が主な担当です。

- Supabaseプロジェクトの作成と環境変数への追加
- テーブルの構築とマイグレーションの実行
- RLS (Row Level Security) ポリシーの設定
- Supabase SSRを用いた認証機能の組み込み

## 作業ルール

1. 作業を始める前に `git pull` で最新状態を取得する
2. タスクが完了したら `docs/TODO.md` の該当項目を `[x]` に更新する
3. 作業完了後は `git add . && git commit -m "作業内容の説明"` でコミットする
4. 最後に `git push` でGitHubへ反映する

## 環境変数

`.env.local` ファイルをリポジトリルート（= プロジェクトルート）に作成し、以下を設定する:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## デプロイに関する注意

### ⚠️ よくある再発エラー: `The specified Root Directory "web" does not exist.`

このエラーは **Vercel ダッシュボードの Root Directory 設定が `web` のまま**になっている場合に発生します。
**AI エージェントからは Vercel ダッシュボード設定を変更できません。** CEO（人間）が手動で
`Settings → General → Root Directory` を **空欄** に変更し、Redeploy する必要があります。
詳細手順は `README.md` を参照。

このエラーが出ているときに AI が取るべき行動:

1. **コード側を「`web/` に戻す」修正は絶対にしない**（過去に往復が起きており、CLAUDE.md の方針に反する）。
2. リポジトリの状態を確認し、ルートに `package.json` / `next.config.ts` / `src/` が揃っていることを確かめる。
3. 揃っていれば**コード側は正しい**。CEO に Vercel ダッシュボード操作を依頼する。
4. 余計な `vercel.json` を作らない（`rootDirectory` フィールドは存在せず、上書き不可）。

### その他

- Next.js プロジェクトはリポジトリルートにある。`web/` サブディレクトリは廃止済み。
- Vercel プロジェクトの **Settings → General → Root Directory** は **空欄（= リポジトリルート）** にすること。
- `vercel.json` は不要（Next.js は Vercel が自動検出する）。

@AGENTS.md
