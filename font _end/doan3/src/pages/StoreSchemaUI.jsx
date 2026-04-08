import { useMemo, useState } from 'react'
import './StoreSchemaUI.css'

const TABLES = [
    {
        key: 'users',
        title: 'Users',
        description: 'Quản lý tài khoản khách hàng và quản trị viên.',
        columns: ['id', 'name', 'email', 'password', 'role', 'created_at'],
    },
    {
        key: 'categories',
        title: 'Categories',
        description: 'Danh mục nước hoa theo nhóm mùi, mùa, giới tính.',
        columns: ['id', 'name', 'description'],
    },
    {
        key: 'products',
        title: 'Products',
        description: 'Thông tin sản phẩm nước hoa, tồn kho và giá bán.',
        columns: [
            'id',
            'name',
            'brand',
            'price',
            'stock',
            'description',
            'image_url',
            'category_id',
            'created_at',
        ],
    },
    {
        key: 'cart',
        title: 'Cart',
        description: 'Giỏ hàng của từng user trước khi tạo đơn.',
        columns: ['id', 'user_id', 'created_at'],
    },
    {
        key: 'cart_items',
        title: 'Cart Items',
        description: 'Chi tiết các sản phẩm nằm trong giỏ hàng.',
        columns: ['id', 'cart_id', 'product_id', 'quantity'],
    },
    {
        key: 'orders',
        title: 'Orders',
        description: 'Đơn hàng với trạng thái vận chuyển.',
        columns: [
            'id',
            'user_id',
            'total_price',
            'status',
            'address',
            'phone',
            'created_at',
        ],
    },
    {
        key: 'order_items',
        title: 'Order Items',
        description: 'Danh sách sản phẩm thuộc mỗi đơn hàng.',
        columns: ['id', 'order_id', 'product_id', 'price', 'quantity'],
    },
    {
        key: 'reviews',
        title: 'Reviews',
        description: 'Đánh giá sản phẩm từ người dùng sau mua hàng.',
        columns: ['id', 'user_id', 'product_id', 'rating', 'comment', 'created_at'],
    },
]

const MOCK_ROWS = {
    users: [
        {
            id: 1,
            name: 'Linh Tran',
            email: 'linh@email.com',
            role: 'user',
            created_at: '2026-04-02 09:10',
        },
        {
            id: 2,
            name: 'Admin Store',
            email: 'admin@luxe.vn',
            role: 'admin',
            created_at: '2026-04-01 10:15',
        },
    ],
    categories: [
        { id: 1, name: 'Floral', description: 'Mùi hoa nữ tính, thanh lịch' },
        { id: 2, name: 'Woody', description: 'Mùi gỗ ấm, sang trọng' },
    ],
    products: [
        {
            id: 1,
            name: 'Noir Rose 50ml',
            brand: 'Luxe',
            price: '1490000',
            stock: 18,
            category_id: 1,
            created_at: '2026-04-04',
        },
        {
            id: 2,
            name: 'Amber Night 100ml',
            brand: 'Maison',
            price: '2350000',
            stock: 9,
            category_id: 2,
            created_at: '2026-04-05',
        },
    ],
    cart: [
        { id: 88, user_id: 1, created_at: '2026-04-08 07:21' },
        { id: 89, user_id: 2, created_at: '2026-04-08 08:03' },
    ],
    cart_items: [
        { id: 1, cart_id: 88, product_id: 1, quantity: 2 },
        { id: 2, cart_id: 88, product_id: 2, quantity: 1 },
    ],
    orders: [
        {
            id: 5001,
            user_id: 1,
            total_price: '5330000',
            status: 'shipping',
            phone: '0901234567',
            created_at: '2026-04-08 09:44',
        },
        {
            id: 5002,
            user_id: 2,
            total_price: '1490000',
            status: 'pending',
            phone: '0912345678',
            created_at: '2026-04-08 10:12',
        },
    ],
    order_items: [
        { id: 1, order_id: 5001, product_id: 2, price: '2350000', quantity: 2 },
        { id: 2, order_id: 5002, product_id: 1, price: '1490000', quantity: 1 },
    ],
    reviews: [
        {
            id: 1,
            user_id: 1,
            product_id: 2,
            rating: 5,
            comment: 'Mùi giữ rất lâu, sang trọng.',
            created_at: '2026-04-06 18:33',
        },
        {
            id: 2,
            user_id: 2,
            product_id: 1,
            rating: 4,
            comment: 'Mùi ngọt nhẹ, dùng đi làm hợp.',
            created_at: '2026-04-07 14:27',
        },
    ],
}

