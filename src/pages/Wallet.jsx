import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowLeftRight,
  Ticket,
  History as HistoryIcon,
  ShieldCheck,
  Shield,
  Wallet as WalletIcon,
  Clock3,
  Gift,
  Coins,
  Percent,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import './Wallet.css'

const ACCOUNT_ITEMS = [
  { id: 'wallet', label: 'Wallet', icon: WalletIcon },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'tickets', label: 'My Tickets', icon: Ticket },
  { id: 'history', label: 'Game History', icon: HistoryIcon },
  { id: 'responsible', label: 'Responsible Gaming', icon: ShieldCheck },
  { id: 'coinprotect', label: 'CoinProtect', icon: Shield },
]

const BONUS_TABS = [
  { id: 'active', label: 'Active', enabled: false },
  { id: 'available', label: 'Available', enabled: false },
  { id: 'history', label: 'History', enabled: true },
]

const DUE_FILTERS = [
  { id: 'all', label: 'All Due' },
  { id: 'today', label: 'Today Due' },
  { id: 'past', label: 'Already Due' },
  { id: 'upcoming', label: 'Upcoming Due' },
]

const SORT_OPTIONS = [
  { id: 'due-asc', label: 'Due: Oldest to Newest' },
  { id: 'due-desc', label: 'Due: Newest to Oldest' },
  { id: 'bonus-asc', label: 'Bonus: Low to High' },
  { id: 'bonus-desc', label: 'Bonus: High to Low' },
]

