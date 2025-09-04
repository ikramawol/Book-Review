import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react'
import "../styles/nav.css"

const Navbar = () => {

    const navRef = useRef(null)
    const avatarRef = useRef(null)
    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // initialize auth state from localStorage
        try {
            const stored = localStorage.getItem('user')
            if (stored) setCurrentUser(JSON.parse(stored))
            else setCurrentUser(null)
        } catch {}

        // keep in sync across tabs
        const handleStorage = (e) => {
            if (e.key === 'user') {
                try {
                    const val = e.newValue ? JSON.parse(e.newValue) : null
                    setCurrentUser(val)
                } catch { setCurrentUser(null) }
            }
        }

        let x = 400 , delta = 0 , direction //+ve(up) or -ve(down)
        const handleScroll = () => {
            direction = delta - window.pageYOffset
            delta = window.pageYOffset



            if (window.pageYOffset > 400) {
                if(direction > 0){
                    navRef.current.classList.remove('hidden')
                }else{
                    navRef.current.classList.add('hidden')
                    avatarRef.current.classList.remove('active')
                }
            }
        }

        const handleClick = (e) => {
            if(e.target.id === 'userAvatar'){
                avatarRef.current.classList.toggle('active')
            }else{
                avatarRef.current.classList.remove('active')
            }
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', handleStorage);
        window.addEventListener('click', handleClick);
    
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('storage', handleStorage)
            window.removeEventListener('click', handleClick)
        };
    }, [])

    const handleLogout = async () => {
        try {
            // Call logout API to clear server-side refresh token
            const token = localStorage.getItem('accessToken')
            if (token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            }
        } catch (error) {
            console.error('Logout API call failed:', error)
        } finally {
            // Always clear localStorage and navigate, even if API call fails
            try {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
            } catch {}
            setCurrentUser(null)
            navigate('/')
        }
    }

  return (
    <div ref={navRef} className='nav'>
        <h2> <Link to="/"> Book Review</Link></h2>

        <div className="navList">
            <p><Link to="/books" > Books</Link></p>
            {/* <p><Link to="/genres" > Genre</Link></p> */}
            <p><Link to="/about" > About</Link></p>

            <div className="profilePic" ref={avatarRef}>
                <img  id="userAvatar" src="./pfp.png" alt="" srcSet="" />
                <div className="userOptions">
                    <Link to="/userSettings">
                        <p>⚙️ User Settings</p>
                    </Link>
                    {currentUser ? (
                        <p onClick={handleLogout}>🔻 Logout</p>
                    ) : (
                        <Link to="/login">
                            <p>🔓 Login</p>
                        </Link>
                    )}
                </div>
            </div>

        </div>
    </div>
  )
}

export default Navbar