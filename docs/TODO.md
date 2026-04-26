# Chirp: 開発 TODO リスト

「Chirp」(X 風つぶやきアプリ) の最小実装タスクです。

## Phase 1: 要件定義・設計
- [x] アプリの方向性を決定 (X 風シンプルつぶやきアプリ)
- [x] `docs/REQUIREMENTS.md` の更新
- [x] `docs/DATABASE_SCHEMA.md` の更新
- [x] SQL マイグレーション (`supabase/migrations/0001_init.sql`) の作成

## Phase 2: 実装 (フロント + バックエンド)
- [x] Next.js 16 + Tailwind v4 + shadcn/ui のセットアップ (既存)
- [x] `@supabase/ssr` 導入と client/server/proxy ヘルパー作成
- [x] `proxy.ts` (Next 16) でセッション同期 + 未ログインリダイレクト
- [x] ログイン / 新規登録ページ + Server Actions
- [x] タイムラインページ (投稿フォーム + 一覧 + 削除)
- [x] `.env.example` 追加 / `.env*` を gitignore

## Phase 3: 動作確認 (CEO 担当)
- [ ] Supabase プロジェクトを作成し、`web/.env.local` に URL と anon key を設定
- [ ] Supabase SQL エディタで `supabase/migrations/0001_init.sql` を実行
- [ ] `npm run dev` でサインアップ → 投稿 → 削除 → ログアウトを通しで確認
- [ ] (任意) Vercel など Next.js 対応プラットフォームへデプロイ
