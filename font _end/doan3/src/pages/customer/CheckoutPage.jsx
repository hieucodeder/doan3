import { formatPrice } from '../../data/mockData'

export default function CheckoutPage({ cartItems = [], productsData = [] }) {
    const subtotal = cartItems.reduce((sum, item) => {
        const product = productsData.find((p) => p.id === item.product_id)
        return sum + (product?.price || 0) * item.quantity
    }, 0)
    const shippingFee = cartItems.length > 0 ? 30000 : 0
    const total = subtotal + shippingFee

    return (
        <section className="panel checkout-grid">
            <div>
                <div className="panel-head">
                    <h2>Thanh toan don hang</h2>
                    <p>Vui long dien thong tin giao hang de hoan tat don</p>
                </div>
                <div className="form-grid two-col">
                    <label className="field">
                        <span>user_id</span>
                        <input type="text" defaultValue="1" />
                    </label>
                    <label className="field">
                        <span>phone</span>
                        <input type="text" placeholder="0901234567" />
                    </label>
                    <label className="field full-row">
                        <span>address</span>
                        <input type="text" placeholder="Dia chi nhan hang" />
                    </label>
                    <label className="field">
                        <span>status</span>
                        <select defaultValue="pending">
                            <option value="pending">pending</option>
                            <option value="shipping">shipping</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                        </select>
                    </label>
                    <label className="field">
                        <span>total_price</span>
                        <input type="text" value={formatPrice(total)} readOnly />
                    </label>
                </div>
            </div>

            <aside className="checkout-summary">
                <h3>Tong quan don hang</h3>
                <p>{cartItems.length} san pham</p>
                <p>Phi van chuyen: {formatPrice(shippingFee)}</p>
                <strong>Tong thanh toan: {formatPrice(total)}</strong>
                <button type="button" className="btn-primary">Dat hang ngay</button>
            </aside>
        </section>
    )
}
