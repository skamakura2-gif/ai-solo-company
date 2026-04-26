# Claude Code へのガイド（リポジトリルート）

このファイルはリポジトリ全体に適用される Claude Code 向けのガイドです。
`web/CLAUDE.md` はサブプロジェクト固有のガイドなので、両方を読んでください。

## 出力ルール

### URL は必ず全文で出すこと

作業完了時に提示する URL（デプロイ URL、プレビュー URL、PR URL、Issue URL、
ドキュメント URL など）は、**省略せず全文をそのまま貼り付ける**こと。

- ❌ 悪い例: 「Vercel のプレビュー URL で確認できます」
- ❌ 悪い例: 「[こちら](https://...)」のようにリンクテキストだけ表示
- ❌ 悪い例: `https://example.vercel.app/...`（末尾を `...` で省略）
- ✅ 良い例: `https://ai-solo-company-abc123.vercel.app/rikkunshito`
  をそのまま全文で本文に記載する

対象となる主な URL:

- Vercel の本番 / プレビュー URL（例: `https://<project>.vercel.app/<path>`）
- GitHub の PR / Issue / コミット URL
- Supabase / 外部ダッシュボードへのリンク
- 生成したドキュメントやデモページの URL

URL を載せる時は、ユーザーがそのままコピーしてブラウザに貼れる形で
（クエリパラメータやハッシュも含めて）記載すること。Markdown の
リンク記法を使う場合でも、URL 本文も併記する：

```
デプロイ URL: https://ai-solo-company.vercel.app/rikkunshito
（[リンク](https://ai-solo-company.vercel.app/rikkunshito)）
```

### 完了報告のテンプレート

タスク完了時は、以下の情報を全文で記載すること:

1. 何をしたか（1〜3行）
2. 関連 URL（デプロイ URL / PR URL / コミット URL を**全文**で）
3. 残課題があれば箇条書きで

## プロジェクト構成

```
ai-solo-company/
├── CLAUDE.md            # このファイル（リポジトリ全体のガイド）
├── vercel.json          # Vercel 設定（web/ をビルド対象にする）
├── docs/                # 要件定義 / TODO / DB スキーマ
├── agents/              # 各エージェントの役割定義
└── web/                 # Next.js 16 プロジェクト
    ├── CLAUDE.md        # web 配下の作業ガイド
    └── src/app/
```

## デプロイに関する注意

- 本リポジトリは monorepo 構成で、Next.js プロジェクトは `web/` 配下にある
- Vercel は `vercel.json`（リポジトリルート）の設定で `web/` をビルドする
- `vercel.json` を変更する場合は、Vercel ダッシュボードの Root Directory 設定と
  どちらか一方に統一すること（両方設定すると衝突する可能性がある）
