const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cartItemRoutes = require("./routes/cartItemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { authenticate } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Public routes - không cần token
app.use("/api/auth", authRoutes);

// Protected routes - cần access token
app.use("/api/users", authenticate, userRoutes);
app.use("/api/categories", authenticate, categoryRoutes);
app.use("/api/products", authenticate, productRoutes);
app.use("/api/cart", authenticate, cartRoutes);
app.use("/api/cart-items", authenticate, cartItemRoutes);
app.use("/api/orders", authenticate, orderRoutes);
app.use("/api/order-items", authenticate, orderItemRoutes);
app.use("/api/reviews", authenticate, reviewRoutes);

app.get("/", (req, res) => res.send("API Node.js đang chạy 🚀"));

// Global error handler - bắt lỗi JSON body không hợp lệ và các lỗi khác
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ success: false, message: "Body JSON không hợp lệ" });
    }
    res.status(500).json({ success: false, message: err.message || "Lỗi server" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));