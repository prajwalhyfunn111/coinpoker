import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PokerTable from './pages/PokerTable'
import CashGames from './pages/CashGames'
import Tournaments from './pages/Tournaments'
import Freerolls from './pages/Freerolls'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/table" element={<PokerTable />} />
        <Route path="/cash-games" element={<CashGames />} />
        <Route path="/all-in-or-fold" element={<CashGames />} />
        <Route path="/bomb-pot" element={<CashGames />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/freerolls" element={<Freerolls />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}
