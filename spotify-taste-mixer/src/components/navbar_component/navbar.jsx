import Link from 'next/link'
import './navbar.css'

export default function Navbar () {
    return (
        < nav id='navbar'>
            < Link href = "/" >Home</ Link >
            < Link href = "/api/auth/login" >Dashboard</ Link >
        </ nav >
    )
}