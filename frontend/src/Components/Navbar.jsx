import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react'
import "../styles/nav.css"

const Navbar = () => {

    const navRef = useRef(null)
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

                }
            }
        }

        window.addEventListener('scroll', handleScroll);
    
        return () => window.removeEventListener('scroll', handleScroll);
    })

  return (
    <div ref={navRef} className='nav'>
        <h2>Book Review</h2>

        <div className="navList">
            <p><Link to="/books" > Books</Link></p>
            <p><Link to="/genres" > Genre</Link></p>
            <p><Link to="/about" > About</Link></p>

            <div className="profilePic">
                <Link to="">
                    <img src="./pfp.png" alt="" srcset="" />
                </Link>
            </div>

        </div>
    </div>
  )
}

export default Navbar