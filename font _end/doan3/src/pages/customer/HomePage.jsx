import { formatPrice } from '../../data/mockData'

export default function HomePage({
    onOpenProduct,
    selectedCatalog = 'all',
    selectedCatalogLabel = 'Nước hoa',
    categoriesData = [],
    productsData = [],
}) {
    const selectedCategoryId = selectedCatalog.startsWith('category-')
        ? Number(selectedCatalog.replace('category-', ''))
        : null

    const baseProducts = Array.isArray(productsData) ? productsData : []
    const sourceList = selectedCategoryId
        ? baseProducts.filter((item) => item.category_id === selectedCategoryId)
        : baseProducts

    if (sourceList.length === 0) {
        return (
            <div className="shop-catalog-page">
                <section className="catalog-heading">
                    <h2>Nước hoa</h2>
                    <p>Trang chủ  / Nước hoa / {selectedCatalogLabel}</p>
                </section>
                <section className="panel">
                    <p>Hiện chưa có sản phẩm nào trong danh mục này.</p>
                </section>
            </div>
        )
    }

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


            <section className="catalog-product-grid">
                <div className="card-list catalog-cards">
                    {displayProducts.map((product) => (
                        <article key={product.viewId} className="product-card catalog-card">
                            <div className="gift-tag">Sale</div>
                            <img src={product.image_url} alt={product.name} className="product-photo" />
                            <div className="product-content">
                                <p className="product-brand">{product.brand}</p>
                                <h3>{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="price-row">
                                    <small>{formatPrice(product.oldPrice)}</small>
                                    <strong>{formatPrice(product.price)}</strong>
                                </div>
                            </div>
                            <div className="product-actions">
                                <button type="button" className="btn-primary" onClick={() => onOpenProduct(product.id)}>
                                    Mua ngay
                                </button>
                                <button type="button" className="ghost-btn" onClick={() => onOpenProduct(product.id)}>
                                    Chi tiết
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
