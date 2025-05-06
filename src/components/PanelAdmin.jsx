import { useNavigate } from 'react-router-dom';
import { usePerfil } from '../context/PerfilContext';

const PanelAdmin = () => {
  const navigate = useNavigate();
  const { eliminarPerfil } = usePerfil();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Gestionar Usuarios
        </button>

        <button
          onClick={() => navigate('/administrar-perfiles')}
          className="p-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Gestionar Perfiles
        </button>

        <button
          onClick={() => navigate('/admin/peliculas/paginado')}
          className="p-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Gestionar Películas
        </button>
      </div>
      <button
    
        onClick={() => {
        eliminarPerfil();  // Elimina el perfil
        navigate('/seleccionar-perfil');  // Vuelve a la vista de selección de perfil
        }}
        className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
        Volver
        </button>
    </div>
    
  );
};

export default PanelAdmin;