const BONUS_ITEMS = {
  active: [
    {
      id: 'weekend-reload-rush',
      title: 'Weekend Reload Rush',
      dueDate: '2026-03-31',
      dateLabel: 'Ends 31 Mar 2026',
      kindLabel: 'Cashback',
      kindTone: 'amber',
      statusLabel: 'Active',
      statusTone: 'green',
      summaryLabel: 'Unlocked cashback',
      summaryValue: '₹12.00',
      progress: 64,
      progressLabel: 'Wagering progress',
      note: 'Keep playing eligible casino games to release the remaining cashback.',
      metrics: [
        { icon: Coins, label: 'Unlocked', value: '₹12.00', tone: 'blue' },
        { icon: Percent, label: 'Release rate', value: '20%', tone: 'amber' },
      ],
      details: [
        ['Wager required to unlock remaining', '₹6.75'],
        ['Casino provider', 'CoinPoker'],
        ['Eligible category', 'Casino'],
      ],
    },
    {
      id: 'night-owl-spins',
      title: 'Night Owl Spins Boost',
      dueDate: '2026-03-30',
      dateLabel: 'Ends 30 Mar 2026',
      kindLabel: 'Free Round',
      kindTone: 'red',
      statusLabel: 'Ending Soon',
      statusTone: 'amber',
      summaryLabel: 'Spins remaining',
      summaryValue: '18',
      progress: 42,
      progressLabel: 'Usage progress',
      note: 'Use the remaining free spins before the campaign closes.',
      metrics: [
        { icon: Ticket, label: 'Spins left', value: '18', tone: 'red' },
        { icon: Percent, label: 'Rollover', value: '1X', tone: 'blue' },
      ],
      details: [
        ['Bonus amount', '₹7.50'],
        ['Provider', 'Pragmatic Play'],
        ['Eligible game', 'Gates of Olympus'],
      ],
    },
  ],
  available: [
    {
      id: 'smart-reload',
      title: 'Smart Reload Boost',
      dueDate: '2026-03-31',
      dateLabel: 'Expires 31 Mar 2026',
      kindLabel: 'Cashback',
      kindTone: 'amber',
      statusLabel: 'Ready',
      statusTone: 'blue',
      summaryLabel: 'Claimable bonus',
      summaryValue: '₹7.50',
      note: 'A quick-claim offer with a short rollover path.',
      metrics: [
        { icon: Gift, label: 'Claim amount', value: '₹7.50', tone: 'blue' },
        { icon: Percent, label: 'Rollover', value: '1.5X', tone: 'amber' },
      ],
      details: [
        ['Minimum deposit', '₹10'],
        ['Eligible category', 'Casino'],
        ['Claim window', '24h'],
      ],
    },
    {
      id: 'saturday-spin-drop',
      title: 'Saturday Spin Drop',
      dueDate: '2026-04-01',
      dateLabel: 'Available until 1 Apr 2026',
      kindLabel: 'Free Round',
      kindTone: 'red',
      statusLabel: 'Available',
      statusTone: 'green',
      summaryLabel: 'Free spins',
      summaryValue: '25',
      note: 'Claim once and launch directly into eligible slots.',
      metrics: [
        { icon: Ticket, label: 'Spin count', value: '25', tone: 'red' },
        { icon: Gift, label: 'Bonus value', value: '₹6.50', tone: 'blue' },
      ],
      details: [
        ['Provider', 'Hacksaw Gaming'],
        ['Eligible game', 'Wanted Dead or a Wild'],
        ['Claim type', 'Single tap'],
      ],
    },
  ],
  history: [
    {
      id: 'auto-cashback-new',
      title: 'Auto Cashback campaign NEW',
      dueDate: '2026-03-23',
      dateLabel: 'Ended 23 Mar 2026',
      kindLabel: 'Cashback',
      kindTone: 'amber',
      statusLabel: 'Cleared',
      statusTone: 'green',
      summaryLabel: 'Released bonus',
      summaryValue: '₹5.26',
      note: 'No wagering required. Instantly added to your balance.',
      metrics: [
        { icon: Gift, label: 'Cashback', value: '₹5.26', tone: 'blue' },
        { icon: CheckCircle2, label: 'Cleared', value: '₹5.26', tone: 'green' },
      ],
      details: [
        ['Campaign type', 'Cashback'],
        ['Release model', 'Instant credit'],
        ['Wager required', '₹0'],
      ],
    },
    {
      id: 'vip-installment-test',
      title: 'VIP Installment Test',
      dueDate: '2026-03-09',
      dateLabel: 'Ended 9 Mar 2026',
      kindLabel: 'Installments',
      kindTone: 'violet',
      statusLabel: 'Cleared',
      statusTone: 'green',
      summaryLabel: 'Released bonus',
      summaryValue: '₹10 / ₹10',
      progress: 100,
      progressLabel: 'Wagering progress',
      note: 'No wagering required! Instantly added to your balance.',
      metrics: [
        { icon: Gift, label: 'Total Bonus Amount', value: '₹10', tone: 'blue' },
        { icon: Coins, label: 'Total Installments', value: '5', tone: 'violet' },
      ],
      details: [
        ['Total installments unlocked', '5'],
        ['Total wager required to unlock remaining', '₹0'],
        ['Total wager required to unlock full bonus', '₹10'],
      ],
    },
    {
      id: 'fs-test-020320262',
      title: 'FS Test 020320262',
      dueDate: '2026-04-06',
      dateLabel: 'Ended 6 Apr 2026',
      kindLabel: 'Free Round',
      kindTone: 'red',
      statusLabel: 'Cleared',
      statusTone: 'green',
      summaryLabel: 'Released bonus',
      summaryValue: '₹7.5',
      note: 'Spin bonus completed and cleared successfully.',
      metrics: [
        { icon: Ticket, label: 'Spins awarded', value: '10', tone: 'red' },
        { icon: Percent, label: 'Rollover multiplier', value: '1X', tone: 'blue' },
      ],
      details: [
        ['Casino provider', 'Pragmatic Play'],
        ['Eligible game', 'Sweet Bonanza 1000'],
        ['Wager required', '₹0'],
      ],
    },
  ],
}

const KIND_TONE_ICON = {
  Cashback: Percent,
  Installments: Coins,
  'Free Round': Ticket,
}

function parseDateOnly(dateValue) {
  if (!dateValue) return null
  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function startOfDay(dateValue) {
  return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate())
}

function getDueStatus(dueDate) {
  const parsedDueDate = parseDateOnly(dueDate)
  if (!parsedDueDate) return 'upcoming'

  const dueDay = startOfDay(parsedDueDate).getTime()
  const today = startOfDay(new Date()).getTime()

  if (dueDay === today) return 'today'
  if (dueDay < today) return 'past'
  return 'upcoming'
}

