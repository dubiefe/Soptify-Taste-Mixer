/* Dashboard page
    Page with all the widgets to generate a playlist
*/

'use client'

import './page.css'
import Items_Selector from '@/components/items_selector_component/items_selector';
import Favorites_Selector from '@/components/favorites_selector_component/favorites_selector';
import Playlist from '@/components/playlist_component/playlist';
import Popup_Validation from '@/components/popup_validation_component/popup_validation';
import { useState, useEffect } from "react"

export default function PlaylistPage() {
    // Tokens
    const [ accessToken, setAccessToken ] = useState(null);
    const [ refreshToken, setRefreshToken ] = useState(null);
    // Widgets selection
    const [ selectedTracks, setSelectedTracks ] = useState([]);
    const [ selectedFavoritesTracks, setSelectedFavoritesTracks ] = useState([]);
    const [ selectedArtists, setSelectedArtists ] = useState([]);
    const [ selectedAlbums, setSelectedAlbums ] = useState([]);
    const [ selectedShows, setSelectedShows ] = useState([]);
    // Playlist
    const [ playlist, setPlaylist ] = useState([]);
    const [ launchPlaylist, setLaunchPlaylist ] = useState(false);
    const [ createPlaylistSpotify, setCreatePlaylistSpotify ] = useState(false);
    const [ openPopupValidation, setOpenPopupValidation ] = useState(false);
    // Favorites
    const [ favorites, setFavorites ] = useState([]);
    
    // Initialize favorites from the local storage
    useEffect(() => {
        if (typeof window === "undefined") return

        const stored = localStorage.getItem("favorites");
        if (stored) {
            setFavorites(JSON.parse(stored).map(String));
        }
    }, []);

    // Update favorites in Local Storage
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Deal with the data send by the login process
    useEffect(() => {
        // get the tokens in the URL params
        const params = new URLSearchParams(window.location.search);
        const access = params.get("access_token");
        const refresh = params.get("refresh_token");
        // Store the tokens in the variables and the local storage
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

        // API calls to create / fill the playlist
        async function createPlaylistWithRefresh(type, playlist_id = "", uris = []) {
            // Build the query according to the action
            let url;
            if (type === "create") {
                url = `/api/create_playlist?access_token=${accessToken}`;
            } else {
                url = `/api/fill_playlist?playlist_id=${playlist_id}&uris=${encodeURIComponent(JSON.stringify(uris))}&access_token=${accessToken}`;
            }
            // Try the launch the fetch
            let res = await fetch(url);
            if (res.status === 401) { // expired token
                // Fetch the new access token
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
                res = await fetch(url);
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
            const playlistData = await createPlaylistWithRefresh("create");
            // Fill the playlist
            const result = await createPlaylistWithRefresh("fill", playlistData.id, uris);
            console.log("Playlist created");
        }

        addTracksToPlaylist();
        // Stop the creation
        setCreatePlaylistSpotify(false);
        // Open the validation popup to inform the user
        setOpenPopupValidation(true);

    }, [createPlaylistSpotify]);

    return (
        <>
            {accessToken && 
                <div id='dashboard_container'>
                    <div id='widgets_container'>
                        <div id='first_line'>
                            <fieldset>
                                <legend>&ensp;Tracks ({selectedTracks.length})&ensp;</legend>
                                <Items_Selector type="track"
                                            accessToken={accessToken} 
                                            setAccessToken={setAccessToken}
                                            refreshToken={refreshToken} 
                                            selectedItems={selectedTracks}
                                            setSelectedItems={setSelectedTracks}
                                            favorites={favorites}
                                            setFavorites={setFavorites}/>
                            </fieldset>
                            <fieldset>
                                <legend>&ensp;Favorites Tracks ({selectedFavoritesTracks.length})&ensp;</legend>
                                <Favorites_Selector
                                            accessToken={accessToken} 
                                            setAccessToken={setAccessToken}
                                            refreshToken={refreshToken} 
                                            selectedItems={selectedFavoritesTracks}
                                            setSelectedItems={setSelectedFavoritesTracks}
                                            favorites={favorites}
                                            setFavorites={setFavorites}/>
                            </fieldset>
                            <fieldset>
                                <legend>&ensp;Artists ({selectedArtists.length})&ensp;</legend>
                                <Items_Selector type="artist"
                                            accessToken={accessToken} 
                                            setAccessToken={setAccessToken}
                                            refreshToken={refreshToken} 
                                            selectedItems={selectedArtists}
                                            setSelectedItems={setSelectedArtists}/>
                            </fieldset>
                        </div>
                        <div id='second_line'>
                            <fieldset>
                                <legend>&ensp;Albums ({selectedAlbums.length})&ensp;</legend>
                                <Items_Selector type="album"
                                            accessToken={accessToken} 
                                            setAccessToken={setAccessToken}
                                            refreshToken={refreshToken} 
                                            selectedItems={selectedAlbums}
                                            setSelectedItems={setSelectedAlbums}/>
                            </fieldset>
                            <fieldset>
                                <legend>&ensp;Shows ({selectedShows.length})&ensp;</legend>
                                <Items_Selector type="show"
                                            accessToken={accessToken} 
                                            setAccessToken={setAccessToken}
                                            refreshToken={refreshToken} 
                                            selectedItems={selectedShows}
                                            setSelectedItems={setSelectedShows}/>
                            </fieldset>
                        </div>
                    </div>
                    <button onClick={() => {setLaunchPlaylist(true)}} title='Generate playlist'>
                        <img src="/play-fill.svg" alt="launch_playlist" />
                    </button>
                    <fieldset>
                        <legend>&ensp;Playlist ({playlist.length})&ensp;</legend>
                        <Playlist accessToken={accessToken} 
                              setAccessToken={setAccessToken}
                              refreshToken={refreshToken} 
                              playlist={playlist}
                              setPlaylist={setPlaylist}
                              launchPlaylist={launchPlaylist}
                              setLaunchPlaylist={setLaunchPlaylist}
                              selectedTracks={selectedTracks}
                              selectedFavoritesTracks={selectedFavoritesTracks}
                              selectedArtists={selectedArtists}
                              selectedAlbums={selectedAlbums}
                              selectedShows={selectedShows}
                              favorites={favorites}
                              setFavorites={setFavorites}/>
                        <div id='options_playlist'>
                            <button onClick={() => {setPlaylist([])}}>
                                <img src="/refresh.svg" alt="refresh" title='Refresh playlist'/>
                            </button>
                            <button onClick={() => {setCreatePlaylistSpotify(true)}}>
                                <img src="/download.svg" alt="download" title='Download playlist'/>
                            </button>
                        </div>
                    </fieldset>
                </div>
            }
            {openPopupValidation && 
                <Popup_Validation onClick={() => {setOpenPopupValidation(false)}}/>
            }
        </>
    )
}