export default function ShopFooter() {
    return (
        <footer className="shop-footer">
            <div className="shop-footer-grid">
                <section>
                    <h4>ORCHID Perfumes</h4>
                    <p>
                        He thong nuoc hoa chinh hang. Cam ket san pham chat luong,
                        hoan tien neu phat hien hang khong dung mo ta.
                    </p>
                </section>

                <section>
                    <h4>Ho tro khach hang</h4>
                    <ul>
                        <li>Huong dan dat hang</li>
                        <li>Chinh sach giao hang</li>
                        <li>Chinh sach doi tra</li>
                        <li>Bao mat thong tin</li>
                    </ul>
                </section>

                <section>
                    <h4>Thong tin lien he</h4>
                    <ul>
                        <li>Hotline: 1900 1234</li>
                        <li>Email: support@orchid.vn</li>
                        <li>Dia chi: 15 Nguyen Hue, Q1, TP.HCM</li>
                    </ul>
                </section>

                <section>
                    <h4>Ket noi voi chung toi</h4>
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
