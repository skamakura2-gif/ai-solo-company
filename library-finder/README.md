# library-finder

カーリル図書館 API（<https://calil.jp/doc/api_ref.html>）を用いて、現在地や地域から
近くの図書館を検索できる単独の Next.js 16 アプリです。リポジトリ内の他のアプリ
（六君子湯ページ等）とは独立しており、`library-finder/` ディレクトリ配下のみで
完結します。

## セットアップ

```bash
cd library-finder
npm install
```

`.env.local` を作成し、カーリルから取得したアプリケーションキーを設定します。

```
CALIL_APP_KEY=your_calil_app_key
```

> アプリケーションキーは <https://calil.jp/api/dashboard/> から取得できます。

## 開発サーバー

```bash
npm run dev
```

<http://localhost:3000> を開いて利用してください。

## ビルド

```bash
npm run build
npm run start
```

## 構成

- フレームワーク: Next.js 16 (App Router) + TypeScript
- スタイル: Tailwind CSS v4
- API: `/api/libraries` がカーリル図書館 API を呼び出すサーバープロキシ
  - `lat`, `lng`（現在地）または `pref`, `city`（地域）で検索
  - `geocode` 指定時はサーバー側で距離順に並び替え
- UI: トップページ `/` のみ。位置情報モード・地域モードを切替可能
