/**
 * Minimalistic Mode preset configuration.
 * Update this file to add/remove/modify settings for the preset.
 */

export const MINIMALISTIC_MODE_PRESET = {
  themes: {
    tableThemeIndex: 6, // 7th theme
    cardDeck: 'fullColor',
    cardBack: 'retro',
    chipsId: 3, // Prime
  },
  gameSettings: {
    performanceModeReduceAnimations: true,
    showFoldedCards: true,
    windowHighlightAnimation: false,
    focusWindowOnTurn: false,
    showThrowablesOnHover: true,
    disableThrowablesEntirely: true,
    sortBySuit: true,
  },
  soundSettings: {
    personalisedOnlyInHand: true,
    volumeLevel: 0.5,
    allSoundsMasterToggle: false,
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

export const MINIMALISTIC_MODE_THEME_PREVIEWS = [
  { key: 'tableThemeIndex', title: 'Table Theme', subtitle: '7th theme (index 6)', kind: 'tableTheme' },
  { key: 'cardDeck', title: 'Card Deck', subtitle: 'Full Color', kind: 'cardDeck' },
  { key: 'cardBack', title: 'Card Back', subtitle: 'Retro', kind: 'cardBack' },
  { key: 'chipsId', title: 'Chips', subtitle: 'Prime (id: 3)', kind: 'chips' },
]

export const MINIMALISTIC_MODE_GAME_ITEMS = [
  { label: 'Performance Mode (Reduce Animations)', path: ['gameSettings', 'performanceModeReduceAnimations'] },
  { label: 'Show Folded Cards', path: ['gameSettings', 'showFoldedCards'] },
  { label: 'Window Highlight Animation', path: ['gameSettings', 'windowHighlightAnimation'] },
  { label: 'Focus Window on Turn', path: ['gameSettings', 'focusWindowOnTurn'] },
  { label: 'Show Throwables on Hover', path: ['gameSettings', 'showThrowablesOnHover'] },
  { label: 'Disable Throwables Entirely', path: ['gameSettings', 'disableThrowablesEntirely'] },
  { label: 'Sort by Suit', path: ['gameSettings', 'sortBySuit'] },
]

export const MINIMALISTIC_MODE_SOUND_ITEMS = [
  { label: 'Personalised for You (Only in Hand)', path: ['soundSettings', 'personalisedOnlyInHand'], type: 'toggle' },
  { label: 'Volume Level', path: ['soundSettings', 'volumeLevel'], type: 'number', suffix: '%' },
  { label: 'All Sounds (Master Toggle)', path: ['soundSettings', 'allSoundsMasterToggle'], type: 'toggle' },
  { label: 'Bet/Raise', path: ['soundSettings', 'sounds', 'betRaise'], type: 'toggle' },
  { label: 'Click', path: ['soundSettings', 'sounds', 'click'], type: 'toggle' },
  { label: 'Fold', path: ['soundSettings', 'sounds', 'fold'], type: 'toggle' },
  { label: 'Check', path: ['soundSettings', 'sounds', 'check'], type: 'toggle' },
  { label: 'Bet Slider', path: ['soundSettings', 'sounds', 'betSlider'], type: 'toggle' },
  { label: 'Card Dealing', path: ['soundSettings', 'sounds', 'cardDealing'], type: 'toggle' },
  { label: 'Community Cards', path: ['soundSettings', 'sounds', 'communityCards'], type: 'toggle' },
  { label: 'Flip Cards', path: ['soundSettings', 'sounds', 'flipCards'], type: 'toggle' },
  { label: 'Winnings', path: ['soundSettings', 'sounds', 'winnings'], type: 'toggle' },
  { label: 'Turn', path: ['soundSettings', 'sounds', 'turn'], type: 'toggle' },
  { label: 'Background Music', path: ['soundSettings', 'sounds', 'backgroundMusic'], type: 'toggle' },
  { label: 'Splash Drop', path: ['soundSettings', 'sounds', 'splashDrop'], type: 'toggle' },
  { label: 'Bomb Pot', path: ['soundSettings', 'sounds', 'bombPot'], type: 'toggle' },
  { label: 'All-in Showdown', path: ['soundSettings', 'sounds', 'allInShowdown'], type: 'toggle' },
  { label: 'Extra Time Activation', path: ['soundSettings', 'sounds', 'extraTimeActivation'], type: 'toggle' },
  { label: 'Dealer Voice', path: ['soundSettings', 'sounds', 'dealerVoice'], type: 'toggle' },
  { label: 'Drawing Dead', path: ['soundSettings', 'sounds', 'drawingDead'], type: 'toggle' },
  { label: 'Delight Winning', path: ['soundSettings', 'sounds', 'delightWinning'], type: 'toggle' },
  { label: 'Emoji Playing', path: ['soundSettings', 'sounds', 'emojiPlaying'], type: 'toggle' },
  { label: 'Blinds Up', path: ['soundSettings', 'sounds', 'blindsUp'], type: 'toggle' },
]

