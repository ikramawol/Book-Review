import React, { useState } from 'react'
import '../styles/admin.css'
import AdminDashboard from './AdminDashboard'
import AdminBooks from './AdminBooks'
import AdminGenres from './AdminGenres'
import AdminReviews from './AdminReviews'
import AdminFlags from './AdminFlags'
import { useRef } from 'react'
import AdminRequests from './AdminRequests'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
    const [page, setPage] = useState(<AdminDashboard />)
    const navigate = useNavigate()

    const sidebarContainer = useRef(null)

    const handlePage = (e, x) => {
        // Remove active class from all sidebar items
        const activeElement = document.querySelector('.active')
        if (activeElement) {
            activeElement.classList.remove('active')
        }

        // Add active class to clicked element
        e.target.classList.add('active')

        pageSwitch(x)

    }

    const pageSwitch = (x) => {
        switch (x) {
            case 1:
                setPage(<AdminDashboard />)
                break;
            case 2:
                setPage(<AdminBooks />)
                break;
            case 3:
                setPage(<AdminGenres />)
                break;
            case 4:
                setPage(<AdminReviews />)
                break;
            case 5:
                setPage(<AdminFlags />)
                break;
            case 6:
                setPage(<AdminRequests />)
                break;
            default:
                break;
        }
    }

    const handleLogout = async () => {
        try {
            const loginMethod = localStorage.getItem('loginMethod');
            
            // Call appropriate logout API based on login method
            if (loginMethod === 'custom') {
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
            } else if (loginMethod === 'oauth') {
                // Clear OAuth session
                await fetch('/api/auth/signout', { method: 'POST' })
            }
        } catch (error) {
            console.error('Logout API call failed:', error)
        } finally {
            // Always clear localStorage and navigate, even if API call fails
            try {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
                localStorage.removeItem('loginMethod')
            } catch { }
            navigate('/')
        }
    }

    return (
        <div className='adminContainer'>
            <h3>
                Admin Manager
            </h3>
            <div className='adminPage'>
                <div className="sidebar" ref={sidebarContainer}>
                    <p className="active" onClick={(e) => handlePage(e, 1)}>Dashboard</p>
                    <p onClick={(e) => handlePage(e, 2)}>Books</p>
                    <p onClick={(e) => handlePage(e, 3)}>Genres</p>
                    <p onClick={(e) => handlePage(e, 4)} pageswitch={pageSwitch}>Reviews</p>
                    <p onClick={(e) => handlePage(e, 5)}>Flags</p>
                    {/* <p onClick={(e)=> handlePage(e,6)}>Requests</p> */}
                    <button className="logoutBtn" onClick={handleLogout}>Logout</button>
                </div>
                <div className="mainDisplay">
                    {page}
                </div>
            </div>
        </div>
    )
}

export default Admin