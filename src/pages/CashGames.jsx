import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus, Settings, RotateCcw, Users, Zap, Info, Swords, Eye, Bomb, ChevronDown, Search, Filter, Shield } from 'lucide-react'
import Topbar from '../components/Topbar/Topbar'
import SubNav from '../components/SubNav/SubNav'
import './CashGames.css'

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

const TableIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="icon-table">
        <ellipse cx="12" cy="12" rx="10" ry="6" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        <path d="M12 10C8 10 7 12 7 12C7 12 8 14 12 14C16 14 17 12 17 12C17 12 16 10 12 10Z" fill="white" opacity="0.2"/>
    </svg>
)
const TableTypeBadge = ({ type }) => {
    const isNLH = type === 'NLH';
    const isPLO = type?.startsWith('PLO');
    const plonum = isPLO ? type.replace('PLO', '') : '';
    
    if(!isNLH && !isPLO) return null;

    return (
        <div className={`table-badge-ui ${isNLH ? 'table-badge-ui--nlh' : 'table-badge-ui--plo'}`}>
            <div className="table-badge-ui__felt">
                <span className="table-badge-ui__text">{type}</span>
            </div>
            {isPLO && plonum && (
                <div className={`table-badge-ui__badge table-badge-ui__badge--${plonum}`}>
                    {plonum}
                </div>
            )}
        </div>
    )
}

const SortIcon = ({ columnKey, sortKey, sortOrder }) => {
  const isActive = sortKey === columnKey
  const isDesc = sortOrder === 'desc'

  if (!isActive) {
    // neutral up/down
    return (
      <span className="sort-icon" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 9l4-4 4 4" />
          <path d="M8 15l4 4 4-4" />
        </svg>
      </span>
    )
  }

  return (
    <span className="sort-icon sort-icon--active" aria-hidden="true">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: isDesc ? 'rotate(180deg)' : 'none' }}
      >
        <path d="M8 15l4-8 4 8" />
      </svg>
    </span>
  )
}

const HeadsUpIcon = () => (
    <span style={{ fontStyle: 'italic', fontWeight: 900, fontSize: 13, letterSpacing: -1 }}>
        <span style={{ color: '#ff3b30' }}>V</span>
        <span style={{ color: '#0a84ff', position: 'relative', left: '-2px' }}>S</span>
    </span>
);
const TurboIcon = () => (
    <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #FF9500, #F36E08)', color: 'white', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        T
    </div>
);
const MustShowIcon = () => (
    <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #0a84ff, #005ecb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Eye size={10} strokeWidth={3} />
    </div>
);

const FEATURE_OPTIONS = [
    { id: 'hu', icon: <HeadsUpIcon />, label: 'Heads Up' },
    { id: 'turbo', icon: <TurboIcon />, label: 'Turbo' },
    { id: 'ms', icon: <MustShowIcon />, label: 'Must Show' },
    { id: 'bp', icon: <Bomb size={12} fill="#ff3b30" color="#ff3b30" />, label: 'Bomb Pot' },
    { id: 'hf', icon: null, label: 'Hide Full' }
];
const TABLES_DATA = [
  { id: 1, type: 'NLH',  blinds: '50/100',   blindsVal: 100,  players: '2', buyinVal: 4000,  isVip: true,  color: '#00ff9d', features: ['hu', 'ms'] },
  { id: 2, type: 'PLO6', blinds: '200/400',  blindsVal: 400,  players: '0', buyinVal: 16000, isVip: true,  color: '#ff4438', features: ['turbo'] },
  { id: 3, type: 'PLO5', blinds: '200/400',  blindsVal: 400,  players: '0', buyinVal: 16000, isVip: true,  color: '#ff4438', features: ['ms'] },
  { id: 4, type: 'PLO4', blinds: '200/400',  blindsVal: 400,  players: '0', buyinVal: 16000, isVip: true,  color: '#ff4438', features: ['hu', 'turbo'] },
]

const RIGHT_TABLE_DATA = {
  1: [
    { id: 101, stack: '₮12K', players: '1/2', features: ['hu', 'ms'] },
    { id: 102, stack: '₮8K',  players: '0/2', features: ['hu'] }
  ],
  2: [
    { id: 201, stack: '₮45K', players: '1/6', features: ['ms', 'turbo'] },
    { id: 202, stack: '₮30K', players: '4/6', features: ['ms'] }
  ],
  default: [
    { id: 9991, stack: '₮10K', players: '1/6', features: ['ms'] },
    { id: 9992, stack: '₮0',    players: '0/6', features: ['ms'] }
  ]
}

