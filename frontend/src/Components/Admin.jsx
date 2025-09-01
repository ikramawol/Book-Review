import React, { useState } from 'react'
import '../styles/admin.css'
import AdminDashboard from './AdminDashboard'
import AdminBooks from './AdminBooks'
import AdminGenres from './AdminGenres'
import AdminReviews from './AdminReviews'
import AdminFlags from './AdminFlags'
import { useRef } from 'react'
import AdminRequests from './AdminRequests'

const Admin = () => {
    const [page,setPage] = useState(<AdminDashboard/>)

    const sidebarContainer = useRef(null)

    const handlePage = (e,x) => {
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
                setPage(<AdminDashboard/>)
                break;
            case 2:
                setPage(<AdminBooks/>)
                break;
            case 3:
                setPage(<AdminGenres/>)
                break;
            case 4:
                setPage(<AdminReviews/>)
                break;
            case 5:
                setPage(<AdminFlags/>)
                break;
            case 6:
                setPage(<AdminRequests/>)
                break;
            default:
                break;
        }
    }

  return (
    <div className='adminPage'>
        <div className="sidebar" ref={sidebarContainer}>
            <p className="active" onClick={(e)=> handlePage(e,1)}>Dashboard</p>
            <p onClick={(e)=> handlePage(e,2)}>Books</p>
            <p onClick={(e)=> handlePage(e,3)}>Genres</p>
            <p onClick={(e)=> handlePage(e,4)} pageswitch={pageSwitch}>Reviews</p>
            <p onClick={(e)=> handlePage(e,5)}>Flags</p>
            <p onClick={(e)=> handlePage(e,6)}>Requests</p>
        </div>
        <div className="mainDisplay">
            {page}
        </div>
    </div>
  )
}

export default Admin