/* Playlist
    Component to create the playlist according to the widgets' selection
*/

import './playlist.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Playlist(props) {

    const [ addChristmasTouch, setAddChristmasTouch ] = useState(false);

    // Function to get two random tracks from an array of tracks
    function getRandomTracks(arr) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }

    useEffect(() => {
        if(!props.launchPlaylist) return 

        // Function to get the items with refresh if needed
        async function getWithRefresh(type, id, accessToken, refreshToken) {
            let res = await fetch(`/api/get?type=${type}&id=${id}&access_token=${accessToken}`);
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
                props.setAccessToken(newAccessToken)
                // Rerun search with new token
                res = await fetch(`/api/get?type=${type}&id=${id}&access_token=${newAccessToken}`);
            }
            return res.json();
        }
        
        // Function to create the playlist according to the widgets' selection
        async function runCreatePlaylist () {
           // Create new playlist based on the previous one
           let newPlaylist = [...props.playlist];
           // Adding selected tracks
           if (props.selectedTracks && props.selectedTracks.length > 0) {
                props.selectedTracks.forEach(track => { // only add if not in the playlist
                    if (!newPlaylist.some(t => t.id === track.id)) newPlaylist.push(track)
                });
           }
           // Adding selected favorites tracks
           if (props.selectedFavoritesTracks && props.selectedFavoritesTracks.length > 0) {
                props.selectedFavoritesTracks.forEach(track => { // only add if not in the playlist
                    if (!newPlaylist.some(t => t.id === track.id)) newPlaylist.push(track)
                });
           }
           // Adding tracks from selected artists
           if (props.selectedArtists && props.selectedArtists.length > 0) {
                for (const artist of props.selectedArtists) {
                    // Get the top songs of the artist
                    const result = await getWithRefresh("artist", artist.id, props.accessToken, props.refreshToken);
                    // Add two random songs from the selection
                    const randomTracks = getRandomTracks(result.tracks);
                    if (!newPlaylist.some(t => t.id === randomTracks[0].id)) newPlaylist.push(randomTracks[0])
                    if (!newPlaylist.some(t => t.id === randomTracks[1].id)) newPlaylist.push(randomTracks[1])
                }
           }
           // Adding tracks from selected albums
           if (props.selectedAlbums && props.selectedAlbums.length > 0) {
                for (const album of props.selectedAlbums) {
                    // Get the tracks of the album
                    const result = await getWithRefresh("album", album.id, props.accessToken, props.refreshToken);
                    // Get two random tracks from the album
                    const randomTracks = getRandomTracks(result.items);
                    // Get the tracks with another call to have them in the right format
                    const firstTrack = await getWithRefresh("track", randomTracks[0].id, props.accessToken, props.refreshToken)
                    const secondTrack = await getWithRefresh("track", randomTracks[1].id, props.accessToken, props.refreshToken)
                    if (!newPlaylist.some(t => t.id === firstTrack.id)) newPlaylist.push(firstTrack)
                    if (!newPlaylist.some(t => t.id === secondTrack.id)) newPlaylist.push(secondTrack)
                }
           }
           // Adding episodes from selected shows
           if (props.selectedShows && props.selectedShows.length > 0) {
                for (const show of props.selectedShows) {
                    // Get the episodes of the show
                    const result = await getWithRefresh("show", show.id, props.accessToken, props.refreshToken);
                    // Get two random episode from the show
                    const randomEpisodes = getRandomTracks(result.items);
                    // Add the episodes
                    if (!newPlaylist.some(t => t.id === randomEpisodes[0].id)) newPlaylist.push(randomEpisodes[0])
                    if (!newPlaylist.some(t => t.id === randomEpisodes[1].id)) newPlaylist.push(randomEpisodes[1])
                }
           }
           // Set the new playlist in the variable
           props.setPlaylist(newPlaylist);
        }

        // Create playlist
        runCreatePlaylist();
        props.setLaunchPlaylist(false);

    }, [props.launchPlaylist]);

    // Christmas touch
    useEffect(() => {
        if(!addChristmasTouch) return

        async function getWithRefresh(type, id, accessToken, refreshToken) {
            let res = await fetch(`/api/get?type=${type}&id=${id}&access_token=${accessToken}`);
            if (res.status === 401) { // expired token
                const refreshRes = await fetch("/api/refresh", {
                    method: "POST",
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
                const refreshData = await refreshRes.json();
                const newAccessToken = refreshData.access_token;
                // Update Local Storage + useState
                localStorage.setItem("access_token", JSON.stringify(newAccessToken));
                props.setAccessToken(newAccessToken)
                // Rerun search with new token
                res = await fetch(`/api/get?type=${type}&id=${id}&access_token=${newAccessToken}`);
            }
            return res.json();
        }

        async function addChristmasTracks() {
            let christmasTracks = [];
            // Get the tracks of the christmas playlist
            const result = await getWithRefresh("playlist", "6w3jITQU1CPB2kPiT9mfxb", props.accessToken, props.refreshToken);
            // Get two random tracks from the playlist
            const randomTracks = getRandomTracks(result.items);
            // Get the tracks with another call to have them in the right format
            const firstTrack = await getWithRefresh("track", randomTracks[0].track.id, props.accessToken, props.refreshToken)
            const secondTrack = await getWithRefresh("track", randomTracks[1].track.id, props.accessToken, props.refreshToken)
            if (!props.playlist.some(t => t.id === firstTrack.id)) christmasTracks.push(firstTrack)
            if (!props.playlist.some(t => t.id === secondTrack.id)) christmasTracks.push(secondTrack)
            // Add the tracks to the playlist
            props.setPlaylist(prev => [...christmasTracks, ...prev]);
        }

        addChristmasTracks();
        setAddChristmasTouch(false);

    }, [addChristmasTouch])

    // Function to remove the track from the playlist
    function handleClickTrack(newItem) {
        if (props.playlist.includes(newItem)) { // if in the playlist, remove track
            props.setPlaylist(prev => prev.filter(item => item !== newItem))
        }
    }

    // Function to add / remove the track to the favorites
    function handleClickFavorite(newItem) {
        if (!props.favorites.includes(newItem)) { // if not in favorites' list, add track
            props.setFavorites(prev => [...prev, newItem]);
        } else { // if in favorites' list, remove track
            props.setFavorites(prev => prev.filter(item => item !== newItem))
        }
    }

    return (
        <div id="items_select_container">
            <button id='christmas_button' onClick={() => {setAddChristmasTouch(true)}} title='Christmas Touch !'>
                <img src="/snow2.svg" alt="christmas_touch"/>
                Christmas Touch !
                <img src="/snow2.svg" alt="christmas_touch"/>
            </button>
            <div id='playlist_tracks'>
                {props.playlist && props.playlist.map((item) => {
                    return <Item key={item.uri} 
                                    disable="true"
                                    onClickRemove={() => {handleClickTrack(item)}}
                                    item={item}
                                    type="track"
                                    favorite={true}
                                    isFavorite={props.favorites.includes(String(item.id))}
                                    onClickAddFavorite={() => {handleClickFavorite(String(item.id))}}/>
                })}
            </div>
        </div>
    )
}