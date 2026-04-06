import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Settings as SettingsIcon, Wallet } from 'lucide-react'
import './Topbar.css'

const NAV_ITEMS = [
  { id: 'poker', label: 'Poker', icon: '🃏', active: true },
  { id: 'casino', label: 'Casino', icon: '🎰', active: false },
  { id: 'live', label: 'Live Casino', icon: '🎥', active: false },
  { id: 'sports', label: 'Sportsbook', icon: '⚽', active: false },
]

const MENU_LEFT = [
  { icon: '🏆', label: 'Leaderboards', color: '#ffb347' },
  { icon: '📊', label: 'Career', color: '#e2463d' },
  { icon: '🧠', label: 'PokerIntel', color: '#ff697e' },
  { icon: '🥇', label: 'Winners', color: '#ff8f3d' },
  { icon: '🎯', label: 'Showdown Meter', color: '#e2463d' },
]

const MENU_RIGHT = [
  { icon: '👤', label: 'My Profile' },
  { icon: '⚙️', label: 'Account Settings' },
  { icon: '📋', label: 'Game History' },
  { icon: '🚪', label: 'Logout', danger: true },
]

export default function Topbar() {
  const [active, setActive] = useState('poker')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef(null)

  const handleNav = (id) => {
    setActive(id)
    if (id === 'poker') navigate('/cash-games')
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar__wrapper">
        <div className="topbar__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="topbar__logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#e2463d" />
              <path d="M14 8v12M8 14h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="topbar__logo-text">CoinPoker</span>
        </div>

        <nav className="topbar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`topbar__nav-item ${active === item.id ? 'topbar__nav-item--active' : ''} ${!item.active ? 'topbar__nav-item--disabled' : ''}`}
              onClick={() => item.active && handleNav(item.id)}
              disabled={!item.active}
            >
              <span className="topbar__nav-icon">{item.icon}</span>
              <span className="topbar__nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="topbar__right" ref={menuRef}>
          <div className="topbar__profile" onClick={() => setMenuOpen((open) => !open)}>
            <div className="topbar__avatar">
              <div className="topbar__avatar-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.7)" />
                  <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.5)" />
                </svg>
              </div>
              <span className="topbar__avatar-dot" />
            </div>

            <div className="topbar__profile-info">
              <span className="topbar__username">baazigamesps</span>
              <div className="topbar__balance-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="topbar__coin-icon">
                  <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
                  <path d="M12 7v10M9 10h6M9 14h6" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="topbar__balance">₮0</span>
              </div>
            </div>

            <motion.div
              className="topbar__expand"
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </div>

          <button
            className="topbar__icon-btn topbar__gear"
            aria-label="Account Settings"
            type="button"
            title="Settings"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(false)
              navigate('/settings')
            }}
          >
            <SettingsIcon size={20} strokeWidth={2.2} />
          </button>

          <button
            className={`topbar__icon-btn topbar__wallet ${location.pathname === '/wallet' ? 'topbar__icon-btn--active' : ''}`}
            aria-label="Wallet"
            type="button"
            title="Wallet"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(false)
              navigate('/wallet')
            }}
          >
            <Wallet size={20} strokeWidth={2.2} />
          </button>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                className="topbar__mega-menu"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="mega__header">
                  <div className="mega__header-avatar">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.7)" />
                      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.5)" />
                    </svg>
                  </div>
                  <div className="mega__header-info">
                    <span className="mega__header-name">baazigamesps</span>
                    <span className="mega__header-level">
                      <span className="level-badge">Lv. 12</span>
                      Poker Shark
                    </span>
                  </div>
                  <div className="mega__header-xp">
                    <div className="xp-bar">
                      <motion.div
                        className="xp-fill"
                        initial={{ width: 0 }}
                        animate={{ width: '62%' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="xp-text">620 / 1000 XP</span>
                  </div>
                </div>

                <div className="mega__body">
                  <div className="mega__col mega__col--left">
                    <span className="mega__col-title">Features</span>
                    {MENU_LEFT.map((item, idx) => (
                      <motion.button
                        key={item.label}
                        className="mega__item"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.25 }}
                        whileHover={{ x: 4 }}
                      >
                        <span className="mega__item-icon" style={{ background: `${item.color}18`, color: item.color }}>
                          {item.icon}
                        </span>
                        <span className="mega__item-label">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mega__col mega__col--right">
                    <span className="mega__col-title">Account</span>
                    {MENU_RIGHT.map((item, idx) => (
                      <motion.button
                        key={item.label}
                        className={`mega__item ${item.danger ? 'mega__item--danger' : ''}`}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.25 }}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          if (item.label === 'Account Settings') {
                            setMenuOpen(false)
                            navigate('/settings')
                          }
                        }}
                      >
                        <span className="mega__item-icon">{item.icon}</span>
                        <span className="mega__item-label">{item.label}</span>
                        <svg className="mega__item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mega__footer">
                  <div className="mega__stat">
                    <span className="mega__stat-val">₮12,450</span>
                    <span className="mega__stat-label">Total Winnings</span>
                  </div>
                  <div className="mega__stat">
                    <span className="mega__stat-val">247</span>
                    <span className="mega__stat-label">Games Played</span>
                  </div>
                  <div className="mega__stat">
                    <span className="mega__stat-val mega__stat-val--green">68%</span>
                    <span className="mega__stat-label">Win Rate</span>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
