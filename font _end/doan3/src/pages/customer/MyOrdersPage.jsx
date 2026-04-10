import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/apiClient'
import { formatPrice } from '../../data/mockData'

const STATUS_LABEL = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    completed: 'Thành công',
    delivered: 'Đã giao',
    cancelled: 'Đã huỷ',
}

const STATUS_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Mới đặt' },
    { key: 'shipping', label: 'Đang vận chuyển' },
    { key: 'completed', label: 'Thành công' },
    { key: 'cancelled', label: 'Đã hủy' },
]

export default function MyOrdersPage({ userId }) {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('all')
    const [detailOrder, setDetailOrder] = useState(null)
    const [detailItems, setDetailItems] = useState([])
    const [detailLoading, setDetailLoading] = useState(false)
    const [cancelMsg, setCancelMsg] = useState('')

    const fetchOrders = async (status = 'all') => {
        setIsLoading(true)
        setError('')
        const path = status === 'all'
            ? `/api/orders/user/${userId}`
            : `/api/orders/user/${userId}?status=${status}`
        const { ok, payload } = await apiRequest(path)
        setIsLoading(false)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setOrders(payload.data)
        } else {
            setError(payload?.message || 'Không thể tải lịch sử đơn hàng.')
        }
    }

    useEffect(() => {
        if (!userId) return
        fetchOrders(activeTab)
    }, [userId])

    const filteredOrders = orders

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey)
        setCancelMsg('')
        fetchOrders(tabKey)
    }

    const handleCancelOrder = async (e, order) => {
        e.stopPropagation()
        if (!window.confirm(`Xác nhận huỷ đơn hàng #${order.order_id}?`)) return
        setCancelMsg('')
        const { ok, payload } = await apiRequest(`/api/orders/${order.order_id}/cancel`, {
            method: 'PATCH',
            body: JSON.stringify({ user_id: userId }),
        })
        if (ok && payload?.success) {
            setCancelMsg(`Đã huỷ đơn hàng #${order.order_id}.`)
            await fetchOrders(activeTab)
        } else {
            setCancelMsg(payload?.message || 'Không thể huỷ đơn hàng.')
        }
    }

    const handleOpenDetail = async (order) => {
        setDetailOrder(order)
        setDetailItems([])
        setDetailLoading(true)
        const { ok, payload } = await apiRequest(`/api/orders/${order.order_id}/detail`)
        setDetailLoading(false)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setDetailItems(payload.data)
        }
    }

    return (
        <>
            {detailOrder ? (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '24px',
                        width: '100%', maxWidth: 520,
                        maxHeight: '85vh', overflowY: 'auto',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ margin: 0, color: '#3d2a0a' }}>Chi tiết đơn #{detailOrder.order_id}</h3>
                            <button
                                type="button"
                                onClick={() => setDetailOrder(null)}
                                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#7a5c2a' }}
                            >✕</button>
                        </div>

                        <div style={{ marginBottom: 12, fontSize: 14, color: '#5a3e1e', display: 'grid', gap: 4 }}>
                            <p style={{ margin: 0 }}>📍 {detailOrder.address}</p>
                            <p style={{ margin: 0 }}>📞 {detailOrder.phone}</p>
                            <div style={{ margin: '4px 0' }}>
                                <span className={`status-pill status-${detailOrder.status}`}>
                                    {STATUS_LABEL[detailOrder.status] || detailOrder.status}
                                </span>
                            </div>
                        </div>

                        {detailLoading && <p style={{ color: 'var(--app-muted)', textAlign: 'center', padding: '16px 0' }}>Đang tải...</p>}

                        {detailItems.map((item) => (
                            <div key={item.product_id} style={{
                                display: 'flex', gap: 12, padding: '10px 0',
                                borderBottom: '1px solid #f0e8de',
                            }}>
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.product_name}
                                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #ebd6c8', flexShrink: 0 }}
                                    />
                                ) : null}
                                <div style={{ flex: 1, fontSize: 14 }}>
                                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#3d2a0a' }}>{item.product_name}</p>
                                    <p style={{ margin: 0, color: '#7a5c2a' }}>
                                        {formatPrice(item.price)} × {item.quantity} = <strong>{formatPrice(item.subtotal)}</strong>
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: 16, textAlign: 'right' }}>
                            <strong style={{ fontSize: 16, color: '#3d2a0a' }}>
                                Tổng: {formatPrice(detailOrder.total_price)}
                            </strong>
                        </div>
                    </div>
                </div>
            ) : null}

            <section className="panel">
                <div className="panel-head">
                    <h2>Đơn hàng của bạn</h2>
                    <p>Theo dõi trạng thái đơn hàng sau khi đặt mua</p>
                </div>

                {/* Tab lọc trạng thái */}
                <div className="order-status-tabs">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={activeTab === tab.key ? 'order-tab-btn active' : 'order-tab-btn'}
                            onClick={() => handleTabChange(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="order-list">
                    {isLoading && <p style={{ color: 'var(--app-muted)', textAlign: 'center', padding: '32px 0' }}>Đang tải...</p>}
                    {error && <p style={{ color: '#e08080', textAlign: 'center', padding: '32px 0' }}>{error}</p>}
                    {cancelMsg && <p style={{ color: cancelMsg.startsWith('Đã huỷ') ? '#2e7d32' : '#c8102e', textAlign: 'center', padding: '8px 0' }}>{cancelMsg}</p>}
                    {!isLoading && !error && filteredOrders.length === 0 && (
                        <p style={{ color: 'var(--app-muted)', textAlign: 'center', padding: '32px 0' }}>Chưa có đơn hàng nào.</p>
                    )}
                    {filteredOrders.map((order) => (
                        <article
                            key={order.order_id}
                            className="order-card"
                            onClick={() => handleOpenDetail(order)}
                            style={{ cursor: 'pointer', position: 'relative' }}
                        >
                            <div>
                                <h3>Mã đơn #{order.order_id}</h3>
                                <p>{order.updated_at ? new Date(order.updated_at).toLocaleString('vi-VN') : ''}</p>
                            </div>
                            <div className={`status-pill status-${order.status}`}>
                                {STATUS_LABEL[order.status] || order.status}
                            </div>
                            <p>SĐT nhận hàng: {order.phone}</p>
                            <p>{order.address}</p>
                            {order.note && <p>Ghi chú: {order.note}</p>}
                            <strong>{formatPrice(order.total_price)}</strong>
                            {order.status === 'pending' ? (
                                <button
                                    type="button"
                                    onClick={(e) => handleCancelOrder(e, order)}
                                    style={{
                                        position: 'absolute', top: 12, right: 12,
                                        padding: '5px 14px', borderRadius: 8,
                                        border: '1px solid #c8102e', background: '#fff',
                                        color: '#c8102e', fontWeight: 600, fontSize: 13,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Huỷ đơn
                                </button>
                            ) : null}
                        </article>
                    ))}
                </div>
            </section>
        </>
    )
}
