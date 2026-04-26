import type { Metadata } from "next";

import { NearbyLibraries } from "./nearby-libraries";

export const metadata: Metadata = {
  title: "近くの図書館を探す",
  description:
    "現在地から最も近い図書館をカーリル図書館APIで検索して一覧表示します。",
};

export default function LibrariesPage() {
  const appKeyConfigured = Boolean(process.env.CALIL_APP_KEY);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Library Finder
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            近くの図書館を探す
          </h1>
          <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            ブラウザの位置情報から、現在地に近い図書館をカーリルの図書館APIで検索します。
            データは{" "}
            <a
              href="https://calil.jp/doc/api.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              カーリル図書館API
            </a>
            から提供されています。
          </p>
        </header>

        {appKeyConfigured ? (
          <NearbyLibraries />
        ) : (
          <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200">
            <p className="font-medium">CALIL_APP_KEY が未設定です</p>
            <p className="mt-1">
              <code className="font-mono">web/.env.local</code> に
              <code className="font-mono"> CALIL_APP_KEY=...</code> を追加してから
              開発サーバーを再起動してください。アプリキーは
              <a
                href="https://calil.jp/api/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline underline-offset-4"
              >
                カーリルのダッシュボード
              </a>
              から発行できます。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
