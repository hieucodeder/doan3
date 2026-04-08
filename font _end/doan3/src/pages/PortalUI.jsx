import { useEffect, useMemo, useState } from 'react'
import TopNav from '../components/TopNav'
import ShopFooter from '../components/ShopFooter'
import './PortalUI.css'

import HomePage from './customer/HomePage'
import ProductDetailPage from './customer/ProductDetailPage'
import CartPage from './customer/CartPage'
import CheckoutPage from './customer/CheckoutPage'
import MyOrdersPage from './customer/MyOrdersPage'
import { categories as fallbackCategories, products as fallbackProducts } from '../data/mockData'
import { apiRequest, resolveImageUrl } from '../services/apiClient'

import UsersPage from './admin/UsersPage'
import CategoriesPage from './admin/CategoriesPage'
import ProductsPage from './admin/ProductsPage'
import OrdersPage from './admin/OrdersPage'
import ReviewsPage from './admin/ReviewsPage'

const customerTabs = [
    { key: 'home', label: 'Home' },
    { key: 'detail', label: 'Product Detail' },
    { key: 'cart', label: 'Cart' },
    { key: 'checkout', label: 'Checkout' },
    { key: 'my-orders', label: 'My Orders' },
]

const adminTabs = [
    { key: 'users', label: 'Users' },
    { key: 'categories', label: 'Categories' },
    { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' },
    { key: 'reviews', label: 'Reviews' },
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
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
            />
        )
    }
    if (activeTab === 'cart') {
        return <CartPage cartItems={cartItems} productsData={productsData} onGoCheckout={onGoCheckout} />
    }
    if (activeTab === 'checkout') return <CheckoutPage cartItems={cartItems} productsData={productsData} />
    return <MyOrdersPage />
}

function AdminPages({ activeTab }) {
    if (activeTab === 'users') return <UsersPage />
    if (activeTab === 'categories') return <CategoriesPage />
    if (activeTab === 'products') return <ProductsPage />
    if (activeTab === 'orders') return <OrdersPage />
    return <ReviewsPage />
}

export default function PortalUI({ role = 'user', userName = 'Khach hang', onLogout }) {
    const [customerTab, setCustomerTab] = useState('home')
    const [adminTab, setAdminTab] = useState('users')
    const [selectedProductId, setSelectedProductId] = useState(1)
    const [cartItems, setCartItems] = useState([])
    const [selectedCatalog, setSelectedCatalog] = useState('all')
    const [selectedCatalogLabel, setSelectedCatalogLabel] = useState('Nuoc hoa')
    const [categoryMenu, setCategoryMenu] = useState(fallbackCategories)
    const [productsData, setProductsData] = useState(fallbackProducts)

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

    const handleAddToCart = (productId, quantity = 1) => {
        const product = productsData.find((item) => item.id === productId)
        if (!product) return

        setCartItems((prev) => {
            const existing = prev.find((item) => item.product_id === productId)
            if (existing) {
                return prev.map((item) =>
                    item.product_id === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                )
            }

            return [...prev, { id: Date.now(), product_id: productId, quantity }]
        })
    }

    const handleBuyNow = (productId, quantity = 1) => {
        handleAddToCart(productId, quantity)
        setCustomerTab('cart')
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
                onChangeTab={(nextTab, catalogKey, catalogLabel) => {
                    if (mode === 'customer') {
                        setCustomerTab(nextTab)
                        if (catalogKey) {
                            setSelectedCatalog(catalogKey)
                            setSelectedCatalogLabel(catalogLabel || 'Nuoc hoa')
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
                    />
                ) : (
                    <AdminPages activeTab={adminTab} />
                )}
            </main>

            {mode === 'customer' ? <ShopFooter /> : null}
        </div>
    )
}
