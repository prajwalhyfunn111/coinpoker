import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './GameFormats.css'

const FORMATS = [
  { id: 'cash',       label: 'Cash Games',     emoji: '💰', color: '#e2463d', bg: 'rgba(255,68,56,0.12)'  },
  { id: 'tournaments',label: 'Tournaments',    emoji: '🏆', color: '#e2463d', bg: 'rgba(255,68,56,0.12)'  },
  { id: 'allin',      label: 'All-In Fold',    emoji: '⚡', color: '#00ccff', bg: 'rgba(0,204,255,0.1)'   },
  { id: 'practice',   label: 'Practice Games', emoji: '🃏', color: '#00ff9d', bg: 'rgba(0,255,157,0.08)'  },
]

export default function GameFormats() {
  const navigate = useNavigate()

  return (
    <div className="gf">
      <h2 className="gf__heading">EXPLORE POKER FORMATS</h2>
      <motion.div
        className="gf__grid"
        initial="hidden"
        animate="show"
      >
        {FORMATS.map(f => (
          <motion.button
            key={f.id}
            id={`format-${f.id}`}
            className="gf__card"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            style={{ '--accent': f.color, '--accent-bg': f.bg }}
            onClick={() => {
              if (f.id === 'cash') navigate('/cash-games')
              else navigate('/table')
            }}
          >
            <div className="gf__card-icon" style={{ background: f.bg }}>
              <span role="img" aria-label={f.label}>{f.emoji}</span>
            </div>
            <span className="gf__card-label">{f.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
