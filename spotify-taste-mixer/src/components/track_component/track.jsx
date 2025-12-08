import './track.css'

export default function Track(props) {

    const formatArtists = (artists) => {
        let finalArtists = "";
        artists.map((artist) => {
            finalArtists += artist.name + ", ";
        })
        return finalArtists.substring(0, finalArtists.length - 2);
    }

    return (
        <div id="track_container" onClick={props.onClick} disable={props.disable}>
            <img src={props.img} alt="track_cover"/>
            <div>
                <h2>{props.title}</h2>
                <p>{formatArtists(props.artists)}</p>
            </div>
            {props.disable == "true" && <img src="/x.svg" id='remove_track' alt='remove' onClick={props.onClickRemove}/>}
        </div>
    )
}