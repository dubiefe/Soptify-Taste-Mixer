/* Login
    Component to display a login form calling the spotify connection
*/

import './login.css'

export default function Login () {
    return (
        <div id="login_container">
            <img src="/spotify.svg" alt="spotify" />
            <h1>Welcome to the Spotify Taste Mixer to generate personalized playlists</h1>
            <h2>To start creating, connect to your account</h2>
            <a href="/api/auth/login">
                <button>Login with Spotify</button>
            </a>
        </div>
    )
}