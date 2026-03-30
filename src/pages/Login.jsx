import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import './Login.css'

const ACCESS_PASSWORD = 'ogivey'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    window.setTimeout(() => {
      if (password === ACCESS_PASSWORD) {
        localStorage.setItem('coinpoker_auth', '1')
        const redirectTo = location.state?.from?.pathname || '/cash-games'
        navigate(redirectTo, { replace: true })
        return
      }

      setError('Access denied. Please check the passcode.')
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <div className="login-page">
      <div className="login-glow login-glow--top" aria-hidden="true" />
      <div className="login-glow login-glow--bottom" aria-hidden="true" />

      <div className="login-shell">
        <motion.div
          className="login-brand"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <span className="login-brand__icon">♠</span>
          <span className="login-brand__text">CoinPoker</span>
        </motion.div>

        <div className="login-layout">
          <motion.div
            className="login-visual"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="login-table">
              <div className="login-table__rail" />
              <div className="login-table__felt">
                <div className="login-table__mark">CoinPoker</div>
                <div className="login-cards">
                  {['A♠', 'K♦', 'Q♣', 'J♥', '10♥'].map((card) => (
                    <div key={card} className="login-card">
                      <span>{card}</span>
                    </div>
                  ))}
                </div>
                <div className="login-chips">
                  {['#ff3b30', '#ff9f0a', '#34c759', '#5ac8fa', '#af52de'].map((color, index) => (
                    <div key={color} className="login-chip" style={{ ['--chip-color']: color, ['--chip-delay']: `${index * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="login-visual__caption">Seat open. Shuffle in.</div>
          </motion.div>

          <motion.div
            className="login-card-panel"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="login-card-panel__header">
              <h1>Table Access</h1>
              <p>Enter the passcode to join the lobby.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field">
                <span>Passcode</span>
                <div className="login-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter passcode"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="login-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              {error ? <div className="login-error">{error}</div> : null}
              <div className="login-hint">Case-sensitive.</div>

              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Checking…' : 'Enter Table'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
