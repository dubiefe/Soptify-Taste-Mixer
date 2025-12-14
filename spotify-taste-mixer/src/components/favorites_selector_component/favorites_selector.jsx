/* Favorite_Selector
    Component for the widget to select faovrite tracks for the playlist
    To select them, we need to get them as object because they are stored with their ID in the favorite list
    For the rest, the functionment is similar to the Item_Selector
*/

import './../items_selector_component/items_selector.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Favorites_Selector(props) {

    const [ search, setSearch ] = useState("");
    const [ favoritesTracksObjects, setFavoritesTracksObjects ] = useState("");

    // Get the favorites as track objects, because they are stored as string with their IDs
    useEffect(() => {
        if(!props.favorites) return 

        // Get the track with the given ID
        async function getWithRefresh(type, id, accessToken, refreshToken) {
            // Try to get the track
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

        async function getFavoritesAsObjects() {
            let newFavoritesObjects = [];
            // Launch the get track for each favorite
            for (const fav of props.favorites) {
                const trackObjects = await getWithRefresh("track", fav, props.accessToken, props.refreshToken)
                newFavoritesObjects.push(trackObjects);
            }
            setFavoritesTracksObjects(newFavoritesObjects);
        }

        getFavoritesAsObjects();

    }, [props.favorites]);

    // Function for the onChnage of the search input
    function changeSearch(input) {
        setSearch(input.target.value);
    }

    // Function to add a track to the selected list
    function handleClickTrack(newItem) {
        if (!props.selectedItems.some(t => t.id === newItem.id)) { // add only if not in the list
            // add track
            props.setSelectedItems(prev => [...prev, newItem]);
        } 
        setSearch("");
    }

    // Function to remove the track from the list
    function handleClickTrackRemove(newItem) {
        props.setSelectedItems(prev => prev.filter(item => item.id !== newItem.id))
    }

    // Function to add a track to the favorites' list
    function handleClickFavorite(newItem) {
        if (!props.favorites.includes(newItem)) { // if not in the list, add track
            props.setFavorites(prev => [...prev, newItem]);
        } else { // if in the list, remove track
            props.setFavorites(prev => prev.filter(item => item !== newItem))
        }
    }

    return (
        <div id="items_select_container">
            <div id='search'>
                <button disabled>
                    <img src="/heart-fill.svg" alt="favorites_tracks"/>
                </button>
                <input type="text" value={search} onChange={changeSearch} placeholder="search for your favorites tracks"/>
                {search && favoritesTracksObjects && <div id='search_results'>
                    {favoritesTracksObjects.filter(fav => fav.name.toLowerCase().includes(search.toLowerCase())).map((item) => {
                        return <Item key={item.id} 
                                      disable="false"
                                      onClick={() => {handleClickTrack(item)}}
                                      item={item}
                                      type="track"/>
                    })}
                </div>}
            </div>
            <div id='selected_tracks'>
                {props.selectedItems && props.selectedItems.map((item) => {
                    return <Item key={item.id} 
                                  disable="true"
                                  onClickRemove={() => {handleClickTrackRemove(item)}}
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