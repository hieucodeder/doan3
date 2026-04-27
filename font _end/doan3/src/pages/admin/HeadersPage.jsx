import { useEffect, useState } from 'react'
import {
    activateHeader,
    createHeader,
    deleteHeader,
    getHeaders,
    normalizeHeaderRecord,
    updateHeader,
} from '../../services/apiClient'

export default function HeadersPage() {
    const [headers, setHeaders] = useState([])
    const [selectedHeaderId, setSelectedHeaderId] = useState(null)
    const [editingHeaderId, setEditingHeaderId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [headerForm, setHeaderForm] = useState({
        site_name: '',
        logo_url: '',
        hotline: '',
        email: '',
        address: '',
        banner_text: '',
        banner_image_url: '',
        is_active: false,
    })

    const fetchHeaders = async () => {
        setIsLoading(true)
        const { ok, payload } = await getHeaders()
        setIsLoading(false)

        if (ok && payload?.success && Array.isArray(payload.data)) {
            setHeaders(payload.data.map(normalizeHeaderRecord))
            if (payload.data.length > 0) {
                setSelectedHeaderId((current) => current || payload.data[0].id)
            }
            return
        }

        setHeaders([])
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchHeaders()
        }, 0)

        return () => window.clearTimeout(timer)
    }, [])

    const resetHeaderForm = () => {
        setEditingHeaderId(null)
        setHeaderForm({
            site_name: '',
            logo_url: '',
            hotline: '',
            email: '',
            address: '',
            banner_text: '',
            banner_image_url: '',
            is_active: false,
        })
    }

    const handleHeaderSubmit = async () => {
        if (!headerForm.site_name.trim()) {
            setMessage('Vui lòng điền tên website')
            return
        }

        setIsLoading(true)
        setMessage('')

        const payload = {
            site_name: headerForm.site_name.trim(),
            logo_url: headerForm.logo_url.trim(),
            hotline: headerForm.hotline.trim(),
            email: headerForm.email.trim(),
            address: headerForm.address.trim(),
            banner_text: headerForm.banner_text.trim(),
            banner_image_url: headerForm.banner_image_url.trim(),
            is_active: headerForm.is_active,
        }

        const res = editingHeaderId
            ? await updateHeader(editingHeaderId, payload)
            : await createHeader(payload)

        setIsLoading(false)

        if (res.ok && res.payload?.success) {
            setMessage(editingHeaderId ? 'Cập nhật thành công' : 'Tạo mới thành công')
            resetHeaderForm()
            await fetchHeaders()
            return
        }

        setMessage(res.payload?.message || 'Lỗi khi lưu dữ liệu')
    }

    const handleHeaderEdit = (item) => {
        setEditingHeaderId(item.id)
        setHeaderForm({
            site_name: item.site_name || '',
            logo_url: item.logo_url || '',
            hotline: item.hotline || '',
            email: item.email || '',
            address: item.address || '',
            banner_text: item.banner_text || '',
            banner_image_url: item.banner_image_url || '',
            is_active: item.is_active || false,
        })
    }

    const handleHeaderDelete = async (id) => {
        if (!confirm('Bạn chắc chắn muốn xóa header này?')) return

        setIsLoading(true)
        const { ok, payload } = await deleteHeader(id)
        setIsLoading(false)

        if (ok && payload?.success) {
            setMessage('Xóa thành công')
            if (selectedHeaderId === id) {
                setSelectedHeaderId(null)
            }
            await fetchHeaders()
            return
        }

        setMessage(payload?.message || 'Lỗi khi xóa')
    }

    const handleActivateHeader = async (id) => {
        setIsLoading(true)
        const { ok, payload } = await activateHeader(id)
        setIsLoading(false)

        if (ok && payload?.success) {
            setMessage('Kích hoạt thành công')
            await fetchHeaders()
            return
        }

        setMessage(payload?.message || 'Lỗi khi kích hoạt')
    }

    const selectedHeader = headers.find((item) => item.id === selectedHeaderId) || null
    const activeHeaders = headers.filter((item) => item.is_active).length
    const inactiveHeaders = headers.length - activeHeaders
    const previewHeader = editingHeaderId
        ? normalizeHeaderRecord({
            id: editingHeaderId,
            site_name: headerForm.site_name || 'Tên website sẽ hiển thị tại đây',
            logo_url: headerForm.logo_url || '',
            hotline: headerForm.hotline || '',
            email: headerForm.email || '',
            address: headerForm.address || '',
            banner_text: headerForm.banner_text || 'Thông điệp banner sẽ xuất hiện trong thanh header và hero trang chủ.',
            banner_image_url: headerForm.banner_image_url || '',
            is_active: headerForm.is_active,
        })
        : selectedHeader

    return (
        <>
            <section className="panel header-admin-hero">
                <div className="panel-head">
                    <h2>Quản lý Header</h2>
                    <p>Cấu hình header storefront theo schema backend hiện tại, không dùng menu riêng.</p>
                </div>

                {message && (
                    <p className={`admin-status-msg ${message.includes('thành công') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}

                <div className="header-admin-summary">
                    <article className="header-admin-metric">
                        <span>Tổng header</span>
                        <strong>{headers.length}</strong>
                    </article>
                    <article className="header-admin-metric">
                        <span>Đang kích hoạt</span>
                        <strong>{activeHeaders}</strong>
                    </article>
                    <article className="header-admin-metric">
                        <span>Đang tắt</span>
                        <strong>{inactiveHeaders}</strong>
                    </article>
                    <article className="header-admin-metric">
                        <span>Header đang chọn</span>
                        <strong>{selectedHeader ? `#${selectedHeader.id}` : 0}</strong>
                    </article>
                </div>
            </section>

            <section className="header-admin-layout">
                <div className="panel header-editor-panel">
                    <div className="panel-head">
                        <h3>{editingHeaderId ? 'Chỉnh sửa header' : 'Tạo header mới'}</h3>
                        <p>Cấu hình logo, banner và thông tin liên hệ cho storefront theo đúng schema backend mới.</p>
                    </div>

                    <div className="admin-form-section header-editor-form">
                        <div className="form-grid">
                            <label className="field">
                                <span>Tên website</span>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: NGỌC ÁNH Perfume"
                                    value={headerForm.site_name}
                                    onChange={(e) => setHeaderForm((prev) => ({ ...prev, site_name: e.target.value }))}
                                    className="form-control"
                                />
                            </label>
                            <label className="field">
                                <span>Hotline</span>
                                <input
                                    type="text"
                                    placeholder="0909000000"
                                    value={headerForm.hotline}
                                    onChange={(e) => setHeaderForm((prev) => ({ ...prev, hotline: e.target.value }))}
                                    className="form-control"
                                />
                            </label>
                        </div>

                        <div className="form-grid">
                            <label className="field">
                                <span>Email</span>
                                <input
                                    type="text"
                                    placeholder="shop@example.com"
                                    value={headerForm.email}
                                    onChange={(e) => setHeaderForm((prev) => ({ ...prev, email: e.target.value }))}
                                    className="form-control"
                                />
                            </label>
                            <label className="field">
                                <span>Địa chỉ</span>
                                <input
                                    type="text"
                                    placeholder="HCM"
                                    value={headerForm.address}
                                    onChange={(e) => setHeaderForm((prev) => ({ ...prev, address: e.target.value }))}
                                    className="form-control"
                                />
                            </label>
                        </div>

                        <div className="form-grid">
                            <label className="field">
                                <span>Logo URL</span>
                                <input
                                    type="text"
                                    placeholder="https://example.com/logo.png"
                                    value={headerForm.logo_url}
                                    onChange={(e) => setHeaderForm((prev) => ({ ...prev, logo_url: e.target.value }))}
                                    className="form-control"
                                />
                            </label>
                            <label className="field">
                                <span>Banner image URL</span>
                                <input
                                    type="text"
                                    placeholder="https://example.com/banner.png"
                                    value={headerForm.banner_image_url}
                                    onChange={(e) => setHeaderForm((prev) => ({ ...prev, banner_image_url: e.target.value }))}
                                    className="form-control"
                                />
                            </label>
                        </div>

                        <label className="field">
                            <span>Banner text</span>
                            <input
                                type="text"
                                placeholder="Chao mung den voi shop"
                                value={headerForm.banner_text}
                                onChange={(e) => setHeaderForm((prev) => ({ ...prev, banner_text: e.target.value }))}
                                className="form-control"
                            />
                        </label>

                        <label className="static-toggle">
                            <input
                                type="checkbox"
                                checked={headerForm.is_active}
                                onChange={(e) => setHeaderForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                            />
                            <span>{headerForm.is_active ? 'Tạo và bật ngay' : 'Tạo ở trạng thái nháp'}</span>
                        </label>

                        <div className="form-actions">
                            <button onClick={handleHeaderSubmit} disabled={isLoading} className="btn-primary">
                                {isLoading ? 'Đang xử lý...' : editingHeaderId ? 'Lưu header' : 'Tạo header'}
                            </button>
                            {editingHeaderId && (
                                <button onClick={resetHeaderForm} className="btn-secondary">
                                    Hủy chỉnh sửa
                                </button>
                            )}
                        </div>

                        <div className="header-editor-footnote">
                            <span>Schema header</span>
                            <strong>`site_name`, `logo_url`, `hotline`, `email`, `address`, `banner_text`, `banner_image_url`, `is_active`</strong>
                        </div>
                    </div>
                </div>

                <div className="panel header-list-panel">
                    <div className="panel-head">
                        <h3>Danh sách header</h3>
                        <p>Chọn một header để xem preview storefront, sửa hoặc đặt làm phiên bản chính.</p>
                    </div>

                    {isLoading && !message ? (
                        <p className="admin-status-msg">Đang tải dữ liệu...</p>
                    ) : headers.length === 0 ? (
                        <p className="admin-status-msg">Không có header nào</p>
                    ) : (
                        <div className="header-card-grid">
                            {headers.map((item) => (
                                <article key={item.id} className={`header-card ${selectedHeaderId === item.id ? 'is-selected' : ''}`}>
                                    <div className="header-card-top">
                                        <div>
                                            <span className="header-card-id">Header #{item.id}</span>
                                            <h3>{item.site_name || 'Chưa có tên website'}</h3>
                                        </div>
                                        <span className={item.is_active ? 'badge-success' : 'badge-danger'}>
                                            {item.is_active ? 'Đang active' : 'Bản nháp'}
                                        </span>
                                    </div>
                                    <p>{item.banner_text || item.address || 'Chưa có banner hoặc thông tin liên hệ cho header này.'}</p>
                                    <div className="header-card-actions">
                                        <button onClick={() => setSelectedHeaderId(item.id)} className="btn-edit">
                                            {selectedHeaderId === item.id ? 'Đang chọn' : 'Chọn header'}
                                        </button>
                                        <button onClick={() => handleHeaderEdit(item)} className="btn-edit">
                                            Sửa
                                        </button>
                                        {!item.is_active && (
                                            <button onClick={() => handleActivateHeader(item.id)} className="btn-primary">
                                                Kích hoạt
                                            </button>
                                        )}
                                        <button onClick={() => handleHeaderDelete(item.id)} className="btn-delete">
                                            Xóa
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {previewHeader ? (
                        <div className="header-storefront-preview">
                            <div className="header-storefront-preview-top">
                                <span className="shop-header-highlight-tag">Preview storefront</span>
                                <span className={previewHeader.is_active ? 'badge-success' : 'badge-danger'}>
                                    {previewHeader.is_active ? 'Sẽ hiển thị cho khách' : 'Chưa active'}
                                </span>
                            </div>
                            <div className="logo-block storefront-preview-brand">
                                <span className="logo-chip">NGOC ANH PERFUME</span>
                                {previewHeader.logo_url ? (
                                    <img src={previewHeader.logo_url} alt={previewHeader.site_name || 'Logo'} className="storefront-preview-logo" />
                                ) : null}
                                <h1>{previewHeader.site_name || 'Tên website sẽ hiển thị tại đây'}</h1>
                                <p>{previewHeader.banner_text || 'Thông điệp banner sẽ được hiển thị tại đây.'}</p>
                                <div className="storefront-preview-contact">
                                    {previewHeader.hotline ? <span>Hotline: {previewHeader.hotline}</span> : null}
                                    {previewHeader.email ? <span>Email: {previewHeader.email}</span> : null}
                                    {previewHeader.address ? <span>{previewHeader.address}</span> : null}
                                </div>
                            </div>
                            {previewHeader.banner_image_url ? (
                                <div className="storefront-preview-cover">
                                    <img src={previewHeader.banner_image_url} alt={previewHeader.site_name || 'Banner'} />
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </section>
        </>
    )
}
