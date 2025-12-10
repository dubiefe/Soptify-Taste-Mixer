import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar_component/navbar'

const inter = Inter ({ subsets: [ 'latin' ] })

export const metadata = {
    title: 'Spotify-Taste-Mixer' ,
    description: 'Learning NextJS' ,
}

export default function RootLayout ({ children }) {
    return (
        < html lang = "en" >
            <head>
                <link rel="icon" href="/spotify.svg" />
            </head>
            < body className = { inter . className } >
                < Navbar />
                { children }
            </body>
        </html>
    )
}