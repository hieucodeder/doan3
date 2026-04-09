import TableView from '../../components/TableView'

export default function ReviewsPage() {
    return (
        <TableView
            title="Reviews"
            description="Quan ly danh gia tu bang reviews"
            columns={['id', 'user_id', 'product_id', 'rating', 'comment', 'created_at']}
            rows={[]}
        />
    )
}
