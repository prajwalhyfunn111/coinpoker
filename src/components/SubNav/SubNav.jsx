import { useState, useMemo } from 'react'
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

  const activeTabId = useMemo(() => {
    return TABS.find(t => t.path === location.pathname)?.id || null
  }, [location.pathname])

  return (
    <nav className="subnav" aria-label="Game type navigation">
      <motion.div 
        className="subnav__home-btn" 
        id="btn-home" 
        onClick={() => setShowDevMessage(!showDevMessage)} 
        animate={{ width: showDevMessage ? 'auto' : 36 }}
        style={{ cursor: 'pointer', padding: showDevMessage ? '0 12px' : 0, overflow: 'hidden', whiteSpace: 'nowrap' }}
      >
        <AnimatePresence mode="wait">
          {!showDevMessage ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </motion.div>
          ) : (
            <motion.span
              key="text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              Hang in there, Prajwal is making it :)
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

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
