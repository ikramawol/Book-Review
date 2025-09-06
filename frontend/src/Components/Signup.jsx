import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const navigate = useNavigate();

  const isPasswordStrong = (pw) => {
    // At least 8 chars, one uppercase, one number, one special character
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
    return regex.test(pw)
  }

  const getPasswordRules = (pw) => ({
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw)
  })

  const handleSignup = async (e) => {
    e.preventDefault()
    setPasswordError("")
    if (!isPasswordStrong(password)) {
      setPasswordError('Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character')
      return
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          name: name,
          hash: password
        })
      })
      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Signup failed: ${response.status} ${errorBody}`)
      }
      const result = await response.json()
      console.log('Signup success', result)
      navigate('/')
      // TODO: redirect to login or home after successful signup
    } catch (err) {
      console.error(err)
    }
  }

  const handleSignin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  const googleAuth = () => {
    // Simple redirect to NextAuth Google OAuth
    window.location.href = `${API_BASE_URL}/api/auth/signin`
  }

  return (
    <div className='loginPage'>
      <div className="loginWrapper">
        <h1 className="loginTitle">Create your account</h1>
        <p className="loginSubtitle">Join to discover, review, and track your favorite books.</p>

        <form className="loginCard" onSubmit={handleSignup}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

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
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) setPasswordError("")
              }}
              placeholder="Create a password"
              required
            />
            {(() => {
              const rules = getPasswordRules(password)
              return (
                <ul className="pwRules">
                  <li className={rules.length ? 'ok' : 'bad'}>
                    <span>{rules.length ? '✔️' : '✖️'}</span>
                    8 characters
                  </li>
                  <li className={rules.uppercase ? 'ok' : 'bad'}>
                    <span>{rules.uppercase ? '✔️' : '✖️'}</span>
                    one uppercase letter
                  </li>
                  <li className={rules.number ? 'ok' : 'bad'}>
                    <span>{rules.number ? '✔️' : '✖️'}</span>
                    one number
                  </li>
                  <li className={rules.special ? 'ok' : 'bad'}>
                    <span>{rules.special ? '✔️' : '✖️'}</span>
                    one special character
                  </li>
                </ul>
              )
            })()}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (passwordError) setPasswordError("")
              }}
              placeholder="Re-enter your password"
              required
            />
            {passwordError && (
              <p className="helperText errorText">{passwordError}</p>
            )}
          </div>

          <button type="submit" className="update-btn">Create account</button>

          {/* <button type="button" className="google-btn" onClick={googleAuth}>
            <span className="google-icon" aria-hidden>G</span>
            <span>Continue with Google</span>
          </button> */}
        </form>
        <p className="authSwitch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  )
}

export default Signup