import { createContext, useState, useContext } from 'react';

// Crear el contexto
const PerfilContext = createContext();

// Hook para usar el contexto más fácilmente
export const usePerfil = () => useContext(PerfilContext);

// Proveedor del contexto
export const PerfilProvider = ({ children }) => {
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  const cargarPerfilDesdeLocalStorage = () => {
    const perfilGuardado = localStorage.getItem('perfilSeleccionado');
    if (perfilGuardado) {
      setPerfilSeleccionado(JSON.parse(perfilGuardado));
    }
  };

   // Función para eliminar el perfil seleccionado
   const eliminarPerfil = () => {
    setPerfilSeleccionado(null);
    localStorage.removeItem('perfilSeleccionado');
  };

  // Cargar perfil cuando se monta
  useState(() => {
    cargarPerfilDesdeLocalStorage();
  }, []);



  return (
    <PerfilContext.Provider value={{ perfilSeleccionado, setPerfilSeleccionado, eliminarPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
};
