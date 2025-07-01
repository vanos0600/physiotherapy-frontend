import React, { useState, useEffect } from 'react';
import './Progress.css';

const ProgressManager = () => {
  const [progressList, setProgressList] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [progressNote, setProgressNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');

  const fetchProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = dateFilter 
        ? `http://localhost:5000/api/progress?date=${dateFilter}` 
        : 'http://localhost:5000/api/progress';
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Error al cargar los progresos');
      
      const data = await res.json();
      setProgressList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [dateFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!patientId || !progressNote) {
      setError('Paciente y nota de progreso son requeridos');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ patient: patientId, progressNote }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al crear progreso');
      }
      
      const newProgress = await res.json();
      setProgressList((prev) => [...prev, newProgress]);
      setPatientId('');
      setProgressNote('');
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Formatear fecha en formato DD/MM/AAAA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="progress-manager">
      <div className="progress-header">
        <h1>Seguimiento de Progreso Médico</h1>
        <p>Registra y monitorea el progreso de tus pacientes</p>
      </div>

      <div className="progress-controls">
        <div className="filter-section">
          <label htmlFor="date-filter">Filtrar por fecha:</label>
          <input 
            type="date" 
            id="date-filter" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)} 
          />
          <button onClick={() => setDateFilter('')} className="clear-filter">
            Limpiar filtro
          </button>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`toggle-form-btn ${showForm ? 'active' : ''}`}
        >
          {showForm ? 'Ocultar Formulario' : 'Nuevo Registro'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <div className="form-card">
            <h2>Registrar Nuevo Progreso</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="patient-id">ID del Paciente</label>
                <input
                  type="text"
                  id="patient-id"
                  placeholder="Ingrese el ID del paciente"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="progress-note">Nota de Progreso</label>
                <textarea
                  id="progress-note"
                  placeholder="Detalles de la evolución del paciente..."
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  rows="5"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Guardar Progreso
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="progress-list-container">
        <h2>Registros de Progreso</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando registros médicos...</p>
          </div>
        ) : (
          <>
            {progressList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No se encontraron registros</h3>
                <p>{dateFilter ? 'No hay registros para esta fecha' : 'Crea tu primer registro de progreso'}</p>
              </div>
            ) : (
              <div className="progress-grid">
                {progressList.map((progress) => (
                  <div key={progress._id} className="progress-card">
                    <div className="progress-header">
                      <div className="patient-badge">
                        {progress.patient ? progress.patient.name?.charAt(0) || 'P' : 'P'}
                      </div>
                      <div className="progress-info">
                        <h3>
                          {progress.patient ? progress.patient.name || `Paciente ${progress.patient._id.substring(0, 6)}` : 'Paciente Desconocido'}
                        </h3>
                        <p className="progress-date">{formatDate(progress.date)}</p>
                      </div>
                    </div>
                    
                    <div className="progress-content">
                      <p className="progress-note">{progress.progressNote}</p>
                    </div>
                    
                    <div className="progress-footer">
                      <span className="progress-id">ID: {progress._id.substring(0, 8)}</span>
                      {progress.patient && (
                        <span className="patient-id">Paciente ID: {progress.patient._id.substring(0, 8)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressManager;