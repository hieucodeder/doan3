import { useEffect, useMemo, useState } from 'react'
import TopNav from '../components/TopNav'
import ShopFooter from '../components/ShopFooter'
import './PortalUI.css'

import HomePage from './customer/HomePage'
import ProductDetailPage from './customer/ProductDetailPage'
import CartPage from './customer/CartPage'
import CheckoutPage from './customer/CheckoutPage'
import MyOrdersPage from './customer/MyOrdersPage'
import AboutPage from './customer/AboutPage'
import { apiRequest, resolveImageUrl } from '../services/apiClient'

import UsersPage from './admin/UsersPage'
import CategoriesPage from './admin/CategoriesPage'
import ProductsPage from './admin/ProductsPage'
import OrdersPage from './admin/OrdersPage'
import DashboardPage from './admin/DashboardPage'

const customerTabs = [
    { key: 'home', label: 'Home' },
    { key: 'detail', label: 'Product Detail' },
    { key: 'cart', label: 'Cart' },
    { key: 'checkout', label: 'Checkout' },
    { key: 'my-orders', label: 'My Orders' },
]

const adminTabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'products', label: 'Sản phẩm' },
    { key: 'orders', label: 'Đơn hàng' },
    { key: 'users', label: 'Khách hàng' },
    { key: 'categories', label: 'Danh mục' },
]

function CustomerPages({
    activeTab,
    selectedProductId,
    onOpenProduct,
    selectedCatalog,
    selectedCatalogLabel,
    categoriesData,
    productsData,
    cartItems,
    onAddToCart,
    onBuyNow,
    onGoCheckout,
    onRemoveFromCart,
    onUpdateCartQty,
    userId,
    onCheckoutSuccess,
}) {
    if (activeTab === 'home') {
        return (
            <HomePage
                onOpenProduct={onOpenProduct}
                selectedCatalog={selectedCatalog}
                selectedCatalogLabel={selectedCatalogLabel}
                categoriesData={categoriesData}
                productsData={productsData}
            />
        )
    }
    if (activeTab === 'detail') {
        return (
            <ProductDetailPage
                productId={selectedProductId}
                categoriesData={categoriesData}
                productsData={productsData}
                userId={userId}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
            />
        )
    }
    if (activeTab === 'cart') {
        return <CartPage cartItems={cartItems} productsData={productsData} onGoCheckout={onGoCheckout} onRemoveFromCart={onRemoveFromCart} onUpdateCartQty={onUpdateCartQty} />
    }
    if (activeTab === 'checkout') return <CheckoutPage cartItems={cartItems} productsData={productsData} userId={userId} onCheckoutSuccess={onCheckoutSuccess} />
    if (activeTab === 'about') return <AboutPage />
    return <MyOrdersPage userId={userId} />
}

function AdminPages({ activeTab }) {
    if (activeTab === 'dashboard') return <DashboardPage />
    if (activeTab === 'products') return <ProductsPage />
    if (activeTab === 'orders') return <OrdersPage />
    if (activeTab === 'users') return <UsersPage />
    if (activeTab === 'categories') return <CategoriesPage />
    return <DashboardPage />
}

