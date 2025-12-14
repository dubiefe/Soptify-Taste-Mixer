/* API search
   This route search items according to a query with the search filter and the type of the item
 */

import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);

  // Get the url params
  const q = url.searchParams.get("q");
  const type = url.searchParams.get("type") || "track";
  const accessToken = url.searchParams.get("access_token");

  if (!q) {
    return NextResponse.json({ error: "Missing 'q' parameter" }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access_token" }, { status: 401 });
  }

  // Get the items
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

  // Return the result of the search
  return NextResponse.json(data, { status: response.status });
}