import TableView from '../../components/TableView'
import { orders } from '../../data/mockData'

export default function OrdersPage() {
    const rows = orders.map((order) => ({
        ...order,
        total_price: order.total_price.toLocaleString('vi-VN'),
    }))

    return (
        <TableView
            title="Orders"
            description="Quan ly don hang tu bang orders"
            columns={['id', 'user_id', 'total_price', 'status', 'address', 'phone', 'created_at']}
            rows={rows}
        />
    )
}
