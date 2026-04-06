import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Trophy, Users, Zap, Info, Clock, Target, Shield, Coins, Layers, RotateCcw, ChevronDown, Search, Filter } from 'lucide-react'
import Topbar from '../components/Topbar/Topbar'
import SubNav from '../components/SubNav/SubNav'
import './Tournaments.css'

const CoinsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="icon-coin">
    <circle cx="12" cy="12" r="10" fill="url(#coinGrad)" stroke="#ffca28" strokeWidth="1"/>
    <path d="M12 7v10M9 10h6M9 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffca28" />
        <stop offset="100%" stopColor="#7d6500" />
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

const TOURNAMENTS_DATA = [
  { id: 1, time: '22:35 22 Mar', timeVal: 1, name: 'LUS: ₮150 CoinMasters BITCOIN', type: 'Level Up Series', buyin: '150', buyinVal: 150, players: '530', prize: '200,000', prizeVal: 200000, color: '#ffd700', status: 'Registering', daysLeft: '3d 8h' },
  { id: 2, time: '22:35 22 Mar', timeVal: 1, name: '₮1,050 Falcon', type: 'Daily Featured', buyin: '1,050', buyinVal: 1050, players: '122', prize: '150,000', prizeVal: 150000, color: '#e2463d', status: 'Registering', daysLeft: '3d 8h' },
  { id: 3, time: '23:35 22 Mar', timeVal: 2, name: 'LUS: ₮530 Sunday Main Event HR', type: 'Level Up Series', buyin: '530', buyinVal: 530, players: '1', prize: '150,000', prizeVal: 150000, color: '#ffd700', status: 'Registering', daysLeft: '3d 9h' },
  { id: 4, time: 'Starts in 9h', timeVal: 3, name: 'LUSSide: ₮530 Thursday 6-Max Masters', type: 'Level Up Series', buyin: '530', buyinVal: 530, players: '1', prize: '75,000', prizeVal: 75000, color: '#ff0055', status: 'Late Reg', daysLeft: '9h 6m' },
]

