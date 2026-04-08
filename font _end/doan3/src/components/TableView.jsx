export default function TableView({ title, description, columns, rows }) {
    return (
        <section className="panel">
            <div className="panel-head">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={row.id || index}>
                                {columns.map((column) => (
                                    <td key={`${row.id || index}-${column}`}>{row[column] ?? '-'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
