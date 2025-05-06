import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GestionPeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies', {
          headers: { Authorization: `${token}` },
        });
        setPeliculas(res.data);
      } catch (error) {
        console.error('Error al obtener películas:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPeliculas();
  }, []);

  const eliminarPelicula = async (id) => {
    const confirmar = confirm('¿Estás seguro de que querés eliminar esta película?');
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`, {
        headers: { Authorization: `${token}` },
      });

      setPeliculas((prev) => prev.filter((pelicula) => pelicula._id !== id));
    } catch (error) {
      console.error('Error al eliminar película:', error);
      alert('No se pudo eliminar la película');
    }
  };

  if (cargando) return <p className="p-4">Cargando películas...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Películas</h1>
        <button
          onClick={() => navigate('/admin/peliculas/nueva')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Crear Nueva Película
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {peliculas.map((pelicula) => (
          <div key={pelicula._id} className="bg-white border p-4 rounded shadow">
            <img
              src={pelicula.image}
              alt={pelicula.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{pelicula.title}</h2>
            <p className="text-sm text-gray-600">{pelicula.description}</p>
            <p className="text-sm mt-1">Clasificación: {pelicula.ageRating}</p>
            <p className="text-sm mt-1">Categoría: {pelicula.category}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate(`/admin/peliculas/editar/${pelicula._id}`)}
                className="flex-1 px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarPelicula(pelicula._id)}
                className="flex-1 px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionPeliculas;
