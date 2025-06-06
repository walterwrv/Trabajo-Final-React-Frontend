import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Crear el contexto
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // datos del usuario (email, id, etc.)
  

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
     
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
          headers: { Authorization: `${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error al cargar usuario", err);
        localStorage.removeItem("token");
      } 
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
