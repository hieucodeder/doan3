import { useState } from 'react'
import './Auth.css'

export default function Login({ onSwitchToRegister, onLogin }) {
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        const result = onLogin ? await onLogin(form) : { success: true }
        setIsSubmitting(false)

        if (!result.success) {
            setError(result.message || 'Dang nhap that bai')
            setSuccessMsg('')
            return
        }
        setError('')
        setSuccessMsg('Đăng nhập thành công! Đang chuyển trang...')
    }

    return (
        <div className="auth-container">
            <div className="auth-overlay" />

            <div className="auth-card">
                {/* Logo / Brand */}
                <div className="auth-brand">
                    <div className="brand-icon">✦</div>
                    <h1 className="brand-name">LUXE PARFUM</h1>
                    <p className="brand-tagline">Hành trình của hương thơm</p>
                </div>

                <h2 className="auth-title">Đăng Nhập</h2>
                <p className="auth-subtitle">Chào mừng bạn trở lại</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                className="form-input"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="#" className="forgot-link">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" className="auth-btn">
                        <span>{isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}</span>
                    </button>
                    {successMsg ? <p className="success-msg auth-form-success">{successMsg}</p> : null}
                    {error ? <p className="error-msg auth-form-error">{error}</p> : null}
                </form>

                <div className="auth-divider">
                    <span>hoặc</span>
                </div>

                <p className="auth-switch">
                    Chưa có tài khoản?{' '}
                    <button type="button" className="switch-btn" onClick={onSwitchToRegister}>
                        Đăng ký ngay
                    </button>
                </p>
            </div>
        </div>
    )
}
