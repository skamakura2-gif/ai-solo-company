"use client";

import { useCallback, useMemo, useState } from "react";

type LibraryHit = {
  systemid: string;
  systemname: string;
  formal: string;
  short: string;
  address: string;
  pref: string;
  city: string;
  post: string;
  tel: string;
  url_pc: string;
  category: string;
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
};

type ApiResponse = {
  count: number;
  demo?: boolean;
  query: {
    lat: number | null;
    lng: number | null;
    pref: string | null;
    city: string | null;
  };
  libraries: LibraryHit[];
};

type Mode = "geo" | "address";

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

const CATEGORY_LABEL: Record<string, string> = {
  LARGE: "中央館",
  MEDIUM: "地域館",
  SMALL: "小規模館",
  UNIVERSITY: "大学",
  SPECIAL: "専門",
  BM: "移動図書館",
};

function formatDistance(km: number | null): string {
  if (km === null) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("geo");
  const [pref, setPref] = useState<string>("東京都");
  const [city, setCity] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  type SearchArgs =
    | { kind: "geo"; lat: number; lng: number }
    | { kind: "address"; pref: string; city: string };

  const search = useCallback(async (args: SearchArgs) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams();
      if (args.kind === "geo") {
        params.set("lat", String(args.lat));
        params.set("lng", String(args.lng));
      } else if (args.city.trim()) {
        params.set("city", `${args.pref}${args.city.trim()}`);
      } else {
        params.set("pref", args.pref);
      }
      params.set("limit", "20");
      const res = await fetch(`/api/libraries?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as ApiResponse | { error: string };
      if (!res.ok) {
        const msg = "error" in data ? data.error : "検索に失敗しました。";
        setError(msg);
        return;
      }
      setResult(data as ApiResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const requestGeolocation = useCallback(() => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("このブラウザでは位置情報が利用できません。");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCoords(next);
        setLoading(false);
        void search({ kind: "geo", lat: next.lat, lng: next.lng });
      },
      (err) => {
        setLoading(false);
        setError(`位置情報の取得に失敗しました: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, [search]);

  const onAddressSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void search({ kind: "address", pref, city });
    },
    [pref, city, search],
  );

  const subtitle = useMemo(() => {
    if (!result) return null;
    const q = result.query;
    if (q.lat !== null && q.lng !== null) {
      return `現在地（${q.lat.toFixed(4)}, ${q.lng.toFixed(4)}）周辺の図書館 ${result.count} 件`;
    }
    if (q.city) return `${q.city} の図書館 ${result.count} 件`;
    if (q.pref) return `${q.pref} の図書館 ${result.count} 件`;
    return null;
  }, [result]);

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.3em] text-slate-500">
                LIBRARY FINDER
              </p>
              <h1 className="text-base font-semibold text-slate-900">
                近くの図書館を探す
              </h1>
            </div>
          </div>
          <a
            href="https://calil.jp/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 hover:text-emerald-700"
          >
            powered by カーリル →
          </a>
        </div>
      </header>

      <section className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("geo")}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                mode === "geo"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              現在地から探す
            </button>
            <button
              type="button"
              onClick={() => setMode("address")}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                mode === "address"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              地域から探す
            </button>
          </div>

          {mode === "geo" ? (
            <div className="mt-6 flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                ブラウザの位置情報を使い、現在地周辺の図書館を距離順に表示します。
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={requestGeolocation}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  </svg>
                  {loading ? "検索中…" : "現在地で検索"}
                </button>
                {coords && (
                  <span className="text-xs text-slate-500">
                    現在地: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={onAddressSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">都道府県</span>
                  <select
                    value={pref}
                    onChange={(e) => setPref(e.target.value)}
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">市区町村（任意）</span>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="例: 世田谷区 / 調布市"
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "検索中…" : "この地域で検索"}
                </button>
              </div>
            </form>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result?.demo && !error && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>デモモード</strong>:{" "}
            <code className="rounded bg-amber-100 px-1">CALIL_APP_KEY</code>{" "}
            が未設定のため、サンプルの図書館データを表示しています。
            実データを取得するには{" "}
            <a
              href="https://calil.jp/api/dashboard/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              カーリル API ダッシュボード
            </a>
            でキーを発行し、<code className="rounded bg-amber-100 px-1">.env.local</code>{" "}
            に設定してください。
          </div>
        )}

        {subtitle && !error && (
          <p className="mt-8 text-sm text-slate-500">{subtitle}</p>
        )}

        {result && result.libraries.length === 0 && !error && (
          <p className="mt-2 text-sm text-slate-500">
            該当する図書館が見つかりませんでした。
          </p>
        )}

        {result && result.libraries.length > 0 && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.libraries.map((lib, i) => {
              const mapHref =
                lib.lat !== null && lib.lng !== null
                  ? `https://www.google.com/maps/search/?api=1&query=${lib.lat},${lib.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lib.address)}`;
              const key = `${lib.systemid}-${lib.short}-${i}`;
              return (
                <li
                  key={key}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{lib.systemname}</span>
                        {lib.category && CATEGORY_LABEL[lib.category] && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] tracking-wider text-slate-600">
                            {CATEGORY_LABEL[lib.category]}
                          </span>
                        )}
                      </div>
                      <h2 className="mt-1 truncate text-base font-semibold text-slate-900">
                        {lib.formal || lib.short}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {formatDistance(lib.distanceKm)}
                    </span>
                  </div>

                  <dl className="grid gap-1 text-sm text-slate-700">
                    <div className="flex gap-2">
                      <dt className="w-12 shrink-0 text-xs text-slate-400">住所</dt>
                      <dd className="break-words">
                        〒{lib.post} {lib.address}
                      </dd>
                    </div>
                    {lib.tel && (
                      <div className="flex gap-2">
                        <dt className="w-12 shrink-0 text-xs text-slate-400">電話</dt>
                        <dd>
                          <a
                            href={`tel:${lib.tel.replace(/[^0-9+]/g, "")}`}
                            className="text-emerald-700 hover:underline"
                          >
                            {lib.tel}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs">
                    {lib.url_pc && (
                      <a
                        href={lib.url_pc}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                      >
                        公式サイト ↗
                      </a>
                    )}
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      地図で見る ↗
                    </a>
                    <a
                      href={`https://calil.jp/library/${lib.systemid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      カーリルで見る ↗
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>
            データ提供:{" "}
            <a
              href="https://calil.jp/doc/api_ref.html"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              カーリル 図書館 API
            </a>
            （
            <a
              href="https://calil.jp/doc/api_ref.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              https://calil.jp/doc/api_ref.html
            </a>
            ）
          </p>
          <p className="mt-1">
            利用には{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">
              CALIL_APP_KEY
            </code>{" "}
            の設定が必要です。
          </p>
        </footer>
      </section>
    </div>
  );
}
