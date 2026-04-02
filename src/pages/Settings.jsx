import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Topbar from '../components/Topbar/Topbar'
import { useTableSettings } from '../lib/useTableSettings'
import {
  MINIMALISTIC_MODE_GAME_ITEMS,
  MINIMALISTIC_MODE_PRESET,
  MINIMALISTIC_MODE_SOUND_ITEMS,
} from '../minimalistic-mode.const'
import './Settings.css'

const ZEN_GLITTER_PARTICLES = [
  { left: '8%', top: '12%', size: '10px', delay: '0s' },
  { left: '18%', top: '28%', size: '8px', delay: '0.08s' },
  { left: '27%', top: '18%', size: '14px', delay: '0.12s' },
  { left: '38%', top: '42%', size: '9px', delay: '0.2s' },
  { left: '49%', top: '14%', size: '12px', delay: '0.05s' },
  { left: '58%', top: '34%', size: '10px', delay: '0.18s' },
  { left: '68%', top: '20%', size: '16px', delay: '0.09s' },
  { left: '77%', top: '44%', size: '8px', delay: '0.22s' },
  { left: '86%', top: '16%', size: '12px', delay: '0.14s' },
  { left: '14%', top: '62%', size: '12px', delay: '0.1s' },
  { left: '31%', top: '74%', size: '9px', delay: '0.24s' },
  { left: '52%', top: '66%', size: '14px', delay: '0.06s' },
  { left: '71%', top: '72%', size: '10px', delay: '0.16s' },
  { left: '88%', top: '64%', size: '12px', delay: '0.26s' },
]

const THEME_CATEGORIES = [
  { kind: 'tableTheme', label: 'Tables' },
  { kind: 'cardDeck', label: 'Card Deck' },
  { kind: 'cardBack', label: 'Card Back' },
  { kind: 'chips', label: 'Chips' },
]

const TABLE_THEME_OPTIONS = [
  { id: 0, label: 'Emerald Glow', preview: { felt: 'teal', rail: 'slate', room: 'indigo', shape: 'oval' } },
  { id: 1, label: 'Neon Green', preview: { felt: 'green', rail: 'shadow', room: 'charcoal', shape: 'oval' } },
  { id: 2, label: 'Red Velvet', preview: { felt: 'crimson', rail: 'teal', room: 'burgundy', shape: 'oval' } },
  { id: 3, label: 'Royal Purple', preview: { felt: 'violet', rail: 'graphite', room: 'charcoal', shape: 'oval' } },
  { id: 4, label: 'Blue Ring', preview: { felt: 'blue', rail: 'blueSteel', room: 'navy', shape: 'octagon' } },
  { id: 5, label: 'Golden Hour', preview: { felt: 'teal', rail: 'copper', room: 'amber', shape: 'oval' } },
  { id: 6, label: 'Night Hall', preview: { felt: 'teal', rail: 'slate', room: 'indigo', shape: 'oval' } },
]

const CARD_DECK_OPTIONS = [
  { id: 'fullColor', label: 'Full Color', preview: 'fullColor' },
  { id: 'mono', label: 'Mono', preview: 'mono' },
  { id: 'vintage', label: 'Vintage', preview: 'vintage' },
]

const CARD_BACK_OPTIONS = [
  { id: 'retro', label: 'Retro', preview: 'retro' },
  { id: 'modern', label: 'Modern', preview: 'modern' },
  { id: 'classic', label: 'Classic', preview: 'classic' },
]

const CHIP_OPTIONS = [
  { id: 1, label: 'Classic', preview: 'classic' },
  { id: 2, label: 'Gold', preview: 'gold' },
  { id: 3, label: 'Prime', preview: 'prime' },
  { id: 4, label: 'Neon', preview: 'neon' },
  { id: 5, label: 'Stone', preview: 'stone' },
]

function SettingsSwitch({ checked, onChange, disabled }) {
  return (
    <label className="settings-switch" aria-label={checked ? 'On' : 'Off'}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="settings-switch__track" aria-hidden="true">
        <span className="settings-switch__thumb" />
      </span>
    </label>
  )
}

