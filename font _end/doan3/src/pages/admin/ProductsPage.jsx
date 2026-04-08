import { useState } from 'react'
import TableView from '../../components/TableView'
import { products } from '../../data/mockData'

export default function ProductsPage() {
    const [rows, setRows] = useState(products)
    const [form, setForm] = useState({
        name: '',
        brand: '',
        price: '',
        stock: '',
        category_id: '1',
    })

    const handleAddProduct = () => {
        if (!form.name.trim() || !form.brand.trim()) return

        const newProduct = {
            id: rows.length + 1,
            name: form.name,
            brand: form.brand,
            price: Number(form.price || 0),
            stock: Number(form.stock || 0),
            description: 'San pham moi duoc them boi admin',
            image_url: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1200',
            category_id: Number(form.category_id),
            created_at: new Date().toISOString().slice(0, 10),
        }

        setRows([newProduct, ...rows])
        setForm({ name: '', brand: '', price: '', stock: '', category_id: '1' })
    }

    const mappedRows = rows.map((product) => ({
        ...product,
        price: Number(product.price).toLocaleString('vi-VN'),
    }))

    return (
        <>
            <section className="panel">
                <div className="panel-head">
                    <h2>Them san pham</h2>
                    <p>Admin co quyen them san pham moi</p>
                </div>
                <div className="form-grid two-col">
                    <label className="field">
                        <span>name</span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Ten san pham"
                        />
                    </label>
                    <label className="field">
                        <span>brand</span>
                        <input
                            type="text"
                            value={form.brand}
                            onChange={(e) => setForm({ ...form, brand: e.target.value })}
                            placeholder="Thuong hieu"
                        />
                    </label>
                    <label className="field">
                        <span>price</span>
                        <input
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            placeholder="Gia ban"
                        />
                    </label>
                    <label className="field">
                        <span>stock</span>
                        <input
                            type="number"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            placeholder="So luong ton"
                        />
                    </label>
                    <label className="field">
                        <span>category_id</span>
                        <select
                            value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                        >
                            <option value="1">1 - Floral</option>
                            <option value="2">2 - Woody</option>
                            <option value="3">3 - Fresh</option>
                        </select>
                    </label>
                </div>
                <button type="button" className="btn-primary inline-action" onClick={handleAddProduct}>
                    Them san pham
                </button>
            </section>

            <TableView
                title="Products"
                description="Quan ly san pham tu bang products"
                columns={['id', 'name', 'brand', 'price', 'stock', 'description', 'image_url', 'category_id', 'created_at']}
                rows={mappedRows}
            />
        </>
    )
}
