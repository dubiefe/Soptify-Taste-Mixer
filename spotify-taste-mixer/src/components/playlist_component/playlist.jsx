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
           // Adding selected tracks
           if (props.selectedTracks) props.setPlaylist(prev => [...prev, ...props.selectedTracks])
           // Adding tracks from selected artists
           if (props.selectedArtists && props.selectedArtists.length > 0) {
                props.selectedArtists.forEach(async artist => {
                    // Get the top songs of the artist
                    const result = await getWithRefresh("artist", artist.id, props.accessToken, props.refreshToken);
                    // Add two random songs from the selection
                    const num1 = Math.floor(Math.random() * result.tracks.length);
                    let num2 = num1;
                    while (num2 === num1) {
                        num2 = Math.floor(Math.random() * result.tracks.length);
                    }
                    props.setPlaylist(prev => [...prev, result.tracks[num1], result.tracks[num2]])
                });
           }
           // Adding tracks from selected albums
           if (props.selectedAlbums && props.selectedAlbums.length > 0) {
                props.selectedAlbums.forEach(async album => {
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
                    props.setPlaylist(prev => [...prev, firstTrack, secondTrack])
                });
           }
           // Adding episodes from selected shows
           if (props.selectedShows && props.selectedShows.length > 0) {
                props.selectedShows.forEach(async show => {
                    // Get the tracks of the album
                    const result = await getWithRefresh("show", show.id, props.accessToken, props.refreshToken);
                    // Get two random tracks from the album
                    const num1 = Math.floor(Math.random() * result.items.length);
                    let num2 = num1;
                    while (num2 === num1) {
                        num2 = Math.floor(Math.random() * result.items.length);
                    }
                    // Add the episodes
                    props.setPlaylist(prev => [...prev, result.items[num1], result.items[num2]])
                });
           }
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

    return (
        <div id="items_select_container">
            <div id='playlist_tracks'>
                {props.playlist && props.playlist.map((item) => {
                    return <Item key={item.id} 
                                    disable="true"
                                    onClickRemove={() => {handleClickTrack(item)}}
                                    item={item}
                                    type="track"/>
                })}
            </div>
        </div>
    )
}