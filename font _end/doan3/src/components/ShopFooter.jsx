export default function ShopFooter() {
    return (
        <footer className="shop-footer">
            <div className="shop-footer-grid">
                <section>
                    <h4>ORCHID Perfumes</h4>
                    <p>
                        Hệ thống bán lẻ nước hoa và mỹ phẩm chính hãng từ năm 2004. Cam kết chất lượng, giao hàng nhanh chóng, và
                        hoàn tiền nếu phát hiện hàng không đúng mô tả.
                    </p>
                </section>

                <section>
                    <h4>Hỗ trợ khách hàng</h4>
                    <ul>
                        <li>Hướng dẫn đặt hàng</li>
                        <li>Chính sách giao hàng</li>
                        <li>Chính sách đổi trả</li>
                        <li>Bảo mật thông tin</li>
                    </ul>
                </section>

                <section>
                    <h4>Thông tin liên hệ</h4>
                    <ul>
                        <li>Hotline: 1900 1234</li>
                        <li>Email: support@orchid.vn</li>
                        <li>Địa chỉ: 15 Nguyễn Huệ, Q1, TP.HCM</li>
                    </ul>
                </section>

                <section>
                    <h4>Kết nối với chúng tôi</h4>
                    <div className="footer-socials">
                        <button type="button">Facebook</button>
                        <button type="button">Instagram</button>
                        <button type="button">TikTok</button>
                    </div>
                </section>
            </div>

            <div className="shop-footer-bottom">
                <p>© 2026 ORCHID Perfumes & Cosmetics. All rights reserved.</p>
            </div>
        </footer>
    )
}
