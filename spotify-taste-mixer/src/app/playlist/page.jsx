'use client'

import { useState, useEffect } from "react"

export default function PlaylistPage() {

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const access = params.get("access_token");
        const refresh = params.get("refresh_token");

        setAccessToken(access);
        setRefreshToken(refresh);

        localStorage.setItem('access_token', JSON.stringify(access));
        localStorage.setItem('refresh_token', JSON.stringify(refresh));

        // Clean url
        window.history.replaceState({}, document.title, "/playlist");
    }, []);

    return (
        <>
            <h2>Hello Playlists!</h2>
        </>
    )
}