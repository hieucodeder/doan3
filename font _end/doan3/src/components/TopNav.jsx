export default function TopNav({
    title,
    tabs,
    activeTab,
    onChangeTab,
    roleLabel,
    onLogout,
    userName,
    cartCount = 0,
    selectedCatalog = 'all',
    menuCategories = [],
}) {
    if (roleLabel === 'customer') {
        const menuItems = [
            { label: 'Nuoc hoa', tab: 'home', catalog: 'all' },
            ...menuCategories.map((category) => ({
                label: category.name,
                tab: 'home',
                catalog: `category-${category.id}`,
            })),
        ]

        return (
            <header className="shop-header-v2">
                <div className="shop-top-strip">
                    <p>NUOC HOA & MY PHAM CHINH HANG TU 2004</p>
                    <div className="shop-top-search">
                        <input type="text" placeholder="Tim kiem nuoc hoa cua ban" />
                        <button type="button">Tim kiem</button>
                    </div>
                    <div className="shop-top-links">
                        <span>Gioi thieu ve shop</span>
                        <span>Lich su mua hang</span>
                    </div>
                </div>

                <div className="shop-main-nav">
                    <div className="logo-block">
                        <h1>ORCHID</h1>
                        <p>Perfumes & Cosmetics</p>
                    </div>

                    <nav className="shop-menu-links">
                        {menuItems.map((item) => (
                            <button
                                type="button"
                                key={item.label}
                                onClick={() => onChangeTab(item.tab, item.catalog, item.label)}
                                className={selectedCatalog === item.catalog ? 'active' : ''}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="shop-account-tools">
                        <button type="button" className="user-pill">Xin chao {userName}</button>
                        <button type="button" className="cart-pill" onClick={() => onChangeTab('cart')}>
                            Gio hang
                            <span className="cart-dot">{cartCount}</span>
                        </button>
                        {onLogout ? (
                            <button type="button" className="logout-btn" onClick={onLogout}>
                                Dang xuat
                            </button>
                        ) : null}
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="portal-header">
            <div>
                <p className="portal-eyebrow">Doan3 Perfume Shop</p>
                <h1>{title}</h1>
                {roleLabel ? <p className="role-label">Vai tro: {roleLabel}</p> : null}
            </div>
            <div className="topnav-actions">
                <div className="tab-list">
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.key}
                            onClick={() => onChangeTab(tab.key)}
                            className={activeTab === tab.key ? 'tab-item active' : 'tab-item'}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {onLogout ? (
                    <button type="button" className="logout-btn" onClick={onLogout}>
                        Dang xuat
                    </button>
                ) : null}
            </div>
        </header>
    )
}
