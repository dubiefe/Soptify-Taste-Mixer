import './tracks_select.css'
import Track from '../track_component/track';
import { useState, useEffect } from 'react'

export default function Tracks_Select(props) {

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
        
        if (search != "") fetchTracks(search, props.accessToken);  
    }, [search]);

    function changeSearch(input) {
        setSearch(input.target.value);
    }

    function handleClickTrack(track) {
        if (!props.selectedTracks.includes(track)) {
            // add track
            props.setSelectedTracks(prev => [...prev, track]);
            setSearch("");
            setResultSearch([]);
        } else {
            // remove track
            props.setSelectedTracks(prev => prev.filter(item => item !== track))
        }
    }

    return (
        <div id="tracks_select_container">
            <div id='search'>
                <button disabled>
                    <img src="/music-note.svg" alt="tracks"/>
                </button>
                <input type="text" value={search} onChange={changeSearch} placeholder='search for tracks'/>
                {search && resultSearch && <div id='search_results'>
                    {resultSearch.map((track) => {
                        return <Track key={track.id} 
                                      disable="false"
                                      onClick={() => {handleClickTrack(track)}}
                                      img={track.album.images[0].url} 
                                      title={track.name} 
                                      artists={track.artists}/>
                    })}
                </div>}
            </div>
            <div id='selected_tracks'>
                {props.selectedTracks && props.selectedTracks.map((track) => {
                    return <Track key={track.id} 
                                  disable="true"
                                  onClickRemove={() => {handleClickTrack(track)}}
                                  img={track.album.images[0].url} 
                                  title={track.name} 
                                  artists={track.artists}/>
                })}
            </div>
        </div>
    )
}