"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Library as LibraryIcon,
  LoaderCircle,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

type CalilLibrary = {
  systemid: string;
  systemname: string;
  libkey: string;
  libid: string;
  short: string;
  formal: string;
  url_pc: string;
  address: string;
  pref: string;
  city: string;
  post: string;
  tel: string;
  geocode: string;
  category: string;
  image: string;
  distance?: number;
};

type Status =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "fetching"; longitude: number; latitude: number }
  | {
      kind: "ready";
      longitude: number;
      latitude: number;
      libraries: CalilLibrary[];
    }
  | { kind: "error"; message: string };

const CATEGORY_LABEL: Record<string, string> = {
  SMALL: "図書室",
  MEDIUM: "図書館",
  LARGE: "図書館（広域）",
  UNIV: "大学",
  SPECIAL: "専門",
  BM: "移動図書館",
};

export function NearbyLibraries() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const findLibraries = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus({
        kind: "error",
        message: "このブラウザは位置情報に対応していません。",
      });
      return;
    }

    setStatus({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;
        setStatus({ kind: "fetching", longitude, latitude });

        try {
          const url = new URL("/api/libraries", window.location.origin);
          url.searchParams.set("longitude", String(longitude));
          url.searchParams.set("latitude", String(latitude));
          url.searchParams.set("limit", "10");

          const res = await fetch(url.toString());
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.error ?? "図書館情報の取得に失敗しました。");
          }
          setStatus({
            kind: "ready",
            longitude,
            latitude,
            libraries: (data.libraries ?? []) as CalilLibrary[],
          });
        } catch (err) {
          setStatus({
            kind: "error",
            message:
              err instanceof Error ? err.message : "図書館の検索に失敗しました。",
          });
        }
      },
      (err) => {
        setStatus({
          kind: "error",
          message: geolocationErrorMessage(err),
        });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);

  useEffect(() => {
    findLibraries();
  }, [findLibraries]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusLine status={status} />
        <Button
          onClick={findLibraries}
          disabled={status.kind === "locating" || status.kind === "fetching"}
          size="sm"
        >
          <Navigation />
          再検索
        </Button>
      </div>

      {status.kind === "error" && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5" />
          <p>{status.message}</p>
        </div>
      )}

      {status.kind === "ready" && status.libraries.length === 0 && (
        <div className="rounded-lg border border-border bg-background p-6 text-center text-sm text-muted-foreground">
          周辺に図書館が見つかりませんでした。
        </div>
      )}

      {status.kind === "ready" && status.libraries.length > 0 && (
        <ul className="flex flex-col gap-3">
          {status.libraries.map((lib) => (
            <li key={lib.libid}>
              <LibraryCard library={lib} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StatusLine({ status }: { status: Status }) {
  switch (status.kind) {
    case "idle":
      return (
        <p className="text-sm text-muted-foreground">
          位置情報の利用を許可すると、近くの図書館を表示します。
        </p>
      );
    case "locating":
      return (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="animate-spin" />
          現在地を取得しています…
        </p>
      );
    case "fetching":
      return (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="animate-spin" />
          近くの図書館を検索しています…
        </p>
      );
    case "ready":
      return (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin />
          {status.libraries.length} 件 ヒット（{status.latitude.toFixed(4)},{" "}
          {status.longitude.toFixed(4)} 周辺）
        </p>
      );
    case "error":
      return null;
  }
}

function LibraryCard({ library }: { library: CalilLibrary }) {
  const categoryLabel = CATEGORY_LABEL[library.category] ?? library.category;
  const calilUrl = `https://calil.jp/library/${library.libid}/${encodeURIComponent(library.formal)}`;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 shadow-sm transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LibraryIcon className="size-3.5" />
            <span>{categoryLabel}</span>
            <span aria-hidden>·</span>
            <span>{library.systemname}</span>
          </div>
          <h2 className="text-base font-semibold text-foreground">
            {library.formal}
          </h2>
        </div>
        {typeof library.distance === "number" && (
          <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {formatDistance(library.distance)}
          </div>
        )}
      </div>

      <dl className="grid grid-cols-1 gap-1.5 text-sm text-muted-foreground sm:grid-cols-[auto_1fr] sm:gap-x-3">
        <dt className="flex items-center gap-1.5 sm:justify-end">
          <MapPin className="size-3.5" />
          <span className="sr-only">住所</span>
        </dt>
        <dd>{library.address}</dd>
        {library.tel && (
          <>
            <dt className="flex items-center gap-1.5 sm:justify-end">
              <Phone className="size-3.5" />
              <span className="sr-only">電話番号</span>
            </dt>
            <dd>
              <a href={`tel:${library.tel}`} className="hover:underline">
                {library.tel}
              </a>
            </dd>
          </>
        )}
      </dl>

      <div className="flex flex-wrap gap-2 pt-1">
        {library.url_pc && (
          <a
            href={library.url_pc}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            公式サイト
            <ExternalLink data-icon="inline-end" />
          </a>
        )}
        <a
          href={calilUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          カーリルで見る
          <ExternalLink data-icon="inline-end" />
        </a>
      </div>
    </article>
  );
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

function geolocationErrorMessage(err: GeolocationPositionError) {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "位置情報の利用が許可されていません。ブラウザの設定で許可してください。";
    case err.POSITION_UNAVAILABLE:
      return "現在地を取得できませんでした。";
    case err.TIMEOUT:
      return "位置情報の取得がタイムアウトしました。再試行してください。";
    default:
      return err.message || "現在地の取得に失敗しました。";
  }
}
