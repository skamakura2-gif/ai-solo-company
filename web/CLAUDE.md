# Claude Code へのガイド

このファイルは Claude Code (AI エージェント) が最初に読む引き継ぎ文書です。

## プロジェクト概要

「Chirp」 — シンプルな X (旧 Twitter) 風つぶやきアプリ。

- フレームワーク: Next.js 16 (App Router) + TypeScript
- スタイリング: Tailwind CSS v4 + shadcn/ui
- バックエンド: Supabase (Auth + Postgres + RLS)

## ディレクトリ構成

```
ai-solo-company/
├── docs/
│   ├── REQUIREMENTS.md
│   ├── DATABASE_SCHEMA.md
│   └── TODO.md
├── supabase/
│   └── migrations/0001_init.sql   # profiles + posts + RLS + view + trigger
└── web/                            # Next.js プロジェクト
    └── src/
        ├── proxy.ts                # Next 16 Proxy: セッション同期
        ├── app/
        │   ├── login/, signup/, timeline/, actions/
        │   └── page.tsx
        ├── components/ui/button.tsx
        └── lib/supabase/{client,server,proxy}.ts
```

## 重要な実装ルール

1. **Next.js 16**: Middleware は `proxy.ts` に名称変更。export する関数も `proxy`。
   コードを書く前に必ず `node_modules/next/dist/docs/` で最新仕様を確認すること。
2. **Server Component 優先**: データ取得は Server Component、変更は Server Actions。
   末端のインタラクティブな部品にだけ `"use client"` をつける。
3. **Supabase**: `@supabase/ssr` の `createBrowserClient` / `createServerClient`
   を使い分ける。`server.ts` と `proxy.ts` で `cookies` をきちんと同期させること。
4. **RLS は必須**: 新しいテーブルを足すなら必ず RLS を有効化し、
   `auth.uid()` ベースのポリシーを書く。
5. **環境変数**: `web/.env.local` のみ。リポジトリ直下の `.gitignore` で
   `.env*` は除外済み。コミットしないこと。

## 環境変数

`web/.env.local` を作成し以下を設定:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

@AGENTS.md
