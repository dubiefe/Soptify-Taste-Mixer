import './popup_validation.css'

export default function Popup_Validation(props) {

    return (
        <div id="popup_background">
            <div id='popup_container'>
                <h1>The playlist have been added to your spotify account !</h1>
                <button onClick={props.onClick}>OK</button>
            </div>
        </div>
    )
}