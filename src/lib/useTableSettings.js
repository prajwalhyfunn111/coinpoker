import { useEffect, useState } from 'react'
import { loadTableSettings, subscribeTableSettings, setTableSettings } from './tableSettingsStore'

export function useTableSettings() {
  const [settings, setSettingsState] = useState(() => loadTableSettings())

  useEffect(() => {
    return subscribeTableSettings((next) => {
      setSettingsState(next)
    })
  }, [])

  const setSettings = (nextOrUpdater) => {
    if (typeof nextOrUpdater === 'function') {
      const next = nextOrUpdater(settings)
      setTableSettings(next)
    } else {
      setTableSettings(nextOrUpdater)
    }
  }

  return [settings, { setSettings, setTableSettings }]
}

