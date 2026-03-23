import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Showcase.css'

const TABS = [
  { id: 'upcoming', label: 'New & Upcoming' },
  { id: 'desktop',  label: 'NEW DESKTOP APP' },
  { id: 'cash',     label: 'CASH GAME FEATURES' },
  { id: 'intel',    label: 'POKERINTEL' },
]

const CONTENT = {
  intel: {
    title: 'Personal Poker Lab',
    desc: 'A modern poker toolkit featuring tagged hands and pre-flop charts for smarter gameplay',
    items: [
      { id: 1, title: 'Advanced Poker Analysis', desc: 'Take poker analysis to the next level with powerful new tools' },
      { id: 2, title: 'Smart Poker Insights', desc: 'Gather insights about your game with powerful new features' },
    ]
  },
  upcoming: {
    title: 'Upcoming Events',
    desc: 'Join our weekly tournaments and win big prizes from the global pool.',
    items: [
      { id: 3, title: 'WPM Qualifier', desc: 'Daily qualifiers for the World Poker Masters' },
    ]
  }
}

export default function Showcase() {
  const [active, setActive] = useState('intel')
  const data = CONTENT[active] || CONTENT.intel

  return (
    <section className="showcase">
      <div className="showcase__sidebar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`showcase__tab ${active === tab.id ? 'showcase__tab--active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
            {active === tab.id && <motion.div className="showcase__tab-glow" layoutId="tab-glow" />}
          </button>
        ))}
      </div>

      <div className="showcase__content">
        <div className="showcase__text">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {data.items.map(item => (
                <div key={item.id} className="showcase__item">
                  <h3 className="showcase__item-title">{item.title}</h3>
                  <p className="showcase__item-desc">{item.desc}</p>
                </div>
              ))}
              <div className="showcase__item showcase__item--active">
                <h3 className="showcase__item-title">{data.title}</h3>
                <p className="showcase__item-desc">{data.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="showcase__visual">
           {/* Modern 3D Mockup Space */}
           <div className="showcase__graphic">
              <div className="graphic__center">P</div>
              <div className="graphic__node graphic__node--1">Gameplay</div>
              <div className="graphic__node graphic__node--2">Strategy</div>
              <div className="graphic__node graphic__node--3">Hands</div>
              <div className="graphic__lines" />
           </div>
        </div>
      </div>
    </section>
  )
}
