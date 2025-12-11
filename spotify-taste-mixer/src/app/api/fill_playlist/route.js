import { NextResponse } from "next/server";

export async function GET(req) {
    const url = new URL(req.url);

    const playlist_id = url.searchParams.get("playlist_id");
    const uris = JSON.parse(url.searchParams.get("uris") || "[]");
    const accessToken = url.searchParams.get("access_token");

    if (!accessToken) {
        return NextResponse.json({ error: "Missing access_token" }, { status: 401 });
    }

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

    return NextResponse.json(data, { status: response.status });
}