import { useEffect, useState } from 'react';
import axios from 'axios';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({ email: '', role: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth', {
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
      await axios.delete(`http://localhost:5000/api/auth/${id}`, {
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
      const res = await axios.put(`http://localhost:5000/api/auth/${id}`, formData, {
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">Email</th>
            <th className="p-2 text-left border-b">Rol</th>
            <th className="p-2 text-left border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td className="p-2 border-b">
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
              <td className="p-2 border-b">
                {editandoId === usuario._id ? (
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  >
                    <option value="standard">standard</option>
                    <option value="admin">admin</option>
                    <option value="owner">owner</option>
                  </select>
                ) : (
                  usuario.role
                )}
              </td>
              <td className="p-2 border-b space-x-2">
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
