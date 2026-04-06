import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MessageSquare, Info, ShieldCheck, Settings as Gear } from 'lucide-react'
import './PokerTable.css'
import { useTableSettings } from '../lib/useTableSettings'

const FLOP = [
  { rank: 'A', suit: '♥' },
  { rank: 'K', suit: '♠' },
  { rank: '10', suit: '♦' },
]

const PLAYER_HAND = [
  { rank: 'A', suit: '♠' },
  { rank: 'Q', suit: '♠' },
]

const PLAYERS = [
  { id: 1, name: 'ApexPlayer', chips: '₮45,202', active: true, turn: true, pos: 'top' },
  { id: 2, name: 'PokerGosh', chips: '₮12,800', active: true, turn: false, pos: 'right' },
  { id: 3, name: 'BluffMaster', chips: '₮8,420', active: true, turn: false, pos: 'bottom-right' },
  { id: 4, name: 'You (baazigamesps)', chips: '₮0', active: true, turn: false, pos: 'bottom', isYou: true },
  { id: 5, name: 'Sharky', chips: '₮2,900', active: true, turn: false, pos: 'bottom-left' },
  { id: 6, name: 'TiltKing', chips: '₮5,100', active: true, turn: false, pos: 'left' },
]

const TABLE_THEME_OPTIONS = [
  { id: 0, preview: { felt: 'teal', rail: 'slate', room: 'indigo', shape: 'oval' } },
  { id: 1, preview: { felt: 'green', rail: 'shadow', room: 'charcoal', shape: 'oval' } },
  { id: 2, preview: { felt: 'crimson', rail: 'teal', room: 'burgundy', shape: 'oval' } },
  { id: 3, preview: { felt: 'violet', rail: 'graphite', room: 'charcoal', shape: 'oval' } },
  { id: 4, preview: { felt: 'blue', rail: 'blueSteel', room: 'navy', shape: 'octagon' } },
  { id: 5, preview: { felt: 'teal', rail: 'copper', room: 'amber', shape: 'oval' } },
  { id: 6, preview: { felt: 'teal', rail: 'slate', room: 'indigo', shape: 'oval' } },
]

const CHIP_OPTIONS = [
  { id: 1, preview: 'classic' },
  { id: 2, preview: 'gold' },
  { id: 3, preview: 'prime' },
  { id: 4, preview: 'neon' },
  { id: 5, preview: 'stone' },
]

const suitColorForDeck = (suit, deck) => {
  if (deck === 'mono') return '#050505'
  if (deck === 'vintage') {
    if (suit === '♣') return '#3e8b1d'
    if (suit === '♦' || suit === '♥') return '#3f6bf5'
    return '#050505'
  }
  return suit === '♦' || suit === '♥' ? '#cf292f' : '#050505'
}

