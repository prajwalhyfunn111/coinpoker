import { useState } from 'react'
import { motion } from 'framer-motion'
import './GameStats.css'

const TABS = ['Cash', 'Tournament']

const STATS = {
  Cash: {
    period:   '17 Feb - Today',
    metrics:  [
      { id: 'hands',    label: 'Hands Played',  value: '0'  },
      { id: 'profit',   label: 'Net Profit',     value: '₮0' },
      { id: 'vpip',     label: 'VPIP %',         value: '0'  },
      { id: 'pfr',      label: 'PFR %',           value: '0'  },
    ],
    featured: { label: 'Total Cashes', value: '₮0',  trend: null },
  },
  Tournament: {
    period:   '17 Feb - Today',
    metrics:  [
      { id: 'played',   label: 'No. of Tournaments', value: '0' },
      { id: 'won',      label: 'Tournaments Won',     value: '0' },
      { id: 'itm',      label: 'ITM (%)',             value: '0' },
      { id: 'cashes',   label: 'Total Cashes',        value: '₮0' },
    ],
    featured: { label: 'Total Cashes', value: '₮0',  trend: null },
  },
}

export default function GameStats() {
  const [activeTab, setActiveTab] = useState('Tournament')
  const [period, setPeriod]       = useState('Monthly')

  const data = STATS[activeTab]

  return (
    <aside className="gs">
      <div className="gs__header">
        <span className="gs__heading">GAME STATS</span>
        <select
          id="stats-period"
          className="gs__period"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        >
          <option>Monthly</option>
          <option>Weekly</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="gs__tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t}
            id={`stats-tab-${t.toLowerCase()}`}
            role="tab"
            aria-selected={activeTab === t}
            className={`gs__tab ${activeTab === t ? 'gs__tab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Period label */}
      <div className="gs__period-label">
        <span>Monthly</span>
        <span className="gs__period-range">{data.period}</span>
      </div>

      {/* Metrics Grid */}
      <motion.div
        key={activeTab}
        className="gs__grid"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {data.metrics.map(m => (
          <div key={m.id} className="gs__metric-card">
            <span className="gs__metric-label">{m.label}</span>
            <span className="gs__metric-value">{m.value}</span>
          </div>
        ))}
      </motion.div>

      {/* CoinMasters promo */}
      <div className="gs__promo">
        <div className="gs__promo-body">
          <div>
            <p className="gs__promo-title">CoinMasters</p>
            <p className="gs__promo-sub">$250,000 in prizes</p>
          </div>
          <span className="gs__promo-trophy">🏆</span>
        </div>
        <button id="btn-coinmasters" className="gs__promo-cta">
          Register Now →
        </button>
      </div>
    </aside>
  )
}
