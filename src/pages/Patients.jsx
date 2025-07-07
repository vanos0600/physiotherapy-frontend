import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUserInjured, FaPhone, FaEnvelope, FaTrash, FaPlus, FaEdit, FaSearch, FaUserMd
} from 'react-icons/fa';
import './Patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', condition: '', phone: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  const token = localStorage.getItem('token');

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar pacientes');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.condition.trim()) {
      setError('Nombre y condición son campos requeridos');
      return;
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    try {
      if (editMode && currentPatient) {
        await axios.put(`http://localhost:5000/api/patients/${currentPatient._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Paciente actualizado correctamente');
      } else {
        await axios.post('http://localhost:5000/api/patients', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Paciente agregado correctamente');
      }

      setFormData({ name: '', age: '', condition: '', phone: '', email: '' });
      fetchPatients();
      setEditMode(false);
      setCurrentPatient(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este paciente?')) return;

    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(patients.filter(p => p._id !== id));
      setSuccess('Paciente eliminado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar paciente');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (patient) => {
    setEditMode(true);
    setCurrentPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      phone: patient.phone || '',
      email: patient.email || ''
    });
    document.querySelector('.patient-form').scrollIntoView({ behavior: 'smooth' });
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div className="patients-container">
      <div className="header">
        <FaUserMd className="header-icon" />
        <h1><FaUserInjured /> Gestión de Pacientes</h1>
        <p>Administra los registros médicos de tus pacientes</p>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nombre, condición, email o teléfono..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <h2>{editMode ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}</h2>
        <div className="form-grid">
          <input name="name" placeholder="Nombre completo *" value={formData.name} onChange={handleChange} />
          <input name="age" type="number" placeholder="Edad" value={formData.age} onChange={handleChange} />
          <input name="condition" placeholder="Condición médica *" value={formData.condition} onChange={handleChange} />
          <input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="submit">{editMode ? 'Actualizar' : 'Agregar'}</button>
          {editMode && (
            <button type="button" className="cancel-btn" onClick={() => {
              setEditMode(false);
              setCurrentPatient(null);
              setFormData({ name: '', age: '', condition: '', phone: '', email: '' });
            }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <div className="loading">Cargando pacientes...</div>
      ) : (
        <div className="patient-list">
          {filteredPatients.length === 0 ? (
            <p className="empty">No se encontraron pacientes.</p>
          ) : (
            filteredPatients.map(p => (
              <div key={p._id} className="patient-card">
                <h3>{p.name}</h3>
                <p><strong>Edad:</strong> {p.age || 'N/A'}</p>
                <p><strong>Condición:</strong> {p.condition}</p>
                {p.phone && <p><FaPhone /> {p.phone}</p>}
                {p.email && <p><FaEnvelope /> {p.email}</p>}
                <div className="actions">
                  <button onClick={() => handleEdit(p)}><FaEdit /></button>
                  <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id}>
                    {deletingId === p._id ? 'Eliminando...' : <FaTrash />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Patients;