function InfoPill({ text }) {
    return <span className="pill">{text}</span>
}

function DataTable({ tableKey, columns }) {
    const rows = MOCK_ROWS[tableKey] || []

    return (
        <div className="table-shell">
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            {columns.map((column) => (
                                <td key={`${row.id}-${column}`}>{row[column] ?? '-'}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function FormPreview({ tableKey }) {
    const fields = useMemo(() => {
        const table = TABLES.find((item) => item.key === tableKey)
        if (!table) return []
        return table.columns.filter((col) => col !== 'id' && col !== 'created_at')
    }, [tableKey])

    return (
        <div className="form-preview">
            <h4>Form nhập liệu ({tableKey})</h4>
            <div className="form-grid">
                {fields.map((field) => (
                    <label key={field} className="field">
                        <span>{field}</span>
                        <input type="text" placeholder={`Nhập ${field}`} />
                    </label>
                ))}
            </div>
            <div className="action-row">
                <button type="button" className="btn btn-primary">Thêm mới</button>
                <button type="button" className="btn">Cập nhật</button>
                <button type="button" className="btn btn-danger">Xóa</button>
            </div>
        </div>
    )
}

function RelationshipMap() {
    return (
        <section className="schema-relation">
            <h3>Quan hệ giữa các bảng</h3>
            <div className="relation-grid">
                <div className="relation-card">
                    <p>users 1 - n orders</p>
                    <p>users 1 - n reviews</p>
                    <p>users 1 - n cart</p>
                </div>
                <div className="relation-card">
                    <p>categories 1 - n products</p>
                    <p>products 1 - n reviews</p>
                    <p>products 1 - n cart_items</p>
                </div>
                <div className="relation-card">
                    <p>cart 1 - n cart_items</p>
                    <p>orders 1 - n order_items</p>
                    <p>products 1 - n order_items</p>
                </div>
            </div>
        </section>
    )
}

export default function StoreSchemaUI() {
    const [activeTable, setActiveTable] = useState('products')
    const current = TABLES.find((table) => table.key === activeTable)

    return (
        <div className="schema-page">
            <header className="schema-header">
                <p className="eyebrow">Doan3 Perfume Shop</p>
                <h1>Giao diện mẫu theo cấu trúc CSDL</h1>
                <p>
                    Thiết kế này bám trực tiếp các bảng trong MySQL để bạn triển khai frontend trước,
                    backend kết nối sau.
                </p>
            </header>

            <section className="overview-cards">
                <article>
                    <h3>8 bảng</h3>
                    <p>Đầy đủ user, sản phẩm, giỏ hàng, đơn hàng, đánh giá.</p>
                </article>
                <article>
                    <h3>2 vai trò</h3>
                    <p>Phân quyền user và admin từ bảng users.role.</p>
                </article>
                <article>
                    <h3>Form CRUD</h3>
                    <p>Mỗi bảng có khối form minh họa thêm, sửa, xóa dữ liệu.</p>
                </article>
            </section>

            <section className="workspace-layout">
                <aside className="table-nav">
                    <h3>Danh sách bảng</h3>
                    <div className="table-list">
                        {TABLES.map((table) => (
                            <button
                                key={table.key}
                                type="button"
                                className={table.key === activeTable ? 'table-item active' : 'table-item'}
                                onClick={() => setActiveTable(table.key)}
                            >
                                <span>{table.title}</span>
                                <small>{table.columns.length} cột</small>
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="table-detail">
                    {current && (
                        <>
                            <div className="table-head">
                                <div>
                                    <h2>{current.title}</h2>
                                    <p>{current.description}</p>
                                </div>
                                <div className="pill-wrap">
                                    {current.columns.map((column) => (
                                        <InfoPill key={column} text={column} />
                                    ))}
                                </div>
                            </div>

                            <DataTable tableKey={current.key} columns={current.columns} />
                            <FormPreview tableKey={current.key} />
                        </>
                    )}
                </main>
            </section>

            <RelationshipMap />
        </div>
    )
}
