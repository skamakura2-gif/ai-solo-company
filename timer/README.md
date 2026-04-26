# Timer

Next.js 15 + Tailwind CSS v4 で作ったシンプルなカウントダウンタイマー。

## ローカル開発

```bash
cd timer
npm install
npm run dev
```

http://localhost:3000 を開く。

## Vercel への公開

1. https://vercel.com/new でこのリポジトリを Import。
2. **Root Directory** を `timer` に設定。
3. Framework は自動で「Next.js」が選ばれる。`Build Command` / `Output Directory` はデフォルトのまま。
4. Deploy を押すと公開 URL が発行される。

以降はこのブランチに push するたびに自動デプロイされる。
