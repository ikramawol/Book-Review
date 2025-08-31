import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import '../styles/about.css'

const AboutPage = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className="about-page">
      <Navbar />
      <div className="about-content">
        
        {/* <div className="navgap"></div> */}
        
        <div className="about-sections">
          <section className="mission-section">
            <h2>Our Mission</h2>
            <p>
              At Book Review, we believe that every book has the power to transform lives and create meaningful connections. 
              Our platform is dedicated to bringing readers together from all walks of life, fostering a community where 
              stories are shared, discussed, and celebrated.
            </p>
          </section>

          <section className="community-section">
            <h2>Building a Community</h2>
            <p>
              We're more than just a book review platform – we're a vibrant community of passionate readers, 
              writers, and book lovers. Whether you're discovering your next favorite author or sharing insights 
              about a beloved classic, you'll find kindred spirits who share your love for literature.
            </p>
            <div className="cta-section">
              <p>Ready to join our community of book lovers?</p>
              <button className="cta-login" onClick={handleLoginClick}>
                Login to Get Started
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutPage