import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Trophy, Users, Clock, Target, Shield, Info, ChevronDown, RotateCcw, Search, Filter } from 'lucide-react'
import Topbar from '../components/Topbar/Topbar'
import SubNav from '../components/SubNav/SubNav'
import './Freerolls.css'

const CoinsIcon = ({ color = "#00ffa3" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="icon-coin">
    <circle cx="12" cy="12" r="10" fill="url(#coinGrad)" stroke={color} strokeWidth="1"/>
    <path d="M12 7v10M9 10h6M9 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#004d31" />
      </linearGradient>
    </defs>
  </svg>
)
const SortIcon = ({ columnKey, sortKey, sortOrder }) => {
    const isActive = sortKey === columnKey;
    return (
        <span style={{ 
            opacity: isActive ? 1 : 0.3, 
            fontSize: '11px', 
            marginLeft: '4px', 
            display: 'inline-block',
            transform: isActive && sortOrder === 'desc' ? 'rotate(180deg)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' 
        }}>
            {isActive ? '↑' : '↕'}
        </span>
    );
}

const FREEROLLS_DATA = [
  { id: 1, time: 'Starts in 11m', timeVal: 1, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '153', prize: '10', prizeVal: 10, color: '#00ffa3', status: 'Registering', daysLeft: '11m' },
  { id: 2, time: 'Starts in 1h 10m', timeVal: 2, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '44', prize: '10', prizeVal: 10, color: '#00ffa3', status: 'Registering', daysLeft: '1h 10m' },
  { id: 3, time: '18:30 19 Mar', timeVal: 3, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '0', prize: '20', prizeVal: 20, color: '#00ffa3', status: 'Upcoming', daysLeft: '2h 19m' },
  { id: 4, time: '19:30 19 Mar', timeVal: 4, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '0', prize: '20', prizeVal: 20, color: '#00ffa3', status: 'Upcoming', daysLeft: '3h 19m' },
  { id: 5, time: '20:30 19 Mar', timeVal: 5, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '0', prize: '20', prizeVal: 20, color: '#00ffa3', status: 'Upcoming', daysLeft: '4h 19m' },
  { id: 6, time: '21:30 19 Mar', timeVal: 6, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '0', prize: '50', prizeVal: 50, color: '#00ffa3', status: 'Upcoming', daysLeft: '5h 19m' },
  { id: 7, time: '22:30 19 Mar', timeVal: 7, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '0', prize: '50', prizeVal: 50, color: '#00ffa3', status: 'Upcoming', daysLeft: '6h 19m' },
  { id: 8, time: '23:30 19 Mar', timeVal: 8, name: 'Level Up Freeroll', buyin: '0', buyinVal: 0, players: '0', prize: '50', prizeVal: 50, color: '#00ffa3', status: 'Upcoming', daysLeft: '7h 19m' },
]

export default function Freerolls() {
  const [selectedId, setSelectedId] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const navigate = useNavigate()

  const handleSort = (key) => {
    if (sortKey === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
        setSortKey(key)
        setSortOrder('asc')
    }
  }

  const sortedFreerolls = useMemo(() => {
    return [...FREEROLLS_DATA].sort((a, b) => {
        if (!sortKey) return 0
        const factor = sortOrder === 'asc' ? 1 : -1
        return (a[sortKey] - b[sortKey]) * factor
    })
  }, [sortKey, sortOrder])

  useEffect(() => {
    if (sortedFreerolls.length > 0) setSelectedId(sortedFreerolls[0].id)
  }, [sortedFreerolls])

  const selectedTournament = FREEROLLS_DATA.find(t => t.id === selectedId) || sortedFreerolls[0]

  return (
    <div className="lobby freerolls-view">
      <Topbar />
      <div className="lobby__container">
        <SubNav />
        <main className="lobby__main">

          <div className="lobby__split">
            <section className="lobby__left">
              <div className="lobby__header">
                <button 
                    className={`sort-head ${sortKey === 'timeVal' ? 'sort-head--active' : ''}`}
                    onClick={() => handleSort('timeVal')}
                >
                    <Clock size={12} style={{ marginRight: '4px', opacity: 0.7 }} /> Time <SortIcon columnKey="timeVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <span>Tournament Name</span>
                <button 
                    className={`sort-head ${sortKey === 'buyinVal' ? 'sort-head--active' : ''}`}
                    onClick={() => handleSort('buyinVal')}
                >
                    <CoinsIcon /> Buy-In <SortIcon columnKey="buyinVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <button 
                    className={`sort-head ${sortKey === 'players' ? 'sort-head--active' : ''}`}
                    onClick={() => handleSort('players')}
                >
                    <Users size={12} style={{ marginRight: '4px', opacity: 0.7 }} /> Players <SortIcon columnKey="players" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <button 
                    className={`sort-head ${sortKey === 'prizeVal' ? 'sort-head--active' : ''}`}
                    onClick={() => handleSort('prizeVal')}
                >
                    <Trophy size={12} style={{ marginRight: '4px', opacity: 0.7 }} /> Prize Pool <SortIcon columnKey="prizeVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
              </div>
              
              <div className="table-rows">
                <AnimatePresence mode="popLayout" initial={false}>
                  {sortedFreerolls.map((t, idx) => (
                    <motion.div 
                        key={t.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`table-row ${selectedId === t.id ? 'table-row--selected' : ''}`}
                        onClick={() => setSelectedId(t.id)}
                    >
                        <div className="tournament-time">
                            <span className={t.time.includes('in') ? 'time-urgent' : ''}>{t.time}</span>
                        </div>
                        <div className="tournament-name">
                            <div className="chip-icon-small" />
                            <span>{t.name}</span>
                        </div>
                        <div className="tournament-buyin">
                            <CoinsIcon />
                            <span>{t.buyin}</span>
                        </div>
                         <div className="tournament-players">
                             <Users size={14} style={{ color: 'var(--primary)', opacity: 0.7 }} />
                             <span>{t.players}</span>
                         </div>
                         <div className="tournament-prize">
                             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                 <Trophy size={14} style={{ color: '#00ffa3', opacity: 0.8 }} />
                                 <span>₮{t.prize}</span>
                             </div>
                             <span className="chevron">›</span>
                         </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            <aside className="lobby__right">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="tournament-inspector"
                >
                  <div className="inspector-hero" style={{ '--accent': '#00ffa3' }}>
                    <div className="prize-badge">₮{selectedTournament.prize} FIRST PRIZE</div>
                    <div className="trophy-large">
                      <Trophy size={64} style={{ color: '#00ffa3' }} />
                    </div>
                    <div className="registration-status">
                      <span className="status-label">{selectedTournament.status}</span>
                      <div className="timer-box">{selectedTournament.daysLeft}</div>
                    </div>
                    <div className="start-info">Starts at {selectedTournament.time}</div>
                    <div className="inspector-name">{selectedTournament.name}</div>
                  </div>

                  <div className="inspector-stats">
                    <div className="stat-row">
                      <div className="stat-item">
                        <Users size={18} className="stat-icon" />
                        <div><div className="stat-val">{selectedTournament.players}</div><div className="stat-label">Entrants</div></div>
                      </div>
                      <div className="stat-item">
                        <Trophy size={18} className="stat-icon" />
                        <div><div className="stat-val">₮{selectedTournament.prize}</div><div className="stat-label">Prize Pool</div></div>
                      </div>
                      <div className="stat-item">
                        <Target size={18} className="stat-icon" />
                        <div><div className="stat-val">5 Level</div><div className="stat-label">Late Reg.</div></div>
                      </div>
                    </div>

                    <div className="detail-list">
                      <div className="detail-item">
                         <span className="label">Starting Stack</span>
                         <span className="value highlight">5,000 (50BB)</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Estimated ITM Duration <Info size={12}/></span>
                        <span className="value">1 Hr 30 Mins</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Re-Buy</span>
                        <span className="value">Not Available</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Buy-In <Info size={12}/></span>
                        <span className="value">₮0</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Minimum Cash</span>
                        <span className="value">₮1</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn-details btn-details--red">Details</button>
                </motion.div>
              </AnimatePresence>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
