import './items_selector.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Items_Selector(props) {

    const [ search, setSearch ] = useState("");
    const [ resultSearch, setResultSearch ] = useState([]);

    useEffect(() => {
        async function searchWithRefresh(query, type, accessToken, refreshToken) {
            let res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}&access_token=${accessToken}`);
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
                res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}&access_token=${newAccessToken}`);
            }
            return res.json();
        }
        
        async function runSearch () {
            const result = await searchWithRefresh(search, props.type, props.accessToken, props.refreshToken)

            if (search != "" && props.type == "track") setResultSearch(result.tracks.items);  
            if (search != "" && props.type == "artist") setResultSearch(result.artists.items);
            if (search != "" && props.type == "album") setResultSearch(result.albums.items);
            if (search != "" && props.type == "show") setResultSearch(result.shows.items);
        }

        runSearch();

    }, [search]);

    function changeSearch(input) {
        setSearch(input.target.value);
    }

    function handleClickTrack(newItem) {
        if (!props.selectedItems.includes(newItem)) {
            // add track
            props.setSelectedItems(prev => [...prev, newItem]);
            setSearch("");
            setResultSearch([]);
        } else {
            // remove track
            props.setSelectedItems(prev => prev.filter(item => item !== newItem))
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
                                      onClick={() => {handleClickTrack(item)}}
                                      item={item}
                                      type={props.type}/>
                    })}
                </div>}
            </div>
            <div id='selected_tracks'>
                {props.selectedItems && props.selectedItems.map((item) => {
                    return <Item key={item.id} 
                                  disable="true"
                                  onClickRemove={() => {handleClickTrack(item)}}
                                  item={item}
                                  type={props.type}/>
                })}
            </div>
        </div>
    )
}