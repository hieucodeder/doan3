import TableView from '../../components/TableView'

export default function CategoriesPage() {
    return (
        <TableView
            title="Categories"
            description="Quan ly danh muc tu bang categories"
            columns={['id', 'name', 'description']}
            rows={[]}
        />
    )
}
