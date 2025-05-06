import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePerfil } from '../context/PerfilContext'; // Usamos el contexto para obtener el perfil seleccionado
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const Catalogo = () => {
  const { perfilSeleccionado,eliminarPerfil } = usePerfil(); // Obtenemos el perfil seleccionado
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [paginaInput, setPaginaInput] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeliculas = async () => {
      setCargando(true);
      try {
        const params = {
          page: pagina,
          limit: 8, // Cambialo si querés más o menos por página
        };
    
        // Si es perfil infantil, filtramos por minAge
        if (perfilSeleccionado?.ageCategory === 'Infantil') {
          params.minAge = 13;
        }
    
        const res = await axios.get('http://localhost:5000/api/movies/paginado', { params });
    
        setPeliculas(res.data.data);
        setTotalPaginas(res.data.totalPages);
      } catch (error) {
        console.error('Error al obtener películas:', error);
      } finally {
        setCargando(false);
      }
    };
    

    if (perfilSeleccionado) {
      fetchPeliculas();
    }
  }, [perfilSeleccionado, pagina]);

  const agregarAWtachlist = async (peliculaId) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.post('http://localhost:5000/api/watchlist/add', {
        profileId: perfilSeleccionado._id,
        movieId: peliculaId,
      }, {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Película agregada',
        text: `Película agregada a la watchlist`,
      });
      
    } catch (error) {

      const mensaje = error.response?.data?.message || 'No se pudo agregar a la watchlist';
      const detalle = error.response?.data?.error?.message || '';
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar a la watchlist',
        html: `<strong>${mensaje}</strong>${detalle ? `<br/><small>${detalle}</small>` : ''}`,
      });
    }
  };

  if (!perfilSeleccionado) return <p>Selecciona un perfil para ver el catálogo</p>;
  if (cargando) return <p>Cargando películas...</p>;

  return (
    <>
    <button
    
    onClick={() => {
      eliminarPerfil();  // Elimina el perfil
      navigate('/seleccionar-perfil');  // Vuelve a la vista de selección de perfil
    }}
      className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      Volver
    </button>
    <div className="p-4">
    <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Catálogo {perfilSeleccionado?.ageCategory === 'Infantil' ? 'Infantil' : 'General'}
        </h1>
        <button
          onClick={() => navigate('/watchlist')}
          className={`px-4 py-2 text-white rounded transition ${
            perfilSeleccionado?.ageCategory === 'Infantil' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Ver Watchlist
        </button>
      </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {peliculas.map((pelicula) => (
            <div key={pelicula._id} className="bg-gray-100 p-2 rounded shadow">
              <img src={pelicula.image } alt={pelicula.title} className="w-full h-48 object-cover rounded" />
              <h2 className="text-lg font-semibold mt-2">{pelicula.title}</h2>
              <p className="text-sm text-gray-600">{pelicula.description}</p>
              <button
                onClick={() => agregarAWtachlist(pelicula._id)}
                className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
              >
                Agregar a Watchlist
              </button>
            </div>
          ))}
          
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center mt-6 gap-4">
        <button
          disabled={pagina === 1}
          onClick={() => {
            setPagina(pagina - 1);
            setPaginaInput(pagina - 1);
          }}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          ← Anterior
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (paginaInput >= 1 && paginaInput <= totalPaginas) {
              setPagina(paginaInput);
            }
          }}
          className="flex items-center gap-2"
        >
          <span>Página</span>
          <input
            type="number"
            value={paginaInput}
            onChange={(e) => setPaginaInput(Number(e.target.value))}
            min={1}
            max={totalPaginas}
            className="w-16 text-center border rounded"
          />
          <span>de {totalPaginas}</span>
          <button
            type="submit"
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ir
          </button>
        </form>

        <button
          disabled={pagina === totalPaginas}
          onClick={() => {
            setPagina(pagina + 1);
            setPaginaInput(pagina + 1);
          }}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
      </div>
      
    </>
  );
};

export default Catalogo;
