import './item.css'

export default function Item(props) {

    const formatArtists = (artists) => {
        let finalArtists = "";
        artists.map((artist) => {
            finalArtists += artist.name + ", ";
        })
        return finalArtists.substring(0, finalArtists.length - 2);
    }

    return (
        <div id="item_container" onClick={props.onClick} disable={props.disable}>
            {props.type == "track" && props.item.album.images[0] && <img src={props.item.album.images[0].url} alt="track_cover"/>}
            {props.type == "artist" && props.item.images[0] && <img src={props.item.images[0].url} alt="artist_picture"/>}
            {props.type == "album" && props.item.images[0] && <img src={props.item.images[0].url} alt="album_cover"/>}
            {props.type == "show" && props.item.images[0] && <img src={props.item.images[0].url} alt="show_cover"/>}
            <div>
                <h2>{props.item.name}</h2>
                {props.type == "track" && <p>{formatArtists(props.item.artists)}</p>}
                {props.type == "album" && <p>{formatArtists(props.item.artists)}</p>}
            </div>
            {props.disable == "true" && <img src="/x.svg" id='remove_item' alt='remove' onClick={props.onClickRemove}/>}
        </div>
    )
}