import { useState } from 'react'
import './Auth.css'

export default function Register({ onSwitchToLogin, onRegister }) {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState({})
    const [serverMsg, setServerMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const validate = () => {
        const newErrors = {}
        if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên'
        if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email'
        if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
        if (form.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự'
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp'
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setServerMsg('')
        setSuccessMsg('')
        if (onRegister) {
            const result = await onRegister(form)
            if (result?.success) {
                setSuccessMsg('Đăng ký thành công! Đang chuyển đến trang đăng nhập...')
                setTimeout(() => onSwitchToLogin(), 1500)
            } else {
                setServerMsg(result?.message || 'Đăng ký thất bại.')
            }
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-overlay" />

            <div className="auth-card auth-card--register">
                {/* Logo / Brand */}
                <div className="auth-brand">
                    <div className="brand-icon">✦</div>
                    <h1 className="brand-name">LUXE PARFUM</h1>
                    <p className="brand-tagline">Hành trình của hương thơm</p>
                </div>

                <h2 className="auth-title">Đăng Ký</h2>
                <p className="auth-subtitle">Tạo tài khoản và khám phá thế giới hương thơm</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {serverMsg && <p className="error-msg" style={{ textAlign: 'center', marginBottom: '8px' }}>{serverMsg}</p>}
                    {successMsg && <p style={{ textAlign: 'center', color: '#2e7d32', fontSize: '14px', marginBottom: '8px' }}>{successMsg}</p>}
                    <div className="form-group">
                        <label className="form-label">Họ và tên</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                            />
                        </div>
                        {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
                    </div>

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
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                            />
                        </div>
                        {errors.email && <p className="error-msg">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Số điện thoại</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📞</span>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="0901 234 567"
                                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                            />
                        </div>
                        {errors.phone && <p className="error-msg">{errors.phone}</p>}
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
                                placeholder="Tối thiểu 6 ký tự"
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
                        {errors.password && <p className="error-msg">{errors.password}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔐</span>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? '🙈' : '👁'}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword}</p>}
                    </div>

                    <div className="form-agree">
                        <label className="remember-me">
                            <input type="checkbox" required />
                            <span>
                                Tôi đồng ý với{' '}
                                <a href="#" className="forgot-link">điều khoản dịch vụ</a>
                                {' '}và{' '}
                                <a href="#" className="forgot-link">chính sách bảo mật</a>
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="auth-btn">
                        <span>Tạo Tài Khoản</span>
                    </button>
                </form>

                <div className="auth-divider">
                    <span>hoặc</span>
                </div>

                <p className="auth-switch">
                    Đã có tài khoản?{' '}
                    <button type="button" className="switch-btn" onClick={onSwitchToLogin}>
                        Đăng nhập
                    </button>
                </p>
            </div>
        </div>
    )
}
