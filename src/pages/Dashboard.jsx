// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Appointments from "./Appointments";
import Exercises from "./Exercises";
import Patients from "./Patients";
import Progress from "./Progress";
import { 
  FaCalendarAlt, 
  FaRunning, 
  FaUserFriends, 
  FaChartLine, 
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaMoon,
  FaSun
} from "react-icons/fa";
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      // Obtener información del usuario (ejemplo)
      setUserName("Mgr. Uliana Tupikina");
    }
    
    // Comprobar preferencia de modo oscuro
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    // Aplicar modo oscuro
    document.body.className = darkMode ? "dark-theme" : "light-theme";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">P</div>
            <span>Physio<span>Care</span></span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            <FaCalendarAlt className="nav-icon" />
            <span>Citas</span>
            <div className="notification-badge">5</div>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "exercises" ? "active" : ""}`}
            onClick={() => setActiveTab("exercises")}
          >
            <FaRunning className="nav-icon" />
            <span>Ejercicios</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "patients" ? "active" : ""}`}
            onClick={() => setActiveTab("patients")}
          >
            <FaUserFriends className="nav-icon" />
            <span>Pacientes</span>
            <div className="notification-badge">12</div>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            <FaChartLine className="nav-icon" />
            <span>Progresos</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode ? "Modo Claro" : "Modo Oscuro"}</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="dashboard-content">
        {/* Top Bar */}
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <h1>
              {activeTab === "appointments" && "Gestión de Citas"}
              {activeTab === "exercises" && "Ejercicios de Fisioterapia"}
              {activeTab === "patients" && "Gestión de Pacientes"}
              {activeTab === "progress" && "Seguimiento de Progresos"}
            </h1>
          </div>
          
          <div className="topbar-right">
            <div className="profile-menu">
              <button 
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <FaUserCircle className="user-icon" />
                <span>{userName}</span>
                <FaChevronDown className={`arrow ${showProfileMenu ? "up" : ""}`} />
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <FaUserCircle className="user-icon-lg" />
                    <div>
                      <div className="profile-name">{userName}</div>
                      <div className="profile-role">Fisioterapeuta</div>
                    </div>
                  </div>
          
                  <button className="dropdown-item logout-btn" onClick={logout}>
                    <FaSignOutAlt /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="dashboard-main">
          {activeTab === "appointments" && <Appointments />}
          {activeTab === "exercises" && <Exercises />}
          {activeTab === "patients" && <Patients />}
          {activeTab === "progress" && <Progress />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;