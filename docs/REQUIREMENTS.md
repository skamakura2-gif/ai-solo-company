# REQUIREMENT: Chirp - シンプルな X 風つぶやきアプリ

## 1. プロジェクトの目的
ユーザーが短いつぶやきを投稿し、タイムライン形式で閲覧できる、X (旧 Twitter) 風の極めてシンプルな Web アプリを構築する。

## 2. ターゲットユーザー
- 「とりあえず動く SNS の最小実装」を試したい開発者・学習者。

## 3. コア機能要件

### A. 認証
- メールアドレス + パスワードによる新規登録 / ログイン / ログアウト。
- 二段階認証 (MFA) は対象外。
- セッションは Supabase SSR + Next.js Proxy (旧 Middleware) で同期する。

### B. 投稿 (Chirp)
- ログインユーザーは 1〜280 文字のテキストを投稿できる。
- 自分の投稿は削除できる。

### C. タイムライン
- 全ユーザーの投稿を新しい順に最大 100 件表示する。
- 各投稿に投稿者ハンドル (`@handle`) と投稿時刻を表示する。

## 4. UI/UX の方針
- **意図的に最小限**: shadcn/ui の Button と素の input/textarea のみで構成。装飾は最小限。
- ダークモードは `globals.css` の CSS 変数に追従するのみ (明示トグルなし)。
- レスポンシブ (`max-w-2xl`) で PC / モバイルの両方で読める。

## 5. 技術スタック
- **Frontend**: Next.js 16 (App Router, Server Components 主体), React 19, Tailwind CSS v4
- **UI**: shadcn/ui (Button), Lucide
- **Backend / Auth / DB**: Supabase (Postgres + Auth + RLS)
- **Deployment**: GitHub にソースをプッシュ。本番ホスティングは Vercel など任意の Next.js 対応プラットフォームを想定。
