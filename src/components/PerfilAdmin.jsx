import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePerfil } from '../context/PerfilContext';

const PerfilAdmin = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchPerfiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profiles/all', {
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
    if (!window.confirm('¿Seguro que querés eliminar este perfil?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/profiles/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setPerfiles(perfiles.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
    }
  };

  const irAEditar = (perfil) => {
    navigate(`/editar-perfil/${perfil._id}`); // Ajustá según tu ruta
  };

  useEffect(() => {
    fetchPerfiles();
  }, []);

  if (cargando) return <p className="text-white">Cargando perfiles...</p>;

  return (
    
    <div className="p-6 text-white">
      <button
        onClick={() => navigate('/seleccionar-perfil')}
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
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">{perfil.name}</p>
              <p className="text-sm text-gray-300">Categoría: {perfil.ageCategory}</p>
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
