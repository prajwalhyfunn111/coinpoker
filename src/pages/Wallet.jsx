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
  { id: 'active', label: 'Active', enabled: true },
  { id: 'available', label: 'Available', enabled: true },
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
      id: 'velocity-recharge',
      title: 'Velocity Recharge Bonus',
      dueDate: '2026-04-15',
      dateLabel: 'Ends 15 Apr 2026',
      kindLabel: 'Cashback',
      kindTone: 'amber',
      statusLabel: 'Active',
      statusTone: 'green',
      summaryLabel: 'Unlocked cashback',
      summaryValue: '₹45.00',
      progress: 72,
      progressLabel: 'Wagering progress',
      note: 'Wager on any slot to release your cashback balance.',
      metrics: [
        { icon: Coins, label: 'Unlocked', value: '₹45.00', tone: 'blue' },
        { icon: Percent, label: 'Release rate', value: '15%', tone: 'amber' },
      ],
      details: [
        ['Remaining to unlock', '₹15.00'],
        ['Provider', 'Playtech'],
        ['Game Category', 'Slots'],
      ],
    },
    {
      id: 'twilight-spins-pro',
      title: 'Twilight Spins Tournament',
      dueDate: '2026-04-10',
      dateLabel: 'Ends 10 Apr 2026',
      kindLabel: 'Free Round',
      kindTone: 'red',
      statusLabel: 'Ongoing',
      statusTone: 'amber',
      summaryLabel: 'Spins remaining',
      summaryValue: '35',
      progress: 30,
      progressLabel: 'Usage progress',
      note: 'Complete your spins before the session ends.',
      metrics: [
        { icon: Ticket, label: 'Spins left', value: '35', tone: 'red' },
        { icon: Percent, label: 'Rollover', value: '5X', tone: 'blue' },
      ],
      details: [
        ['Potential Prize', '₹250.00'],
        ['Provider', 'Evolution'],
        ['Eligible game', 'Crazy Time'],
      ],
    },
  ],
  available: [
    {
      id: 'high-roller-match',
      title: 'High Roller Deposit Match',
      dueDate: '2026-04-20',
      dateLabel: 'Expires 20 Apr 2026',
      kindLabel: 'Installments',
      kindTone: 'violet',
      statusLabel: 'Available',
      statusTone: 'blue',
      summaryLabel: 'Match Value',
      summaryValue: '₹5,000',
      note: 'A premium offer for significant deposits.',
      metrics: [
        { icon: Gift, label: 'Bonus Cap', value: '₹5,000', tone: 'blue' },
        { icon: Coins, label: 'Installments', value: '10', tone: 'violet' },
      ],
      details: [
        ['Min. Deposit', '₹1,000'],
        ['Release method', 'Wager-based'],
        ['Time limit', '30 Days'],
      ],
    },
    {
      id: 'midweek-magic-drop',
      title: 'Midweek Magic Free Spins',
      dueDate: '2026-04-08',
      dateLabel: 'Valid until 8 Apr 2026',
      kindLabel: 'Free Round',
      kindTone: 'red',
      statusLabel: 'Flash Offer',
      statusTone: 'green',
      summaryLabel: 'Free spins',
      summaryValue: '50',
      note: 'Limited time drop! Claim now to start spinning.',
      metrics: [
        { icon: Ticket, label: 'Spin count', value: '50', tone: 'red' },
        { icon: Gift, label: 'Value/Spin', value: '₹2.00', tone: 'blue' },
      ],
      details: [
        ['Provider', 'NetEnt'],
        ['Eligible game', 'Starburst'],
        ['Requirement', 'Login only'],
      ],
    },
  ],
  history: [
    {
      id: 'loyalty-rebate-mar',
      title: 'Monthly Loyalty Rebate',
      dueDate: '2026-03-31',
      dateLabel: 'Ended 31 Mar 2026',
      kindLabel: 'Cashback',
      kindTone: 'amber',
      statusLabel: 'Completed',
      statusTone: 'green',
      summaryLabel: 'Paid out',
      summaryValue: '₹124.50',
      note: 'Monthly loyalty rewards transferred to main wallet.',
      metrics: [
        { icon: Gift, label: 'Rebate', value: '₹124.50', tone: 'blue' },
        { icon: CheckCircle2, label: 'Settled', value: 'Yes', tone: 'green' },
      ],
      details: [
        ['Tier', 'Platinum'],
        ['Period', 'Mar 2026'],
        ['Method', 'Instant'],
      ],
    },
    {
      id: 'early-bird-fs-legacy',
      title: 'Early Bird Spins Flash',
      dueDate: '2026-03-25',
      dateLabel: 'Ended 25 Mar 2026',
      kindLabel: 'Free Round',
      kindTone: 'red',
      statusLabel: 'Expired',
      statusTone: 'green',
      summaryLabel: 'Winnings',
      summaryValue: '₹12.00',
      note: 'Spins session expired or completed.',
      metrics: [
        { icon: Ticket, label: 'Total awarded', value: '20', tone: 'red' },
        { icon: Percent, label: 'Used', value: '100%', tone: 'blue' },
      ],
      details: [
        ['Outcome', 'Cashed out'],
        ['Game', 'Book of Dead'],
        ['Rollover', 'Met'],
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
  const [wipNotice, setWipNotice] = useState(false)

  useEffect(() => {
    setExpandedIds([])
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

  const renderShell = (
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
              const isWip = item.id !== 'wallet'
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`wallet-page__menu-item ${isActive ? 'wallet-page__menu-item--active' : ''}`}
                  onClick={() => {
                    if (isWip) {
                      setWipNotice(true)
                      window.clearTimeout(window.__wallet_wip_timeout)
                      window.__wallet_wip_timeout = window.setTimeout(() => setWipNotice(false), 1600)
                      return
                    }
                    setActiveSide(item.id)
                  }}
                >
                  <Icon size={20} strokeWidth={2.1} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
      </aside>

      <main className="wallet-page__content">
        <AnimatePresence>
          {wipNotice ? (
            <motion.div
              key="wallet-skull"
              className="wallet-wip-banner wallet-wip-banner--center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <span role="img" aria-label="skull">💀</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {activeSide === 'wallet' ? (
          <>
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
          </>
        ) : (
          <section className="wallet-page__placeholder">
            <h2>{ACCOUNT_ITEMS.find((item) => item.id === activeSide)?.label}</h2>
            <p>This section is available in the wallet hub layout and can be connected to live data next.</p>
          </section>
        )}
      </main>
    </div>
  )

  return <div className="wallet-page">{renderShell}</div>
}
