export default function AboutPage() {
    return (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px', fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>

            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, #1a1008 0%, #3b2710 60%, #7a5c2a 100%)',
                borderRadius: '16px',
                padding: '48px 40px',
                textAlign: 'center',
                marginBottom: '32px',
                color: '#fff',
            }}>
                <p style={{ fontSize: '12px', letterSpacing: '4px', color: '#c9a84c', textTransform: 'uppercase', margin: '0 0 12px' }}>
                    Từ năm 2004
                </p>
                <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '2px' }}>NGỌC ÁNH</h1>
                <p style={{ fontSize: '16px', color: '#c9a84c', letterSpacing: '6px', textTransform: 'uppercase', margin: '0 0 20px' }}>Perfumes</p>
                <p style={{ fontSize: '15px', color: '#e5d4b0', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                    Chuyên cung cấp nước hoa và mỹ phẩm chính hãng, mang đến hương thơm đẳng cấp cho mọi người.
                </p>
            </div>

            {/* Câu chuyện */}
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e8d5c0',
                padding: '32px',
                marginBottom: '24px',
            }}>
                <h2 style={{ fontSize: '20px', color: '#7a5c2a', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>📖</span> Câu chuyện của chúng tôi
                </h2>
                <p style={{ color: '#4b3a1e', lineHeight: 1.8, margin: '0 0 12px' }}>
                    Ngọc Ánh Perfumes được thành lập năm <strong>2004</strong> với mong muốn mang những chai nước hoa chính hãng từ các thương hiệu danh tiếng thế giới đến tay người tiêu dùng Việt Nam với mức giá hợp lý nhất.
                </p>
                <p style={{ color: '#4b3a1e', lineHeight: 1.8, margin: 0 }}>
                    Hơn 20 năm hoạt động, chúng tôi đã phục vụ hàng chục nghìn khách hàng trên toàn quốc và không ngừng mở rộng danh mục sản phẩm từ nước hoa, mỹ phẩm đến các sản phẩm chăm sóc cá nhân cao cấp.
                </p>
            </div>

            {/* Giá trị cốt lõi */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
            }}>
                {[
                    { icon: '✅', title: 'Hàng chính hãng 100%', desc: 'Mọi sản phẩm đều có tem kiểm định và xuất xứ rõ ràng.' },
                    { icon: '🚚', title: 'Giao hàng toàn quốc', desc: 'Đóng gói cẩn thận, giao nhanh trong 2–5 ngày làm việc.' },
                    { icon: '💬', title: 'Tư vấn tận tâm', desc: 'Đội ngũ hỗ trợ sẵn sàng tư vấn chọn hương phù hợp với bạn.' },
                    { icon: '🔄', title: 'Đổi trả dễ dàng', desc: 'Nhận đổi/trả trong vòng 7 ngày nếu sản phẩm có lỗi.' },
                ].map((item) => (
                    <div key={item.title} style={{
                        background: '#fffdf5',
                        border: '1px solid #e8d5c0',
                        borderRadius: '12px',
                        padding: '24px 20px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '30px', marginBottom: '10px' }}>{item.icon}</div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1008', margin: '0 0 8px' }}>{item.title}</h3>
                        <p style={{ fontSize: '13px', color: '#7a5c2a', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Liên hệ */}
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e8d5c0',
                padding: '32px',
            }}>
                <h2 style={{ fontSize: '20px', color: '#7a5c2a', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>📞</span> Liên hệ với chúng tôi
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {[
                        { icon: '📍', label: 'Địa chỉ', value: '123 Đường Hoa Hồng, Q.1, TP.HCM' },
                        { icon: '📱', label: 'Điện thoại', value: '0901 234 567' },
                        { icon: '✉️', label: 'Email', value: 'ngocanhperfumes@gmail.com' },
                        { icon: '🕐', label: 'Giờ mở cửa', value: '8:00 – 21:00 (Thứ 2 – CN)' },
                    ].map((item) => (
                        <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                            <div>
                                <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                                <p style={{ margin: 0, fontSize: '14px', color: '#1a1008', fontWeight: 500 }}>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
