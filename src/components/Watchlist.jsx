import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePerfil } from '../context/PerfilContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

const Watchlist = () => {
  const { perfilSeleccionado } = usePerfil();
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();
  const { modoOscuro } = useTheme(); 
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setCargando(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/watchlist/${perfilSeleccionado._id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setWatchlist(res.data);
      } catch (error) {
        console.error('Error al cargar la watchlist:', error);
      }
      finally {
        setCargando(false);
      }
    };

    if (perfilSeleccionado) {
      fetchWatchlist();
    }
  }, [perfilSeleccionado]);

  const eliminarDeWatchlist = async (movieId) => {
    setCargando(true);
    const token = localStorage.getItem('token'); // <-- esta línea es clave
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/watchlist/remove`,
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
      Swal.fire({
        icon: 'success',
        title: 'Película eliminada',
        text: `Película eliminada de la watchlist con éxito`,
      });
    } catch (error) {
      const mensaje = error.response?.data?.message || 'No se pudo eliminar de la watchlist';
      const detalle = error.response?.data?.error?.message || '';
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar a la watchlist',
        html: `<strong>${mensaje}</strong>${detalle ? `<br/><small>${detalle}</small>` : ''}`,
      });
    }
    finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando...</p>
      </div>
    );
  }
  return (
    <div className={`p-4 ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-2xl font-bold mb-4">Mi Watchlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {watchlist.map((pelicula) => (
          <div key={pelicula._id} className={`border p-4 rounded shadow ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
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
          className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Volver
      </button>
    </div>
  );
};

export default Watchlist;
