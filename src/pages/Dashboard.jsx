import { motion } from 'framer-motion'
import Topbar             from '../components/Topbar/Topbar'
import SubNav             from '../components/SubNav/SubNav'
import HeroBanner         from '../components/HeroBanner/HeroBanner'
import SkillScoreBanner   from '../components/SkillScoreBanner/SkillScoreBanner'
import GameFormats        from '../components/GameFormats/GameFormats'
import QuickActions       from '../components/QuickActions/QuickActions'
import GameStats          from '../components/GameStats/GameStats'
import Showcase           from '../components/Showcase/Showcase'
import MediaGrid          from '../components/MediaGrid/MediaGrid'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Topbar />

      <div className="dashboard__container">
        <SubNav />

        <main className="dashboard__main">
          {/* Top row synchronized items */}
          <section className="dashboard__top-row">
            <motion.div
              className="dashboard__left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <HeroBanner />
            </motion.div>

            <motion.div
              className="dashboard__center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SkillScoreBanner />
            </motion.div>

            <motion.div
              className="dashboard__right"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <GameStats />
            </motion.div>
          </section>

          {/* Middle row features */}
          <div className="dashboard__center-bottom">
            <GameFormats />
            <QuickActions />
          </div>

          {/* Scroll sections */}
          <Showcase />
          <MediaGrid />
        </main>
      </div>
    </div>
  )
}
