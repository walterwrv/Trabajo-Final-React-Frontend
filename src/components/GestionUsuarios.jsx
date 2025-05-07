import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({ email: '', role: '' });
  const { modoOscuro } = useTheme(); 

  const token = localStorage.getItem('token');

  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth`, {
          headers: { Authorization: `${token}` },
        });
        setUsuarios(res.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    const confirmar = confirm('¿Estás seguro de que querés eliminar este usuario?');
    if (!confirmar) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/auth/${id}`, {
        headers: { Authorization: `${token}` },
      });

      setUsuarios((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('No se pudo eliminar el usuario');
    }
  };

  const comenzarEdicion = (usuario) => {
    setEditandoId(usuario._id);
    setFormData({ email: usuario.email, role: usuario.role });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData({ email: '', role: '' });
  };

  const guardarCambios = async (id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/${id}`, formData, {
        headers: { Authorization: `${token}` },
      });

      setUsuarios((prev) =>
        prev.map((user) => (user._id === id ? { ...user, ...res.data.user } : user))
      );

      cancelarEdicion();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('No se pudo actualizar el usuario');
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (cargando) return <p className="p-4">Cargando usuarios...</p>;

  return (
    <div className={`p-4 ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <button
        
        onClick={() => {
          navigate(-1);  // Vuelve a la vista de selección de perfil
        }}
          className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Volver
        </button>
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead className={`${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
          <tr>
            <th className="p-2 text-left border-b">Email</th>
            <th className="p-2 text-left border-b">Rol</th>
            <th className="p-2 text-left border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td className={`p-2 border-b  ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
                {editandoId === usuario._id ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  usuario.email
                )}
              </td>
              <td className={`p-2 border-b  ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

                {editandoId === usuario._id ? (
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`border px-2 py-1 w-full ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                    <option value="standard">standard</option>
                    <option value="admin">admin</option>
                    <option value="owner">owner</option>
                  </select>
                ) : (
                  usuario.role
                )}
              </td>
              <td className={`p-2 border-b space-x-2 ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

                {editandoId === usuario._id ? (
                  <>
                    <button
                      onClick={() => guardarCambios(usuario._id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => comenzarEdicion(usuario)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarUsuario(usuario._id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;
