import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/apiClient'
import { formatPrice } from '../../data/mockData'

const STATUS_LABEL = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã huỷ',
}

export default function MyOrdersPage({ userId }) {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!userId) return
        const fetchOrders = async () => {
            setIsLoading(true)
            setError('')
            const { ok, payload } = await apiRequest(`/api/orders/history/${userId}`)
            setIsLoading(false)
            if (ok && payload?.success && Array.isArray(payload.data)) {
                setOrders(payload.data)
            } else {
                setError(payload?.message || 'Không thể tải lịch sử đơn hàng.')
            }
        }
        fetchOrders()
    }, [userId])

    return (
        <section className="panel">
            <div className="panel-head">
                <h2>Lịch sử mua hàng</h2>
                <p>Theo dõi trạng thái đơn hàng sau khi đặt mua</p>
            </div>
            <div className="order-list">
                {isLoading && <p style={{ color: 'var(--app-muted)', textAlign: 'center', padding: '32px 0' }}>Đang tải...</p>}
                {error && <p style={{ color: '#e08080', textAlign: 'center', padding: '32px 0' }}>{error}</p>}
                {!isLoading && !error && orders.length === 0 && (
                    <p style={{ color: 'var(--app-muted)', textAlign: 'center', padding: '32px 0' }}>Chưa có đơn hàng nào.</p>
                )}
                {orders.map((order) => (
                    <article key={order.order_id} className="order-card">
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
                    </article>
                ))}
            </div>
        </section>
    )
}
