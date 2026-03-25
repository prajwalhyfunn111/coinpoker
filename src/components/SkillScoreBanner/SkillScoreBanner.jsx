import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import './SkillScoreBanner.css'

const DATA = [
  { name: 'Mon', score: 400 },
  { name: 'Tue', score: 300 },
  { name: 'Wed', score: 500 },
  { name: 'Thu', score: 450 },
  { name: 'Fri', score: 700 },
  { name: 'Sat', score: 850 },
  { name: 'Sun', score: 780 },
]

export default function SkillScoreBanner() {
  return (
    <div className="ssb">
      <div className="ssb__header">
        <div>
          <h2 className="ssb__title">SKILL SCORE</h2>
          <p className="ssb__subtitle">PLAY TOURNAMENTS TO IMPROVE RANK</p>
        </div>
        <div className="ssb__stat">
          <span className="ssb__stat-label">Metric</span>
          <span className="ssb__stat-value">780 / 1000</span>
        </div>
        <div className="ssb__stat">
          <span className="ssb__stat-label">Current Rank</span>
          <span className="ssb__stat-value ssb__stat-value--gold">ELITE</span>
        </div>
      </div>

      <div className="ssb__chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4438" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff4438" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ backgroundColor: '#05080c', borderColor: 'rgba(255,68,56,0.16)', borderRadius: '12px' }}
              itemStyle={{ color: '#ff4438', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#ff4438"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="ssb__footer">
        <button id="btn-start-tournament" className="ssb__cta">
          START PLAYING TOURNAMENT NOW →
        </button>
      </div>
    </div>
  )
}
