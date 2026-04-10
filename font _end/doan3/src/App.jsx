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
        // Kiểm tra xem tài khoản có tồn tại nhưng bị khóa không
        try {
          const statusRes = await apiRequest('/api/users/check-status', {
            skipAuth: true,
            method: 'POST',
            body: JSON.stringify({ email }),
          })
          if (statusRes.ok && statusRes.payload?.data?.is_active === 0) {
            return { success: false, message: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.', type: 'inactive' }
          }
        } catch (_) {
          // bỏ qua nếu endpoint này không tồn tại
        }

        // Kiểm tra nếu backend trả message cụ thể về khóa tài khoản
        const backendMsg = String(payload?.message || '').toLowerCase()
        if (backendMsg.includes('khóa') || backendMsg.includes('vô hiệu') || backendMsg.includes('disabled') || backendMsg.includes('inactive') || backendMsg.includes('blocked')) {
          return { success: false, message: payload.message, type: 'inactive' }
        }

        return { success: false, message: payload?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.' }
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

  const handleRegister = async ({ fullName, email, password }) => {
    try {
      const { ok, payload } = await apiRequest('/api/auth/register', {
        skipAuth: true,
        method: 'POST',
        body: JSON.stringify({ name: fullName, email, password }),
      })
      if (ok && payload?.success) {
        return { success: true }
      }
      return { success: false, message: payload?.message || 'Đăng ký thất bại.' }
    } catch {
      return { success: false, message: 'Không thể kết nối đến server.' }
    }
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