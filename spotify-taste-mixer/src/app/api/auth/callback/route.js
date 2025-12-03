import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:3000/api/auth/callback";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json(data, { status: 400 });
  }

  // Redirection vers le frontend avec tokens en query params
  const redirectUrl = new URL("http://127.0.0.1:3000/playlist");
  redirectUrl.searchParams.set("access_token", data.access_token);
  redirectUrl.searchParams.set("refresh_token", data.refresh_token);

  return NextResponse.redirect(redirectUrl.toString());
}