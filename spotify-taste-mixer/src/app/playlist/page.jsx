'use client'

import './page.css'
import Items_Selector from '@/components/items_selector_component/items_selector';
import { useState, useEffect } from "react"

export default function PlaylistPage() {

    const [ accessToken, setAccessToken ] = useState(null);
    const [ refreshToken, setRefreshToken ] = useState(null);
    const [ selectedTracks, setSelectedTracks ] = useState([]);
    const [ selectedArtists, setSelectedArtists ] = useState([]);

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
            {accessToken && 
                <>
                    <fieldset>
                        <legend>&ensp;Tracks&ensp;</legend>
                        <Items_Selector type="track"
                                    accessToken={accessToken} 
                                    refreshToken={refreshToken} 
                                    selectedItems={selectedTracks}
                                    setSelectedItems={setSelectedTracks}/>
                    </fieldset>
                    <fieldset>
                        <legend>&ensp;Artists&ensp;</legend>
                        <Items_Selector type="artist"
                                    accessToken={accessToken} 
                                    refreshToken={refreshToken} 
                                    selectedItems={selectedArtists}
                                    setSelectedItems={setSelectedArtists}/>
                    </fieldset>
                </>
            }
        </>
    )
}