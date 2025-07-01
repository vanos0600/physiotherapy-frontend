import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulación de verificación de autenticación
  useEffect(() => {
    // En una aplicación real, aquí verificarías el token en localStorage
    // o harías una petición al servidor para validar la sesión
    
    const timer = setTimeout(() => {
      // Para pruebas, marcamos como autenticado después de 500ms
      setIsAuthenticated(true);
      setUser({ name: "Admin", role: "admin" });
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (credentials) => {
    // Lógica de login real iría aquí
    setIsAuthenticated(true);
    setUser({ name: "Admin", role: "admin" });
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);