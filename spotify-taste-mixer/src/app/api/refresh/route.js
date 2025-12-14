/* API refresh
   This route fetch a new access token with the given refresh token
 */

import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function POST(req) {
  // Get the refresh token in the request
  const { refresh_token } = await req.json();

  // Build the header with the client_id and secret from the spotify app
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + authHeader,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token
    })
  });

  const data = await response.json();

  // Return the answer containing the new acess token
  return NextResponse.json(data);
}