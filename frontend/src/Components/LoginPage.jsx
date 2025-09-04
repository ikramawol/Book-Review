import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
// import { useSession } from "next-auth/react";
import '../styles/login.css'

const LoginPage = () => {


  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, hash: password })
      })
      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Login failed: ${response.status} ${errorBody}`)
      }
      const result = await response.json()
      console.log('Login success', result)
      try {
        const decodedToken = jwtDecode(result?.data?.accessToken);
        console.log(decodedToken)

        if(decodedToken.role == "USER"){
          navigate('/')
        }else if(decodedToken.role == "ADMIN"){
          navigate('/admin/')
        }
        localStorage.setItem('accessToken', result?.data?.accessToken || '')
        localStorage.setItem('user', JSON.stringify(result?.data?.user || {}))
      } catch {}
    } catch (err) {
      console.error(err)
    }
  }

  // FIX THIS LATER

  // google sign in
  const handleSignin = async () => {

    try {
      const response = await fetch(`/api/auth/signin`);
      // const result = await response.json();
      console.log(response)
      
    } catch (error) {
      console.error(error)
      
    }

  }


  const googleAuth = () => {
    // Simple redirect to NextAuth Google OAuth
    window.location.href = '/api/auth/signin'
  }

  return (
    <div className='loginPage'>
      <div className="loginWrapper">
        <h1 className="loginTitle">Welcome back</h1>
        <p className="loginSubtitle">Sign in to continue exploring and reviewing books.</p>

        <form className="loginCard" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="update-btn">Login</button>

          <button type="button" className="google-btn" onClick={googleAuth}>
            <span className="google-icon" aria-hidden>G</span>
            <span>Continue with Google</span>
          </button>
        </form>
        <p className="authSwitch">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  )
}

export default LoginPage