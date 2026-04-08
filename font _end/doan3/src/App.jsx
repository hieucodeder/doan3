import { useState } from 'react'
import PortalUI from './pages/PortalUI'
import Login from './pages/Login'
import Register from './pages/Register'
import {
  apiRequest,
  clearAuthStorage,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from './services/apiClient'

function App() {
  const [authPage, setAuthPage] = useState('login')
  const [currentUser, setCurrentUser] = useState(() => getStoredUser())

  const handleLogin = async ({ email, password }) => {
    try {
      const { ok, payload } = await apiRequest('/api/auth/login', {
        skipAuth: true,
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!ok || !payload?.success || !payload?.data) {
        return { success: false, message: payload?.message || 'Dang nhap that bai' }
      }

      const user = {
        id: payload.data.id,
        name: payload.data.name,
        email: payload.data.email,
        role: payload.data.role,
      }

      if (payload.data.accessToken) {
        setAccessToken(payload.data.accessToken)
      }
      setStoredUser(user)

      setCurrentUser(user)
      return { success: true }
    } catch (error) {
      return { success: false, message: 'Khong the ket noi den server' }
    }
  }

  const handleRegister = (payload) => {
    console.log('Dang ky demo:', payload)
    setAuthPage('login')
  }

  const handleLogout = () => {
    clearAuthStorage()
    setCurrentUser(null)
    setAuthPage('login')
  }

  if (!currentUser) {
    return authPage === 'login' ? (
      <Login
        onSwitchToRegister={() => setAuthPage('register')}
        onLogin={handleLogin}
      />
    ) : (
      <Register
        onSwitchToLogin={() => setAuthPage('login')}
        onRegister={handleRegister}
      />
    )
  }

  return (
    <PortalUI
      role={currentUser.role}
      userName={currentUser.name}
      userId={currentUser.id}
      onLogout={handleLogout}
    />
  )
}

export default App