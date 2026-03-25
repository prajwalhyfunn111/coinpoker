import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import './SubNav.css'

const TABS = [
  { id: 'cash',       label: 'Cash Games',        emoji: '💰', path: '/cash-games' },
  { id: 'allinorfold',label: 'All-In Or Fold',    emoji: '⚡', path: '/all-in-or-fold' },
  { id: 'bombpot',    label: 'Bomb Pot',           emoji: '💣', path: '/bomb-pot' },
  { id: 'tournaments',label: 'Tournaments',        emoji: '🏆', path: '/tournaments' },
  { id: 'freerolls',  label: 'Freerolls',          emoji: '🎁', path: '/freerolls' },
]

export default function SubNav() {
  const [showDevMessage, setShowDevMessage] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!showDevMessage) return
    const id = window.setTimeout(() => setShowDevMessage(false), 1400)
    return () => window.clearTimeout(id)
  }, [showDevMessage])

  const activeTabId = useMemo(() => {
    return TABS.find(t => t.path === location.pathname)?.id || null
  }, [location.pathname])

  return (
    <nav className="subnav" aria-label="Game type navigation">
      <motion.div 
        className="subnav__home-btn" 
        id="btn-home" 
        onClick={() => setShowDevMessage(true)} 
        animate={{ width: 36 }}
        style={{ cursor: 'pointer', padding: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </motion.div>

      <AnimatePresence>
        {showDevMessage ? (
          <motion.div
            key="subnav-skull"
            className="subnav__skull-overlay"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <span role="img" aria-label="skull">💀</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="subnav__tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`subnav-${tab.id}`}
            className={`subnav__tab ${activeTabId === tab.id ? 'subnav__tab--active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="subnav__tab-emoji">{tab.emoji}</span>
            <span className="subnav__tab-label">{tab.label}</span>
            {activeTabId === tab.id && (
              <motion.div
                className="subnav__tab-bar"
                layoutId="subnav-bar"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      <button className="subnav__more" id="btn-more-tabs" aria-label="More game types">›</button>
    </nav>
  )
}
