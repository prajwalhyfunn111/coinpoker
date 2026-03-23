import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './HeroBanner.css'

const SLIDES = [
  {
    id: 0,
    tag:     'LIMITED OFFER',
    title1:  'LEVEL UP WITH',
    title2:  '100%',
    title3:  'RAKEBACK',
    subtitle:'MARCH 2nd–31st',
    bg:      'linear-gradient(135deg, #1a0005 0%, #3d0010 40%, #0a0a0f 100%)',
    cta:     'Claim Now',
    accent:  '#e8192c',
  },
  {
    id: 1,
    tag:     'EXCLUSIVE EVENT',
    title1:  'COINMASTERS',
    title2:  '$250,000',
    title3:  'PRIZE POOL',
    subtitle:'Registration Open',
    bg:      'linear-gradient(135deg, #0a0a00 0%, #2a1a00 40%, #0a0a0f 100%)',
    cta:     'Register Now',
    accent:  '#f5c142',
  },
  {
    id: 2,
    tag:     'PLAY ANYTIME',
    title1:  'FREEROLL',
    title2:  'EVERY',
    title3:  'WEEKEND',
    subtitle:'No buy-in required',
    bg:      'linear-gradient(135deg, #000d1a 0%, #00203d 40%, #0a0a0f 100%)',
    cta:     'Join Freeroll',
    accent:  '#00c48c',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[current]

  return (
    <div className="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="hero__slide"
          style={{ background: slide.bg }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
        >
          {/* Decorative cards */}
          <div className="hero__cards" aria-hidden="true">
            <div className="hero__card hero__card--1" style={{ borderColor: slide.accent }}>🂱</div>
            <div className="hero__card hero__card--2" style={{ borderColor: slide.accent }}>🂾</div>
            <div className="hero__card hero__card--3">🃎</div>
          </div>

          {/* Text */}
          <div className="hero__content">
            <span className="hero__tag" style={{ color: slide.accent, borderColor: slide.accent }}>
              {slide.tag}
            </span>
            <h1 className="hero__title">
              {slide.title1}<br />
              <span className="hero__title-big" style={{ color: slide.accent }}>
                {slide.title2}
              </span><br />
              {slide.title3}
            </h1>
            <p className="hero__subtitle">{slide.subtitle}</p>
            <button
              id={`hero-cta-${slide.id}`}
              className="hero__cta"
              style={{
                background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`,
                boxShadow: `0 4px 20px ${slide.accent}55`,
              }}
            >
              {slide.cta} →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="hero__dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            id={`hero-dot-${i}`}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
