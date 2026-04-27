import { useEffect, useRef, useState } from 'react'
import { resolveImageUrl } from '../services/apiClient'

function LogoutDialog({ onConfirm, onCancel }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                background: '#fff', borderRadius: '12px', padding: '32px 28px',
                minWidth: '300px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}>
                <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#1a1008' }}>Xác nhận đăng xuất</p>
                <p style={{ fontSize: '14px', color: '#7a5c2a', marginBottom: '24px' }}>Bạn có chắc muốn đăng xuất không?</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '9px 24px', borderRadius: '8px', border: '1px solid #c9a84c',
                            background: '#fff', color: '#b8872a', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        style={{
                            padding: '9px 24px', borderRadius: '8px', border: 'none',
                            background: 'linear-gradient(135deg, #c9a84c, #b8872a)', color: '#fff',
                            fontWeight: 600, cursor: 'pointer', fontSize: '14px',
                        }}
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    )
}

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
    activeHeader = null,
    onSearch,
}) {
    const [keyword, setKeyword] = useState('')
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            if (onSearch) onSearch(keyword.trim())
        }, 400)
        return () => clearTimeout(timerRef.current)
    }, [keyword, onSearch])

    const handleSearch = () => {
        clearTimeout(timerRef.current)
        if (onSearch) onSearch(keyword.trim())
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch()
    }

    useEffect(() => {
        if (!isAdminDrawerOpen) return undefined

        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsAdminDrawerOpen(false)
        }

        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isAdminDrawerOpen])

    if (roleLabel === 'customer') {
        const menuItems = [
            { id: 'all', label: 'Tất cả', catalog: 'all' },
            ...menuCategories.map((category) => ({
                id: category.id,
                label: category.name,
                catalog: `category-${category.id}`,
            })),
        ]

        return (
            <>
                {showLogoutDialog && (
                    <LogoutDialog
                        onConfirm={() => { setShowLogoutDialog(false); onLogout() }}
                        onCancel={() => setShowLogoutDialog(false)}
                    />
                )}
                <header className="shop-header-v2">
                    <div className="shop-top-strip">
                        <p>{activeHeader?.banner_text || 'NƯỚC HOA & MỸ PHẨM CHÍNH HÃNG TỪ 2004'}</p>
                        <div className="shop-top-search">
                            <div className="search-inner">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button type="button" className="search-icon-btn" onClick={handleSearch} aria-label="Tim kiem">
                                    🔍
                                </button>
                            </div>
                        </div>
                        <div className="shop-top-links">
                            {activeHeader?.hotline ? (
                                <span>Hotline: {activeHeader.hotline}</span>
                            ) : null}
                            <button type="button" onClick={() => onChangeTab('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', padding: 0 }}>
                                Giới thiệu về shop
                            </button>
                        </div>
                    </div>

                    <div className="shop-main-nav">
                        <div className="logo-block">
                            <span className="logo-chip">NGOC ANH PERFUME</span>
                            <div className="store-brand-row">
                                {activeHeader?.logo_url ? (
                                    <img src={resolveImageUrl(activeHeader.logo_url)} alt={activeHeader.site_name || 'NGỌC ÁNH'} className="store-brand-logo" />
                                ) : null}
                                <div>
                                    <h1>{activeHeader?.site_name || 'NGỌC ÁNH'}</h1>
                                    <p>{activeHeader?.address || 'Nước hoa chính hãng, tuyển chọn mùi hương cho từng dấu ấn cá nhân.'}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="shop-menu-links">
                            {menuItems.map((item) => (
                                <button
                                    type="button"
                                    key={item.id || item.label}
                                    onClick={() => onChangeTab('home', item.catalog, item.label)}
                                    className={selectedCatalog === item.catalog ? 'active' : ''}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="shop-account-tools">
                            <button type="button" className="user-pill">Xin chao {userName}</button>
                            <button type="button" className={activeTab === 'cart' ? 'cart-pill active' : 'cart-pill'} onClick={() => onChangeTab('cart')}>
                                Giỏ hàng
                                <span className="cart-dot">{cartCount}</span>
                            </button>
                            <button type="button" className={activeTab === 'my-orders' ? 'ghost-btn active' : 'ghost-btn'} onClick={() => onChangeTab('my-orders')}>
                                Đơn hàng của bạn
                            </button>
                            {onLogout ? (
                                <button type="button" className="logout-btn" onClick={() => setShowLogoutDialog(true)}>
                                    Đăng xuất
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {activeTab === 'home' && activeHeader ? (
                        <div
                            className={`shop-header-highlight ${activeHeader.banner_image_url ? 'has-banner-image' : ''}`}
                            style={activeHeader.banner_image_url
                                ? { backgroundImage: `linear-gradient(90deg, rgba(255, 250, 242, 0.95) 0%, rgba(255, 250, 242, 0.88) 38%, rgba(255, 250, 242, 0.72) 60%, rgba(255, 250, 242, 0.55) 100%), url(${resolveImageUrl(activeHeader.banner_image_url)})` }
                                : undefined}
                        >
                            <div className="shop-header-highlight-copy">
                                <span className="shop-header-highlight-tag">Header đang hiển thị</span>
                                <h2>{activeHeader.site_name || 'NGỌC ÁNH'}</h2>
                                <p>{activeHeader.banner_text || 'Tuỳ chỉnh banner, logo và thông tin liên hệ trong trang quản trị header để thay đổi phần mở đầu của storefront.'}</p>
                                <div className="shop-header-contact-row">
                                    {activeHeader.hotline ? <span>Hotline: {activeHeader.hotline}</span> : null}
                                    {activeHeader.email ? <span>Email: {activeHeader.email}</span> : null}
                                    {activeHeader.address ? <span>{activeHeader.address}</span> : null}
                                </div>
                            </div>
                            <div className="shop-header-highlight-side">
                                <div className="shop-header-highlight-actions">
                                    <button type="button" className="shop-highlight-primary" onClick={() => onChangeTab('home', 'all', 'Tất cả')}>
                                        Khám phá sản phẩm
                                    </button>
                                    <button type="button" className="shop-highlight-secondary" onClick={() => onChangeTab('about')}>
                                        Về NGỌC ÁNH
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </header>
            </>
        )
    }

    return (
        <>
            {showLogoutDialog && (
                <LogoutDialog
                    onConfirm={() => { setShowLogoutDialog(false); onLogout() }}
                    onCancel={() => setShowLogoutDialog(false)}
                />
            )}
            <header className="portal-header">
                <div className="portal-header-brand">
                    <p className="portal-eyebrow">NGỌC ÁNH Perfume Shop</p>
                    <h1>{title}</h1>
                </div>
                <nav className="admin-header-tabs">
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
                </nav>
                {onLogout ? (
                    <button type="button" className="logout-btn" onClick={() => setShowLogoutDialog(true)}>
                        Đăng xuất
                    </button>
                ) : null}
            </header>
        </>
    )
}
