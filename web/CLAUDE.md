# Claude Code へのガイド

このファイルはClaude Code（AIエージェント）が最初に読む引き継ぎ文書です。
作業を始める前に必ず `../docs/TODO.md` を確認し、未完了の自分担当タスクから着手してください。

## プロジェクト概要

個人目標管理Webアプリ（OKRトラッカー）の開発プロジェクトです。
- フレームワーク: Next.js 16 (App Router) + TypeScript
- スタイリング: Tailwind CSS v4 + shadcn/ui
- バックエンド: Supabase（予定）

## ディレクトリ構成

```
ai_solo_company/
├── docs/
│   ├── TODO.md          # 全エージェント共通のタスクリスト（最重要）
│   ├── REQUIREMENTS.md  # 要件定義
│   └── DATABASE_SCHEMA.md # DB設計
├── agents/
│   └── claude-code-role.md # Claude Codeの役割定義
└── web/                 # Next.jsプロジェクト（このディレクトリ）
    ├── src/app/
    └── src/components/ui/
```

## あなた（Claude Code）の担当タスク

`../docs/TODO.md` のPhase 3（バックエンド・インフラ構築）が主な担当です。

- Supabaseプロジェクトの作成と環境変数への追加
- テーブルの構築とマイグレーションの実行
- RLS (Row Level Security) ポリシーの設定
- Supabase SSRを用いた認証機能の組み込み

## 作業ルール

1. 作業を始める前に `git pull` で最新状態を取得する
2. タスクが完了したら `../docs/TODO.md` の該当項目を `[x]` に更新する
3. 作業完了後は `git add . && git commit -m "作業内容の説明"` でコミットする
4. 最後に `git push` でGitHubへ反映する

## 環境変数

`.env.local` ファイルをプロジェクトルートに作成し、以下を設定する:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

@AGENTS.md
