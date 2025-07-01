// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaClinicMedical } from 'react-icons/fa';
import './ForgotPassword.css'; // Asegúrate de crear este archivo CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al enviar enlace');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para volver al login
  const handleBackToLogin = () => {
    navigate('/'); // Navega a la ruta raíz, que es el login en tu configuración
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <div className="physio-icon">
          <FaClinicMedical />
        </div>
        
        <h1 className="forgot-title">Recuperar <span>Contraseña</span></h1>
        <p className="forgot-subtitle">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        
        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-with-icon">
              <input 
                type="email" 
                id="email" 
                placeholder="tu@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              <span className="input-icon"><FaEnvelope /></span>
            </div>
          </div>
          
          <button type="submit" className="forgot-button" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
        
        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
        
        <div className="back-to-login">
          <button onClick={handleBackToLogin} className="back-button">
            <FaArrowLeft /> Volver al inicio de sesión
          </button>
        </div>
      </div>
      
      <div className="forgot-image">
        <div className="image-content">
          <h2>Physio<span>Care</span></h2>
          <p>Tu bienestar es nuestra prioridad</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;