/* API fill_playlist
   This route fill the playlist with the given ID with the given tracks
   The tracks are given in an array of string, yet we have to parse it because it can't be an array of string directly in the url
 */

import { NextResponse } from "next/server";

export async function GET(req) {
    const url = new URL(req.url);

    // Get the url params
    const playlist_id = url.searchParams.get("playlist_id");
    const uris = JSON.parse(url.searchParams.get("uris") || "[]"); // Get the uris of the tracks in the right format
    const accessToken = url.searchParams.get("access_token");

    if (!accessToken) {
        return NextResponse.json({ error: "Missing access_token" }, { status: 401 });
    }

    // Fill the playlist
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uris: uris
        })
    });
    const data = await response.json();

    // Return the answer containing the result status of the request
    return NextResponse.json(data, { status: response.status });
}