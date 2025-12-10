import './playlist.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Playlist(props) {

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
        
        async function runSearch () {
           console.log("start")
        }

        runSearch();
        props.setLaunchPlaylist(false);

    }, [props.launchPlaylist]);

    return (
        <div id="items_select_container">
            
        </div>
    )
}