export default function PokerTable() {
  const [settings] = useTableSettings()
  const reduceAnimations = Boolean(settings?.gameSettings?.performanceModeReduceAnimations)
  const showFoldedCards = Boolean(settings?.gameSettings?.showFoldedCards)
  const windowHighlightAnimation = Boolean(settings?.gameSettings?.windowHighlightAnimation)
  const focusWindowOnTurn = Boolean(settings?.gameSettings?.focusWindowOnTurn)
  const themeSettings = settings?.themes || {}
  const tableTheme = TABLE_THEME_OPTIONS.find((option) => option.id === themeSettings.tableThemeIndex) || TABLE_THEME_OPTIONS[0]
  const tablePreview = tableTheme.preview
  const deckStyle = themeSettings.cardDeck || 'fullColor'
  const cardBackStyle = themeSettings.cardBack || 'retro'
  const chipStyle = (CHIP_OPTIONS.find((option) => option.id === themeSettings.chipsId) || CHIP_OPTIONS[0]).preview
  const chipTones = chipStyle === 'gold'
    ? ['gold']
    : chipStyle === 'prime'
      ? ['slate', 'blue', 'gold']
      : chipStyle === 'stone'
        ? ['stone']
        : ['red', 'blue', 'gold', 'teal']
  const chipStar = chipStyle === 'neon'
  const roomClass = tablePreview.room ? `table-scene--${tablePreview.room}` : ''
  const railClass = tablePreview.rail ? `poker-table--rail-${tablePreview.rail}` : ''
  const feltClass = tablePreview.felt ? `poker-table__surface--felt-${tablePreview.felt}` : ''
  const shapeClass = tablePreview.shape === 'octagon' ? 'poker-table--octagon' : ''

  const [showCards, setShowCards] = useState(false)
  const [showFpsToast, setShowFpsToast] = useState(false)

  useEffect(() => {
    if (showFoldedCards) {
      setShowCards(true)
      return
    }

    setShowCards(false)
    const timer = setTimeout(() => setShowCards(true), reduceAnimations ? 0 : 800)
    return () => clearTimeout(timer)
  }, [showFoldedCards, reduceAnimations])

  useEffect(() => {
    const timer = window.setTimeout(() => setShowFpsToast(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  const activeTurnPlayer = PLAYERS.find((p) => p.turn)
  const focus = focusWindowOnTurn && Boolean(activeTurnPlayer)

  const exitTable = () => window.history.back()

  const goToZenMode = () => {
    sessionStorage.setItem('settings_zen', '1')
    setShowFpsToast(false)
    window.location.hash = '#/settings'
  }

  return (
    <div className="table-shell">
      <div className="table-modal">
        <div className={`table-scene ${focus ? 'table-scene--focus' : ''} ${roomClass}`}>
      {/* ── Top Bar ──────────────────────────── */}
      <header className="table-nav">
        <button onClick={exitTable} className="table-nav__btn"><ArrowLeft size={20} /></button>
        <div className="table-nav__info">
          <span className="table-nav__game">NL Hold'em – ₮10/₮20</span>
          <span className="table-nav__id">Table #402 – "Royal Flush"</span>
        </div>
        <div className="table-nav__actions">
          <button
            className="table-nav__btn table-nav__btn--gear"
            onClick={() => {
              window.location.hash = '#/settings'
            }}
            aria-label="Table settings"
            title="Table settings"
          >
            <Gear size={20} />
          </button>
          <button className="table-nav__btn"><ShieldCheck size={20} /> RNG Verified</button>
          <button className="table-nav__btn"><MessageSquare size={20} /></button>
          <button className="table-nav__btn"><Info size={20} /></button>
        </div>
      </header>

      {/* ── The Arena ────────────────────────── */}
      <main className="table-arena">
        <div className={`poker-table ${railClass} ${shapeClass}`}>
          <div className={`poker-table__surface ${feltClass} ${windowHighlightAnimation ? 'poker-table__surface--highlight' : ''}`}>
            <div className="poker-table__inner" />
            
            {/* ── Pot & Dealer ────────────────── */}
            <div className="table-center">
              {reduceAnimations ? (
                <div className="pot">
                  <div className="pot__label">POT</div>
                  <div className="pot__value">₮840</div>
                </div>
              ) : (
                <motion.div
                  className="pot"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="pot__label">POT</div>
                  <div className="pot__value">₮840</div>
                </motion.div>
              )}

              <div className="table-chips">
                {chipTones.map((tone, idx) => (
                  <div key={`${tone}-${idx}`} className={`table-chip table-chip--${tone} ${chipStar ? 'table-chip--star' : ''}`}>
                    <span className={`table-chip__center ${chipStar ? 'table-chip__center--star' : ''}`} />
                  </div>
                ))}
              </div>

              <div className="community-cards">
                <AnimatePresence>
                  {showCards &&
                    FLOP.map((card, i) =>
                      reduceAnimations ? (
                        <div key={i} className="poker-card">
                          <div className="poker-card__inner" style={{ color: suitColorForDeck(card.suit, deckStyle) }}>
                            <span className="poker-card__rank">{card.rank}</span>
                            <span className="poker-card__suit">{card.suit}</span>
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          key={i}
                          className="poker-card"
                          initial={{ y: -100, opacity: 0, rotateY: 90 }}
                          animate={{ y: 0, opacity: 1, rotateY: 0 }}
                          transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
                        >
                          <div className="poker-card__inner" style={{ color: suitColorForDeck(card.suit, deckStyle) }}>
                            <span className="poker-card__rank">{card.rank}</span>
                            <span className="poker-card__suit">{card.suit}</span>
                          </div>
                        </motion.div>
                      )
                    )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Players Around Table ────────── */}
            {PLAYERS.map(player => (
              <div key={player.id} className={`seat seat--${player.pos}`}>
                <div className={`player-avatar ${player.turn ? 'player-avatar--turn' : ''}`}>
                  <div className="player-avatar__img" />
                  {player.turn && <div className="player-avatar__timer" />}
                </div>
                {!player.isYou ? (
                  <div className="player-cards" aria-hidden="true">
                    <div className={`table-card-back table-card-back--${cardBackStyle}`} />
                    <div className={`table-card-back table-card-back--${cardBackStyle}`} />
                  </div>
                ) : null}
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-chips">{player.chips}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showFpsToast ? (
          <motion.div
            className="table-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="table-toast__title">Performance Notice</div>
            <p className="table-toast__copy">
              We detected lower frame rates on this table.{' '}
              <button type="button" className="table-toast__cta" onClick={goToZenMode}>
                Enable Zen Mode
              </button>
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Player Active Controls ────────────── */}
      <footer className="table-controls">
        <div className="table-controls__left">
          <div className="my-hand">
            {PLAYER_HAND.map((card, i) =>
              reduceAnimations ? (
                <div key={i} className="poker-card personal-card">
                  <div className="poker-card__inner" style={{ color: suitColorForDeck(card.suit, deckStyle) }}>
                    <span>{card.rank}</span>
                    <span>{card.suit}</span>
                  </div>
                </div>
              ) : (
                <motion.div
                  key={i}
                  className="poker-card personal-card"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.2 }}
                >
                  <div className="poker-card__inner" style={{ color: suitColorForDeck(card.suit, deckStyle) }}>
                    <span>{card.rank}</span>
                    <span>{card.suit}</span>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>

        <div className="table-controls__center">
          <button id="btn-fold" className="act-btn act-btn--fold">FOLD</button>
          <button id="btn-call" className="act-btn act-btn--call">CALL ₮20</button>
          <button id="btn-raise" className="act-btn act-btn--raise">RAISE ₮60+</button>
        </div>

        <div className="table-controls__right">
          <div className="bet-slider-mock">
            <div className="bet-slider-track">
              <div className="bet-slider-thumb" />
            </div>
            <div className="bet-options">
              <span>MIN</span><span>1/2</span><span>POT</span><span>MAX</span>
            </div>
          </div>
        </div>
      </footer>
        </div>
      </div>
    </div>
  )
}
