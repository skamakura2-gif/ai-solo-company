import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CALIL_ENDPOINT = "https://api.calil.jp/library";

type CalilLibrary = {
  systemid: string;
  systemname: string;
  libkey: string;
  libid: string | number;
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
  image: string | null;
  distance?: number;
};

export type LibraryHit = {
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

function toHit(raw: CalilLibrary): LibraryHit {
  let lat: number | null = null;
  let lng: number | null = null;
  if (typeof raw.geocode === "string" && raw.geocode.includes(",")) {
    const [lngStr, latStr] = raw.geocode.split(",");
    const lngNum = Number(lngStr);
    const latNum = Number(latStr);
    if (Number.isFinite(lngNum) && Number.isFinite(latNum)) {
      lng = lngNum;
      lat = latNum;
    }
  }
  return {
    systemid: raw.systemid,
    systemname: raw.systemname,
    formal: raw.formal,
    short: raw.short,
    address: raw.address,
    pref: raw.pref,
    city: raw.city,
    post: raw.post,
    tel: raw.tel,
    url_pc: raw.url_pc,
    category: raw.category,
    lat,
    lng,
    distanceKm:
      typeof raw.distance === "number" && Number.isFinite(raw.distance)
        ? raw.distance
        : null,
  };
}

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export async function GET(request: Request) {
  const appkey = process.env.CALIL_APP_KEY;
  if (!appkey) {
    return NextResponse.json(
      {
        error:
          "CALIL_APP_KEY が設定されていません。.env.local に CALIL_APP_KEY を設定してください。",
      },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const pref = searchParams.get("pref");
  const city = searchParams.get("city");
  const limitParam = searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 20, 1), 50);

  const params = new URLSearchParams();
  params.set("appkey", appkey);
  params.set("format", "json");
  params.set("callback", "no");
  params.set("limit", String(limit));

  let userLat: number | null = null;
  let userLng: number | null = null;

  if (lat && lng) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (
      !Number.isFinite(latNum) ||
      !Number.isFinite(lngNum) ||
      latNum < -90 ||
      latNum > 90 ||
      lngNum < -180 ||
      lngNum > 180
    ) {
      return NextResponse.json(
        { error: "緯度経度の値が不正です。" },
        { status: 400 },
      );
    }
    userLat = latNum;
    userLng = lngNum;
    params.set("geocode", `${lngNum},${latNum}`);
  } else if (city) {
    params.set("city", city);
  } else if (pref) {
    params.set("pref", pref);
  } else {
    return NextResponse.json(
      {
        error:
          "lat/lng または pref / city のいずれかを指定してください。",
      },
      { status: 400 },
    );
  }

  const url = `${CALIL_ENDPOINT}?${params.toString()}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "カーリル API への接続に失敗しました。",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: `カーリル API がエラーを返しました（HTTP ${upstream.status}）`,
      },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "カーリル API のレスポンスが解釈できませんでした。" },
      { status: 502 },
    );
  }

  if (!Array.isArray(raw)) {
    return NextResponse.json(
      { error: "予期しないレスポンス形式です。" },
      { status: 502 },
    );
  }

  let hits = (raw as CalilLibrary[]).map(toHit);

  if (userLat !== null && userLng !== null) {
    hits = hits.map((h) => {
      if (h.distanceKm !== null) return h;
      if (h.lat === null || h.lng === null) return h;
      return {
        ...h,
        distanceKm: haversineKm(userLat!, userLng!, h.lat, h.lng),
      };
    });
    hits.sort((a, b) => {
      const da = a.distanceKm ?? Number.POSITIVE_INFINITY;
      const db = b.distanceKm ?? Number.POSITIVE_INFINITY;
      return da - db;
    });
  }

  return NextResponse.json({
    count: hits.length,
    query: {
      lat: userLat,
      lng: userLng,
      pref: pref || null,
      city: city || null,
    },
    libraries: hits,
  });
}
