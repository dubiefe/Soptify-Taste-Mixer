/* API get
   This route fetch the item linked to the given ID
   It has different fetch function according to the type of the item
      - artist -> get the top tracks of the artist
      - album | playlist -> get the tracks inside the album/playlist
      - show -> get the episode of the show
      - track -> get the track details
 */

import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);

  // Get the url params
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  const accessToken = url.searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access_token" }, { status: 401 });
  }

  let response, data;

  // Get Artist -> get the top tracks
  if (type === "artist") {
    response = await fetch(
      `https://api.spotify.com/v1/${type}s/${id}/top-tracks?market=EN`,
      {headers: { Authorization: `Bearer ${accessToken}` }}
    );
  } 
  
  // Get Album | Playlist -> get the tracks
  else if(type === "album" || type === "playlist") {
    response = await fetch(
      `https://api.spotify.com/v1/${type}s/${id}/tracks`,
      {headers: { Authorization: `Bearer ${accessToken}` }}
    );
  } 
  
  // Get Show -> get the episodes
  else if (type === "show") {
    response = await fetch(
      `https://api.spotify.com/v1/${type}s/${id}/episodes`,
      {headers: { Authorization: `Bearer ${accessToken}` }}
    );
  } 
  
  // Get Track -> get the details of the track
  else {
    response = await fetch(
      `https://api.spotify.com/v1/${type}s/${id}`,
      {headers: { Authorization: `Bearer ${accessToken}` }}
    );
  }

  data = await response.json();
  return NextResponse.json(data, { status: response.status });
}