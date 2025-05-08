import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000/api/students';

const StudentCRUD = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', language: '' });
  const [editingId, setEditingId] = useState(null);

  // Leer estudiantes
  const fetchStudents = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setStudents(data.students))
      .catch(err => console.error('Error:', err));
  };

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        console.log('Respuesta de la API:', data);
        setStudents(data.students); // Solo si `data` es un array
      })
      .catch(err => console.error('Error:', err));
  }, []);

  // Guardar o actualizar
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        fetchStudents();
        setForm({ name: '', email: '', phone: '', language: '' });
        setEditingId(null);
      });
  };

  // Cargar datos para editar
  const handleEdit = (student) => {
    setForm(student);
    setEditingId(student.id);
  };

  // Eliminar estudiante
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante,seguro seguro?????')) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => fetchStudents());
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📚 Lista de Estudiantes</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Nombre"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <input type="email" className="form-control" placeholder="Email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" placeholder="Teléfono"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" placeholder="Idioma"
              value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success w-100">
              {editingId ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      </form>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Idioma</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.language}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(s)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentCRUD;
