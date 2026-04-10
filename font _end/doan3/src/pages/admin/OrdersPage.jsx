import { useEffect, useState } from 'react'
import { apiRequest, resolveImageUrl } from '../../services/apiClient'
import { formatPrice } from '../../data/mockData'

const STATUS_LABEL = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    completed: 'Hoàn thành',
    delivered: 'Đã giao',
    cancelled: 'Đã huỷ',
}

export default function OrdersPage() {
    const [rows, setRows] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [detailOrder, setDetailOrder] = useState(null)
    const [detailItems, setDetailItems] = useState([])
    const [detailLoading, setDetailLoading] = useState(false)

    const fetchOrders = async () => {
        setIsLoading(true)
        const { ok, payload } = await apiRequest('/api/orders')
        setIsLoading(false)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setRows(payload.data)
            return
        }
        setMessage(payload?.message || 'Không thể tải danh sách đơn hàng.')
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleOpenDetail = async (order) => {
        setDetailOrder(order)
        setDetailItems([])
        setDetailLoading(true)
        const orderId = order.id || order.order_id
        const { ok, payload } = await apiRequest(`/api/orders/${orderId}/detail`)
        setDetailLoading(false)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setDetailItems(payload.data)
        }
    }

    const handleCancel = async (order) => {
        const orderId = order.id || order.order_id
        if (!window.confirm(`Xác nhận huỷ đơn hàng #${orderId}?`)) return
        const { ok, payload } = await apiRequest(`/api/orders/${orderId}/cancel`, {
            method: 'PATCH',
            body: JSON.stringify({ user_id: order.user_id }),
        })
        if (ok && payload?.success) {
            setMessage('Huỷ đơn hàng thành công.')
            await fetchOrders()
            return
        }
        setMessage(payload?.message || 'Không thể huỷ đơn hàng.')
    }

    const handleUpdateStatus = async (orderId, nextStatus) => {
        const { ok, payload } = await apiRequest(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: nextStatus }),
        })

        if (ok && payload?.success) {
            setMessage('Cập nhật trạng thái đơn hàng thành công.')
            await fetchOrders()
            return
        }

        setMessage(payload?.message || 'Không thể cập nhật trạng thái đơn hàng.')
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
                        width: '100%', maxWidth: 540,
                        maxHeight: '85vh', overflowY: 'auto',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ margin: 0, color: '#3d2a0a' }}>
                                Chi tiết đơn #{detailOrder.id || detailOrder.order_id}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setDetailOrder(null)}
                                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#7a5c2a' }}
                            >✕</button>
                        </div>

                        <div style={{ marginBottom: 12, fontSize: 14, color: '#5a3e1e', display: 'grid', gap: 4 }}>
                            <p style={{ margin: 0 }}>👤 Khách hàng #{detailOrder.user_id}</p>
                            <p style={{ margin: 0 }}>📍 {detailOrder.address}</p>
                            <p style={{ margin: 0 }}>📞 {detailOrder.phone}</p>
                            <div style={{ margin: '4px 0' }}>
                                <span className={`status-pill status-${detailOrder.status}`}>
                                    {STATUS_LABEL[detailOrder.status] || detailOrder.status}
                                </span>
                            </div>
                        </div>

                        {detailLoading && (
                            <p style={{ color: 'var(--app-muted)', textAlign: 'center', padding: '16px 0' }}>Đang tải...</p>
                        )}

                        {detailItems.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex', gap: 12, padding: '10px 0',
                                borderBottom: '1px solid #f0e8de',
                            }}>
                                {item.image_url ? (
                                    <img
                                        src={resolveImageUrl(item.image_url)}
                                        alt={item.product_name}
                                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #ebd6c8', flexShrink: 0 }}
                                    />
                                ) : (
                                    <div style={{ width: 64, height: 64, background: '#f5ede4', borderRadius: 8, flexShrink: 0 }} />
                                )}
                                <div style={{ flex: 1, fontSize: 14 }}>
                                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#3d2a0a' }}>{item.product_name}</p>
                                    <p style={{ margin: 0, color: '#7a5c2a' }}>
                                        {formatPrice(Number(item.price))} × {item.quantity} = <strong>{formatPrice(Number(item.subtotal))}</strong>
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: 16, textAlign: 'right' }}>
                            <strong style={{ fontSize: 16, color: '#3d2a0a' }}>
                                Tổng cộng: {formatPrice(Number(detailOrder.total_price || 0))}
                            </strong>
                        </div>
                    </div>
                </div>
            ) : null}

            <section className="panel">
                <div className="panel-head">
                    <h2>Quản lý đơn hàng</h2>
                    <p>Trạng thái: chờ xử lý, đang giao, hoàn thành</p>
                </div>

                {isLoading ? <p className="admin-status-msg">Đang tải...</p> : null}
                {message ? <p className="admin-status-msg">{message}</p> : null}

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Tổng tiền</th>
                                <th>Địa chỉ</th>
                                <th>SĐT</th>
                                <th>Trạng thái</th>
                                <th>Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && !isLoading ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--app-muted)' }}>Chưa có đơn hàng.</td></tr>
                            ) : rows.map((order) => (
                                <tr key={order.id || order.order_id}>
                                    <td>{order.id || order.order_id}</td>
                                    <td>{order.user_id}</td>
                                    <td>{formatPrice(Number(order.total_price || 0))}</td>
                                    <td>{order.address}</td>
                                    <td>{order.phone}</td>
                                    <td>
                                        <span className={`status-pill status-${order.status}`}>{STATUS_LABEL[order.status] || order.status}</span>
                                    </td>
                                    <td>
                                        <div className="admin-row-actions">
                                            <button type="button" className="ghost-btn" onClick={() => handleOpenDetail(order)}>
                                                Chi tiết
                                            </button>
                                            <button type="button" className="ghost-btn" onClick={() => handleUpdateStatus(order.id || order.order_id, 'pending')}>
                                                Chờ xử lý
                                            </button>
                                            <button type="button" className="ghost-btn" onClick={() => handleUpdateStatus(order.id || order.order_id, 'shipping')}>
                                                Đang giao
                                            </button>
                                            <button type="button" className="ghost-btn" onClick={() => handleUpdateStatus(order.id || order.order_id, 'completed')}>
                                                Hoàn thành
                                            </button>
                                            {order.status === 'pending' ? (
                                                <button type="button" className="ghost-btn" style={{ color: '#c8102e', borderColor: '#c8102e' }} onClick={() => handleCancel(order)}>
                                                    Huỷ đơn
                                                </button>
                                            ) : null}
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
