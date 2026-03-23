import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MessageSquare, Info, ShieldCheck } from 'lucide-react'
import './PokerTable.css'
import { useTableSettings } from '../lib/useTableSettings'

const FLOP = [
  { rank: 'A', suit: '♥', color: '#e8192c' },
  { rank: 'K', suit: '♠', color: '#fff' },
  { rank: '10', suit: '♦', color: '#e8192c' },
]

const PLAYER_HAND = [
  { rank: 'A', suit: '♠', color: '#fff' },
  { rank: 'Q', suit: '♠', color: '#fff' },
]

const PLAYERS = [
  { id: 1, name: 'ApexPlayer', chips: '₮45,202', active: true, turn: true, pos: 'top' },
  { id: 2, name: 'PokerGosh', chips: '₮12,800', active: true, turn: false, pos: 'right' },
  { id: 3, name: 'BluffMaster', chips: '₮8,420', active: true, turn: false, pos: 'bottom-right' },
  { id: 4, name: 'You (baazigamesps)', chips: '₮0', active: true, turn: false, pos: 'bottom' },
  { id: 5, name: 'Sharky', chips: '₮2,900', active: true, turn: false, pos: 'bottom-left' },
  { id: 6, name: 'TiltKing', chips: '₮5,100', active: true, turn: false, pos: 'left' },
]

export default function PokerTable() {
  const [settings] = useTableSettings()
  const reduceAnimations = Boolean(settings?.gameSettings?.performanceModeReduceAnimations)
  const showFoldedCards = Boolean(settings?.gameSettings?.showFoldedCards)
  const windowHighlightAnimation = Boolean(settings?.gameSettings?.windowHighlightAnimation)
  const focusWindowOnTurn = Boolean(settings?.gameSettings?.focusWindowOnTurn)

  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    if (showFoldedCards) {
      setShowCards(true)
      return
    }

    setShowCards(false)
    const timer = setTimeout(() => setShowCards(true), reduceAnimations ? 0 : 800)
    return () => clearTimeout(timer)
  }, [showFoldedCards, reduceAnimations])

  const activeTurnPlayer = PLAYERS.find((p) => p.turn)
  const focus = focusWindowOnTurn && Boolean(activeTurnPlayer)

  const exitTable = () => window.history.back()

  return (
    <div className={`table-scene ${focus ? 'table-scene--focus' : ''}`}>
      {/* ── Top Bar ──────────────────────────── */}
      <header className="table-nav">
        <button onClick={exitTable} className="table-nav__btn"><ArrowLeft size={20} /></button>
        <div className="table-nav__info">
          <span className="table-nav__game">NL Hold'em – ₮10/₮20</span>
          <span className="table-nav__id">Table #402 – "Royal Flush"</span>
        </div>
        <div className="table-nav__actions">
          <button className="table-nav__btn"><ShieldCheck size={20} /> RNG Verified</button>
          <button className="table-nav__btn"><MessageSquare size={20} /></button>
          <button className="table-nav__btn"><Info size={20} /></button>
        </div>
      </header>

      {/* ── The Arena ────────────────────────── */}
      <main className="table-arena">
        <div className="poker-table">
          <div className={`poker-table__surface ${windowHighlightAnimation ? 'poker-table__surface--highlight' : ''}`}>
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

              <div className="community-cards">
                <AnimatePresence>
                  {showCards &&
                    FLOP.map((card, i) =>
                      reduceAnimations ? (
                        <div key={i} className="poker-card">
                          <div className="poker-card__inner" style={{ color: card.color }}>
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
                          <div className="poker-card__inner" style={{ color: card.color }}>
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
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-chips">{player.chips}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Player Active Controls ────────────── */}
      <footer className="table-controls">
        <div className="table-controls__left">
          <div className="my-hand">
            {PLAYER_HAND.map((card, i) =>
              reduceAnimations ? (
                <div key={i} className="poker-card personal-card">
                  <div className="poker-card__inner" style={{ color: card.color }}>
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
                  <div className="poker-card__inner" style={{ color: card.color }}>
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
  )
}
