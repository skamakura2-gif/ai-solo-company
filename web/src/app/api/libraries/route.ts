import { NextResponse } from "next/server";

import {
  CalilConfigError,
  CalilFetchError,
  findNearbyLibraries,
} from "@/lib/calil";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const longitude = Number(searchParams.get("longitude"));
  const latitude = Number(searchParams.get("latitude"));
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw ? Math.min(Math.max(Number(limitRaw), 1), 50) : 10;

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return NextResponse.json(
      { error: "longitude and latitude query params are required" },
      { status: 400 },
    );
  }

  try {
    const libraries = await findNearbyLibraries({ longitude, latitude, limit });
    return NextResponse.json({ libraries });
  } catch (err) {
    if (err instanceof CalilConfigError) {
      return NextResponse.json(
        {
          error:
            "サーバーに CALIL_APP_KEY が設定されていません。web/.env.local を確認してください。",
        },
        { status: 500 },
      );
    }
    if (err instanceof CalilFetchError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status ?? 502 },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch libraries" },
      { status: 500 },
    );
  }
}
