import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../services/apiClient'
import { formatPrice } from '../../data/mockData'

export default function ProductsPage() {
    const [rows, setRows] = useState([])
    const [categories, setCategories] = useState([])
    const [keyword, setKeyword] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [imageInput, setImageInput] = useState('')
    const [form, setForm] = useState({
        name: '',
        brand: '',
        price: '',
        stock: '',
        description: '',
        images: [],
        category_id: '',
    })

    useEffect(() => {
        const fetchInitData = async () => {
            setIsLoading(true)
            const [productsRes, categoriesRes] = await Promise.all([
                apiRequest('/api/products'),
                apiRequest('/api/categories'),
            ])
            setIsLoading(false)

            if (productsRes.ok && productsRes.payload?.success && Array.isArray(productsRes.payload.data)) {
                setRows(productsRes.payload.data)
            }

            if (categoriesRes.ok && categoriesRes.payload?.success && Array.isArray(categoriesRes.payload.data)) {
                setCategories(categoriesRes.payload.data)
                if (!form.category_id && categoriesRes.payload.data[0]?.id) {
                    setForm((prev) => ({ ...prev, category_id: String(categoriesRes.payload.data[0].id) }))
                }
            }
        }

        fetchInitData()
    }, [])

    const refreshProducts = async (searchKeyword = '') => {
        const path = searchKeyword
            ? `/api/products/search?keyword=${encodeURIComponent(searchKeyword)}`
            : '/api/products'
        const { ok, payload } = await apiRequest(path)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setRows(payload.data)
        }
    }

    const resetForm = () => {
        setEditingId(null)
        setImageInput('')
        setForm({
            name: '',
            brand: '',
            price: '',
            stock: '',
            description: '',
            images: [],
            category_id: categories[0]?.id ? String(categories[0].id) : '',
        })
    }

    const handleSubmit = async () => {
        if (!form.name.trim()) return

        const endpoint = editingId ? `/api/products/${editingId}` : '/api/products'
        const method = editingId ? 'PUT' : 'POST'

        const updatePayload = {
            name: form.name.trim(),
            brand: form.brand.trim(),
            price: Number(form.price || 0),
            stock: Number(form.stock || 0),
            description: form.description,
            category_id: form.category_id ? Number(form.category_id) : null,
        }

        const normalizedImages = [...new Set((form.images || []).map((img) => String(img || '').trim()).filter(Boolean))]
        const primaryImage = normalizedImages[0] || ''
        const payload = editingId
            ? updatePayload
            : {
                ...updatePayload,
                image_url: primaryImage,
                images: normalizedImages,
            }

        const { ok, payload: responsePayload } = await apiRequest(endpoint, {
            method,
            body: JSON.stringify(payload),
        })

        if (ok && responsePayload?.success) {
            setMessage(editingId ? 'Cập nhật sản phẩm thành công.' : 'Thêm sản phẩm thành công.')
            resetForm()
            await refreshProducts(keyword)
            return
        }

        setMessage(responsePayload?.message || 'Không thể lưu sản phẩm.')
    }

    const handleSearch = async () => {
        await refreshProducts(keyword.trim())
    }

    const handleEdit = async (id) => {
        const { ok, payload } = await apiRequest(`/api/products/${id}`)
        if (!ok || !payload?.success || !payload?.data) {
            setMessage(payload?.message || 'Không thể tải chi tiết sản phẩm.')
            return
        }

        const data = payload.data
        setEditingId(id)
        setImageInput('')
        setForm({
            name: data.name || '',
            brand: data.brand || '',
            price: data.price ?? '',
            stock: data.stock ?? '',
            description: data.description || '',
            images: [data.image_url || data.image].filter(Boolean),
            category_id: data.category_id ? String(data.category_id) : '',
        })
    }

    const handleDelete = async (id) => {
        const shouldDelete = window.confirm('Bạn có chắc muốn xoá sản phẩm này?')
        if (!shouldDelete) return

        const { ok, payload } = await apiRequest(`/api/products/${id}`, { method: 'DELETE' })
        if (ok && payload?.success) {
            setMessage('Xoá sản phẩm thành công.')
            await refreshProducts(keyword)
            return
        }
        setMessage(payload?.message || 'Không thể xoá sản phẩm.')
    }

    const handleAddImageUrl = () => {
        if (!imageInput.trim()) return
        setForm((prev) => ({ ...prev, images: [...prev.images, imageInput.trim()] }))
        setImageInput('')
    }

    const handleRemoveImage = (idx) => {
        setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
    }

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return
        const results = await Promise.all(
            files.map(
                (file) =>
                    new Promise((resolve) => {
                        const reader = new FileReader()
                        reader.onload = () => resolve(String(reader.result || ''))
                        reader.readAsDataURL(file)
                    })
            )
        )
        setForm((prev) => ({ ...prev, images: [...prev.images, ...results] }))
        e.target.value = ''
    }

    const brandOptions = useMemo(() => [
        ...new Set(rows.map((p) => p.brand).filter(Boolean)),
    ], [rows])

    const mappedRows = useMemo(() => rows.map((product) => ({
        ...product,
        price: formatPrice(Number(product.price || 0)),
    })), [rows])

    return (
        <>
            <section className="panel">
                <div className="panel-head">
                    <h2>Quản lý sản phẩm</h2>
                    <p>CRUD sản phẩm + tìm kiếm + upload ảnh nước hoa</p>
                </div>

                {message ? <p className="admin-status-msg">{message}</p> : null}

                <div className="admin-toolbar">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm sản phẩm theo tên"
                        style={{ color: '#000' }}
                    />
                    <button type="button" className="ghost-btn" onClick={handleSearch}>Tìm</button>
                    <button type="button" className="ghost-btn" onClick={() => { setKeyword(''); refreshProducts('') }}>
                        Reset
                    </button>
                </div>

                <div className="form-grid two-col">
                    <label className="field">
                        <span>Tên sản phẩm</span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Tên sản phẩm"
                            style={{ background: '#fff', color: '#000' }}
                        />
                    </label>
                    <label className="field">
                        <span>Thương hiệu</span>
                        <input
                            type="text"
                            list="brand-list"
                            value={form.brand}
                            onChange={(e) => setForm({ ...form, brand: e.target.value })}
                            placeholder="Thương hiệu"
                            style={{ background: '#fff', color: '#000' }}
                        />
                        <datalist id="brand-list">
                            {brandOptions.map((b) => <option key={b} value={b} />)}
                        </datalist>
                    </label>
                    <label className="field">
                        <span>Giá</span>
                        <input
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            placeholder="Giá bán"
                            style={{ background: '#fff', color: '#000' }}
                        />
                    </label>
                    <label className="field">
                        <span>Số lượng</span>
                        <input
                            type="number"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            placeholder="Số lượng tồn"
                            style={{ background: '#fff', color: '#000' }}
                        />
                    </label>
                    <label className="field">
                        <span>Danh mục</span>
                        <select
                            value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            style={{ background: '#fff', color: '#000' }}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className="field full-row">
                        <span>Mô tả</span>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Mô tả sản phẩm"
                        />
                    </label>
                    <label className="field full-row">
                        <span>Ảnh sản phẩm</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddImageUrl()}
                                placeholder="https://..."
                                style={{ background: '#fff', color: '#000', flex: 1 }}
                            />
                            <button type="button" className="ghost-btn" onClick={handleAddImageUrl}>Thêm</button>
                        </div>
                        <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ marginTop: 6 }} />
                        {form.images.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                                {form.images.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <img
                                            src={url}
                                            alt=""
                                            style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #e6cfbf', display: 'block' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            style={{
                                                position: 'absolute', top: -6, right: -6,
                                                background: '#e57373', border: 'none', color: '#fff',
                                                borderRadius: '50%', width: 18, height: 18,
                                                fontSize: 11, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                lineHeight: 1,
                                            }}
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </label>
                </div>
                <div className="admin-toolbar" style={{ marginTop: 12 }}>
                    <button type="button" className="btn-primary inline-action" onClick={handleSubmit}>
                        {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                    </button>
                    {editingId ? (
                        <button type="button" className="ghost-btn" onClick={resetForm}>Hủy sửa</button>
                    ) : null}
                </div>
            </section>

            <section className="panel">
                <div className="panel-head">
                    <h2>Danh sách sản phẩm</h2>
                    <p>{isLoading ? 'Đang tải...' : `Tổng ${mappedRows.length} sản phẩm`}</p>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Danh mục</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedRows.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--app-muted)' }}>Chưa có dữ liệu.</td></tr>
                            ) : mappedRows.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.category_id}</td>
                                    <td>
                                        <div className="admin-row-actions">
                                            <button type="button" className="ghost-btn" onClick={() => handleEdit(product.id)}>Sửa</button>
                                            <button type="button" className="logout-btn" onClick={() => handleDelete(product.id)}>Xoá</button>
                                        </div>
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
