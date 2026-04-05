# Vibe Coding: 開発TODOリスト

これは「一人企業」に関わる全エージェント（Antigravity, Cursor, Claude Code）とCEO（あなた）が共通で参照するTODOリストです。
自分が担当するタスクがある場合はここを確認し、作業が終わったら `[x]` をつけてください。

## Phase 1: 要件定義・設計（担当：CEO, Antigravity）
- [x] どのようなアプリを作成するかアイデアを決定する
- [x] ターゲットユーザー、使用機能、マネタイズ方法などの要件定義文を `docs/REQUIREMENTS.md` にまとめる
- [x] データベースのテーブル設計案を作成する

## Phase 2: フロントエンドベースの構築（担当：Cursor, CEO）
- [x] Next.js 15 (App Router) プロジェクトの初期化 (`npx create-next-app@latest`)
- [ ] Tailwind CSS と shadcn/ui のセットアップ
- [ ] ホーム画面（LP）のUI構築
- [ ] 共通コンポーネント（ヘッダー、フッターなど）の実装

## Phase 3: バックエンド・インフラ構築（担当：Claude Code, Antigravity）
- [ ] Supabase プロジェクトの作成と環境変数への追加
- [ ] テーブルの構築とマイグレーションの実行
- [ ] RLS (Row Level Security) ポリシーの設定
- [ ] Supabase SSR を用いた認証機能（新規登録・ログイン・セッション管理）の組み込み

## Phase 4: 決済・連携（担当：Claude Code, Cursor）
- [ ] Stripe APIの導入
- [ ] プラン一覧画面（価格表UI）の実装
- [ ] Stripe Checkout決済エンドポイント・Webhookの実装
- [ ] 課金成功時、Supabaseへのクレジット付与・プラン更新の仕組みを作成

---
※ 各エージェントはこのリストを定期的に確認し、進行中のタスクを自律的に進めてください。
