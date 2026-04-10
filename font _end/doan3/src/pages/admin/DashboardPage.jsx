import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/apiClient'
import { formatPrice } from '../../data/mockData'

export default function DashboardPage() {
    const [summary, setSummary] = useState(null)
    const [topProducts, setTopProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)
            setError('')

            const [summaryRes, topRes] = await Promise.all([
                apiRequest('/api/dashboard/summary'),
                apiRequest('/api/dashboard/top-products'),
            ])

            setIsLoading(false)

            if (summaryRes.ok && summaryRes.payload?.success && summaryRes.payload.data) {
                setSummary(summaryRes.payload.data)
            } else {
                setError(summaryRes.payload?.message || 'Không thể tải dữ liệu tổng quan.')
            }

            if (topRes.ok && topRes.payload?.success && Array.isArray(topRes.payload.data)) {
                setTopProducts(topRes.payload.data)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <>
            <section className="panel">
                <div className="panel-head">
                    <h2>Tổng quan hệ thống</h2>
                    <p>Doanh thu, đơn hàng và sản phẩm bán chạy</p>
                </div>

                {isLoading && <p className="admin-status-msg">Đang tải dữ liệu...</p>}
                {error ? <p className="admin-status-msg error">{error}</p> : null}

                {summary ? (
                    <div className="admin-stat-grid">
                        <article className="admin-stat-card">
                            <p>Doanh thu</p>
                            <strong>{formatPrice(Number(summary.total_revenue || 0))}</strong>
                        </article>
                        <article className="admin-stat-card">
                            <p>Đơn hàng</p>
                            <strong>{summary.total_orders}</strong>
                        </article>
                        <article className="admin-stat-card">
                            <p>Đơn hoàn thành</p>
                            <strong>{summary.completed_orders}</strong>
                        </article>
                        <article className="admin-stat-card">
                            <p>Tổng sản phẩm</p>
                            <strong>{summary.total_products}</strong>
                        </article>
                    </div>
                ) : null}
            </section>

            <section className="panel">
                <div className="panel-head">
                    <h2>Sản phẩm bán chạy</h2>
                    <p>Top 5 sản phẩm có chỉ số bán cao nhất</p>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên sản phẩm</th>
                                <th>Đã bán</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--app-muted)' }}>
                                        {isLoading ? '' : 'Chưa có dữ liệu sản phẩm.'}
                                    </td>
                                </tr>
                            ) : topProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.product_name || product.name}</td>
                                    <td>{Number(product.total_sold || 0)}</td>
                                    <td>{formatPrice(Number(product.price || 0))}</td>
                                    <td>{Number(product.stock || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}
