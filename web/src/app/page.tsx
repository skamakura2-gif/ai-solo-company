import Link from "next/link";
import { Library, MapPin } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-start gap-8 py-32 px-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
          <Library className="size-3.5" />
          ai-solo-company
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
            近くの図書館を、
            <br />
            ワンタップで。
          </h1>
          <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
            ブラウザの位置情報とカーリル図書館APIを組み合わせて、
            現在地から近い図書館を一覧表示します。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/libraries"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <MapPin />
            近くの図書館を探す
          </Link>
          <a
            href="https://calil.jp/doc/api.html"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            カーリルAPIについて
          </a>
        </div>
      </main>
    </div>
  );
}