function getByPath(obj, path) {
  return path.reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

function setByPath(obj, path, value) {
  if (path.length === 0) return value
  const [head, ...rest] = path
  return {
    ...obj,
    [head]: rest.length === 0 ? value : setByPath(obj?.[head] || {}, rest, value),
  }
}

function createMinimalisticDraft() {
  return {
    themes: { ...MINIMALISTIC_MODE_PRESET.themes },
    gameSettings: { ...MINIMALISTIC_MODE_PRESET.gameSettings },
    soundSettings: {
      ...MINIMALISTIC_MODE_PRESET.soundSettings,
      sounds: { ...MINIMALISTIC_MODE_PRESET.soundSettings.sounds },
    },
  }
}

function SettingsToggleRow({ title, description, checked, onChange, disabled }) {
  const handleChange = disabled ? () => {} : onChange
  return (
    <div className="settings-row">
      <div className="settings-row__text">
        <div className="settings-row__title">{title}</div>
        {description ? <div className="settings-row__desc">{description}</div> : null}
      </div>
      <div className="settings-row__right">
        <SettingsSwitch checked={checked} onChange={handleChange} disabled={disabled} />
      </div>
    </div>
  )
}

function VolumeSlider({ value, onChange, disabled }) {
  const pct = Math.round((value || 0) * 100)

  return (
    <div className="settings-row settings-row--volume">
      <div className="settings-row__text">
        <div className="settings-row__title">Volume Level</div>
      </div>
      <div className="settings-row__right settings-row__right--volume">
        <div className="settings-row__value">{pct}%</div>
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          className="settings-range"
          aria-label="Volume level"
        />
      </div>
    </div>
  )
}

function ThemeCheckBadge() {
  return (
    <span className="settings-theme-choice__check" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function ThemeLogoMark() {
  return (
    <div className="settings-theme-logo" aria-hidden="true">
      <span className="settings-theme-logo__icon">
        <span />
      </span>
      <span className="settings-theme-logo__text">CoinPoker</span>
    </div>
  )
}

function ThemeTableScene({ tablePreview, children }) {
  const railClass = tablePreview?.rail ? `settings-theme-scene__table--${tablePreview.rail}` : ''
  const feltClass = tablePreview?.felt ? `settings-theme-scene__felt--${tablePreview.felt}` : ''
  const roomClass = tablePreview?.room ? `settings-theme-scene--${tablePreview.room}` : ''
  const shapeClass = tablePreview?.shape === 'octagon' ? 'settings-theme-scene__table--octagon' : ''

  return (
    <div className={`settings-theme-scene ${roomClass}`}>
      <div className="settings-theme-scene__room" />
      <div className={`settings-theme-scene__table ${railClass} ${shapeClass}`}>
        <div className={`settings-theme-scene__felt ${feltClass}`}>
          <div className="settings-theme-scene__glow settings-theme-scene__glow--top-left" />
          <div className="settings-theme-scene__glow settings-theme-scene__glow--top-right" />
          <div className="settings-theme-scene__glow settings-theme-scene__glow--bottom-left" />
          <div className="settings-theme-scene__glow settings-theme-scene__glow--bottom-right" />
          {children}
        </div>
      </div>
    </div>
  )
}

function PreviewCard({ rank, suit, tone }) {
  return (
    <div className={`settings-preview-card settings-preview-card--${tone}`}>
      <span className="settings-preview-card__rank">{rank}</span>
      <span className="settings-preview-card__suit">{suit}</span>
      <span className="settings-preview-card__art" />
    </div>
  )
}

function CardBackCard({ variant }) {
  return <div className={`settings-card-back settings-card-back--${variant}`} />
}

function ChipPreview({ tone, star }) {
  return (
    <div className={`settings-preview-chip settings-preview-chip--${tone}`}>
      <span className={`settings-preview-chip__center ${star ? 'settings-preview-chip__center--star' : ''}`} />
    </div>
  )
}

function ThemeMainPreview({ category, selectedOption }) {
  const fallbackTable = TABLE_THEME_OPTIONS[0].preview
  const tablePreview = category === 'tableTheme' ? selectedOption.preview : fallbackTable

  return (
    <div className="settings-theme-browser__hero">
      <ThemeTableScene tablePreview={tablePreview}>
        {category === 'tableTheme' ? <ThemeLogoMark /> : null}

        {category === 'cardDeck' ? (
          <div className="settings-theme-cards settings-theme-cards--hero">
            {selectedOption.preview === 'mono' ? (
              <>
                <PreviewCard rank="A" suit="♣" tone="mono" />
                <PreviewCard rank="K" suit="♦" tone="mono" />
                <PreviewCard rank="Q" suit="♠" tone="mono" />
                <PreviewCard rank="J" suit="♥" tone="mono" />
                <PreviewCard rank="10" suit="♥" tone="mono" />
              </>
            ) : selectedOption.preview === 'vintage' ? (
              <>
                <PreviewCard rank="A" suit="♣" tone="vintage-club" />
                <PreviewCard rank="K" suit="♦" tone="vintage-diamond" />
                <PreviewCard rank="Q" suit="♠" tone="vintage-spade" />
                <PreviewCard rank="J" suit="♥" tone="vintage-heart" />
                <PreviewCard rank="10" suit="♥" tone="vintage-heart" />
              </>
            ) : (
              <>
                <PreviewCard rank="A" suit="♣" tone="classic-club" />
                <PreviewCard rank="K" suit="♦" tone="classic-diamond" />
                <PreviewCard rank="Q" suit="♠" tone="classic-spade" />
                <PreviewCard rank="J" suit="♥" tone="classic-heart" />
                <PreviewCard rank="10" suit="♥" tone="classic-heart" />
              </>
            )}
          </div>
        ) : null}

        {category === 'cardBack' ? (
          <div className="settings-theme-card-backs settings-theme-card-backs--hero">
            {Array.from({ length: 5 }).map((_, idx) => (
              <CardBackCard key={idx} variant={selectedOption.preview} />
            ))}
          </div>
        ) : null}

        {category === 'chips' ? (
          <div className="settings-theme-chip-stage">
            <div className="settings-theme-chip-stage__stacks">
              {['red', 'blue', 'gold', 'teal', 'slate', 'bronze'].map((tone) => (
                <div className="settings-theme-chip-stage__stack" key={tone}>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <ChipPreview key={idx} tone={selectedOption.preview === 'stone' ? 'stone' : tone} star={selectedOption.preview === 'neon'} />
                  ))}
                </div>
              ))}
            </div>
            <div className="settings-theme-chip-stage__row">
              {['red', 'blue', 'gold', 'teal', 'slate', 'bronze'].map((tone) => (
                <ChipPreview key={tone} tone={selectedOption.preview === 'stone' ? 'stone' : tone} star={selectedOption.preview === 'neon'} />
              ))}
            </div>
          </div>
        ) : null}
      </ThemeTableScene>
    </div>
  )
}

