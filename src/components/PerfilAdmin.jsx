import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePerfil } from '../context/PerfilContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

const PerfilAdmin = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const { modoOscuro } = useTheme(); 
  const token = localStorage.getItem('token');

  const fetchPerfiles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/all`, {
        headers: { Authorization: `${token}` },
      });
      setPerfiles(res.data.profiles);
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarPerfil = async (id) => {
    // if (!window.confirm('¿Seguro que querés eliminar este perfil?')) return;

    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
     

    try {
      if (resultado.isConfirmed){
        await axios.delete(`${import.meta.env.VITE_API_URL}/profiles/${id}`, {
          headers: { Authorization: `${token}` },
        });
        Swal.fire({
          icon: 'success',
          title: 'Perfil eliminado',
          text: `Perfil eliminado con éxito`,
        });
        setPerfiles(perfiles.filter(p => p._id !== id));
      }
      
    } catch (error) {
      
      const mensaje = error.response?.data?.message || 'Error al eliminar perfil';
      const detalle = error.response?.data?.error?.message || '';
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar a la watchlist',
        html: `<strong>${mensaje}</strong>${detalle ? `<br/><small>${detalle}</small>` : ''}`,
      });
    }
  };

  const irAEditar = (perfil) => {
    navigate(`/editar-perfil/${perfil._id}`); // Ajustá según tu ruta
  };

  useEffect(() => {
    fetchPerfiles();
  }, []);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando perfiles...</p>
      </div>
    );
  }

  return (
    
    <div className={`p-6 ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Volver
      </button>
      <h1 className="text-2xl font-bold mb-4">Administrar Perfiles</h1>
      
      <button
        onClick={() => navigate('/crear-perfil')}
        className="mb-6 bg-green-600 px-4 py-2 rounded hover:bg-green-500"
      >
        ➕ Nuevo Perfil
      </button>

      <div className="grid gap-4">
        {perfiles.map((perfil) => (
          <div
            key={perfil._id}
            className={`border p-4 rounded shadow flex justify-between items-center ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"}`}
          >
            <div>
              <p className="text-lg font-semibold">{perfil.name}</p>
              <p className="text-sm ">Categoría: {perfil.ageCategory}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => irAEditar(perfil)}
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-400"
              >
                📝 Editar
              </button>
              <button
                onClick={() => eliminarPerfil(perfil._id)}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerfilAdmin;
