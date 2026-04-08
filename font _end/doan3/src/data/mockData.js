export const users = [
    {
        id: 1,
        name: 'Linh Tran',
        email: 'linh@email.com',
        password: '******',
        role: 'user',
        created_at: '2026-04-02 09:10',
    },
    {
        id: 2,
        name: 'Admin Store',
        email: 'admin@luxe.vn',
        password: '******',
        role: 'admin',
        created_at: '2026-04-01 10:15',
    },
]

export const demoAccounts = [
    {
        id: 1,
        name: 'Linh Tran',
        email: 'user@shop.vn',
        password: '123456',
        role: 'user',
    },
    {
        id: 2,
        name: 'Admin Store',
        email: 'admin@shop.vn',
        password: 'admin123',
        role: 'admin',
    },
]

export const categories = [
    { id: 1, name: 'Floral', description: 'Nu tinh, sang trong, de dung hang ngay' },
    { id: 2, name: 'Woody', description: 'Am, tram, hop buoi toi va mua lanh' },
    { id: 3, name: 'Fresh', description: 'Mat, clean, cho mua he va van phong' },
]

export const products = [
    {
        id: 1,
        name: 'Noir Rose 50ml',
        brand: 'Luxe',
        price: 1490000,
        stock: 18,
        description: 'Floral - rose, jasmine, musk',
        image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200',
        category_id: 1,
        created_at: '2026-04-04',
    },
    {
        id: 2,
        name: 'Amber Night 100ml',
        brand: 'Maison',
        price: 2350000,
        stock: 9,
        description: 'Woody amber - oud, amber, vanilla',
        image_url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=1200',
        category_id: 2,
        created_at: '2026-04-05',
    },
    {
        id: 3,
        name: 'Citrus Air 75ml',
        brand: 'Atelier',
        price: 1790000,
        stock: 24,
        description: 'Fresh citrus - bergamot, lime, neroli',
        image_url: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=1200',
        category_id: 3,
        created_at: '2026-04-06',
    },
]

export const cart = [
    { id: 88, user_id: 1, created_at: '2026-04-08 07:21' },
]

export const cart_items = [
    { id: 1, cart_id: 88, product_id: 1, quantity: 2 },
    { id: 2, cart_id: 88, product_id: 2, quantity: 1 },
]

export const orders = [
    {
        id: 5001,
        user_id: 1,
        total_price: 5330000,
        status: 'shipping',
        address: '15 Nguyen Hue, Q1, TP.HCM',
        phone: '0901234567',
        created_at: '2026-04-08 09:44',
    },
    {
        id: 5002,
        user_id: 1,
        total_price: 1490000,
        status: 'pending',
        address: '15 Nguyen Hue, Q1, TP.HCM',
        phone: '0901234567',
        created_at: '2026-04-08 10:12',
    },
]

export const order_items = [
    { id: 1, order_id: 5001, product_id: 2, price: 2350000, quantity: 2 },
    { id: 2, order_id: 5002, product_id: 1, price: 1490000, quantity: 1 },
]

export const reviews = [
    {
        id: 1,
        user_id: 1,
        product_id: 2,
        rating: 5,
        comment: 'Mui giu rat lau, sang trong.',
        created_at: '2026-04-06 18:33',
    },
    {
        id: 2,
        user_id: 1,
        product_id: 1,
        rating: 4,
        comment: 'Mui ngot nhe, dung di lam rat hop.',
        created_at: '2026-04-07 14:27',
    },
]

export const formatPrice = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

export const categoryNameById = (categoryId) =>
    categories.find((category) => category.id === categoryId)?.name || 'Unknown'

export const productById = (productId) => products.find((product) => product.id === productId)
