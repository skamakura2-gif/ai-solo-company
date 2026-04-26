# ai-solo-company

個人目標管理 Web アプリ（OKR トラッカー）。Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui。

---

## ⚠️ Vercel デプロイ前に必ず確認すること

**Next.js プロジェクトはリポジトリルートに配置されています。`web/` サブディレクトリは廃止済みです。**

Vercel でデプロイする場合、以下の設定を**必ず**確認してください。設定が誤っていると
`The specified Root Directory "web" does not exist.` というエラーで毎回ビルドが失敗します。

| 項目 | 正しい値 |
| --- | --- |
| Settings → General → **Root Directory** | **空欄**（= リポジトリルート） |
| Framework Preset | Next.js（自動検出） |
| Build Command | （空欄＝デフォルト `next build`） |
| Install Command | （空欄＝デフォルト `npm install`） |

### 設定変更手順

1. Vercel ダッシュボードでプロジェクト `ai-solo-company` を開く
2. 上部タブの **Settings** をクリック
3. 左サイドバーの **General** を選択
4. **Root Directory** セクションの **Edit** をクリック
5. テキストボックスを**空欄**にして **Save**
6. **Deployments** タブから最新デプロイを **Redeploy**

> この設定はダッシュボードでしか変更できません（`vercel.json` の `rootDirectory` フィールドは存在しません）。
> AI エージェントからは変更できないため、人間が必ず操作する必要があります。

---

## ローカル開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## ドキュメント

- `docs/REQUIREMENTS.md` — 要件定義
- `docs/DATABASE_SCHEMA.md` — DB 設計
- `docs/TODO.md` — タスクリスト（全エージェント共通）
- `CLAUDE.md` / `AGENTS.md` — エージェント向け引き継ぎ
