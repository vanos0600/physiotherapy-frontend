import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaClinicMedical, FaArrowLeft } from "react-icons/fa";
import './Register.css';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        email,
        password,
        name
      };

      const { data } = await axios.post("http://localhost:5000/api/users/register", payload);

      setSuccess("Registro exitoso. Redirigiendo a login...");
      // Limpiar formulario
      setEmail("");
      setPassword("");
      setName("");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Error en registro");
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="physio-icon">
          <FaClinicMedical />
        </div>
        
        <h1 className="register-title">Regístrate en <span>PhysioCare</span></h1>
        <p className="register-subtitle">Crea tu cuenta para acceder a nuestro sistema de gestión de pacientes</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="name">Nombre Completo</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="name"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span className="input-icon"><FaUser /></span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-with-icon">
              <input
                type="email"
                id="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="input-icon"><FaEnvelope /></span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-icon"><FaLock /></span>
            </div>
          </div>

          <button type="submit" className="register-button">Registrar</button>
        </form>
        
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
        
        <div className="back-to-login">
          <button onClick={handleBackToLogin} className="back-button">
            <FaArrowLeft /> Volver al inicio de sesión
          </button>
        </div>
      </div>
      
      <div className="register-image">
        <div className="image-content">
          <h2>Physio<span>Care</span></h2>
          <p>Tu bienestar es nuestra prioridad</p>
        </div>
      </div>
    </div>
  );
}

export default Register;