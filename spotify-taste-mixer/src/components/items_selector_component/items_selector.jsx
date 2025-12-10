import './items_selector.css'
import Track from '../track_component/track';
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
        
        if (search != "" && props.type == "track") fetchTracks(search, props.accessToken);  
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
                </button>
                <input type="text" value={search} onChange={changeSearch} placeholder={"search for " + props.type + "s"}/>
                {search && resultSearch && <div id='search_results'>
                    {resultSearch.map((track) => {
                        return <Track key={track.id} 
                                      disable="false"
                                      onClick={() => {handleClickTrack(track)}}
                                      track={track}/>
                    })}
                </div>}
            </div>
            <div id='selected_tracks'>
                {props.selectedItems && props.selectedItems.map((track) => {
                    return <Track key={track.id} 
                                  disable="true"
                                  onClickRemove={() => {handleClickTrack(track)}}
                                  track={track}/>
                })}
            </div>
        </div>
    )
}