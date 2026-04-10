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
    const [form, setForm] = useState({
        name: '',
        brand: '',
        price: '',
        stock: '',
        description: '',
        image_url: '',
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
        setForm({
            name: '',
            brand: '',
            price: '',
            stock: '',
            description: '',
            image_url: '',
            category_id: categories[0]?.id ? String(categories[0].id) : '',
        })
    }

    const handleSubmit = async () => {
        if (!form.name.trim()) return

        const payload = {
            name: form.name,
            brand: form.brand,
            price: Number(form.price || 0),
            stock: Number(form.stock || 0),
            description: form.description,
            image_url: form.image_url,
            category_id: Number(form.category_id),
        }

        const endpoint = editingId ? `/api/products/${editingId}` : '/api/products'
        const method = editingId ? 'PUT' : 'POST'

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
        setForm({
            name: data.name || '',
            brand: data.brand || '',
            price: data.price ?? '',
            stock: data.stock ?? '',
            description: data.description || '',
            image_url: data.image_url || data.image || '',
            category_id: String(data.category_id || ''),
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

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setForm((prev) => ({ ...prev, image_url: String(reader.result || '') }))
        }
        reader.readAsDataURL(file)
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
                        <span>URL ảnh</span>
                        <input
                            type="text"
                            value={form.image_url}
                            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                            placeholder="https://..."
                            style={{ background: '#fff', color: '#000' }}
                        />
                    </label>
                    <label className="field full-row">
                        <span>Upload ảnh hoa</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                {form.image_url ? (
                    <img src={form.image_url} alt="Preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 10, border: '1px solid #e6cfbf' }} />
                ) : null}
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