function ThemeThumbnailContent({ category, option }) {
  if (category === 'tableTheme') {
    return <ThemeLogoMark />
  }

  if (category === 'cardDeck') {
    return option.preview === 'mono' ? (
      <div className="settings-theme-cards settings-theme-cards--thumb">
        <PreviewCard rank="A" suit="♣" tone="mono" />
        <PreviewCard rank="K" suit="♦" tone="mono" />
      </div>
    ) : option.preview === 'vintage' ? (
      <div className="settings-theme-cards settings-theme-cards--thumb">
        <PreviewCard rank="A" suit="♣" tone="vintage-club" />
        <PreviewCard rank="K" suit="♦" tone="vintage-diamond" />
      </div>
    ) : (
      <div className="settings-theme-cards settings-theme-cards--thumb">
        <PreviewCard rank="A" suit="♣" tone="classic-club" />
        <PreviewCard rank="K" suit="♦" tone="classic-diamond" />
      </div>
    )
  }

  if (category === 'cardBack') {
    return (
      <div className="settings-theme-card-backs settings-theme-card-backs--thumb">
        <CardBackCard variant={option.preview} />
        <CardBackCard variant={option.preview} />
      </div>
    )
  }

  const chipTones = option.preview === 'stone' ? Array.from({ length: 6 }).map(() => 'stone') : ['red', 'blue', 'gold', 'teal', 'slate', 'bronze']

  return (
    <div className="settings-theme-chip-stage settings-theme-chip-stage--thumb">
      <div className="settings-theme-chip-stage__row">
        {chipTones.map((tone, idx) => (
          <ChipPreview key={`${tone}-${idx}`} tone={tone} star={option.preview === 'neon'} />
        ))}
      </div>
    </div>
  )
}

