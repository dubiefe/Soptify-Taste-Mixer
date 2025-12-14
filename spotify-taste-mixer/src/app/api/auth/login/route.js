/* API login
   This route generate the code linked to the user account with the needed scope
   For this app, we need to read, and update the playlists.
 */

import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

const SCOPES = [
  "user-read-private",
  "playlist-modify-public",
  "playlist-modify-private"
].join(" ");

export function GET() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES
  });

  // Redirect to the callback function
  return NextResponse.redirect(
    "https://accounts.spotify.com/authorize?" + params.toString()
  );
}