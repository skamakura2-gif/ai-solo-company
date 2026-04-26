# DATABASE SCHEMA (Supabase / PostgreSQL)

「Chirp」(X 風つぶやきアプリ) のデータベース設計です。
実際の DDL は `supabase/migrations/0001_init.sql` を参照してください。
全テーブルで RLS を有効化し、最小権限のポリシーを適用します。

## 1. `auth.users` (Supabase 提供)
Supabase Auth が管理する組み込みテーブル。`raw_user_meta_data.handle` に
新規登録時の希望ハンドルを格納する。

## 2. `profiles`
`auth.users` と 1:1 のプロフィール。公開情報のみ。
- `id` (uuid, PK, references auth.users.id on delete cascade)
- `handle` (text, unique, not null) - 公開ハンドル名 (`@handle`)
- `created_at` (timestamptz, default now())

**RLS ポリシー**
- SELECT: 全員可 (タイムラインで `@handle` を表示するため)
- INSERT / UPDATE: 自分自身 (`auth.uid() = id`) のみ可

**トリガー**
- `auth.users` への INSERT 時に `public.handle_new_user()` を実行し、
  `raw_user_meta_data.handle` (なければメールのローカル部) から
  英数字+アンダースコアのみのハンドルを生成して `profiles` に挿入する。
  既存と衝突する場合は末尾に連番を付与してユニークに保つ。

## 3. `posts`
ひとつの投稿 (chirp)。
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, not null, references auth.users.id on delete cascade)
- `content` (text, not null, `1 <= char_length(content) <= 280`)
- `created_at` (timestamptz, default now())

**インデックス**
- `posts (created_at desc)` - タイムラインの並び替え用

**RLS ポリシー**
- SELECT: 全員可 (公開タイムライン)
- INSERT: `auth.uid() = user_id` (自分名義の投稿のみ)
- DELETE: `auth.uid() = user_id` (自分の投稿のみ削除可)
- UPDATE: ポリシー無し = 不可 (編集機能は提供しない)

## 4. `posts_with_author` (View)
`posts` と `profiles` を結合した、タイムライン表示用の読み取り専用ビュー。
`security_invoker = true` で作成しているため、RLS は呼び出し元ユーザーで評価される。
- 列: `id`, `user_id`, `content`, `created_at`, `handle`
