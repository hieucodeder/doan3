import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/apiClient'

export default function CategoriesPage() {
    const [rows, setRows] = useState([])
    const [form, setForm] = useState({ name: '', description: '' })
    const [message, setMessage] = useState('')

    const fetchCategories = async () => {
        const { ok, payload } = await apiRequest('/api/categories')
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setRows(payload.data)
            return
        }
        setMessage(payload?.message || 'Không thể tải danh mục.')
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xoá danh mục này?')) return
        const { ok, payload } = await apiRequest(`/api/categories/${id}`, { method: 'DELETE' })
        if (ok && payload?.success) {
            setMessage('Xóa danh mục thành công.')
            await fetchCategories()
            return
        }
        setMessage(payload?.message || 'Không thể xoá danh mục.')
    }

    const handleCreate = async () => {
        if (!form.name.trim()) return
        const { ok, payload } = await apiRequest('/api/categories', {
            method: 'POST',
            body: JSON.stringify(form),
        })
        if (ok && payload?.success) {
            setMessage('Thêm danh mục thành công.')
            setForm({ name: '', description: '' })
            await fetchCategories()
            return
        }
        setMessage(payload?.message || 'Không thể thêm danh mục.')
    }

    return (
        <>
            <section className="panel">
                <div className="panel-head">
                    <h2>Quản lý danh mục</h2>
                    <p>Thêm mới và xem danh mục sản phẩm</p>
                </div>

                {message ? <p className="admin-status-msg">{message}</p> : null}

                <div className="form-grid two-col">
                    <label className="field">
                        <span>Tên danh mục</span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Ví dụ: Nước hoa nam"
                        />
                    </label>
                    <label className="field">
                        <span>Mô tả</span>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Mô tả ngắn"
                        />
                    </label>
                </div>

                <button type="button" className="btn-primary inline-action" onClick={handleCreate}>
                    Thêm danh mục
                </button>
            </section>

            <section className="panel">
                <div className="panel-head">
                    <h2>Danh sách danh mục</h2>
                    <p>Tổng {rows.length} danh mục</p>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--app-muted)' }}>Chưa có dữ liệu.</td></tr>
                            ) : rows.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.name}</td>
                                    <td>{row.description || '-'}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="ghost-btn"
                                            style={{ color: '#c8102e' }}
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}
