import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePerfil } from '../context/PerfilContext'; // Usamos el contexto para obtener el perfil seleccionado
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext'; 


const Catalogo = () => {
  const { perfilSeleccionado,eliminarPerfil } = usePerfil(); // Obtenemos el perfil seleccionado
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [paginaInput, setPaginaInput] = useState(1);
  const { modoOscuro } = useTheme(); 

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');

  const [tituloInput, setTituloInput] = useState('');
  const [categoriaInput, setCategoriaInput] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeliculas = async () => {
      setCargando(true);
      try {
        const params = {
          page: pagina,
          limit: 8,
        };
  
        if (perfilSeleccionado?.ageCategory === 'Infantil') {
          params.maxAge = 12;
        }
  
        if (titulo) params.title = titulo;
        if (categoria) params.category = categoria;
  
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/movies/paginado`, { params });
  
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
  }, [perfilSeleccionado, pagina, titulo, categoria]);
  

  const agregarAWtachlist = async (peliculaId) => {
    setCargando(true);
    const token = localStorage.getItem('token');
   
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/watchlist/add`, {
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
    finally {
      setCargando(false);
    }
  };

  if (!perfilSeleccionado) return <p>Selecciona un perfil para ver el catálogo</p>;
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando...</p>
      </div>
    );
  }

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
    <div className={`p-4 ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
    <div className="flex justify-between items-center mb-4">
        
        <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTitulo(tituloInput);
            setCategoria(categoriaInput);
            setPagina(1); // Volver a la primera página al aplicar filtros
          }}
          className="flex flex-col md:flex-row gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Buscar por título"
            value={tituloInput}
            onChange={(e) => setTituloInput(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            type="text"
            placeholder="Filtrar por categoría"
            value={categoriaInput}
            onChange={(e) => setCategoriaInput(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Filtrar
            </button>
            <button
              type="button"
              onClick={() => {
                setTitulo('');
                setCategoria('');
                setTituloInput('');
                setCategoriaInput('');
                setPagina(1);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Limpiar filtros
            </button>
          </div>
        </form>

        <h1 className="text-2xl font-bold">      
          Catálogo {perfilSeleccionado?.ageCategory === 'Infantil' ? 'Infantil' : 'General'}
        </h1>
        </div>
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
            <div key={pelicula._id} className={`border p-4 rounded shadow ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
              <img src={pelicula.image } alt={pelicula.title} className="w-full h-48 object-cover rounded" />
              <h2 className="text-lg font-semibold mt-2">{pelicula.title}</h2>
              <p className="text-sm text-gray-600">{pelicula.description}</p>
              <p className="text-sm mt-1">Clasificación: {pelicula.ageRating}</p>
              <p className="text-sm mt-1">Categoría: {pelicula.category}</p>
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