export default function CashGames() {
  const [activeTypes, setActiveTypes] = useState(['All'])
  const [activePloVariants, setActivePloVariants] = useState(['All'])
  const [activeStake, setActiveStake] = useState('VIP')
  const [featureFilters, setFeatureFilters] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isInspectorLoading, setIsInspectorLoading] = useState(false)
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedId, setSelectedId] = useState(1)
  
  const location = useLocation()
  const navigate = useNavigate()

  const isAoFRoute = location.pathname === '/all-in-or-fold' || location.pathname === '/bomb-pot'

  useEffect(() => {
    setActiveTypes(['All'])
    if (isAoFRoute) {
      setSelectedId(null)
    }
  }, [location.pathname, isAoFRoute])

  const handleRefresh = () => {
    setIsRefreshing(true)
    if (isAoFRoute) {
      setSelectedId(null)
      setIsInspectorLoading(true)
    }
    setTimeout(() => {
      setIsRefreshing(false)
      if (isAoFRoute) setIsInspectorLoading(false)
    }, 800)
  }

  const handleRowClick = (id) => {
      setSelectedId(id)
      setIsInspectorLoading(true)
      setTimeout(() => setIsInspectorLoading(false), 300)
  }

  const toggleType = (t) => {
    setActiveTypes(prev => {
        if (t === 'All') return ['All']
        const withoutAll = prev.filter(x => x !== 'All')
        return withoutAll.includes(t)
            ? (withoutAll.length === 1 ? ['All'] : withoutAll.filter(x => x !== t))
            : [...withoutAll, t]
    })
  }

  const togglePloVariant = (v) => {
    const pf = v.replace(' ','')
    setActivePloVariants(prev => {
        if (pf === 'All') return ['All']
        const withoutAll = prev.filter(x => x !== 'All')
        return withoutAll.includes(pf)
            ? (withoutAll.length === 1 ? ['All'] : withoutAll.filter(x => x !== pf))
            : [...withoutAll, pf]
    })
  }

  const toggleFeature = (f) => {
    setFeatureFilters(prev => 
        prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedTables = useMemo(() => {
    return [...TABLES_DATA]
      .filter(t => {
        if (activeTypes.includes('All')) return true
        const hasDirectMatch = activeTypes.includes(t.type)
        if (hasDirectMatch) return true
        if (activeTypes.includes('PLO') && t.type.startsWith('PLO')) {
            if (activePloVariants.includes('All')) return true
            const ver = t.type.replace('PLO', '')
            return activePloVariants.some(v => v.includes(ver))
        }
        return false
      })
      .sort((a, b) => {
        if (!sortKey) return 0
        const factor = sortOrder === 'asc' ? 1 : -1
        return (a[sortKey] - b[sortKey]) * factor
      })
  }, [sortKey, sortOrder, activeTypes, activePloVariants])

  useEffect(() => {
    if (isAoFRoute) {
      setSelectedId(null)
      return
    }
    if (sortedTables.length > 0) {
      setSelectedId(sortedTables[0].id)
    }
  }, [sortedTables, isAoFRoute])

  const rawRightData = RIGHT_TABLE_DATA[selectedId] || RIGHT_TABLE_DATA.default
  const selectedTable = TABLES_DATA.find(t => t.id === selectedId)
  
  const currentRightData = rawRightData.filter(rt => {
    if (featureFilters.length === 0) return true
    return featureFilters.every(f => rt.features.includes(f))
  })

  return (
    <div className="lobby">
      <Topbar />
      <div className="lobby__container">
        <SubNav />
        <main className="lobby__main">
          <div className="filters">
            <div className="filters__group">
              {[
                { label: 'All', value: 'All' },
                { label: 'NLH', value: 'NLH' },
                { label: 'PLO', value: 'PLO' }
              ].map(t => (
                <div key={t.value} className="filter-item-wrapper">
                  <button 
                    className={`pill ${activeTypes.includes(t.value) ? 'pill--active' : ''}`}
                    onClick={() => toggleType(t.value)}
                  >
                    {t.label}
                  </button>
                  {t.value === 'PLO' && activeTypes.includes('PLO') && (
                    <motion.div 
                        className="plo-variants"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                    >
                        {['All', 'PLO 4', 'PLO 5', 'PLO 6'].map(pf => (
                            <button 
                                key={pf}
                                className={`pill-variant ${activePloVariants.includes(pf.replace(' ','')) ? 'pill-variant--active' : ''}`}
                                onClick={() => togglePloVariant(pf)}
                            >
                                {pf}
                            </button>
                        ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="filters__group filters__group--refresh">
              {['Micro', 'Low', 'Mid', 'High', 'VIP'].map(s => (
                <button 
                  key={s}
                  className={`pill ${activeStake === s ? 'pill--active' : ''}`}
                  onClick={() => setActiveStake(s)}
                >
                  {s}
                </button>
              ))}
              <div className="separator" />
              <button className="pill-refresh" onClick={handleRefresh} disabled={isRefreshing}>
                <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }}>
                    <RotateCcw size={16} />
                </motion.div>
              </button>
            </div>
          </div>

          <div className="lobby__split">
            <section className="lobby__left">
              <div className="lobby__header">
                <span>Game Type</span>
                <button className={`sort-head ${sortKey === 'blindsVal' ? 'sort-head--active' : ''}`} onClick={() => handleSort('blindsVal')}>
                    Blinds <SortIcon columnKey="blindsVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <button className={`sort-head ${sortKey === 'players' ? 'sort-head--active' : ''}`} onClick={() => handleSort('players')}>
                    <Users size={12} style={{ marginRight: '4px', opacity: 0.7 }} /> Players <SortIcon columnKey="players" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <button className={`sort-head ${sortKey === 'buyinVal' ? 'sort-head--active' : ''}`} onClick={() => handleSort('buyinVal')}>
                    <CoinsIcon /> Buy-In <SortIcon columnKey="buyinVal" sortKey={sortKey} sortOrder={sortOrder} />
                </button>
                <span />
              </div>
              
              <div className="table-rows">
                <AnimatePresence mode="wait">
                  {isRefreshing ? (
                    <motion.div 
                        key="refresh" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="lobby-refreshing"
                    >
                        <div className="scan-line" />
                        <RotateCcw className="refresh-spinner" size={32} />
                        <p style={{ marginTop: '16px', fontWeight: 900, fontSize: '18px', letterSpacing: '4px' }}>DECRYPTING TABLES...</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                        key="list" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                    >
                        {sortedTables.length > 0 ? (
                            sortedTables.map(t => (
                                <div 
                                    key={t.id} 
                                    className={`table-row ${selectedId === t.id ? 'table-row--selected' : ''}`}
                                    onClick={() => handleRowClick(t.id)}
                                >
                                    <div className="table-row__type" style={{ position: 'relative' }}>
                                        <TableTypeBadge type={t.type} />
                                        {t.isVip && (
                                            <div style={{ position: 'absolute', top: '-6px', left: '-6px', background: 'linear-gradient(135deg, #FFD700, #FF8F00)', color: 'black', fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 10 }}>VIP</div>
                                        )}
                                    </div>
                                    <div className="table-row__blinds">{t.blinds}</div>
                                    <div className="table-row__players" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Users size={14} style={{ color: 'var(--primary)', opacity: 0.7 }} />
                                        <span>{t.players}</span>
                                    </div>
                                    <div className="table-row__buyin" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CoinsIcon />
                                        <span>₮{t.buyinVal}</span>
                                    </div>
                                    <button
                                      className="btn-quick-join"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        navigate('/table')
                                      }}
                                    >
                                      Quick Join
                                    </button>
                                </div>
                            ))
                        ) : (
                             <div className="table-empty"><Info /> No tables found</div>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <aside className="lobby__right">
               <div className="right-filters">
                  {FEATURE_OPTIONS.map(f => (
                    <button 
                        key={f.id} 
                        className={`filter-chip ${featureFilters.includes(f.id) ? 'filter-chip--active' : ''}`}
                        onClick={() => toggleFeature(f.id)}
                    >
                        {f.icon && <span style={{display: 'flex', alignItems: 'center'}}>{f.icon}</span>}
                        {f.label}
                    </button>
                  ))}
               </div>

               <div className="inspector-content">
                  <AnimatePresence mode="wait">
                    {isInspectorLoading ? (
                      <motion.div 
                        key="scanning"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="lobby-refreshing"
                        style={{ height: '300px', marginTop: '20px' }}
                      >
                         <div className="scan-line" />
                         <RotateCcw className="refresh-spinner" size={24} />
                         <p style={{ marginTop: '12px', fontWeight: 800, letterSpacing: '2px' }}>RETRIEVING DATA...</p>
                      </motion.div>
                    ) : selectedTable ? (
                      <motion.div 
                        key={selectedId}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="inspector-hero" style={{ marginBottom: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: `1px solid ${selectedTable?.color}40`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {(selectedTable?.type?.includes('PLO') || selectedTable?.type === 'NLH') ? (
                                <TableTypeBadge type={selectedTable?.type} />
                            ) : (
                                <div className="type-dot" style={{ background: selectedTable?.color, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {selectedTable?.type === 'AoF' && <Swords size={16} color="white" />}
                                    {selectedTable?.type === 'Bomb' && <Bomb size={16} color="black" />}
                                </div>
                            )}
                            <div>
                                <h3 style={{ margin: 0, color: 'white', fontSize: '18px', fontWeight: 800 }}>
                                    {selectedTable?.type} <span style={{fontSize: '14px', opacity: 0.7}}>Table</span>
                                </h3>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>Blinds: {selectedTable?.blinds} • Min Buy-In: ₮{selectedTable?.buyinVal}</div>
                            </div>
                        </div>
                        <div className="lobby__header lobby__header--small">
                            <span>Stack</span>
                            <span>Players</span>
                            <span>Features</span>
                            <span style={{textAlign: 'right'}}>Action</span>
                        </div>
                        <div className="table-rows table-rows--small">
                            {currentRightData.map(rt => (
                                <div key={rt.id} className="table-row table-row--plain" style={{ display: 'grid', gridTemplateColumns: '70px 60px 100px 1fr', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ fontWeight: 800, color: 'white' }}>{rt.stack}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{rt.players}</div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {rt.features?.includes('turbo') && <TurboIcon />}
                                        {rt.features?.includes('hu') && <HeadsUpIcon />}
                                        {rt.features?.includes('ms') && <MustShowIcon />}
                                        {rt.features?.includes('bp') && <Bomb size={14} fill="#ff3b30" color="#ff3b30" />}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <button className="btn-join" onClick={() => navigate('/table')}>Join</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="inspector-empty">Select a table</div>
                    )}
                  </AnimatePresence>
               </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
