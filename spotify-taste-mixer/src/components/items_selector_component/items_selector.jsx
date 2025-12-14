/* Item_Selector 
    Component to display widgets such as:
        - tracks
        - artists
        - albums
        - shows
    The diplay depends on the given type if the widget
*/

import './items_selector.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Items_Selector(props) {

    const [ search, setSearch ] = useState("");
    const [ resultSearch, setResultSearch ] = useState([]);

    // Run the search to obtain the spotify items
    useEffect(() => {

        if(search == "") return 

        async function searchWithRefresh(query, type, accessToken, refreshToken) {
            let res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}&access_token=${accessToken}`);
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
                res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}&access_token=${newAccessToken}`);
            }
            return res.json();
        }
        
        async function runSearch () {
            const result = await searchWithRefresh(search, props.type, props.accessToken, props.refreshToken)
            // Get the right element from the result according to the type
            if (props.type == "track") setResultSearch(result.tracks.items);  
            if (props.type == "artist") setResultSearch(result.artists.items);
            if (props.type == "album") setResultSearch(result.albums.items);
            if (props.type == "show") setResultSearch(result.shows.items);
        }

        runSearch();

    }, [search]);

    // Function for the onChange of the search input
    function changeSearch(input) {
        setSearch(input.target.value);
    }

    
    // Function to add an item to the selected list
    function handleClickItem(newItem) {
        if (!props.selectedItems.some(t => t.id === newItem.id)) { // add only if not in the list
            // add item
            props.setSelectedItems(prev => [...prev, newItem]);
        } 
        setSearch("");
    }

    // Function to remove the item from the list
    function handleClickItemRemove(newItem) {
        props.setSelectedItems(prev => prev.filter(item => item.id !== newItem.id))
    }

    // Function to add an item to the favorites' list
    function handleClickFavorite(newItem) {
        if (!props.favorites.includes(newItem)) { // if not in the list, add item
            props.setFavorites(prev => [...prev, newItem]);
        } else { // if in the list, remove item
            props.setFavorites(prev => prev.filter(item => item !== newItem))
        }
    }

    return (
        <div id="items_select_container">
            <div id='search'>
                <button disabled>
                    {props.type == "track" && <img src="/music-note.svg" alt="tracks"/>}
                    {props.type == "artist" && <img src="/person-fill.svg" alt="artists"/>}
                    {props.type == "album" && <img src="/music-note-list.svg" alt="albums"/>}
                    {props.type == "show" && <img src="/mic-fill.svg" alt="shows"/>}
                </button>
                <input type="text" value={search} onChange={changeSearch} placeholder={"search for " + props.type + "s"}/>
                {search && resultSearch && <div id='search_results'>
                    {resultSearch.map((item) => {
                        return <Item key={item.id} 
                                      disable="false"
                                      onClick={() => {handleClickItem(item)}}
                                      item={item}
                                      type={props.type}/>
                    })}
                </div>}
            </div>
            <div id='selected_tracks'>
                {props.type == "track" && props.selectedItems && props.selectedItems.map((item) => {
                    return <Item key={item.id} 
                                  disable="true"
                                  onClickRemove={() => {handleClickItemRemove(item)}}
                                  item={item}
                                  type={props.type}
                                  favorite={true}
                                  isFavorite={props.favorites.includes(String(item.id))}
                                  onClickAddFavorite={() => {handleClickFavorite(String(item.id))}}/>
                })}
                {props.type != "track" && props.selectedItems && props.selectedItems.map((item) => {
                    return <Item key={item.id} 
                                  disable="true"
                                  onClickRemove={() => {handleClickItemRemove(item)}}
                                  item={item}
                                  type={props.type}/>
                })}
            </div>
        </div>
    )
}