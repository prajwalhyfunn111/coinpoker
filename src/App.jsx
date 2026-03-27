import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PokerTable from './pages/PokerTable'
import CashGames from './pages/CashGames'
import Tournaments from './pages/Tournaments'
import Freerolls from './pages/Freerolls'
import Settings from './pages/Settings'
import Wallet from './pages/Wallet'
import Login from './pages/Login'

function RequireAuth({ children }) {
  const location = useLocation()
  const isAuthed = localStorage.getItem('coinpoker_auth') === '1'
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/cash-games" replace />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/table" element={<RequireAuth><PokerTable /></RequireAuth>} />
        <Route path="/cash-games" element={<RequireAuth><CashGames /></RequireAuth>} />
        <Route path="/all-in-or-fold" element={<RequireAuth><CashGames /></RequireAuth>} />
        <Route path="/bomb-pot" element={<RequireAuth><CashGames /></RequireAuth>} />
        <Route path="/tournaments" element={<RequireAuth><Tournaments /></RequireAuth>} />
        <Route path="/freerolls" element={<RequireAuth><Freerolls /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
      </Routes>
    </HashRouter>
  )
}
