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
            setMessage('Vui lòng nhập địa chỉ và số điện thoại.')
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
            setMessage(`Đặt hàng thành công! Mã đơn hàng: #${payload.data?.order_id}`)
            setTimeout(() => {
                if (onCheckoutSuccess) onCheckoutSuccess()
            }, 2500)
        } else {
            setMessage(payload?.message || 'Đặt hàng thất bại. Vui lòng thử lại.')
        }
    }

    return (
        <section className="panel checkout-grid">
            <div>
                <div className="panel-head">
                    <h2>Thanh toán đơn hàng</h2>
                    <p>Vui lòng điền thông tin giao hàng để hoàn tất đơn</p>
                </div>
                <div className="form-grid two-col">
                    <label className="field">
                        <span>User ID</span>
                        <input type="text" value={userId || ''} readOnly />
                    </label>
                    <label className="field">
                        <span>Điện thoại</span>
                        <input
                            type="text"
                            placeholder="0901234567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>
                    <label className="field full-row">
                        <span>Địa chỉ</span>
                        <input
                            type="text"
                            placeholder="Địa chỉ nhận hàng"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <label className="field">
                        <span>Tổng tiền</span>
                        <input type="text" value={formatPrice(total)} readOnly />
                    </label>
                </div>
                {message ? <p className="checkout-msg">{message}</p> : null}
            </div>

            <aside className="checkout-summary">
                <h3>Tổng quan đơn hàng</h3>
                <p>{cartItems.length} sản phẩm</p>
                <p>Phí vận chuyển: {formatPrice(shippingFee)}</p>
                <strong>Tổng thanh toán: {formatPrice(total)}</strong>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleCheckout}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                </button>
            </aside>
        </section>
    )
}
