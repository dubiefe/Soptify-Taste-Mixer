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
            {props.type == "track" && props.item?.album?.images?.[0] && <img src={props.item.album.images[0].url} alt="track_cover"/>}
            {props.type == "track" && props.item?.images?.[0] && <img src={props.item.images[0].url} alt="episode_cover"/>}
            {props.type == "artist" && props.item?.images?.[0] && <img src={props.item.images[0].url} alt="artist_picture"/>}
            {props.type == "album" && props.item?.images?.[0] && <img src={props.item.images[0].url} alt="album_cover"/>}
            {props.type == "show" && props.item?.images?.[0] && <img src={props.item.images[0].url} alt="show_cover"/>}
            <div>
                <h2>{props.item.name}</h2>
                {props.type == "track" && props.item?.artists && <p>{formatArtists(props.item.artists)}</p>}
                {props.type == "album" && <p>{formatArtists(props.item.artists)}</p>}
            </div>
            <div id='options_container'>
                {props.favorite &&
                    <svg onClick={props.onClickAddFavorite} id='add_favorite_item' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={props.isFavorite ? "lightcoral" : "white"} class="bi bi-heart-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                    </svg>
                }
                {props.disable == "true" && <img src="/x.svg" id='remove_item' alt='remove' onClick={props.onClickRemove}/>}
            </div>
        </div>
    )
}