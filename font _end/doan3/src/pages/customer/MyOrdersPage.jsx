import { formatPrice, orders } from '../../data/mockData'

export default function MyOrdersPage() {
    return (
        <section className="panel">
            <div className="panel-head">
                <h2>Don hang cua toi</h2>
                <p>Theo doi trang thai don hang sau khi dat mua</p>
            </div>
            <div className="order-list">
                {orders.map((order) => (
                    <article key={order.id} className="order-card">
                        <div>
                            <h3>Ma don #{order.id}</h3>
                            <p>{order.created_at}</p>
                        </div>
                        <div className={`status-pill status-${order.status}`}>{order.status}</div>
                        <p>SDT nhan hang: {order.phone}</p>
                        <p>{order.address}</p>
                        <strong>{formatPrice(order.total_price)}</strong>
                    </article>
                ))}
            </div>
        </section>
    )
}
