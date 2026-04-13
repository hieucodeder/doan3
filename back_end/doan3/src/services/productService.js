const db = require("../config/db");

// Tạo sản phẩm mới và có thể thêm nhiều ảnh bằng sp_add_product_image
const createProduct = async (name, brand, price, stock, description, category_id, image_url, images = []) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [createRows] = await connection.query(
            "CALL sp_create_product(?, ?, ?, ?, ?, ?)",
            [name, brand, price, stock, description, category_id]
        );

        // SP mới trả về product_id trực tiếp bằng SELECT LAST_INSERT_ID() AS product_id
        let product_id =
            createRows?.[0]?.[0]?.product_id ||
            createRows?.[0]?.product_id ||
            null;

        // Fallback 1: dùng LAST_INSERT_ID của connection hiện tại
        if (!product_id) {
            const [lastRows] = await connection.query("SELECT LAST_INSERT_ID() AS product_id");
            const lastId = lastRows[0]?.product_id || null;
            if (lastId) {
                const [checkRows] = await connection.query(
                    "SELECT id FROM products WHERE id = ? LIMIT 1",
                    [lastId]
                );
                if (checkRows.length > 0) {
                    product_id = lastId;
                }
            }
        }

        // Fallback 2: tìm bản ghi vừa tạo theo dữ liệu đầu vào
        if (!product_id) {
            const [findRows] = await connection.query(
                `SELECT id
                 FROM products
                 WHERE name = ?
                   AND brand = ?
                   AND price = ?
                   AND stock = ?
                   AND category_id = ?
                 ORDER BY id DESC
                 LIMIT 1`,
                [name, brand, price, stock, category_id]
            );
            product_id = findRows[0]?.id || null;
        }

        if (!product_id) {
            throw new Error("Không lấy được product_id sau khi tạo sản phẩm");
        }

        const imageList = [];
        if (image_url) imageList.push(image_url);
        if (Array.isArray(images) && images.length > 0) {
            imageList.push(...images.filter(Boolean));
        }

        // Thêm ảnh do frontend gửi lên (nếu có)
        for (const url of imageList) {
            await connection.query("CALL sp_add_product_image(?, ?)", [product_id, url]);
        }

        // Trả về product_id và số ảnh đã thêm từ request
        await connection.commit();
        return { product_id, added_images: imageList.length };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

// Lấy danh sách tất cả sản phẩm
const getProducts = async () => {
    const [rows] = await db.query("CALL sp_get_products()");
    return rows[0];
};

// Cập nhật sản phẩm theo id (chỉ cần ít nhất 1 trường, NULL = giữ nguyên)
const updateProduct = async (id, name, brand, price, stock, description, category_id) => {
    const [rows] = await db.query(
        "CALL sp_update_product_full(?, ?, ?, ?, ?, ?, ?)",
        [id, name ?? null, brand ?? null, price ?? null, stock ?? null, description ?? null, category_id ?? null]
    );
    return rows[0];
};

// Thêm 1 ảnh cho sản phẩm
const addProductImage = async (product_id, image_url) => {
    const [rows] = await db.query(
        "CALL sp_add_product_image(?, ?)",
        [product_id, image_url]
    );
    return rows[0];
};

// Lấy chi tiết sản phẩm theo id (kèm tên danh mục)
const getProductById = async (id) => {
    const [rows] = await db.query(
        "CALL sp_get_product_by_id(?)",
        [id]
    );

    const product = rows?.[0]?.[0] || null;
    if (!product) return null;

    let images = product.images;

    // mysql2 có thể trả JSON dạng string hoặc Buffer
    if (Buffer.isBuffer(images)) {
        images = images.toString("utf8");
    }

    if (typeof images === "string") {
        try {
            images = JSON.parse(images);
        } catch (e) {
            images = [];
        }
    }

    // Chuẩn hóa: luôn là mảng, loại null
    if (!Array.isArray(images)) {
        images = [];
    } else {
        images = images.filter(Boolean);
    }

    return { ...product, images };
};

// Tìm kiếm sản phẩm theo keyword và category_id (0 = tất cả)
const searchProducts = async (keyword = "", category_id = 0) => {
    const [rows] = await db.query(
        "CALL sp_search_products(?, ?)",
        [keyword, category_id]
    );
    return rows[0];
};

// Xóa sản phẩm (SP kiểm tra nếu đã có trong order thì không cho xóa)
const deleteProduct = async (id) => {
    const [rows] = await db.query("CALL sp_delete_product(?)", [id]);
    return rows[0][0]?.message || null;
};

module.exports = { createProduct, getProducts, updateProduct, getProductById, searchProducts, deleteProduct, addProductImage };
