import './item.css'

export default function Item(props) {

    const formatArtists = (artists) => {
        let finalArtists = "";
        artists.map((artist) => {
            finalArtists += artist.name + ", ";
        })
        return finalArtists.substring(0, finalArtists.length - 2);
    }

    console.log(props.type)
    console.log(props.item)

    return (
        <div id="item_container" onClick={props.onClick} disable={props.disable}>
            {props.type == "track" && <img src={props.item.album.images[0].url} alt="track_cover"/>}
            {props.type == "artist" && <img src={props.item.images[0].url} alt="track_cover"/>}
            <div>
                <h2>{props.item.name}</h2>
                {props.type == "track" && <p>{formatArtists(props.item.artists)}</p>}
            </div>
            {props.disable == "true" && <img src="/x.svg" id='remove_item' alt='remove' onClick={props.onClickRemove}/>}
        </div>
    )
}