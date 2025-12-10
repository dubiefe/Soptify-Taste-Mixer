import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);

  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  const accessToken = url.searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access_token" }, { status: 401 });
  }

  const response = await fetch(
    `https://api.spotify.com/v1/${type}s/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}