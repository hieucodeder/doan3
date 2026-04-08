import { formatPrice } from '../../data/mockData'

export default function HomePage({
    onOpenProduct,
    selectedCatalog = 'all',
    selectedCatalogLabel = 'Nuoc hoa',
    categoriesData = [],
    productsData = [],
}) {
    const selectedCategoryId = selectedCatalog.startsWith('category-')
        ? Number(selectedCatalog.replace('category-', ''))
        : null

    const baseProducts = Array.isArray(productsData) ? productsData : []
    const matchedProducts = selectedCategoryId
        ? baseProducts.filter((item) => item.category_id === selectedCategoryId)
        : baseProducts
    const sourceList = matchedProducts.length > 0 ? matchedProducts : baseProducts

    if (sourceList.length === 0) {
        return (
            <div className="shop-catalog-page">
                <section className="catalog-heading">
                    <h2>Nuoc Hoa</h2>
                    <p>Trang chu / Nuoc Hoa / {selectedCatalogLabel}</p>
                </section>
                <section className="panel">
                    <p>Chua co du lieu san pham tu API.</p>
                </section>
            </div>
        )
    }

    const displayProducts = Array.from({ length: Math.max(8, sourceList.length * 2) }, (_, index) => {
        const source = sourceList[index % sourceList.length]
        return {
            ...source,
            viewId: `${source.id}-${index}`,
            oldPrice: Math.round(source.price * 1.22),
        }
    })

    return (
        <div className="shop-catalog-page">
            <section className="catalog-heading">
                <h2>Nuoc Hoa</h2>
                <p>Trang chu / Nuoc Hoa / {selectedCatalogLabel}</p>
            </section>

            <section className="catalog-filter-row panel">
                <div className="filter-actions">
                    <button type="button">Nhom huong</button>
                    <button type="button">Nam / Nu</button>
                    <button type="button">Duoi 2 trieu</button>
                    <button type="button">2 - 4 trieu</button>
                    <button type="button">Tren 4 trieu</button>
                </div>
            </section>

            <section className="catalog-chip-row">
                <div className="chips shop-chips">
                    {categoriesData.map((category) => (
                        <span className="chip" key={category.id}>
                            {category.name}
                        </span>
                    ))}
                </div>
            </section>

            <section className="catalog-product-grid">
                <div className="card-list catalog-cards">
                    {displayProducts.map((product) => (
                        <article key={product.viewId} className="product-card catalog-card">
                            <div className="gift-tag">QUA TANG</div>
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
                                    Chi tiet
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
