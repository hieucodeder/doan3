import { useEffect, useState } from 'react'
import {
    getStaticPages,
    createStaticPage,
    updateStaticPage,
    deleteStaticPage,
} from '../../services/apiClient'

function stripHtml(value) {
    return String(value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export default function StaticPagesPage() {
    const [rows, setRows] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        title: '',
        slug: '',
        content: '',
        is_active: true,
    })

    const fetchStaticPages = async () => {
        setIsLoading(true)
        setMessage('')
        const { ok, payload } = await getStaticPages()
        setIsLoading(false)

        if (ok && payload?.success && Array.isArray(payload.data)) {
            setRows(payload.data)
        } else {
            setMessage(payload?.message || 'Lỗi khi tải dữ liệu')
        }
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            fetchStaticPages()
        }, 0)

        return () => window.clearTimeout(timer)
    }, [])

    const resetForm = () => {
        setEditingId(null)
        setForm({
            title: '',
            slug: '',
            content: '',
            is_active: true,
        })
    }

    const handleInputChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: field === 'is_active' ? Boolean(value) : value,
        }))
    }

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.slug.trim()) {
            setMessage('Vui lòng điền tiêu đề và slug')
            return
        }

        setIsLoading(true)
        setMessage('')

        const payload = {
            title: form.title.trim(),
            slug: form.slug.trim(),
            content: form.content,
            is_active: form.is_active,
        }

        const res = editingId
            ? await updateStaticPage(editingId, payload)
            : await createStaticPage(payload)

        setIsLoading(false)

        if (res.ok && res.payload?.success) {
            setMessage(editingId ? 'Cập nhật trang thành công' : 'Tạo trang thành công')
            resetForm()
            await fetchStaticPages()
        } else {
            setMessage(res.payload?.message || 'Lỗi khi lưu dữ liệu')
        }
    }

    const handleEdit = (item) => {
        setEditingId(item.id)
        setForm({
            title: item.title || '',
            slug: item.slug || '',
            content: item.content || '',
            is_active: item.is_active !== false,
        })
    }

    const handleDelete = async (id) => {
        if (!confirm('Bạn chắc chắn muốn xóa trang này?')) return

        setIsLoading(true)
        const { ok, payload } = await deleteStaticPage(id)
        setIsLoading(false)

        if (ok && payload?.success) {
            setMessage('Xóa trang thành công')
            await fetchStaticPages()
        } else {
            setMessage(payload?.message || 'Lỗi khi xóa trang')
        }
    }

    const totalPages = rows.length
    const activePages = rows.filter((item) => item.is_active).length
    const inactivePages = totalPages - activePages
    const previewText = stripHtml(form.content)
    const pageRows = [...rows].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))

    return (
        <>
            <section className="panel static-admin-hero">
                <div className="panel-head">
                    <h2>Quản lý trang tĩnh</h2>
                    <p>Xây dựng các trang nội dung như giới thiệu, điều khoản, chính sách và landing page phụ.</p>
                </div>

                {message && (
                    <p className={`admin-status-msg ${message.includes('thành công') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}

                <div className="static-admin-summary">
                    <article className="static-admin-metric">
                        <span>Tổng trang</span>
                        <strong>{totalPages}</strong>
                    </article>
                    <article className="static-admin-metric">
                        <span>Đang hoạt động</span>
                        <strong>{activePages}</strong>
                    </article>
                    <article className="static-admin-metric">
                        <span>Tạm tắt</span>
                        <strong>{inactivePages}</strong>
                    </article>
                    <article className="static-admin-metric static-admin-metric--hint">
                        <span>Gợi ý</span>
                        <p>Dùng slug ngắn, không dấu và ổn định để tránh đổi đường dẫn về sau.</p>
                    </article>
                </div>
            </section>

            <section className="static-admin-layout">
                <div className="panel static-editor-panel">
                    <div className="panel-head">
                        <h3>{editingId ? 'Chỉnh sửa trang' : 'Tạo trang mới'}</h3>
                        <p>{editingId ? `Đang chỉnh sửa trang #${editingId}` : 'Soạn nội dung và công bố khi đã sẵn sàng.'}</p>
                    </div>

                    <div className="admin-form-section static-editor-form">
                        <div className="form-grid">
                            <label className="field">
                                <span>Tiêu đề trang</span>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Chính sách đổi trả"
                                    value={form.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="form-control"
                                />
                            </label>
                            <label className="field">
                                <span>Slug</span>
                                <input
                                    type="text"
                                    placeholder="chinh-sach-doi-tra"
                                    value={form.slug}
                                    onChange={(e) => handleInputChange('slug', e.target.value)}
                                    className="form-control"
                                />
                            </label>
                        </div>

                        <label className="field">
                            <span>Nội dung</span>
                            <textarea
                                placeholder="Nhập nội dung hiển thị cho trang tĩnh..."
                                value={form.content}
                                onChange={(e) => handleInputChange('content', e.target.value)}
                                className="form-control static-editor-textarea"
                                rows="10"
                            />
                        </label>

                        <div className="static-editor-row">
                            <label className="static-toggle">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                />
                                <span>{form.is_active ? 'Trang đang bật' : 'Trang đang tắt'}</span>
                            </label>

                            <div className="form-actions">
                                <button onClick={handleSubmit} disabled={isLoading} className="btn-primary">
                                    {isLoading ? 'Đang xử lý...' : editingId ? 'Lưu thay đổi' : 'Tạo trang'}
                                </button>
                                {editingId && (
                                    <button onClick={resetForm} className="btn-secondary">
                                        Hủy chỉnh sửa
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="static-editor-footnote">
                        <span>URL dự kiến</span>
                        <strong>/{form.slug.trim() || 'duong-dan-trang'}</strong>
                    </div>
                </div>

                <aside className="panel static-preview-panel">
                    <div className="panel-head">
                        <h3>Xem nhanh</h3>
                        <p>Preview nội dung trước khi lưu.</p>
                    </div>

                    <div className="static-preview-card">
                        <div className="static-preview-badge">
                            <span className={form.is_active ? 'badge-success' : 'badge-danger'}>
                                {form.is_active ? 'Đang hiển thị' : 'Đang ẩn'}
                            </span>
                        </div>
                        <h4>{form.title.trim() || 'Tiêu đề trang sẽ hiện ở đây'}</h4>
                        <p className="static-preview-slug">/{form.slug.trim() || 'duong-dan-trang'}</p>
                        <div className="static-preview-copy">
                            {previewText || 'Nội dung mô tả sẽ xuất hiện ở đây để bạn rà soát nhanh bố cục và câu chữ.'}
                        </div>
                    </div>
                </aside>
            </section>

            <section className="panel">
                <div className="panel-head">
                    <h2>Danh sách trang</h2>
                    <p>Chọn một trang để sửa nhanh hoặc kiểm tra trạng thái xuất bản.</p>
                </div>

                {isLoading && !message ? (
                    <p className="admin-status-msg">Đang tải dữ liệu...</p>
                ) : rows.length === 0 ? (
                    <p className="admin-status-msg">Không có trang nào</p>
                ) : (
                    <div className="static-page-grid">
                        {pageRows.map((item) => (
                            <article key={item.id} className={`static-page-card ${editingId === item.id ? 'is-selected' : ''}`}>
                                <div className="static-page-card-top">
                                    <div>
                                        <span className="static-page-id">Trang #{item.id}</span>
                                        <h3>{item.title}</h3>
                                    </div>
                                    <span className={item.is_active ? 'badge-success' : 'badge-danger'}>
                                        {item.is_active ? 'Kích hoạt' : 'Tắt'}
                                    </span>
                                </div>

                                <p className="static-page-path">/{item.slug}</p>
                                <p className="static-page-excerpt">
                                    {stripHtml(item.content) || 'Chưa có nội dung mô tả.'}
                                </p>

                                <div className="static-page-actions">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="btn-edit"
                                    >
                                        Sửa nội dung
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="btn-delete"
                                    >
                                        Xóa trang
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}
