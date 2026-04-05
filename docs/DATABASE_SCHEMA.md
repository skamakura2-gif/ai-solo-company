# DATABASE SCHEMA (Supabase / PostgreSQL)

「パーソナル目標・タスク管理アプリ」のためのデータベース設計案です。Supabase上で構築します。
セキュリティを担保するため、全テーブルで Row Level Security (RLS) を有効化し、自分自身のデータしか参照・更新できないようにします。

## 1. `users` テーブル (Supabase Auth連携)
Supabase Auth（認証）で生成される `auth.users` と連動して、ユーザーのプロフィール情報を管理します。
- `id` (UUID, Primary Key, references auth.users.id)
- `email` (String)
- `display_name` (String, nullable)
- `created_at` (Timestamp)
- `total_penalty_amount` (Integer, default: 0) - ペナルティ貯金の合計額

## 2. `goals` テーブル (大目標・OKR管理)
半期ごとの目標や、月間の定性・定量目標を保存します。
- `id` (UUID, Primary Key)
- `user_id` (UUID, references users.id)
- `title` (String) - 例: 「単月600万円の売上達成」
- `description` (Text, nullable)
- `category` (String) - 例: "Quantitative", "Qualitative", "Value"
- `period_type` (Enum: 'half_yearly', 'monthly')
- `target_date` (Date)
- `is_achieved` (Boolean, default: false)
- `created_at` (Timestamp)

## 3. `tasks` テーブル (期間別タスク・行動管理)
目標に紐づく、または独立した日・週・月ごとのタスク（行動）を管理します。
- `id` (UUID, Primary Key)
- `user_id` (UUID, references users.id)
- `goal_id` (UUID, nullable, references goals.id)
- `title` (String) - 例: 「一次返信を1時間以内に行う」
- `frequency` (Enum: 'daily', 'weekly', 'monthly')
- `status` (Enum: 'pending', 'completed', 'failed')
- `due_date` (Date) - そのタスクの実行対象日（週次/月次の場合はその期間の最終日）
- `penalty_amount` (Integer, default: 0) - 失敗時の罰金額（例：100円）
- `created_at` (Timestamp)

## 4. `reflections` テーブル (振り返り・言語化の記録)
日々の業務完了報告や、金曜日の課題言語化などのメモを記録します。タスクと紐付けて管理も可能です。
- `id` (UUID, Primary Key)
- `user_id` (UUID, references users.id)
- `task_id` (UUID, nullable, references tasks.id)
- `content` (Text) - 振り返り、課題の言語化内容
- `reflection_date` (Date)
- `created_at` (Timestamp)

## 5. `penalties_log` テーブル (ペナルティ履歴)
タスクが「failed」になった際に追加されるチーム貯金（罰金）の履歴テーブルです。
- `id` (UUID, Primary Key)
- `user_id` (UUID, references users.id)
- `task_id` (UUID, nullable, references tasks.id)
- `amount` (Integer) - 例: 100
- `reason` (String)
- `created_at` (Timestamp)

---
### トリガー (Database Triggers)
- **ユーザー登録時:** `auth.users` にレコードが作成されたら、自動で `users` テーブルにもレコードを作成する。
- **ペナルティ発生時:** `tasks` の `status` が `failed` になり `penalty_amount` が0より大きい場合、自動的に `penalties_log` に記録し、`users.total_penalty_amount` を加算する。