function ThemeChoicePreview({ category, option, tablePreview }) {
  return (
    <div className="settings-theme-choice__table-card">
      <div className="settings-theme-choice__table-preview">
        <ThemeTableScene tablePreview={category === 'tableTheme' ? option.preview : tablePreview}>
          {category === 'tableTheme' ? <ThemeLogoMark /> : <ThemeThumbnailContent category={category} option={option} />}
        </ThemeTableScene>
      </div>
      <span className="settings-theme-choice__label">{option.label}</span>
    </div>
  )
}

function ThemeBrowser({ category, selectedValue, tablePreview, disabled, onSelect }) {
  const options =
    category === 'tableTheme'
      ? TABLE_THEME_OPTIONS
      : category === 'cardDeck'
        ? CARD_DECK_OPTIONS
        : category === 'cardBack'
          ? CARD_BACK_OPTIONS
          : CHIP_OPTIONS

  return (
    <div className="settings-theme-browser">
      <div
        className="settings-theme-browser__rail"
        role="list"
        aria-label={`${category} options`}
      >
        {options.map((option) => {
          const isActive = option.id === selectedValue
          return (
            <button
              key={option.id}
              type="button"
              disabled={Boolean(disabled)}
              className={`settings-theme-choice ${isActive ? 'settings-theme-choice--active' : ''}`}
              onClick={() => onSelect && onSelect(option.id)}
              aria-pressed={isActive}
              aria-label={option.label}
            >
              <ThemeChoicePreview category={category} option={option} tablePreview={tablePreview} />
              {isActive ? <ThemeCheckBadge /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Settings() {
  const location = useLocation()
  const [activeNav, setActiveNav] = useState('game')
  const [minimalisticConfirmOpen, setMinimalisticConfirmOpen] = useState(false)
  const [isZenLaunching, setIsZenLaunching] = useState(false)
  const [isApplyingZen, setIsApplyingZen] = useState(false)
  const [zenAppliedVisible, setZenAppliedVisible] = useState(false)
  const [settings, actions] = useTableSettings()

  const { themes, gameSettings, soundSettings } = settings

  useEffect(() => {
    if (!minimalisticConfirmOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMinimalisticConfirmOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [minimalisticConfirmOpen])

  const [modalThemeCategory, setModalThemeCategory] = useState('tableTheme')
  const [modalAccordionOpen, setModalAccordionOpen] = useState(null)
  const [mainAccordionOpen, setMainAccordionOpen] = useState(null)
  const [modalSettingsDraft, setModalSettingsDraft] = useState(() => createMinimalisticDraft())

  useEffect(() => {
    if (minimalisticConfirmOpen) setModalThemeCategory('tableTheme')
  }, [minimalisticConfirmOpen])

  useEffect(() => {
    if (minimalisticConfirmOpen) setModalSettingsDraft(createMinimalisticDraft())
  }, [minimalisticConfirmOpen])

  useEffect(() => {
    if (!minimalisticConfirmOpen) setIsApplyingZen(false)
  }, [minimalisticConfirmOpen])

  useEffect(() => {
    if (activeNav === 'game' || activeNav === 'sounds') {
      setMainAccordionOpen(activeNav)
    }
  }, [activeNav])

  useEffect(() => {
    if (!location?.state?.nav) return
    setActiveNav(location.state.nav)
    setMinimalisticConfirmOpen(false)
  }, [location?.state?.nav])

  useEffect(() => {
    const storedNav = sessionStorage.getItem('settings_nav')
    if (!storedNav) return
    setActiveNav(storedNav)
    setMinimalisticConfirmOpen(false)
    sessionStorage.removeItem('settings_nav')
  }, [])

  useEffect(() => {
    const openZen = sessionStorage.getItem('settings_zen')
    if (!openZen) return
    setActiveNav('game')
    setMinimalisticConfirmOpen(true)
    sessionStorage.removeItem('settings_zen')
  }, [])

  const handleOpenZenMode = () => {
    if (isZenLaunching || minimalisticConfirmOpen) return
    setIsZenLaunching(true)
    window.setTimeout(() => {
      setMinimalisticConfirmOpen(true)
      setIsZenLaunching(false)
    }, 420)
  }

  const handleApplyMinimalistic = () => {
    if (isApplyingZen) return
    setIsApplyingZen(true)
    window.setTimeout(() => {
      actions.setTableSettings(modalSettingsDraft)
      setMinimalisticConfirmOpen(false)
      setIsApplyingZen(false)
      setZenAppliedVisible(true)
      window.setTimeout(() => {
        setZenAppliedVisible(false)
        window.location.hash = '#/table'
      }, 700)
    }, 280)
  }

  const navItems = [
    { id: 'themes', label: 'Themes' },
    { id: 'game', label: 'Game Settings' },
    { id: 'sounds', label: 'Sounds' },
  ]

  const SETTINGS_READ_ONLY = true

  const modalThemeValues = modalSettingsDraft.themes

  const renderThemeBrowser = (category, values, onSelect, disabled = false) => (
    <ThemeBrowser
      category={category}
      selectedValue={
        category === 'tableTheme'
          ? values.tableThemeIndex
          : category === 'cardDeck'
            ? values.cardDeck
            : category === 'cardBack'
              ? values.cardBack
              : values.chipsId
      }
      tablePreview={TABLE_THEME_OPTIONS.find((option) => option.id === values.tableThemeIndex)?.preview || TABLE_THEME_OPTIONS[0].preview}
      disabled={Boolean(disabled)}
      onSelect={disabled ? undefined : onSelect}
    />
  )

  const ModalAccordionSection = ({ title, sectionKey, children }) => {
    const isOpen = modalAccordionOpen === sectionKey
    return (
      <div className="settings-modal__section settings-modal__section--accordion">
        <button
          type="button"
          className="settings-modal__accordion-header"
          aria-expanded={isOpen}
          onClick={() => setModalAccordionOpen((current) => (current === sectionKey ? null : sectionKey))}
        >
          <span className="settings-modal__accordion-title">{title}</span>
          <motion.span
            className="settings-modal__accordion-chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence initial={false} mode="wait">
          {isOpen ? (
            <motion.div
              key={sectionKey}
              className="settings-modal__accordion-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }

  const PageAccordionSection = ({ title, eyebrow, sectionKey, children, lockedOpen = false }) => {
    const isOpen = lockedOpen || mainAccordionOpen === sectionKey
    return (
      <div className={`settings-page-accordion ${isOpen ? 'settings-page-accordion--open' : ''}`}>
        <button
          type="button"
          className="settings-page-accordion__header"
          aria-expanded={isOpen}
          onClick={() => {
            if (lockedOpen) return
            setMainAccordionOpen((current) => (current === sectionKey ? null : sectionKey))
          }}
        >
          <div className="settings-page-accordion__copy">
            {eyebrow ? <div className="settings-page-accordion__eyebrow">{eyebrow}</div> : null}
            <div className="settings-page-accordion__title">{title}</div>
          </div>
          <motion.span
            className="settings-page-accordion__chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              className="settings-page-accordion__content"
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="settings-page-accordion__inner">
                {children}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <AnimatePresence>
        {isZenLaunching ? (
          <motion.div
            className="settings-zen-launch"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="settings-zen-launch__veil" />
            <div className="settings-zen-launch__halo" />
            {ZEN_GLITTER_PARTICLES.map((particle, index) => (
              <span
                key={`${particle.left}-${particle.top}-${index}`}
                className="settings-zen-launch__sparkle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {zenAppliedVisible ? (
          <motion.div
            className="settings-zen-applied-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="settings-zen-applied-overlay__bg" />
            <motion.div
              className="settings-zen-applied-overlay__content"
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <motion.div
                className="settings-zen-applied-overlay__icon"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </motion.div>
              <div className="settings-zen-applied-overlay__text">Zen Mode Applied</div>
              <div className="settings-zen-applied-overlay__sub">Your focused preset is now active</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Topbar />

      <div className="settings-page__container">
        <aside className="settings-page__sidebar">
          <div className="settings-page__sidebar-title">Settings</div>

          <nav className="settings-page__nav" aria-label="Settings navigation">
            {navItems.map((item) => {
              const isActive = !minimalisticConfirmOpen && item.id === activeNav
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`settings-page__nav-item ${isActive ? 'settings-page__nav-item--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    setActiveNav(item.id)
                    setMinimalisticConfirmOpen(false)
                  }}
                >
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="settings-page__sidebar-bottom">
            <motion.button
              type="button"
              className={`settings-minimal-btn ${isZenLaunching ? 'settings-minimal-btn--launching' : ''}`}
              onClick={handleOpenZenMode}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              animate={
                isZenLaunching
                  ? {
                      scale: [1, 1.02, 0.995, 1],
                      boxShadow: [
                        '0 18px 34px rgba(74, 144, 255, 0.14)',
                        '0 24px 52px rgba(122, 96, 255, 0.34)',
                        '0 18px 34px rgba(74, 144, 255, 0.18)',
                      ],
                    }
                  : {
                      scale: 1,
                      boxShadow: '0 18px 34px rgba(74, 144, 255, 0.14)',
                    }
              }
              transition={{ duration: 0.36, ease: 'easeOut' }}
            >
              <span className="settings-minimal-btn__glow" aria-hidden="true" />
              <span className="settings-minimal-btn__copy">
                <span className="settings-minimal-btn__label">{isZenLaunching ? 'Entering Zen...' : 'Zen Mode'}</span>
                <span className="settings-minimal-btn__meta">Focused preset</span>
              </span>
              <motion.span
                className="settings-minimal-btn__icon"
                aria-hidden="true"
                animate={isZenLaunching ? { x: [0, 6, 0], rotate: [0, 14, 0] } : { x: 0, rotate: 0 }}
                transition={{ duration: 0.34, ease: 'easeOut' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3c-1.6 2.4-4.1 4.6-7.3 6.6 1.1 4 3.5 7.4 7.3 10.1 3.8-2.7 6.2-6.1 7.3-10.1C16.1 7.6 13.6 5.4 12 3Z" />
                </svg>
              </motion.span>
              <span className="settings-minimal-btn__shimmer" aria-hidden="true" />
              <span className="settings-minimal-btn__pulse" aria-hidden="true" />
            </motion.button>
          </div>
        </aside>

        <main className="settings-page__main">
          <div className="settings-page__panel settings-page__panel--scroll">
            {minimalisticConfirmOpen ? (
              <div className="settings-zen-panel settings-modal" role="region" aria-label="Zen Mode settings">
                <button
                  className="settings-modal__close"
                  aria-label="Close Zen Mode"
                  onClick={() => setMinimalisticConfirmOpen(false)}
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 6l12 12" />
                    <path d="M18 6l-12 12" />
                  </svg>
                </button>

                <div className="settings-modal__header">
                  <div className="settings-modal__title">Zen Mode</div>
                  <div className="settings-modal__subtitle">Calm, refined table experience with focused controls.</div>
                </div>

                <div className="settings-modal__body">
                  <div className="settings-modal__theme-previews">
                    <div className="settings-zen-grid">
                      {THEME_CATEGORIES.map((category) => {
                        const selectedOption =
                          category.kind === 'tableTheme'
                            ? TABLE_THEME_OPTIONS.find((o) => o.id === modalThemeValues.tableThemeIndex) || TABLE_THEME_OPTIONS[0]
                            : category.kind === 'cardDeck'
                              ? CARD_DECK_OPTIONS.find((o) => o.id === modalThemeValues.cardDeck) || CARD_DECK_OPTIONS[0]
                              : category.kind === 'cardBack'
                                ? CARD_BACK_OPTIONS.find((o) => o.id === modalThemeValues.cardBack) || CARD_BACK_OPTIONS[0]
                                : CHIP_OPTIONS.find((o) => o.id === modalThemeValues.chipsId) || CHIP_OPTIONS[0];

                        return (
                          <div key={category.kind} className="settings-zen-grid__cell">
                            <div className="settings-zen-grid__label">{category.label}</div>
                            <ThemeMainPreview category={category.kind} selectedOption={selectedOption} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="settings-modal__scroll">
                    <ModalAccordionSection title="Game Settings" sectionKey="game">
                      {MINIMALISTIC_MODE_GAME_ITEMS.map((item) => {
                        const on = Boolean(getByPath(modalSettingsDraft, item.path))
                        return (
                          <div className="settings-modal__item" key={item.label}>
                            <div className="settings-modal__item-label">{item.label}</div>
                            <SettingsSwitch
                              checked={on}
                              disabled={true}
                              onChange={() => {}}
                            />
                          </div>
                        )
                      })}
                    </ModalAccordionSection>

                    <ModalAccordionSection title="Sound Settings" sectionKey="sound">
                      {MINIMALISTIC_MODE_SOUND_ITEMS.map((item) => {
                        const value = getByPath(modalSettingsDraft, item.path)
                        if (item.type === 'toggle') {
                          const on = Boolean(value)
                          return (
                            <div className="settings-modal__item" key={item.label}>
                              <div className="settings-modal__item-label">{item.label}</div>
                              <SettingsSwitch
                                checked={on}
                                disabled={true}
                                onChange={() => {}}
                              />
                            </div>
                          )
                        }

                        return (
                          <div className="settings-modal__item settings-modal__item--number" key={item.label}>
                            <div className="settings-modal__item-label">{item.label}</div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={Math.round((Number(value) || 0) * 100)}
                              disabled={true}
                              onChange={() => {}}
                              className="settings-range"
                              aria-label={item.label}
                            />
                          </div>
                        )
                      })}
                    </ModalAccordionSection>
                  </div>
                </div>

                <div className="settings-modal__footer">
                  <motion.button
                    type="button"
                    className={`settings-modal__apply ${isApplyingZen ? 'settings-modal__apply--applying' : ''}`}
                    onClick={handleApplyMinimalistic}
                    whileTap={{ scale: 0.97 }}
                    animate={isApplyingZen ? { scale: [1, 1.04, 1], boxShadow: ['0 18px 38px rgba(78,110,255,0.28)', '0 24px 56px rgba(133,85,255,0.36)', '0 18px 38px rgba(78,110,255,0.28)'] } : { scale: 1 }}
                    transition={{ duration: 0.28 }}
                  >
                    <span className="settings-modal__apply-label">{isApplyingZen ? 'Applying...' : 'Apply'}</span>
                    <motion.span
                      className="settings-modal__apply-arrow"
                      aria-hidden="true"
                      animate={isApplyingZen ? { x: [0, 8, 0], opacity: [0.75, 1, 0.9] } : { x: 0, opacity: 0.9 }}
                      transition={isApplyingZen ? { duration: 0.45, repeat: 1 } : { duration: 0.18 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="m8.5 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
                {activeNav === 'themes' ? (
                  <>
                    <div className="settings-theme-gallery">
                      {THEME_CATEGORIES.map((category) => (
                        <div key={category.kind} className="settings-theme-gallery__section">
                          <div className="settings-theme-category__label settings-theme-category__label--static">
                            {category.label}
                          </div>
                          {renderThemeBrowser(category.kind, themes, null, true)}
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}

                {activeNav === 'game' ? (
                  <PageAccordionSection
                    title="Game Settings"
                    eyebrow="Table Behavior"
                    sectionKey="game"
                  >
                    <SettingsToggleRow
                      title="Performance Mode (Reduce Animations)"
                      checked={gameSettings.performanceModeReduceAnimations}
                      onChange={(v) => actions.setTableSettings({ gameSettings: { performanceModeReduceAnimations: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />
                    <SettingsToggleRow
                      title="Show Folded Cards"
                      checked={gameSettings.showFoldedCards}
                      onChange={(v) => actions.setTableSettings({ gameSettings: { showFoldedCards: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />
                    <SettingsToggleRow
                      title="Window Highlight Animation"
                      checked={gameSettings.windowHighlightAnimation}
                      onChange={(v) => actions.setTableSettings({ gameSettings: { windowHighlightAnimation: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />
                    <SettingsToggleRow
                      title="Focus Window on Turn"
                      checked={gameSettings.focusWindowOnTurn}
                      onChange={(v) => actions.setTableSettings({ gameSettings: { focusWindowOnTurn: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />
                    <SettingsToggleRow
                      title="Show Throwables on Hover"
                      checked={gameSettings.showThrowablesOnHover}
                      onChange={(v) => actions.setTableSettings({ gameSettings: { showThrowablesOnHover: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />
                    <SettingsToggleRow
                      title="Disable Throwables Entirely"
                      checked={gameSettings.disableThrowablesEntirely}
                      onChange={(v) => actions.setTableSettings({ gameSettings: { disableThrowablesEntirely: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />
                    <SettingsToggleRow
                      title="Sort by Suit"
                      checked={gameSettings.sortBySuit}
                      onChange={(v) => actions.setTableSettings({ gameSettings: { sortBySuit: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />
                  </PageAccordionSection>
                ) : null}

                {activeNav === 'sounds' ? (
                  <PageAccordionSection
                    title="Sound Settings"
                    eyebrow="Audio Experience"
                    sectionKey="sounds"
                  >
                    <SettingsToggleRow
                      title="Personalised for You (Only in Hand)"
                      checked={soundSettings.personalisedOnlyInHand}
                      onChange={(v) => actions.setTableSettings({ soundSettings: { personalisedOnlyInHand: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />

                    <VolumeSlider
                      value={soundSettings.volumeLevel}
                      disabled={SETTINGS_READ_ONLY || !soundSettings.allSoundsMasterToggle}
                      onChange={(v) => actions.setTableSettings({ soundSettings: { volumeLevel: v } })}
                    />

                    <SettingsToggleRow
                      title="All Sounds (Master Toggle)"
                      checked={soundSettings.allSoundsMasterToggle}
                      onChange={(v) => actions.setTableSettings({ soundSettings: { allSoundsMasterToggle: v } })}
                      disabled={SETTINGS_READ_ONLY}
                    />

                    {[
                      { key: 'betRaise', label: 'Bet/Raise' },
                      { key: 'click', label: 'Click' },
                      { key: 'fold', label: 'Fold' },
                      { key: 'check', label: 'Check' },
                      { key: 'betSlider', label: 'Bet Slider' },
                      { key: 'cardDealing', label: 'Card Dealing' },
                      { key: 'communityCards', label: 'Community Cards' },
                      { key: 'flipCards', label: 'Flip Cards' },
                      { key: 'winnings', label: 'Winnings' },
                      { key: 'turn', label: 'Turn' },
                      { key: 'backgroundMusic', label: 'Background Music' },
                      { key: 'splashDrop', label: 'Splash Drop' },
                      { key: 'bombPot', label: 'Bomb Pot' },
                      { key: 'allInShowdown', label: 'All-in Showdown' },
                      { key: 'extraTimeActivation', label: 'Extra Time Activation' },
                      { key: 'dealerVoice', label: 'Dealer Voice' },
                      { key: 'drawingDead', label: 'Drawing Dead' },
                      { key: 'delightWinning', label: 'Delight Winning' },
                      { key: 'emojiPlaying', label: 'Emoji Playing' },
                      { key: 'blindsUp', label: 'Blinds Up' },
                    ].map((item) => (
                      <SettingsToggleRow
                        key={item.key}
                        title={item.label}
                        checked={Boolean(soundSettings.sounds?.[item.key])}
                        onChange={(v) => actions.setTableSettings({ soundSettings: { sounds: { [item.key]: v } } })}
                        disabled={SETTINGS_READ_ONLY}
                      />
                    ))}
                  </PageAccordionSection>
                ) : null}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
