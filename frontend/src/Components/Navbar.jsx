import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react'
import "../styles/nav.css"

const Navbar = () => {

    const navRef = useRef(null)
    const avatarRef = useRef(null)

    useEffect(() => {
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
        window.addEventListener('click', handleClick);
    
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('click', handleClick)
        };
    })

  return (
    <div ref={navRef} className='nav'>
        <h2> <Link to="/"> Book Review</Link></h2>

        <div className="navList">
            <p><Link to="/books" > Books</Link></p>
            {/* <p><Link to="/genres" > Genre</Link></p> */}
            <p><Link to="/about" > About</Link></p>

            <div className="profilePic" ref={avatarRef}>
                <img  id="userAvatar" src="./pfp.png" alt="" srcset="" />
                
                <div className="userOptions">
                    <Link to="/userSettings">
                        <p>⚙️ User Settings</p>
                    </Link>
                    <Link to="login">
                        <p>🔻 Logout </p>
                    </Link>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Navbar