import TableView from '../../components/TableView'

export default function OrdersPage() {
    const rows = []

    return (
        <TableView
            title="Orders"
            description="Quan ly don hang tu bang orders"
            columns={['id', 'user_id', 'total_price', 'status', 'address', 'phone', 'created_at']}
            rows={rows}
        />
    )
}
