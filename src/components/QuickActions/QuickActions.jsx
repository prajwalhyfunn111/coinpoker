import { useNavigate } from 'react-router-dom'
import './QuickActions.css'

const ACTIONS = [
  {
    id:    'transactions',
    icon:  '🔔',
    title: 'My Transactions',
    desc:  'Check your withdrawal and deposit status here',
    cta:   'View Transactions',
    color: '#f5c142',
  },
  {
    id:    'pokerintel',
    icon:  '💡',
    title: 'PokerIntel',
    desc:  'Use PokerIntel to understand your gameplay and improvise',
    cta:   'Explore Intel',
    color: '#00c48c',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="qa">
      {ACTIONS.map(a => (
        <button
          key={a.id}
          id={`qa-${a.id}`}
          className="qa__card"
          style={{ '--qa-color': a.color }}
          onClick={() => navigate('/table')}
        >
          <div className="qa__icon">{a.icon}</div>
          <div className="qa__body">
            <p className="qa__title">{a.title}</p>
            <p className="qa__desc">{a.desc}</p>
          </div>
          <span className="qa__arrow">›</span>
        </button>
      ))}
    </div>
  )
}
