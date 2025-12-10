import './items_selector.css'
import Item from '../item_component/item';
import { useState, useEffect } from 'react'

export default function Items_Selector(props) {

    const [ search, setSearch ] = useState("");
    const [ resultSearch, setResultSearch ] = useState([]);

    useEffect(() => {
        const fetchTracks = async (query, accessToken) => {
            const res = await fetch(
                `/api/search?q=${encodeURIComponent(query)}&type=track&access_token=${accessToken}`
            );
            const result = await res.json();
            console.log(result.tracks.items);
            setResultSearch(result.tracks.items);  
        }

        const fetchArtists = async (query, accessToken) => {
            const res = await fetch(
                `/api/search?q=${encodeURIComponent(query)}&type=artist&access_token=${accessToken}`
            );
            const result = await res.json();
            console.log(result.artists.items);
            setResultSearch(result.artists.items);  
        }
        
        if (search != "" && props.type == "track") fetchTracks(search, props.accessToken);  
        if (search != "" && props.type == "artist") fetchArtists(search, props.accessToken);  
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
        <div id="tracks_select_container">
            <div id='search'>
                <button disabled>
                    {props.type == "track" && <img src="/music-note.svg" alt="tracks"/>}
                    {props.type == "artist" && <img src="/person-fill.svg" alt="artists"/>}
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