import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePerfil } from '../context/PerfilContext';
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
  const { perfilSeleccionado } = usePerfil();
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/watchlist/${perfilSeleccionado._id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setWatchlist(res.data);
      } catch (error) {
        console.error('Error al cargar la watchlist:', error);
      }
    };

    if (perfilSeleccionado) {
      fetchWatchlist();
    }
  }, [perfilSeleccionado]);

  const eliminarDeWatchlist = async (movieId) => {
    const token = localStorage.getItem('token'); // <-- esta línea es clave
    try {
      await axios.post(
        'http://localhost:5000/api/watchlist/remove',
        {
          profileId: perfilSeleccionado._id,
          movieId,
        },
        {
          headers: { Authorization: token },
        }
      );

      // Filtramos la película eliminada
      setWatchlist(prev => prev.filter(movie => movie._id !== movieId));
    } catch (error) {
      console.error('No se pudo eliminar de la watchlist:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mi Watchlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {watchlist.map((pelicula) => (
          <div key={pelicula._id} className="bg-white shadow rounded p-2">
            <img src={pelicula.image} alt={pelicula.title} className="w-full h-48 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{pelicula.title}</h2>
            <p className="text-sm text-gray-600">{pelicula.description}</p>
            <button
              onClick={() => eliminarDeWatchlist(pelicula._id)}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/catalogo')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Volver al Catálogo
      </button>
    </div>
  );
};

export default Watchlist;
