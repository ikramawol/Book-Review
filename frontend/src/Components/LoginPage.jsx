import React, { useState } from 'react'
import '../styles/login.css'

const LoginPage = () => {


  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {

  }

  // FIX THIS LATER
  // handle login
  // create the signup

  return (
    <div className='loginPage'>
      <form onSubmit={handleLogin}>


            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="update-btn">Login</button>
          </form>
    </div>
  )
}

export default LoginPage