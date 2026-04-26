import "server-only";

export type CalilCategory =
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "UNIV"
  | "SPECIAL"
  | "BM";

export type CalilLibrary = {
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
  category: CalilCategory | string;
  image: string;
  distance?: number;
};

const CALIL_ENDPOINT = "https://api.calil.jp/library";

export class CalilConfigError extends Error {
  constructor() {
    super("CALIL_APP_KEY is not set in environment variables.");
    this.name = "CalilConfigError";
  }
}

export class CalilFetchError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "CalilFetchError";
  }
}

export type FindNearbyParams = {
  longitude: number;
  latitude: number;
  limit?: number;
};

export async function findNearbyLibraries({
  longitude,
  latitude,
  limit = 10,
}: FindNearbyParams): Promise<CalilLibrary[]> {
  const appkey = process.env.CALIL_APP_KEY;
  if (!appkey) throw new CalilConfigError();

  const url = new URL(CALIL_ENDPOINT);
  url.searchParams.set("appkey", appkey);
  url.searchParams.set("geocode", `${longitude},${latitude}`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("format", "json");
  url.searchParams.set("callback", "");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new CalilFetchError(
      `Calil API responded with ${res.status}`,
      res.status,
    );
  }

  const text = await res.text();
  const json = parseCalilResponse(text);

  if (!Array.isArray(json)) {
    throw new CalilFetchError("Unexpected response shape from Calil API");
  }

  return json as CalilLibrary[];
}

function parseCalilResponse(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return [];
  try {
    return JSON.parse(trimmed);
  } catch {
    const stripped = trimmed
      .replace(/^callback\s*\(/, "")
      .replace(/\)\s*;?\s*$/, "");
    return JSON.parse(stripped);
  }
}
