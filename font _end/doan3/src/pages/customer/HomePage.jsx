import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '../../data/mockData'
import { apiRequest } from '../../services/apiClient'

export default function HomePage({
    onOpenProduct,
    selectedCatalog = 'all',
    selectedCatalogLabel = 'Nước hoa',
    productsData = [],
}) {
    const selectedCategoryId = selectedCatalog.startsWith('category-')
        ? Number(selectedCatalog.replace('category-', ''))
        : null

    const baseProducts = useMemo(() => (Array.isArray(productsData) ? productsData : []), [productsData])
    const sourceList = selectedCategoryId
        ? baseProducts.filter((item) => item.category_id === selectedCategoryId)
        : baseProducts

    const [ratings, setRatings] = useState({})

    useEffect(() => {
        if (baseProducts.length === 0) return
        let isMounted = true
        const fetchAllRatings = async () => {
            const results = await Promise.all(
                baseProducts.map((p) => apiRequest(`/api/reviews/${p.id}`))
            )
            if (!isMounted) return
            const map = {}
            baseProducts.forEach((p, i) => {
                const data = results[i]?.payload?.data
                if (Array.isArray(data) && data.length > 0) {
                    const avg = data.reduce((s, r) => s + Number(r.rating), 0) / data.length
                    map[p.id] = { avg: avg.toFixed(1), count: data.length }
                } else {
                    map[p.id] = { avg: '0.0', count: 0 }
                }
            })
            setRatings(map)
        }
        fetchAllRatings()
        return () => { isMounted = false }
    }, [baseProducts])

    const displayProducts = sourceList.map((product) => ({
        ...product,
        viewId: `${product.id}`,
        oldPrice: Math.round(product.price * 1.22),
    }))

    return (
        <div className="shop-catalog-page">
            <section className="catalog-heading">
                <h2>Nước hoa</h2>
                <p>Trang chủ / Nước hoa / {selectedCatalogLabel}</p>
            </section>

            {sourceList.length === 0 ? (
                <section className="panel">
                    <p>Hiện chưa có sản phẩm nào trong danh mục này.</p>
                </section>
            ) : (
            <section className="catalog-product-grid">
                <div className="card-list catalog-cards">
                    {displayProducts.map((product) => (
                        <article key={product.viewId} className="product-card catalog-card" onClick={() => onOpenProduct(product.id)} style={{ cursor: 'pointer' }}>
                            <div className="gift-tag">Sale</div>
                            <img src={product.image_url} alt={product.name} className="product-photo" />
                            <div className="product-content">
                                <p className="product-brand">{product.brand}</p>
                                <h3>{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                {ratings[product.id] ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '4px 0' }}>
                                        <span style={{ color: '#c6782c', fontSize: '13px' }}>
                                            {'★'.repeat(Math.round(Number(ratings[product.id].avg)))}{'☆'.repeat(5 - Math.round(Number(ratings[product.id].avg)))}
                                        </span>
                                        <small style={{ color: '#7a5c2a', fontSize: '12px' }}>
                                            {ratings[product.id].avg} ({ratings[product.id].count})
                                        </small>
                                    </div>
                                ) : null}
                                <div className="price-row">
                                    <small>{formatPrice(product.oldPrice)}</small>
                                    <strong>{formatPrice(product.price)}</strong>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            )}
        </div>
    )
}
