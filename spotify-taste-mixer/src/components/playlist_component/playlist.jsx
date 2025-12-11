import './playlist.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Playlist(props) {

    console.log(props.playlist)

    useEffect(() => {
        if(!props.launchPlaylist) return 

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
        
        async function runCreatePlaylist () {
           // Create new playlist
           let newPlaylist = [...props.playlist];
           // Adding selected tracks
           if (props.selectedTracks && props.selectedTracks.length > 0) {
                props.selectedTracks.forEach(track => {
                    if (!newPlaylist.some(t => t.id === track.id)) newPlaylist.push(track)
                });
           }
           // Adding tracks from selected artists
           if (props.selectedArtists && props.selectedArtists.length > 0) {
                for (const artist of props.selectedArtists) {
                    // Get the top songs of the artist
                    const result = await getWithRefresh("artist", artist.id, props.accessToken, props.refreshToken);
                    // Add two random songs from the selection
                    const num1 = Math.floor(Math.random() * result.tracks.length);
                    let num2 = num1;
                    while (num2 === num1) {
                        num2 = Math.floor(Math.random() * result.tracks.length);
                    }
                    if (!newPlaylist.some(t => t.id === result.tracks[num1].id)) newPlaylist.push(result.tracks[num1])
                    if (!newPlaylist.some(t => t.id === result.tracks[num2].id)) newPlaylist.push(result.tracks[num2])
                }
           }
           // Adding tracks from selected albums
           if (props.selectedAlbums && props.selectedAlbums.length > 0) {
                for (const album of props.selectedAlbums) {
                    // Get the tracks of the album
                    const result = await getWithRefresh("album", album.id, props.accessToken, props.refreshToken);
                    // Get two random tracks from the album
                    const num1 = Math.floor(Math.random() * result.items.length);
                    let num2 = num1;
                    while (num2 === num1) {
                        num2 = Math.floor(Math.random() * result.items.length);
                    }
                    // Get the tracks with another call to have them in the right format
                    const firstTrack = await getWithRefresh("track", result.items[num1].id, props.accessToken, props.refreshToken)
                    const secondTrack = await getWithRefresh("track", result.items[num2].id, props.accessToken, props.refreshToken)
                    if (!newPlaylist.some(t => t.id === firstTrack.id)) newPlaylist.push(firstTrack)
                    if (!newPlaylist.some(t => t.id === secondTrack.id)) newPlaylist.push(secondTrack)
                }
           }
           // Adding episodes from selected shows
           if (props.selectedShows && props.selectedShows.length > 0) {
                for (const show of props.selectedShows) {
                    // Get the tracks of the album
                    const result = await getWithRefresh("show", show.id, props.accessToken, props.refreshToken);
                    // Get two random tracks from the album
                    const num1 = Math.floor(Math.random() * result.items.length);
                    let num2 = num1;
                    while (num2 === num1) {
                        num2 = Math.floor(Math.random() * result.items.length);
                    }
                    // Add the episodes
                    if (!newPlaylist.some(t => t.id === result.items[num1].id)) newPlaylist.push(result.items[num1])
                    if (!newPlaylist.some(t => t.id === result.items[num2].id)) newPlaylist.push(result.items[num2])
                }
           }

           
           props.setPlaylist(newPlaylist);
        }

        // Create playlist
        runCreatePlaylist();
        props.setLaunchPlaylist(false);

    }, [props.launchPlaylist]);

    function handleClickTrack(newItem) {
        if (!props.playlist.includes(newItem)) {
            // add track
            props.setPlaylist(prev => [...prev, newItem]);
        } else {
            // remove track
            props.setPlaylist(prev => prev.filter(item => item !== newItem))
        }
    }

    function handleClickFavorite(newItem) {
        if (!props.favorites.includes(newItem)) {
            // add track
            props.setFavorites(prev => [...prev, newItem]);
        } else {
            // remove track
            props.setFavorites(prev => prev.filter(item => item !== newItem))
        }
    }

    return (
        <div id="items_select_container">
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