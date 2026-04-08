import { useEffect, useState } from 'react'
import { formatPrice, reviews } from '../../data/mockData'
import { apiRequest, resolveImageUrl } from '../../services/apiClient'

export default function ProductDetailPage({
    productId,
    productsData = [],
    categoriesData = [],
    onAddToCart,
    onBuyNow,
}) {
    const fallbackProduct = productsData.find((item) => item.id === productId) || productsData[0]
    const [product, setProduct] = useState(fallbackProduct)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)

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
                setProduct({
                    ...apiProduct,
                    id: Number(apiProduct.id || productId),
                    price: Number(apiProduct.price || 0),
                    stock: Number(apiProduct.stock || 0),
                    category_id: Number(apiProduct.category_id || 0),
                    image_url: resolveImageUrl(apiProduct.image_url || apiProduct.image || ''),
                })
            } else {
                setError(payload?.message || 'Khong tai duoc chi tiet san pham')
                setProduct(fallbackProduct)
            }

            setIsLoading(false)
        }

        fetchProductDetail()

        return () => {
            isMounted = false
        }
    }, [productId, fallbackProduct])

    useEffect(() => {
        setQuantity(1)
    }, [product?.id])

    if (!product) return null

    const productReviews = reviews.filter((review) => review.product_id === product.id)
    const categoryName = categoriesData.find((item) => item.id === product.category_id)?.name || 'Khac'
    const avgRating = productReviews.length
        ? (productReviews.reduce((sum, item) => sum + item.rating, 0) / productReviews.length).toFixed(1)
        : '0.0'

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
                    <img src={product.image_url} alt={product.name} className="product-main-photo" />
                    <div className="thumb-row">
                        <img src={product.image_url} alt={product.name} />
                        <img src={product.image_url} alt={product.name} />
                        <img src={product.image_url} alt={product.name} />
                    </div>
                </section>

                <section className="panel product-buy-box">
                    {/* <p className="badge">Product Detail</p> */}
                    <h2>{product.name}</h2>
                    <p className="product-brand">Thuong hieu: {product.brand}</p>
                    <div className="rating-line">
                        <span>{'★'.repeat(Math.round(Number(avgRating)))}</span>
                        <small>{avgRating}/5 ({productReviews.length} danh gia)</small>
                    </div>
                    <h3 className="price-tag">{formatPrice(product.price)}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="stats-row">
                        <span>Category: {categoryName}</span>
                        <span>Con lai: {product.stock} chai</span>
                    </div>
                    <div className="buy-actions">
                        <div className="qty-box">
                            <span>So luong</span>
                            <div className="qty-control">
                                <button type="button" onClick={decreaseQty}>-</button>
                                <input type="text" value={quantity} readOnly />
                                <button type="button" onClick={increaseQty}>+</button>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => onAddToCart && onAddToCart(product.id, quantity)}
                        >
                            Them vao gio hang
                        </button>
                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => onBuyNow && onBuyNow(product.id, quantity)}
                        >
                            Mua ngay
                        </button>
                    </div>
                </section>
            </div>

            <section className="panel shipping-notes">
                <article>
                    <strong>Giao nhanh</strong>
                    <p>Noi thanh 2h, ngoai thanh 1-3 ngay.</p>
                </article>
                <article>
                    <strong>Cam ket chinh hang</strong>
                    <p>Hoan tien 200% neu phat hien hang gia.</p>
                </article>
                <article>
                    <strong>Ho tro doi tra</strong>
                    <p>Doi tra 7 ngay neu loi nha san xuat.</p>
                </article>
            </section>

            <section className="panel full">
                <div className="panel-head">
                    <h2>Danh gia san pham</h2>
                    <p>Danh gia tu khach da mua hang</p>
                </div>
                <div className="review-list">
                    {productReviews.map((review) => (
                        <article key={review.id} className="review-item">
                            <strong>{'★'.repeat(review.rating)}</strong>
                            <p>{review.comment}</p>
                            <small>{review.created_at}</small>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
