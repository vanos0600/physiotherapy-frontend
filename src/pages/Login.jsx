// src/pages/Login.jsx

import React, { useState } from "react";
import axios from "axios";
import './Login.css';
import { FaUser, FaLock, FaClinicMedical } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard'); // 🔁 CAMBIAMOS DE /patients A /dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Error en login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="physio-icon"><FaClinicMedical /></div>
        <h1 className="login-title">Physio<span style={{color: "#6a11cb"}}>Care</span></h1>
        <p className="login-subtitle">Acceso profesional para fisioterapeutas</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              type="email" 
              id="email" 
              placeholder="tu@email.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <span className="input-icon"><FaUser /></span>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="input-icon"><FaLock /></span>
          </div>

          {error && <p style={{color: 'red'}}>{error}</p>}

          <div className="forgot-link">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>

        <div className="signup-link">
          <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
