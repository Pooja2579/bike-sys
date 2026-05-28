import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import VerifyPhone from './pages/VerifyPhone'
import DiscoverRides from './pages/DiscoverRides'
import OfferRide from './pages/OfferRide'
import NavigationPage from './pages/NavigationPage'
import ProfilePage from './pages/ProfilePage'

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 7000
})

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bike-user')
    return stored ? JSON.parse(stored) : null
  })
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (user) {
      localStorage.setItem('bike-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bike-user')
    }
  }, [user])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  return (
    <div className="app-shell">
      <Header user={user} onLogout={() => setUser(null)} />
      <main className="page-container">
        {toast && <div className="toast-banner">{toast}</div>}
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/verify"
            element={<VerifyPhone api={api} onVerified={setUser} showToast={showToast} user={user} />}
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute user={user}>
                <DiscoverRides api={api} user={user} showToast={showToast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer"
            element={
              <ProtectedRoute user={user}>
                <OfferRide api={api} user={user} showToast={showToast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/navigation"
            element={
              <ProtectedRoute user={user}>
                <NavigationPage api={api} user={user} showToast={showToast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage api={api} user={user} showToast={showToast} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
