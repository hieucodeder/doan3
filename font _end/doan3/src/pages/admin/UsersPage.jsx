import { useState } from 'react'
import TableView from '../../components/TableView'

export default function UsersPage() {
    const [rows, setRows] = useState([])
    const [form, setForm] = useState({ name: '', email: '', role: 'user' })

    const handleAddUser = () => {
        if (!form.name.trim() || !form.email.trim()) return

        const newUser = {
            id: rows.length + 1,
            name: form.name,
            email: form.email,
            password: '******',
            role: form.role,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
        setRows([newUser, ...rows])
        setForm({ name: '', email: '', role: 'user' })
    }

    return (
        <>
            <section className="panel">
                <div className="panel-head">
                    <h2>Them nguoi dung</h2>
                    <p>Admin co quyen quan ly user</p>
                </div>
                <div className="form-grid two-col">
                    <label className="field">
                        <span>name</span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Nhap ten"
                        />
                    </label>
                    <label className="field">
                        <span>email</span>
                        <input
                            type="text"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Nhap email"
                        />
                    </label>
                    <label className="field">
                        <span>role</span>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </label>
                </div>
                <button type="button" className="btn-primary inline-action" onClick={handleAddUser}>
                    Them user
                </button>
            </section>

            <TableView
                title="Users"
                description="Quan ly tai khoan tu bang users"
                columns={['id', 'name', 'email', 'password', 'role', 'created_at']}
                rows={rows}
            />
        </>
    )
}
