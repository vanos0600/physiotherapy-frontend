import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Appointments.css";

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    type: "",
    notes: "",
    status: "pending",
  });

  // URL de la API (debería estar en variables de entorno)
  const API_URL = "http://localhost:5000/api/appointments";

  // Cargar citas desde MongoDB
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(API_URL);
        setAppointments(response.data);
      } catch (err) {
        setError("Error cargando citas: " + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Manejo inputs formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar nueva cita a MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.name || !form.date || !form.time) {
      setError("Nombre, fecha y hora son obligatorios");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(API_URL, form);
      setAppointments((prev) => [...prev, response.data]);
      setForm({ name: "", date: "", time: "", type: "", notes: "", status: "pending" });
      setFormVisible(false);
    } catch (err) {
      setError("Error creando cita: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Borrar cita en MongoDB
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setAppointments((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      setError("Error eliminando cita: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar y ordenar
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (filterStatus !== "all") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    if (searchText.trim()) {
      const txt = searchText.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(txt) ||
          (app.notes && app.notes.toLowerCase().includes(txt))
      );
    }

    return filtered.sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;
      const fieldA = a[sortField]?.toString().toLowerCase() || "";
      const fieldB = b[sortField]?.toString().toLowerCase() || "";

      // Manejo especial para fechas
      if (sortField === "date") {
        return modifier * (new Date(a.date) - new Date(b.date));
      }

      // Manejo especial para hora
      if (sortField === "time") {
        const timeA = new Date(`1970-01-01T${a.time}:00`);
        const timeB = new Date(`1970-01-01T${b.time}:00`);
        return modifier * (timeA - timeB);
      }

      return modifier * fieldA.localeCompare(fieldB);
    });
  }, [appointments, filterStatus, searchText, sortField, sortDirection]);

  // Contadores rápidos
  const countByStatus = (status) =>
    appointments.filter((app) => app.status === status).length;

  // Función para obtener la primera letra del nombre
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  // Formatear fecha a dd/mm/aaaa
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="appointment-manager">
      <div className="manager-header">
        <h1>Gestión de Citas</h1>
        <p>Administra tus citas de fisioterapia</p>
      </div>

      {error && <div className="global-error">{error}</div>}

      <div className="controls-section">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre o notas..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <button 
            className="toggle-form-btn"
            onClick={() => setFormVisible(!formVisible)}
            disabled={isLoading}
          >
            {formVisible ? "Ocultar Formulario" : " Nueva Cita"}
          </button>
        </div>
      </div>

      {formVisible && (
        <div className="appointment-form">
          <h2>Agregar Nueva Cita</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Paciente*</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Fecha*</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label>Hora*</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Tipo de Cita</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Consulta General">Consulta General</option>
                <option value="Rehabilitación">Rehabilitación</option>
                <option value="Masaje Terapéutico">Masaje Terapéutico</option>
                <option value="Evaluación">Evaluación</option>
                <option value="Fisioterapia Deportiva">Fisioterapia Deportiva</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Notas Adicionales</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>Estado</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="canceled">Cancelada</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Agregar Cita"}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setFormVisible(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label>Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={isLoading}
          >
            <option value="all">Todas las citas</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendientes</option>
            <option value="canceled">Canceladas</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            disabled={isLoading}
          >
            <option value="date">Fecha</option>
            <option value="time">Hora</option>
            <option value="name">Paciente</option>
            <option value="type">Tipo</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Dirección</label>
          <button
            className="direction-btn"
            onClick={() => setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"))}
            disabled={isLoading}
          >
            {sortDirection === "asc" ? "Ascendente ↑" : "Descendente ↓"}
          </button>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card total">
          <div className="stat-value">{appointments.length}</div>
          <div className="stat-label">Citas Totales</div>
        </div>
        
        <div className="stat-card confirmed">
          <div className="stat-value">{countByStatus("confirmed")}</div>
          <div className="stat-label">Confirmadas</div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-value">{countByStatus("pending")}</div>
          <div className="stat-label">Pendientes</div>
        </div>
        
        <div className="stat-card canceled">
          <div className="stat-value">{countByStatus("canceled")}</div>
          <div className="stat-label">Canceladas</div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando citas...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="no-appointments">
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No hay citas programadas</h3>
            <p>Actualmente no tienes citas que coincidan con tus filtros.</p>
            <button 
              className="add-first-btn"
              onClick={() => {
                setFormVisible(true);
                setFilterStatus("all");
                setSearchText("");
              }}
              disabled={isLoading}
            >
              Agregar Primera Cita
            </button>
          </div>
        </div>
      ) : (
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Notas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app) => (
                <tr key={app._id}>
                  <td className="patient-cell">
                    <div className="patient-avatar">
                      {getInitial(app.name)}
                    </div>
                    {app.name}
                  </td>
                  <td>{formatDate(app.date)}</td>
                  <td>{app.time}</td>
                  <td>{app.type}</td>
                  <td className="notes-cell">{app.notes}</td>
                  <td>
                    <div className={`status-badge ${app.status}`}>
                      {app.status === "confirmed" ? "Confirmada" : 
                       app.status === "pending" ? "Pendiente" : "Cancelada"}
                    </div>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(app._id)}
                      title="Eliminar Cita"
                      disabled={isLoading}
                    >
                      <span className="delete-icon">🗑️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}