function getBonusNumericValue(value) {
  const firstNumber = String(value ?? '').match(/\d+(\.\d+)?/)
  return firstNumber ? Number(firstNumber[0]) : 0
}

function BonusMetric({ icon: Icon, label, value, tone }) {
  return (
    <div className={`wallet-page-card__metric wallet-page-card__metric--${tone}`}>
      <span className="wallet-page-card__metric-icon">
        <Icon size={18} strokeWidth={2.2} />
      </span>
      <div className="wallet-page-card__metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

function BonusCard({ item, expanded, onToggle, showReleaseBadge, dueStatus }) {
  const KindIcon = KIND_TONE_ICON[item.kindLabel] ?? Gift
  const heroLabel = item.summaryLabel === 'Released bonus' ? 'Bonus value' : item.summaryLabel
  const showExpandedHero = item.summaryLabel !== 'Released bonus'

  return (
    <motion.article layout className={`wallet-page-card ${expanded ? 'wallet-page-card--expanded' : ''}`}>
      <button type="button" className="wallet-page-card__header" onClick={onToggle}>
        <div className="wallet-page-card__title-wrap">
          <h3>{item.title}</h3>
          {showReleaseBadge ? (
            <span className="wallet-page-card__release-pill">
              <span className="wallet-page-card__release-icon">
                <Sparkles size={13} strokeWidth={2.2} />
              </span>
              <span className="wallet-page-card__release-copy">
                <span>Released bonus:</span>
                <strong>{item.summaryValue}</strong>
              </span>
            </span>
          ) : null}
          <span
            className={`wallet-page-card__date-trigger wallet-page-card__date-trigger--${dueStatus}`}
            aria-label={item.dateLabel}
          >
            <Clock3 size={14} strokeWidth={2.2} />
            <span className={`wallet-page-card__date-tooltip wallet-page-card__date-tooltip--${dueStatus}`}>{item.dateLabel}</span>
          </span>
        </div>

        <div className="wallet-page-card__chips">
          <span className="wallet-page-status-tooltip">
            <span className="wallet-page-chip-status-icon" aria-label={item.statusLabel}>
              <CheckCircle2 size={14} strokeWidth={2.4} />
            </span>
            <span className="wallet-page-status-tooltip__bubble">{item.note || item.statusLabel}</span>
          </span>
          <span className={`wallet-page-chip wallet-page-chip--${item.kindTone}`}>
            <KindIcon size={13} strokeWidth={2.2} />
            {item.kindLabel}
          </span>
          <motion.span
            className="wallet-page-card__chevron"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={17} strokeWidth={2.4} />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            className="wallet-page-card__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="wallet-page-card__body-inner">
              {showExpandedHero ? (
                <div className="wallet-page-card__hero">
                  <div className="wallet-page-card__hero-copy">
                    <span>{heroLabel}</span>
                    <strong>{item.summaryValue}</strong>
                  </div>
                  {typeof item.progress === 'number' ? <span className="wallet-page-card__hero-progress">{item.progress}%</span> : null}
                </div>
              ) : null}

              {typeof item.progress === 'number' ? (
                <div className="wallet-page-card__progress">
                  <div className="wallet-page-card__progress-head">
                    <span>{item.progressLabel}</span>
                    <strong>{item.progress}%</strong>
                  </div>
                  <div className="wallet-page-card__progress-track">
                    <motion.span
                      className="wallet-page-card__progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ) : null}

              <div className="wallet-page-card__metrics">
                {item.metrics.map((metric) => (
                  <BonusMetric
                    key={metric.label}
                    icon={metric.icon}
                    label={metric.label}
                    value={metric.value}
                    tone={metric.tone}
                  />
                ))}
              </div>

              <div className="wallet-page-card__details">
                {item.details.map(([label, value]) => (
                  <div className="wallet-page-card__detail-row" key={label}>
                    <span className="wallet-page-card__detail-key">{label}</span>
                    <span className="wallet-page-card__detail-sep">:</span>
                    <strong className="wallet-page-card__detail-value">{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  )
}

export default function Wallet() {
  const navigate = useNavigate()
  const [activeSide, setActiveSide] = useState('wallet')
  const [activeTab, setActiveTab] = useState('history')
  const [expandedIds, setExpandedIds] = useState([])
  const [dueFilter, setDueFilter] = useState('all')
  const [sortBy, setSortBy] = useState('due-asc')

  useEffect(() => {
    const firstId = BONUS_ITEMS[activeTab]?.[0]?.id
    setExpandedIds(firstId ? [firstId] : [])
  }, [activeTab])

  const items = BONUS_ITEMS[activeTab] ?? []
  const displayItems = useMemo(() => {
    const computedItems = items.map((item) => ({
      ...item,
      dueStatus: getDueStatus(item.dueDate),
      bonusNumericValue: getBonusNumericValue(item.summaryValue),
      dueTimestamp: parseDateOnly(item.dueDate)?.getTime() ?? Number.POSITIVE_INFINITY,
    }))

    const filteredItems =
      activeTab === 'history'
        ? computedItems.filter((item) => {
            if (dueFilter === 'all') return true
            return item.dueStatus === dueFilter
          })
        : computedItems

    filteredItems.sort((a, b) => {
      if (sortBy === 'due-desc') return b.dueTimestamp - a.dueTimestamp
      if (sortBy === 'bonus-asc') return a.bonusNumericValue - b.bonusNumericValue
      if (sortBy === 'bonus-desc') return b.bonusNumericValue - a.bonusNumericValue
      return a.dueTimestamp - b.dueTimestamp
    })

    return filteredItems
  }, [items, activeTab, dueFilter, sortBy])

  return (
    <div className="wallet-page">
      <div className="wallet-page__shell">
        <aside className="wallet-page__sidebar">
          <button type="button" className="wallet-page__brand" onClick={() => navigate('/')}>
            <span className="wallet-page__brand-icon">
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#d21919" />
                <path d="M14 8v12M8 14h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>CoinPoker</span>
          </button>

          <nav className="wallet-page__menu">
            {ACCOUNT_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeSide === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`wallet-page__menu-item ${isActive ? 'wallet-page__menu-item--active' : ''}`}
                  onClick={() => setActiveSide(item.id)}
                >
                  <Icon size={20} strokeWidth={2.1} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="wallet-page__content">
          <header className="wallet-page__header">
            <button
              type="button"
              className="wallet-page__back"
              onClick={() => {
                if (window.history.length > 1) navigate(-1)
                else navigate('/')
              }}
            >
              <ArrowLeft size={22} strokeWidth={2.4} />
            </button>
            <h1>Casino Bonus</h1>
          </header>

          {activeSide === 'wallet' ? (
            <>
              <div className="wallet-page__tabs">
                {BONUS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`wallet-page__tab ${activeTab === tab.id ? 'wallet-page__tab--active' : ''} ${tab.enabled ? '' : 'wallet-page__tab--disabled'}`}
                    onClick={() => {
                      if (!tab.enabled) return
                      setActiveTab(tab.id)
                    }}
                    disabled={!tab.enabled}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="wallet-page__cards-toolbar">
                {activeTab === 'history' ? (
                  <div className="wallet-page__controls">
                    <label className="wallet-page__control">
                      <span>Filter</span>
                      <select value={dueFilter} onChange={(event) => setDueFilter(event.target.value)}>
                        {DUE_FILTERS.map((filter) => (
                          <option key={filter.id} value={filter.id}>
                            {filter.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="wallet-page__control">
                      <span>Sort</span>
                      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : null}
              </div>

              <section className={`wallet-page__cards ${activeTab === 'history' ? 'wallet-page__cards--history' : ''}`}>
                {displayItems.map((item) => (
                  <BonusCard
                    key={item.id}
                    item={item}
                    showReleaseBadge={activeTab === 'history'}
                    dueStatus={item.dueStatus}
                    expanded={expandedIds.includes(item.id)}
                    onToggle={() => {
                      setExpandedIds((ids) =>
                        ids.includes(item.id)
                          ? ids.filter((id) => id !== item.id)
                          : [...ids, item.id],
                      )
                    }}
                  />
                ))}
              </section>
            </>
          ) : (
            <section className="wallet-page__placeholder">
              <h2>{ACCOUNT_ITEMS.find((item) => item.id === activeSide)?.label}</h2>
              <p>This section is available in the wallet hub layout and can be connected to live data next.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
