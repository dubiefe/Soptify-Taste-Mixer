import './page.css'

export default function LoginPage() {
    return (
        <>
            <div id="login_container">
                <h2>Login with spotify</h2>
                <a href="/api/auth/login">
                    <button>Login</button>
                </a>
            </div>
        </>
    )
}