export default function PortalUI({ role = 'user', userName = 'Khach hang', onLogout, userId }) {
    const [customerTab, setCustomerTab] = useState('home')
    const [adminTab, setAdminTab] = useState('dashboard')
    const [selectedProductId, setSelectedProductId] = useState(1)
    const [cartItems, setCartItems] = useState([])
    const [selectedCatalog, setSelectedCatalog] = useState('all')
    const [selectedCatalogLabel, setSelectedCatalogLabel] = useState('Nuoc hoa')
    const [categoryMenu, setCategoryMenu] = useState([])
    const [productsData, setProductsData] = useState([])

    const mode = role === 'admin' ? 'admin' : 'customer'
    const tabs = useMemo(() => (mode === 'customer' ? customerTabs : adminTabs), [mode])
    const activeTab = mode === 'customer' ? customerTab : adminTab

    useEffect(() => {
        let isMounted = true

        const fetchCategories = async () => {
            const { ok, payload } = await apiRequest('/api/categories')
            if (!isMounted) return

            if (ok && payload?.success && Array.isArray(payload.data) && payload.data.length > 0) {
                setCategoryMenu(payload.data)
            }
        }

        if (mode === 'customer') {
            fetchCategories()
        }

        return () => {
            isMounted = false
        }
    }, [mode])

    useEffect(() => {
        let isMounted = true

        const fetchProducts = async () => {
            const { ok, payload } = await apiRequest('/api/products')
            if (!isMounted) return

            if (ok && payload?.success && Array.isArray(payload.data) && payload.data.length > 0) {
                const normalized = payload.data.map((product) => ({
                    ...product,
                    image_url: resolveImageUrl(product.image_url || product.image || ''),
                    price: Number(product.price || 0),
                    category_id: Number(product.category_id || 0),
                }))
                setProductsData(normalized)
            }
        }

        if (mode === 'customer') {
            fetchProducts()
        }

        return () => {
            isMounted = false
        }
    }, [mode])

    const handleOpenProduct = (productId) => {
        setSelectedProductId(productId)
        setCustomerTab('detail')
    }

    const fetchCartItems = async () => {
        if (!userId) return
        const { ok, payload } = await apiRequest(`/api/cart-items/${userId}`)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            setCartItems(payload.data)
        }
    }

    useEffect(() => {
        if (userId && mode === 'customer') {
            fetchCartItems()
        }
    }, [userId, mode])

    const handleAddToCart = async (productId, quantity = 1) => {
        if (!userId) return
        const { ok } = await apiRequest('/api/cart-items', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
        })
        if (ok) {
            await fetchCartItems()
        }
    }

    const handleBuyNow = async (productId, quantity = 1) => {
        await handleAddToCart(productId, quantity)
        setCustomerTab('cart')
    }

    const handleRemoveFromCart = async (productId) => {
        const { ok } = await apiRequest('/api/cart-items', {
            method: 'DELETE',
            body: JSON.stringify({ user_id: userId, product_id: productId }),
        })
        if (ok) {
            await fetchCartItems()
        }
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        if (!userId || quantity < 1) return
        const { ok } = await apiRequest('/api/cart-items', {
            method: 'PUT',
            body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
        })
        if (ok) {
            await fetchCartItems()
        }
    }

    const handleSearch = async (keyword) => {
        const categoryId = selectedCatalog.startsWith('category-')
            ? Number(selectedCatalog.replace('category-', ''))
            : 0
        const params = new URLSearchParams()
        if (keyword) params.set('keyword', keyword)
        params.set('category_id', categoryId)
        const { ok, payload } = await apiRequest(`/api/products/search?${params.toString()}`)
        if (ok && payload?.success && Array.isArray(payload.data)) {
            const normalized = payload.data.map((product) => ({
                ...product,
                image_url: resolveImageUrl(product.image_url || product.image || ''),
                price: Number(product.price || 0),
                category_id: Number(product.category_id || 0),
            }))
            setProductsData(normalized)
        }
    }

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="portal-page">
            <TopNav
                title={mode === 'customer' ? `Xin chao ${userName}` : `Admin panel - ${userName}`}
                tabs={tabs}
                activeTab={activeTab}
                roleLabel={mode}
                userName={userName}
                cartCount={cartCount}
                selectedCatalog={selectedCatalog}
                menuCategories={categoryMenu}
                onLogout={onLogout}
                onSearch={handleSearch}
                onChangeTab={async (nextTab, catalogKey, catalogLabel) => {
                    if (mode === 'customer') {
                        setCustomerTab(nextTab)
                        if (catalogKey) {
                            setSelectedCatalog(catalogKey)
                            setSelectedCatalogLabel(catalogLabel || 'Nuoc hoa')
                        }
                        if (nextTab === 'cart') {
                            await fetchCartItems()
                        }
                    } else {
                        setAdminTab(nextTab)
                    }
                }}
            />

            <main className="portal-main">
                {mode === 'customer' ? (
                    <CustomerPages
                        activeTab={customerTab}
                        selectedProductId={selectedProductId}
                        onOpenProduct={handleOpenProduct}
                        selectedCatalog={selectedCatalog}
                        selectedCatalogLabel={selectedCatalogLabel}
                        categoriesData={categoryMenu}
                        productsData={productsData}
                        cartItems={cartItems}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onGoCheckout={() => setCustomerTab('checkout')}
                        onRemoveFromCart={handleRemoveFromCart}
                        onUpdateCartQty={handleUpdateCartQty}
                        userId={userId}
                        onCheckoutSuccess={() => {
                            setCartItems([])
                            setCustomerTab('home')
                        }}
                    />
                ) : (
                    <AdminPages activeTab={adminTab} />
                )}
            </main>

            {mode === 'customer' ? <ShopFooter /> : null}
        </div>
    )
}
