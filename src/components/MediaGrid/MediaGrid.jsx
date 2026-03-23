import './MediaGrid.css'

const CONTENT = [
  { id: 1, title: 'CASH GAME WORLD CHAMPIONSHIP', rank: '3', value: '₮40,000', color: '#ffd700', bg: 'linear-gradient(135deg, #111, #222)' },
  { id: 2, title: 'CASH GAME WORLD CHAMPIONSHIP', rank: '2', value: '₮20,000', color: '#ff1e33', bg: 'linear-gradient(135deg, #111, #222)' },
  { id: 3, title: 'WPM MAIN EVENT', rank: '1', value: '₮250,000', color: '#fff', bg: 'linear-gradient(135deg, #111, #222)' },
]

const PROMOS = [
  { id: 1, title: '100% RAKEBACK', date: 'MARCH 2nd–31st', tag: 'LIMITED', col: '#ff1e33' },
  { id: 2, title: 'COIN RACES', date: 'MARCH 16th–31st', tag: '$1M PRIZES', col: '#ffd700' },
  { id: 3, title: 'COINMASTERS', date: 'MARCH 1st-30th', tag: '$250K GTD', col: '#fff' },
  { id: 4, title: 'BOOSTED GUARANTEES', date: 'MARCH 8th–31st', tag: 'MAX VALUE', col: '#ff1e33' },
]

export default function MediaGrid() {
  return (
    <section className="media-grid">
      <div className="section-header">
        <h2 className="section-title">Poker Content</h2>
        <div className="nav-controls">
          <span>‹</span><span>›</span>
        </div>
      </div>
      
      <div className="content-row">
        {CONTENT.map(c => (
          <div key={c.id} className="content-card" style={{ background: c.bg }}>
            <span className="content-rank">{c.rank}</span>
            <div className="content-info">
              <p className="content-tag">{c.title}</p>
              <p className="content-value" style={{ color: c.color }}>{c.value}</p>
            </div>
            <div className="content-overlay" />
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: '40px' }}>
        <h2 className="section-title">Promotions</h2>
      </div>

      <div className="promo-row">
        {PROMOS.map(p => (
          <div key={p.id} className="promo-card" style={{ '--promo-col': p.col }}>
            <div className="promo-tag">{p.tag}</div>
            <h3 className="promo-title">{p.title}</h3>
            <p className="promo-date">{p.date}</p>
            <div className="promo-btn" style={{ borderColor: p.col, color: p.col }}>EXPLORE →</div>
          </div>
        ))}
      </div>
    </section>
  )
}
