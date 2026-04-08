import { useState } from 'react'
import { formatPrice } from '../../data/mockData'
import { apiRequest } from '../../services/apiClient'

export default function CheckoutPage({ cartItems = [], productsData = [], userId, onCheckoutSuccess }) {
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    const subtotal = cartItems.reduce((sum, item) => {
        const product = productsData.find((p) => p.id === item.product_id)
        return sum + (product?.price || 0) * item.quantity
    }, 0)
    const shippingFee = cartItems.length > 0 ? 30000 : 0
    const total = subtotal + shippingFee

    const handleCheckout = async () => {
        if (!phone || !address) {
            setMessage('Vui long nhap dia chi va so dien thoai.')
            return
        }
        setIsLoading(true)
        setMessage('')
        const { ok, payload } = await apiRequest('/api/orders/checkout', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, address, phone }),
        })
        setIsLoading(false)
        if (ok && payload?.success) {
            setMessage(`Dat hang thanh cong! Ma don hang: #${payload.data?.order_id}`)
            setTimeout(() => {
                if (onCheckoutSuccess) onCheckoutSuccess()
            }, 2500)
        } else {
            setMessage(payload?.message || 'Dat hang that bai. Vui long thu lai.')
        }
    }

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
                        <input type="text" value={userId || ''} readOnly />
                    </label>
                    <label className="field">
                        <span>phone</span>
                        <input
                            type="text"
                            placeholder="0901234567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>
                    <label className="field full-row">
                        <span>address</span>
                        <input
                            type="text"
                            placeholder="Dia chi nhan hang"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <label className="field">
                        <span>total_price</span>
                        <input type="text" value={formatPrice(total)} readOnly />
                    </label>
                </div>
                {message ? <p className="checkout-msg">{message}</p> : null}
            </div>

            <aside className="checkout-summary">
                <h3>Tong quan don hang</h3>
                <p>{cartItems.length} san pham</p>
                <p>Phi van chuyen: {formatPrice(shippingFee)}</p>
                <strong>Tong thanh toan: {formatPrice(total)}</strong>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleCheckout}
                    disabled={isLoading}
                >
                    {isLoading ? 'Dang xu ly...' : 'Dat hang ngay'}
                </button>
            </aside>
        </section>
    )
}
