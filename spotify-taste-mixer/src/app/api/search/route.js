import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);

  const q = url.searchParams.get("q");
  const type = url.searchParams.get("type") || "track";
  const accessToken = url.searchParams.get("access_token");

  if (!q) {
    return NextResponse.json({ error: "Missing 'q' parameter" }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access_token" }, { status: 401 });
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?${new URLSearchParams({
      q,
      type
    })}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}