export default function Tournaments() {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedId, setSelectedId] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [showBuyIn, setShowBuyIn] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showFeatured, setShowFeatured] = useState(false)
  const [showHideSatellites, setShowHideSatellites] = useState(false)
  const [buyInMode, setBuyInMode] = useState('All')
  const [activeFilters, setActiveFilters] = useState({
    gameType: ['NLH'],
    status: ['Late Reg'],
    format: ['All'],
    sortBy: ['Time: Ascending'],
    buyInPresets: ['All']
  })
  const [stagedFilters, setStagedFilters] = useState(activeFilters)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isInspectorLoading, setIsInspectorLoading] = useState(false)
  const navigate = useNavigate()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const handleRowClick = (id) => {
      setSelectedId(id)
      setIsInspectorLoading(true)
      setTimeout(() => setIsInspectorLoading(false), 300)
  }

  const toggleFilter = (cat, val) => {
    setStagedFilters(prev => {
        if (cat === 'sortBy') {
            return { ...prev, [cat]: [val] }
        }
        const current = prev[cat]
        const next = current.includes(val) 
            ? current.filter(item => item !== val)
            : [...current, val]
        return { ...prev, [cat]: next }
    })
  }

  const handleApply = () => {
    setActiveFilters(stagedFilters)
    setShowFilters(false)
    // Perform network / filter logic here
  }

  const handleReset = () => {
    const resetState = {
        gameType: [],
        status: [],
        format: [],
        sortBy: []
    }
    setStagedFilters(resetState)
  }

  const handleSort = (key) => {
    if (sortKey === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
        setSortKey(key)
        setSortOrder('asc')
    }
  }

  const sortedTournaments = useMemo(() => {
    return [...TOURNAMENTS_DATA].sort((a, b) => {
        if (!sortKey) return 0
        const factor = sortOrder === 'asc' ? 1 : -1
        return (a[sortKey] - b[sortKey]) * factor
    })
  }, [sortKey, sortOrder])

  useEffect(() => {
    if (sortedTournaments.length > 0) {
        setSelectedId(sortedTournaments[0].id)
    }
  }, [sortedTournaments])

  const selectedTournament = TOURNAMENTS_DATA.find(t => t.id === selectedId) || TOURNAMENTS_DATA[0]

  return (
    <div className="lobby">
      <Topbar />
      <div className="lobby__container">
        <SubNav />
        <main className="lobby__main">
          <div className="filters">
            <div className="filters__group">
              {['All', 'Satellites', 'Daily Features', 'Level Up Series'].map(t => (
                <button 
                  key={t}
                  className={`pill ${activeTab === t ? 'pill--active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="filters__group filters__group--secondary">
                <div className="dropdown-container">
                    <button 
                        className={`pill pill--dropdown ${showBuyIn ? 'pill--active' : ''}`}
                        onClick={() => setShowBuyIn(!showBuyIn)}
                    >
                        Buy-In <ChevronDown size={16} />
                    </button>

                    <AnimatePresence>
                        {showBuyIn && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="buyin-dropdown"
                            >
                                <div className="buyin-dropdown__header">
                                    <span>Buy-In</span>
                                    <Info size={14} className="icon-muted" />
                                </div>

                                <div className="buyin-mode-toggle">
                                    <button 
                                        className={`mode-btn mode-btn--all ${buyInMode === 'All' ? 'mode-btn--active' : ''}`}
                                        onClick={() => setBuyInMode('All')}
                                    >All</button>
                                    <button 
                                        className={`mode-btn ${buyInMode === 'Custom' ? 'mode-btn--active' : ''}`}
                                        onClick={() => setBuyInMode('Custom')}
                                    >Custom</button>
                                </div>

                                {buyInMode === 'Custom' ? (
                                    <>
                                        <div className="buyin-range-display">
                                            <div className="range-box">₮ 0</div>
                                            <span className="range-sep">~</span>
                                            <div className="range-box">₮ Max</div>
                                        </div>

                                        <div className="buyin-slider-container">
                                            <div className="slider-track">
                                                <div className="slider-handle left">
                                                    <div className="handle-lines"><span></span><span></span><span></span></div>
                                                </div>
                                                <div className="slider-fill" />
                                                <div className="slider-handle right">
                                                    <div className="handle-lines"><span></span><span></span><span></span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="buyin-presets">
                                        {['Micro', 'Low', 'Mid', 'High', 'VIP'].map(p => (
                                            <button 
                                                key={p} 
                                                className={`preset-btn ${stagedFilters.buyInPresets.includes(p) ? 'preset-btn--active' : ''}`}
                                                onClick={() => toggleFilter('buyInPresets', p)}
                                            >{p}</button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button 
                    className={`pill ${showFeatured ? 'pill--active' : ''}`}
                    onClick={() => setShowFeatured(!showFeatured)}
                >Featured</button>
                <button 
                    className={`pill ${showHideSatellites ? 'pill--active' : ''}`}
                    onClick={() => setShowHideSatellites(!showHideSatellites)}
                >Hide Satellites</button>
                
                <div className="separator" />

                <button className="pill-refresh" onClick={handleRefresh} disabled={isRefreshing}>
                    <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }}>
                        <RotateCcw size={16} />
                    </motion.div>
                </button>
                <button className="pill-refresh">
                    <Search size={16} />
                </button>
                <div className="dropdown-container">
                    <button 
                        className={`pill-refresh pill-refresh--badge ${showFilters ? 'pill-refresh--active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={16} />
                        <div className="notification-dot" />
                    </button>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="filter-popover"
                            >
                                <div className="filter-body">
                                    <div className="filter-section">
                                        <h4 className="section-title">Game Type</h4>
                                        <div className="filter-pills">
                                            {['NLH', 'PLO4', 'PLO5', 'PLO6', "Super Hold'em"].map(f => (
                                                <button 
                                                    key={f} 
                                                    className={`filter-pill ${stagedFilters.gameType.includes(f) ? 'filter-pill--active' : ''}`}
                                                    onClick={() => toggleFilter('gameType', f)}
                                                >{f}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="filter-section">
                                        <h4 className="section-title">Status</h4>
                                        <div className="filter-pills">
                                            {['Late Reg', 'Upcoming', 'Running', 'Finished', 'Hide Satellites'].map(f => (
                                                <button 
                                                    key={f} 
                                                    className={`filter-pill ${stagedFilters.status.includes(f) ? 'filter-pill--active' : ''}`}
                                                    onClick={() => toggleFilter('status', f)}
                                                >{f}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="filter-section">
                                        <h4 className="section-title">My Tickets</h4>
                                        <div className="filter-pills">
                                            <button className="filter-pill filter-pill--active">All</button>
                                        </div>
                                    </div>

                                    <div className="filter-section">
                                        <h4 className="section-title">Format</h4>
                                        <div className="filter-pills">
                                            {['All', 'Freeze-Out', 'Re-Entry', 'Multi-Flight', 'Knockout'].map(f => (
                                                <button 
                                                    key={f} 
                                                    className={`filter-pill ${stagedFilters.format.includes(f) ? 'filter-pill--active' : ''}`}
                                                    onClick={() => toggleFilter('format', f)}
                                                >{f}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="filter-section">
                                        <h4 className="section-title">Sort By</h4>
                                        <div className="filter-pills filter-pills--sort-grid">
                                            {[
                                                'Time: Ascending', 'Time: Descending',
                                                'Buy-In: High to Low', 'Buy-In: Low to High',
                                                'Prize: High to Low', 'Prize: Low to High',
                                                'Players: High to Low', 'Players: Low to High'
                                            ].map(f => (
                                                <button 
                                                    key={f} 
                                                    className={`filter-pill ${stagedFilters.sortBy.includes(f) ? 'filter-pill--active' : ''}`}
                                                    onClick={() => toggleFilter('sortBy', f)}
                                                >{f}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="filter-footer">
                                    <button className="btn-reset" onClick={handleReset}>Reset</button>
                                    <button className="btn-apply" onClick={handleApply}>Apply Filters</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>

          <div className="lobby__split">
            <section className="lobby__left">
              <div className="lobby__header">
                <button className={`sort-head ${sortKey === 'timeVal' ? 'sort-head--active' : ''}`} onClick={() => handleSort('timeVal')}>
                    <Clock size={12} style={{ marginRight: '4px', opacity: 0.7 }} /> Time <SortIcon columnKey="timeVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <span>Tournament Name</span>
                <button className={`sort-head ${sortKey === 'buyinVal' ? 'sort-head--active' : ''}`} onClick={() => handleSort('buyinVal')}>
                    <CoinsIcon /> Buy-In <SortIcon columnKey="buyinVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <button className={`sort-head ${sortKey === 'players' ? 'sort-head--active' : ''}`} onClick={() => handleSort('players')}>
                    <Users size={12} style={{ marginRight: '4px', opacity: 0.7 }} /> Players <SortIcon columnKey="players" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <button className={`sort-head ${sortKey === 'prizeVal' ? 'sort-head--active' : ''}`} onClick={() => handleSort('prizeVal')}>
                    <Trophy size={12} style={{ marginRight: '4px', opacity: 0.7 }} /> Prize Pool <SortIcon columnKey="prizeVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
              </div>
              
              <div className="table-rows">
                <AnimatePresence mode="wait">
                  {isRefreshing ? (
                    <motion.div 
                        key="t-refresh"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="refreshing-schedule lobby-refreshing"
                    >
                        <div className="scan-line" />
                        <RotateCcw className="refresh-spinner" size={32} />
                        <p style={{ marginTop: '16px', fontWeight: 900, fontSize: '18px', letterSpacing: '4px' }}>SYNCING EVENTS...</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                        key="t-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {sortedTournaments.map((t, idx) => (
                          <motion.div 
                              key={t.id}
                              layout
                              initial={{ opacity: 0, scale: 0.98, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.23, 1, 0.32, 1] }}
                              className={`table-row ${selectedId === t.id ? 'table-row--selected' : ''}`}
                              onClick={() => setSelectedId(t.id)}
                          >
                              <div className="tournament-time">
                                  <span className="time-val">{t.time.split(' ')[0]}</span>
                                  <span className="date-val">{t.time.split(' ').slice(1).join(' ')}</span>
                              </div>
                              <div className="tournament-name">
                                  <Trophy size={16} className="trophy-icon" style={{ color: t.color }} />
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
                                  <div className="prize-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <Trophy size={14} style={{ color: '#FFD700', opacity: 0.8 }} />
                                      <span>₮{t.prize}</span>
                                  </div>
                                  <span className="chevron">›</span>
                              </div>
                          </motion.div>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <aside className="lobby__right">
               <AnimatePresence mode="wait">
                  {isInspectorLoading ? (
                      <motion.div 
                        key="scanning-tourney"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="lobby-refreshing"
                        style={{ height: '300px', marginTop: '20px', width: '100%', borderRadius: '12px' }}
                      >
                         <div className="scan-line" />
                         <RotateCcw className="refresh-spinner" size={24} />
                         <p style={{ marginTop: '12px', fontWeight: 800, letterSpacing: '2px' }}>RETRIEVING DATA...</p>
                      </motion.div>
                  ) : (
                      <motion.div 
                        key={selectedId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="tournament-inspector"
                      >
                    <div className="inspector-hero" style={{ '--accent': selectedTournament.color }}>
                        <div className="prize-badge">₮{selectedTournament.prize} FIRST PRIZE</div>
                        <div className="trophy-large">
                            <Trophy size={64} style={{ color: selectedTournament.color }} />
                        </div>
                        <div className="registration-status">
                            <span className="status-label">{selectedTournament.status}</span>
                            <div className="timer-box">{selectedTournament.daysLeft}</div>
                        </div>
                        <div className="start-info">
                            Starts at {selectedTournament.time}
                        </div>
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
                                <div><div className="stat-val">14 Level</div><div className="stat-label">Late Reg.</div></div>
                            </div>
                        </div>

                        <div className="detail-list">
                            <div className="detail-item">
                                <span className="label">Starting Stack</span>
                                <span className="value highlight">20,000 (200BB)</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Estimated ITM Duration <Info size={12}/></span>
                                <span className="value">4 Hrs 40 Mins</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Bubble Protection <Info size={12}/></span>
                                <span className="value flex-center gap-1">Available <Shield size={14} className="icon-blue"/></span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Re-Buy</span>
                                <span className="value">Until Level 14</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Deal <Info size={12}/></span>
                                <span className="value">Available</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn-details" onClick={() => navigate('/table')}>
                        Details
                    </button>
                  </motion.div>
                  )}
               </AnimatePresence>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
