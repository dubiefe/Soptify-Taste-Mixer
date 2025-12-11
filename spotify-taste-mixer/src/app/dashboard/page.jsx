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
    const [ createPlaylistSpotify, setCreatePlaylistSpotify ] = useState(false)
    
    // Initialize favorites
    const [favorites, setFavorites] = useState(() => {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored).map(String) : [];
    });

    // Update favorites in Local Storage
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

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

    // Create playslit in Spotify
    useEffect(() => {
        if(!createPlaylistSpotify) return

        async function createPlaylistWithRefresh() {
            let res = await fetch(`/api/create_playlist?access_token=${accessToken}`);
            if (res.status === 401) { // expired token
                const refreshRes = await fetch("/api/refresh", {
                    method: "POST",
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
                const refreshData = await refreshRes.json();
                const newAccessToken = refreshData.access_token;
                // Update Local Storage + useState
                localStorage.setItem("access_token", JSON.stringify(newAccessToken));
                setAccessToken(newAccessToken)
                // Rerun search with new token
                res = await fetch(`/api/create_playlist?access_token=${newAccessToken}`);
            }
            return res.json();
        }

        async function fillPlaylistWithRefresh(playlist_id, uris) {
            let res = await fetch(`/api/fill_playlist?playlist_id=${playlist_id}&uris=${encodeURIComponent(JSON.stringify(uris))}&access_token=${accessToken}`);
            if (res.status === 401) { // expired token
                const refreshRes = await fetch("/api/refresh", {
                    method: "POST",
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
                const refreshData = await refreshRes.json();
                const newAccessToken = refreshData.access_token;
                // Update Local Storage + useState
                localStorage.setItem("access_token", JSON.stringify(newAccessToken));
                setAccessToken(newAccessToken)
                // Rerun search with new token
                res = await fetch(`/api/fill_playlist?playlist_id=${playlist_id}&uris=${encodeURIComponent(JSON.stringify(uris))}&access_token=${newAccessToken}`);
            }
            return res.json();
        }

        async function addTracksToPlaylist() {
            // Create array with all uris
            let uris = [];
            for (const track of playlist) {
                uris.push(track.uri)
            }
            // Create the playlist and get the id
            const playlistData = await createPlaylistWithRefresh();
            // Fill the playlist
            const result = await fillPlaylistWithRefresh(playlistData.id, uris);
            console.log("Playlist created");
        }

        addTracksToPlaylist();
        setCreatePlaylistSpotify(false);

    }, [createPlaylistSpotify]);

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
                    <button onClick={() => {setLaunchPlaylist(true)}} title='Generate playlist'>
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
                              selectedShows={selectedShows}
                              favorites={favorites}
                              setFavorites={setFavorites}/>
                        <div id='options_playlist'>
                            <button onClick={() => {setPlaylist([])}}>
                                <img src="/arrow-clockwise.svg" alt="refresh" title='Refresh playlist'/>
                            </button>
                            <button onClick={() => {setCreatePlaylistSpotify(true)}}>
                                <img src="/download.svg" alt="download" title='Download playlist'/>
                            </button>
                        </div>
                    </fieldset>
                </div>
            }

        </>
    )
}