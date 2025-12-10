'use client'

import './page.css'
import Items_Selector from '@/components/items_selector_component/items_selector';
import Playlist from '@/components/playlist_component/playlist';
import { useState, useEffect } from "react"

export default function PlaylistPage() {

    const [ accessToken, setAccessToken ] = useState(null);
    const [ refreshToken, setRefreshToken ] = useState(null);
    const [ selectedTracks, setSelectedTracks ] = useState([]);
    const [ selectedArtists, setSelectedArtists ] = useState([]);
    const [ selectedAlbums, setSelectedAlbums ] = useState([]);
    const [ selectedShows, setSelectedShows ] = useState([]);
    const [ playlist, setPlaylist ] = useState([]);
    const [ launchPlaylist, setLaunchPlaylist ] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const access = params.get("access_token");
        const refresh = params.get("refresh_token");

        setAccessToken(access);
        setRefreshToken(refresh);

        localStorage.setItem('access_token', JSON.stringify(access));
        localStorage.setItem('refresh_token', JSON.stringify(refresh));

        // Clean url
        window.history.replaceState({}, document.title, "/dashboard");
    }, []);

    return (
        <>
            {accessToken && 
                <div id='dashboard_container'>
                    <div id='widgets_container'>
                        <fieldset>
                            <legend>&ensp;Tracks&ensp;</legend>
                            <Items_Selector type="track"
                                        accessToken={accessToken} 
                                        setAccessToken={setAccessToken}
                                        refreshToken={refreshToken} 
                                        selectedItems={selectedTracks}
                                        setSelectedItems={setSelectedTracks}/>
                        </fieldset>
                        <fieldset>
                            <legend>&ensp;Artists&ensp;</legend>
                            <Items_Selector type="artist"
                                        accessToken={accessToken} 
                                        setAccessToken={setAccessToken}
                                        refreshToken={refreshToken} 
                                        selectedItems={selectedArtists}
                                        setSelectedItems={setSelectedArtists}/>
                        </fieldset>
                        <fieldset>
                            <legend>&ensp;Albums&ensp;</legend>
                            <Items_Selector type="album"
                                        accessToken={accessToken} 
                                        setAccessToken={setAccessToken}
                                        refreshToken={refreshToken} 
                                        selectedItems={selectedAlbums}
                                        setSelectedItems={setSelectedAlbums}/>
                        </fieldset>
                        <fieldset>
                            <legend>&ensp;Shows&ensp;</legend>
                            <Items_Selector type="show"
                                        accessToken={accessToken} 
                                        setAccessToken={setAccessToken}
                                        refreshToken={refreshToken} 
                                        selectedItems={selectedShows}
                                        setSelectedItems={setSelectedShows}/>
                        </fieldset>
                    </div>
                    <button onClick={() => {setLaunchPlaylist(true)}}>
                        <img src="/play-fill.svg" alt="launch_playlist" />
                    </button>
                    <fieldset>
                        <legend>&ensp;Playlist&ensp;</legend>
                        <Playlist accessToken={accessToken} 
                              setAccessToken={setAccessToken}
                              refreshToken={refreshToken} 
                              playlist={playlist}
                              setPlaylist={setPlaylist}
                              launchPlaylist={launchPlaylist}
                              setLaunchPlaylist={setLaunchPlaylist}
                              selectedTracks={selectedTracks}
                              selectedArtists={selectedArtists}
                              selectedAlbums={selectedAlbums}
                              selectedShows={selectedShows}/>
                    </fieldset>
                </div>
            }

        </>
    )
}