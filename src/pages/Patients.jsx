import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Patients.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    condition: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
      console.error('Error al obtener pacientes:', err.message);
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
    try {
      await axios.post('http://localhost:5000/api/patients', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', age: '', condition: '' });
      fetchPatients();
    } catch (err) {
      console.error('Error al crear paciente:', err.message);
    }
  };

  // Función para eliminar paciente
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualizar la lista de pacientes eliminando el paciente borrado
      setPatients(patients.filter(patient => patient._id !== id));
    } catch (err) {
      console.error('Error al eliminar paciente:', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="patients-container">
      <div className="patients-header">
        <h2>Gestión de Pacientes</h2>
        <p>Administra los registros médicos de tus pacientes</p>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-group">
          <input 
            name="name" 
            placeholder="Nombre completo" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            name="age" 
            placeholder="Edad" 
            value={formData.age} 
            onChange={handleChange} 
            type="number" 
          />
        </div>
        <div className="form-group">
          <input 
            name="condition" 
            placeholder="Condición médica" 
            value={formData.condition} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="submit-btn">
          Agregar Paciente
        </button>
      </form>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando pacientes...</p>
        </div>
      ) : (
        <ul className="patient-list">
          {patients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>No hay pacientes registrados</h3>
              <p>Agrega nuevos pacientes usando el formulario</p>
            </div>
          ) : (
            patients.map((p) => (
              <li key={p._id} className={`patient-card ${deletingId === p._id ? 'deleting' : ''}`}>
                <div className="patient-info">
                  <div className="patient-avatar">
                    {p.name.charAt(0)}
                  </div>
                  <div className="patient-details">
                    <h3>{p.name}</h3>
                    <p><span>Edad:</span> {p.age} años</p>
                    <p><span>Condición:</span> {p.condition}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="delete-btn"
                  disabled={deletingId === p._id}
                >
                  {deletingId === p._id ? (
                    <span className="deleting-text">Eliminando...</span>
                  ) : (
                    <span>Eliminar</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Patients;