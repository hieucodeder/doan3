import { useEffect, useState } from 'react'
import { formatPrice } from '../../data/mockData'
import { apiRequest, resolveImageUrl } from '../../services/apiClient'

export default function ProductDetailPage({
    productId,
    productsData = [],
    categoriesData = [],
    userId,
    onAddToCart,
    onBuyNow,
    onOpenProduct,
}) {
    const fallbackProduct = productsData.find((item) => item.id === productId) || productsData[0]
    const [product, setProduct] = useState(fallbackProduct)
    const [selectedImage, setSelectedImage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)

    const [reviews, setReviews] = useState([])
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
    const [reviewMsg, setReviewMsg] = useState('')
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const [addedMsg, setAddedMsg] = useState('')

    useEffect(() => {
        let isMounted = true

        const fetchProductDetail = async () => {
            if (!productId) return
            setIsLoading(true)
            setError('')
            const { ok, payload } = await apiRequest(`/api/products/${productId}`)
            if (!isMounted) return
            if (ok && payload?.success && payload?.data) {
                const apiProduct = payload.data
                const fallbackImage = resolveImageUrl(apiProduct.image_url || apiProduct.image || '')
                const normalizedImages = Array.isArray(apiProduct.images)
                    ? [...new Set(apiProduct.images.map((img) => resolveImageUrl(img)).filter(Boolean))]
                    : []
                const productImages = normalizedImages.length > 0
                    ? normalizedImages
                    : (fallbackImage ? [fallbackImage] : [])
                setProduct({
                    ...apiProduct,
                    id: Number(apiProduct.id || productId),
                    price: Number(apiProduct.price || 0),
                    stock: Number(apiProduct.stock || 0),
                    category_id: Number(apiProduct.category_id || 0),
                    category_name: apiProduct.category_name || '',
                    images: productImages,
                    image_url: productImages[0] || '',
                })
            } else {
                setError(payload?.message || 'Khong tai duoc chi tiet san pham')
                setProduct(fallbackProduct)
            }
            setIsLoading(false)
        }

        fetchProductDetail()
        return () => { isMounted = false }
    }, [productId])

    useEffect(() => {
        const firstImage = Array.isArray(product?.images) && product.images.length > 0
            ? product.images[0]
            : (product?.image_url || '')
        setSelectedImage(firstImage)
    }, [productId, product?.image_url])

    const fetchReviews = async (pid) => {
        if (!pid) return
        const { ok, payload } = await apiRequest(`/api/reviews/${pid}`)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setReviews(payload.data)
        }
    }

    useEffect(() => {
        setQuantity(1)
        setReviews([])
        setReviewMsg('')
        setReviewForm({ rating: 5, comment: '' })
        if (productId) fetchReviews(productId)
    }, [productId])

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!userId) { setReviewMsg('Ban can dang nhap de danh gia.'); return }
        if (!reviewForm.comment.trim()) { setReviewMsg('Vui long nhap noi dung danh gia.'); return }
        setIsSubmittingReview(true)
        setReviewMsg('')
        const { ok, payload } = await apiRequest('/api/reviews', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                rating: reviewForm.rating,
                comment: reviewForm.comment.trim(),
            }),
        })
        setIsSubmittingReview(false)
        if (ok && payload?.success) {
            setReviewMsg('Cảm ơn bạn đã đánh giá!')
            setReviewForm({ rating: 5, comment: '' })
            await fetchReviews(productId)
        } else {
            setReviewMsg(payload?.message || 'Gửi đánh giá thất bại.')
        }
    }

    if (!product) return null

    const categoryName = product.category_name || categoriesData.find((item) => item.id === product.category_id)?.name || 'Khac'
    const relatedProducts = productsData
        .filter((p) => p.id !== product.id && Number(p.category_id) === Number(product.category_id))
        .slice(0, 4)
    const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
        : '0.0'

    const handleAddToCart = () => {
        if (onAddToCart) onAddToCart(product.id, quantity)
        setAddedMsg(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)
        clearTimeout(window.__addedMsgTimer)
        window.__addedMsgTimer = setTimeout(() => setAddedMsg(''), 2500)
    }

    const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, Math.max(product.stock || 1, 1)))
    const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1))

    return (
        <div className="shop-detail page-grid">
            <section className="panel breadcrumb-panel">
                <p>Home / Danh muc / {categoryName} / {product.name}</p>
            </section>

            {isLoading ? (
                <section className="panel">
                    <p>Dang tai chi tiet san pham...</p>
                </section>
            ) : null}

            {error ? (
                <section className="panel">
                    <p>{error}</p>
                </section>
            ) : null}

            <div className="detail-layout">
                <section className="panel product-visual">
                    <div className="product-gallery-main">
                        <img src={selectedImage || product.image_url} alt={product.name} className="product-main-photo" />
                    </div>
                    {Array.isArray(product.images) && product.images.length > 1 ? (
                        <div className="product-gallery-extra">
                            <div className="thumb-row">
                                {product.images.slice(0, 5).map((img, idx) => (
                                    <img
                                        key={`${img}-${idx}`}
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        onClick={() => setSelectedImage(img)}
                                        className={selectedImage === img ? 'thumb-item active' : 'thumb-item'}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </section>

                <section className="panel product-buy-box">
                    <h2>{product.name}</h2>
                    <p className="product-brand">Thương hiệu: <strong>{product.brand}</strong></p>
                    <div className="rating-line">
                        <span>{'★'.repeat(Math.round(Number(avgRating)))}</span>
                        <small>{avgRating}/5 ({reviews.length} đánh giá)</small>
                    </div>
                    <h3 className="price-tag">{formatPrice(product.price)}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="stats-row">
                        <span>Danh mục: {categoryName}</span>
                        <span>Còn lại: {product.stock} chai</span>
                    </div>

                    <div className="detail-info-list">
                        <div className="detail-info-item">
                            <span className="detail-info-label">Thương hiệu</span>
                            <span className="detail-info-value">{product.brand}</span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-info-label">Loại sản phẩm</span>
                            <span className="detail-info-value">{product.name}</span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-info-label">Tình trạng</span>
                            <span className="detail-info-value">{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-info-label">Mã sản phẩm</span>
                            <span className="detail-info-value">SP{String(product.id).padStart(4, '0')}</span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-info-label">Danh mục</span>
                            <span className="detail-info-value">{categoryName}</span>
                        </div>
                    </div>

                    <div className="buy-actions">
                        <div className="qty-box">
                            <span>Số lượng</span>
                            <div className="qty-control">
                                <button type="button" onClick={decreaseQty}>-</button>
                                <input type="text" value={quantity} readOnly />
                                <button type="button" onClick={increaseQty}>+</button>
                            </div>
                        </div>
                        <div className="buy-actions-row">
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                type="button"
                                className="ghost-btn"
                                onClick={() => onBuyNow && onBuyNow(product.id, quantity)}
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                    {addedMsg ? (
                        <div style={{
                            marginTop: '10px',
                            padding: '10px 14px',
                            background: '#f0fdf4',
                            border: '1px solid #86efac',
                            borderRadius: '10px',
                            color: '#166534',
                            fontSize: '14px',
                            fontWeight: 600,
                        }}>
                            ✓ {addedMsg}
                        </div>
                    ) : null}
                </section>
            </div>

            {relatedProducts.length > 0 && (
                <section className="panel full">
                    <div className="panel-head">
                        <h2>Sản phẩm gợi ý</h2>
                        <p>Cùng danh mục {categoryName}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {relatedProducts.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => onOpenProduct && onOpenProduct(p.id)}
                                style={{
                                    width: 160,
                                    cursor: 'pointer',
                                    border: '1px solid #e6cfbf',
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    background: '#fff',
                                    transition: 'box-shadow 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px #c8a96e33'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <img
                                    src={resolveImageUrl(p.image_url || p.image || '')}
                                    alt={p.name}
                                    style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{ padding: '8px 10px' }}>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#3b2a1a', lineHeight: 1.3 }}>
                                        {p.name}
                                    </p>
                                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#b8860b', fontWeight: 700 }}>
                                        {formatPrice(Number(p.price || 0))}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="panel shipping-notes">
                <article>
                    <strong>Giao nhanh</strong>
                    <p>Nội thành 2h, ngoại thành 1-3 ngày.</p>
                </article>
                <article>
                    <strong>Cam kết chính hãng</strong>
                    <p>Hoàn tiền 200% nếu phát hiện hàng giả.</p>
                </article>
                <article>
                    <strong>Hỗ trợ đổi trả</strong>
                    <p>Đổi trả 7 ngày nếu lỗi nhà sản xuất.</p>
                </article>
            </section>

            <section className="panel full">
                <div className="panel-head">
                    <h2>Đánh giá sản phẩm</h2>
                    <p>{avgRating}/5 — {reviews.length} đánh giá từ khách đã mua hàng</p>
                </div>

                <form className="review-form" onSubmit={handleSubmitReview}>
                    <div className="review-form-rating">
                        <span>Đánh giá của bạn:</span>
                        <div className="star-picker">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className={s <= reviewForm.rating ? 'star active' : 'star'}
                                    onClick={() => setReviewForm((p) => ({ ...p, rating: s }))}
                                >★</button>
                            ))}
                        </div>
                    </div>
                    <textarea
                        className="review-textarea"
                        placeholder="Nhập nhận xét của bạn..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                        rows={3}
                    />
                    <div className="review-form-footer">
                        {reviewMsg ? <span className="review-msg">{reviewMsg}</span> : <span />}
                        <button type="submit" className="btn-primary review-submit-btn" disabled={isSubmittingReview}>
                            {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </div>
                </form>

                <div className="review-list">
                    {reviews.length === 0 ? (
                        <p className="review-empty">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                    ) : reviews.map((review, idx) => (
                        <article key={review.id ?? idx} className="review-item">
                            <div className="review-header">
                                <span className="review-author">{review.name || 'Ẩn danh'}</span>
                                <small className="review-date">{review.created_at ? new Date(review.created_at).toLocaleDateString('vi-VN') : ''}</small>
                            </div>
                            <span className="review-stars">{'★'.repeat(Number(review.rating))}{'☆'.repeat(5 - Number(review.rating))}</span>
                            <p className="review-comment">{review.comment}</p>
                        </article>
                    ))}
                </div>
            </section>

        </div>
    )
}
