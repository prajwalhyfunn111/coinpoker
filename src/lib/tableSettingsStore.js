const STORAGE_KEY = 'coinpoker.tableSettings.v1'
const CHANNEL_NAME = 'coinpoker-tableSettings'

export const DEFAULT_TABLE_SETTINGS = {
  themes: {
    tableThemeIndex: 0,
    cardDeck: 'fullColor',
    cardBack: 'retro',
    chipsId: 1,
  },
  gameSettings: {
    performanceModeReduceAnimations: false,
    showFoldedCards: false,
    windowHighlightAnimation: true,
    focusWindowOnTurn: false,
    showThrowablesOnHover: true,
    disableThrowablesEntirely: false,
    sortBySuit: false,
  },
  soundSettings: {
    personalisedOnlyInHand: true,
    volumeLevel: 0.5,
    allSoundsMasterToggle: true,
    sounds: {
      betRaise: true,
      click: false,
      fold: true,
      check: true,
      betSlider: false,
      cardDealing: false,
      communityCards: false,
      flipCards: false,
      winnings: false,
      turn: true,
      backgroundMusic: false,
      splashDrop: true,
      bombPot: true,
      allInShowdown: false,
      extraTimeActivation: true,
      dealerVoice: false,
      drawingDead: false,
      delightWinning: false,
      emojiPlaying: false,
      blindsUp: false,
    },
  },
}

function safeParseJson(v) {
  try {
    return JSON.parse(v)
  } catch {
    return null
  }
}

function mergeDeep(base, patch) {
  if (!patch || typeof patch !== 'object') return base
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const key of Object.keys(patch)) {
    const patchVal = patch[key]
    const baseVal = base ? base[key] : undefined
    if (
      patchVal &&
      typeof patchVal === 'object' &&
      !Array.isArray(patchVal) &&
      baseVal &&
      typeof baseVal === 'object' &&
      !Array.isArray(baseVal)
    ) {
      out[key] = mergeDeep(baseVal, patchVal)
    } else {
      out[key] = patchVal
    }
  }
  return out
}

export function loadTableSettings() {
  if (typeof window === 'undefined') return DEFAULT_TABLE_SETTINGS
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_TABLE_SETTINGS
  const parsed = safeParseJson(raw)
  if (!parsed) return DEFAULT_TABLE_SETTINGS
  return mergeDeep(DEFAULT_TABLE_SETTINGS, parsed)
}

export function setTableSettings(next) {
  if (typeof window === 'undefined') return
  const current = loadTableSettings()
  const merged = mergeDeep(current, next)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))

  if (typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel(CHANNEL_NAME)
    bc.postMessage({ type: 'update', key: STORAGE_KEY })
    bc.close()
  }

  // Fallback for older environments: storage event generally doesn't fire in same tab.
  window.dispatchEvent(new Event('coinpoker:tableSettingsUpdated'))
}

export function subscribeTableSettings(onUpdate) {
  if (typeof window === 'undefined') return () => {}

  const handler = () => onUpdate(loadTableSettings())
  const channelHandler = (e) => {
    if (!e || !e.data) return
    if (e.data.type === 'update') handler()
  }

  let bc = null
  if (typeof BroadcastChannel !== 'undefined') {
    bc = new BroadcastChannel(CHANNEL_NAME)
    bc.addEventListener('message', channelHandler)
  }

  const storageHandler = (e) => {
    if (e.key === STORAGE_KEY) handler()
  }

  window.addEventListener('storage', storageHandler)
  window.addEventListener('coinpoker:tableSettingsUpdated', handler)

  return () => {
    window.removeEventListener('storage', storageHandler)
    window.removeEventListener('coinpoker:tableSettingsUpdated', handler)
    if (bc) bc.close()
  }
}

