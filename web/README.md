# Chirp

シンプルな X (旧 Twitter) 風つぶやきアプリ。Next.js 16 + Supabase で作られた最小実装です。

## 機能

- メールアドレス + パスワードによる新規登録 / ログイン / ログアウト (二段階認証なし)
- 1〜280 文字のつぶやき投稿
- 全ユーザーの投稿を新しい順に表示するタイムライン
- 自分の投稿の削除

## 技術スタック

- Next.js 16 (App Router, Server Components, Server Actions)
- React 19, Tailwind CSS v4, shadcn/ui
- Supabase (Postgres + Auth + RLS), `@supabase/ssr`

## セットアップ

### 1. Supabase プロジェクトを用意

1. <https://supabase.com> でプロジェクトを作成。
2. Project Settings → API から **Project URL** と **anon public key** を控える。
3. SQL Editor で `../supabase/migrations/0001_init.sql` を実行する。
   - `profiles` / `posts` テーブル、`posts_with_author` ビュー、RLS、新規ユーザー用トリガーが作られます。
4. Authentication → Providers → Email で「Confirm email」を **OFF** にすると、確認メールなしですぐにログイン可能です (動作確認向け)。

### 2. 環境変数

`web/.env.example` をコピーして `web/.env.local` を作成し、値を埋めます:

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`.env*` は `.gitignore` で除外されているため GitHub にコミットされません。

### 3. ローカル起動

```bash
npm install
npm run dev
```

<http://localhost:3000> にアクセスすると `/login` にリダイレクトされます。
新規登録 → タイムライン → つぶやき投稿、と一通り操作できます。

## デプロイ

- このリポジトリを GitHub にプッシュした上で、Vercel など Next.js 対応プラットフォームに接続してください。
- ホスティング側のダッシュボードで `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を環境変数として設定します (リポジトリにはコミットしません)。

## ディレクトリ

```
web/
├── src/
│   ├── proxy.ts                       # Next 16 Proxy (旧 Middleware): セッション同期
│   ├── app/
│   │   ├── page.tsx                   # `/` -> /login or /timeline
│   │   ├── login/                     # ログインページ + フォーム
│   │   ├── signup/                    # 新規登録ページ + フォーム
│   │   ├── timeline/                  # タイムライン (投稿/一覧/削除)
│   │   └── actions/                   # Server Actions (auth, posts)
│   ├── components/ui/button.tsx
│   └── lib/
│       ├── utils.ts
│       └── supabase/
│           ├── client.ts              # Browser client
│           ├── server.ts              # Server Components / Actions client
│           └── proxy.ts               # Proxy 用 updateSession
└── ../supabase/migrations/0001_init.sql
```
