import './../items_selector_component/items_selector.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Favorites_Selector(props) {

    const [ search, setSearch ] = useState("");
    const [ favoritesTracksObjects, setFavoritesTracksObjects ] = useState("");

    useEffect(() => {
        if(!props.favorites) return 

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

        async function getFavoritesAsObjects() {
            let newFavoritesObjects = [];
            for (const fav of props.favorites) {
                const trackObjects = await getWithRefresh("track", fav, props.accessToken, props.refreshToken)
                newFavoritesObjects.push(trackObjects);
            }

            setFavoritesTracksObjects(newFavoritesObjects);
        }

        getFavoritesAsObjects();

    }, [props.favorites]);

    function changeSearch(input) {
        setSearch(input.target.value);
    }

    function handleClickTrack(newItem) {
        if (!props.selectedItems.some(t => t.id === newItem.id)) {
            // add track
            props.setSelectedItems(prev => [...prev, newItem]);
        } 
        setSearch("");
    }

    function handleClickTrackRemove(newItem) {
        props.setSelectedItems(prev => prev.filter(item => item.id !== newItem.id))
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