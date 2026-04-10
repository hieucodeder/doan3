import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/apiClient'

function formatDate(raw) {
    if (!raw) return '-'
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return raw
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [keyword, setKeyword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [editingUser, setEditingUser] = useState(null)
    const [editForm, setEditForm] = useState({ name: '', email: '' })

    const fetchUsers = async () => {
        setIsLoading(true)
        setError('')
        const { ok, payload } = await apiRequest('/api/users')
        setIsLoading(false)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setUsers(payload.data)
        } else {
            setError(payload?.message || 'Không thể tải danh sách người dùng.')
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleStatus = async (user) => {
        const nextStatus = (Number(user.is_active ?? 1) === 1) ? 0 : 1
        const label = nextStatus === 0 ? 'vô hiệu hóa' : 'kích hoạt'
        const confirmed = window.confirm(`Bạn có chắc muốn ${label} tài khoản "${user.name}"?`)
        if (!confirmed) return

        const { ok, payload } = await apiRequest(`/api/users/${user.id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: nextStatus }),
        })

        if (ok && payload?.success) {
            setMessage(`Đã ${label} tài khoản thành công.`)
            await fetchUsers()
            return
        }
        setMessage(payload?.message || `Không thể ${label} tài khoản.`)
    }

    const handleOpenEdit = (user) => {
        setEditingUser(user)
        setEditForm({ name: user.name || '', email: user.email || '' })
    }

    const handleSaveEdit = async () => {
        if (!editingUser) return
        const { ok, payload } = await apiRequest('/api/users/email', {
            method: 'PUT',
            body: JSON.stringify({
                email: editingUser.email,
                name: editForm.name,
                new_email: editForm.email,
            }),
        })
        if (ok && payload?.success) {
            setMessage('Cập nhật tài khoản thành công.')
            setEditingUser(null)
            await fetchUsers()
            return
        }
        setMessage(payload?.message || 'Không thể cập nhật tài khoản.')
    }

    const filteredUsers = users.filter((user) => {
        const name = String(user.name || '').toLowerCase()
        const email = String(user.email || '').toLowerCase()
        const needle = keyword.toLowerCase().trim()
        return !needle || name.includes(needle) || email.includes(needle)
    })

    return (
        <>
            {editingUser ? (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 12, padding: '28px 24px',
                        minWidth: 320, display: 'grid', gap: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    }}>
                        <h3 style={{ margin: 0, color: '#3d2a0a' }}>Sửa thông tin tài khoản</h3>
                        <label className="field">
                            <span>Họ tên</span>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </label>
                        <label className="field">
                            <span>Email</span>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </label>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button type="button" className="ghost-btn" onClick={() => setEditingUser(null)}>Hủy</button>
                            <button type="button" className="btn-primary" onClick={handleSaveEdit}>Lưu</button>
                        </div>
                    </div>
                </div>
            ) : null}

            <section className="panel">
                <div className="panel-head">
                    <h2>Quản lý khách hàng</h2>
                    <p>Theo dõi danh sách khách hàng trong hệ thống</p>
                </div>

                {isLoading && <p className="admin-status-msg">Đang tải...</p>}
                {error && <p className="admin-status-msg error">{error}</p>}
                {message && <p className="admin-status-msg">{message}</p>}

                <div className="admin-toolbar">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm theo tên hoặc email"
                        style={{ color: '#000' }}
                    
                    />
                    <button type="button" className="ghost-btn" onClick={() => setKeyword('')}>Xóa lọc</button>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 && !isLoading ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--app-muted)' }}>Chưa có dữ liệu.</td></tr>
                            ) : filteredUsers.map((u) => {
                                const isActive = Number(u.is_active ?? 1) === 1
                                const isAdmin = u.role === 'admin'
                                return (
                                    <tr key={u.id} className={isActive ? '' : 'disabled-row'}>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td><span className="status-pill" style={{ background: '#e8ddd0', color: '#000', border: '1px solid #ccc' }}>{u.role}</span></td>
                                        <td>
                                            <span className={`status-pill ${isActive ? 'status-completed' : 'status-cancelled'}`}>
                                                {isActive ? 'Hoạt động' : 'Vô hiệu'}
                                            </span>
                                        </td>
                                        <td>{formatDate(u.created_at)}</td>
                                        <td>
                                            {isAdmin ? (
                                                <span style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic' }}>Không thể chỉnh sửa</span>
                                            ) : (
                                                <div className="admin-row-actions">
                                                    <button
                                                        type="button"
                                                        className="ghost-btn"
                                                        title="Sửa thông tin"
                                                        onClick={() => handleOpenEdit(u)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="ghost-btn"
                                                        title={isActive ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
                                                        onClick={() => handleToggleStatus(u)}
                                                    >
                                                        {isActive ? '🚫' : '✅'}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}
