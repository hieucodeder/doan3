import { formatPrice } from '../../data/mockData'

export default function CartPage({ cartItems = [], productsData = [], onGoCheckout, onRemoveFromCart, onUpdateCartQty }) {
    const rows = cartItems.map((item) => {
        const product = productsData.find((p) => p.id === item.product_id)
        const total = (product?.price || 0) * item.quantity
        return {
            ...item,
            image_url: product?.image_url || '',
            product_name: product?.name || '-',
            brand: product?.brand || '-',
            price: formatPrice(product?.price || 0),
            numericTotal: total,
            total: formatPrice(total),
        }
    })

    const grandTotal = rows.reduce((sum, row) => sum + row.numericTotal, 0)

    return (
        <section className="cart-layout">
            <div className="panel">
                <div className="panel-head">
                    <h2>Giỏ hàng của bạn</h2>
                    <p>Kiểm tra các sản phẩm bạn đã thêm vào giỏ hàng.</p>
                </div>
                <div className="cart-list">
                    {rows.length === 0 ? (
                        <p>Chưa có sản phẩm trong giỏ hàng.</p>
                    ) : (
                        rows.map((row) => (
                            <article key={row.id} className="cart-item">
                                <img src={row.image_url} alt={row.product_name} />
                                <div>
                                    <h3>{row.product_name}</h3>
                                    <p>{row.brand}</p>
                                    <small>Gia: {row.price}</small>
                                </div>
                                <div className="cart-qty">
                                    <button type="button" onClick={() => onUpdateCartQty && onUpdateCartQty(row.product_id, row.quantity - 1)}>-</button>
                                    <span>{row.quantity}</span>
                                    <button type="button" onClick={() => onUpdateCartQty && onUpdateCartQty(row.product_id, row.quantity + 1)}>+</button>
                                </div>
                                <strong>{row.total}</strong>
                                <button
                                    type="button"
                                    className="cart-remove-btn"
                                    onClick={() => onRemoveFromCart && onRemoveFromCart(row.product_id)}
                                >
                                    ✕
                                </button>
                            </article>
                        ))
                    )}
                </div>
            </div>

            <aside className="panel cart-summary-card">
                <h3>Tạm tính đơn hàng</h3>
                <p>{rows.length} sản phẩm</p>
                <div className="summary-line">
                    <span>Tổng tiền hàng </span>
                    <strong>{formatPrice(grandTotal)}</strong>
                </div>
                <div className="summary-line">
                    <span>Phí ship</span>
                    <strong>{formatPrice(30000)}</strong>
                </div>
                <div className="summary-line total">
                    <span>Thanh toán</span>
                    <strong>{formatPrice(grandTotal + 30000)}</strong>
                </div>
                <button type="button" className="btn-primary" onClick={onGoCheckout}>
                    Tiến hành thanh toán
                </button>
            </aside>
        </section>
    )
}
