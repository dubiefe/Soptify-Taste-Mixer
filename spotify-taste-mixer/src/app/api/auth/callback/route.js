/* API callback
   This route fetch the tokens (access and refresh) thanks to the code obtained in the route login
 */

import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

export async function GET(req) {
  // Get the params in the url
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

  // Redirect to the dashboard page with the tokens in the params
  redirect("/dashboard?access_token=" + data.access_token + "&refresh_token=" + data.refresh_token);
}