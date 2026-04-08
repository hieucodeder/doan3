import { formatPrice } from '../../data/mockData'

export default function CartPage({ cartItems = [], productsData = [], onGoCheckout }) {
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
                    <h2>Gio hang cua ban</h2>
                    <p>Du lieu tu cart va cart_items</p>
                </div>
                <div className="cart-list">
                    {rows.length === 0 ? (
                        <p>Chua co san pham trong gio hang.</p>
                    ) : (
                        rows.map((row) => (
                            <article key={row.id} className="cart-item">
                                <img src={row.image_url} alt={row.product_name} />
                                <div>
                                    <h3>{row.product_name}</h3>
                                    <p>{row.brand}</p>
                                    <small>Gia: {row.price}</small>
                                </div>
                                <div className="cart-qty">SL: {row.quantity}</div>
                                <strong>{row.total}</strong>
                            </article>
                        ))
                    )}
                </div>
            </div>

            <aside className="panel cart-summary-card">
                <h3>Tam tinh don hang</h3>
                <p>{rows.length} san pham</p>
                <div className="summary-line">
                    <span>Tong tien hang</span>
                    <strong>{formatPrice(grandTotal)}</strong>
                </div>
                <div className="summary-line">
                    <span>Phi ship</span>
                    <strong>{formatPrice(30000)}</strong>
                </div>
                <div className="summary-line total">
                    <span>Thanh toan</span>
                    <strong>{formatPrice(grandTotal + 30000)}</strong>
                </div>
                <button type="button" className="btn-primary" onClick={onGoCheckout}>
                    Tien hanh thanh toan
                </button>
            </aside>
        </section>
    )
}
