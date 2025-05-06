import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PaginadoPeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [paginaInput, setPaginaInput] = useState(1);


  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const obtenerPeliculas = async (paginaActual) => {
    setCargando(true);
    try {
      const res = await axios.get('http://localhost:5000/api/movies/paginado', {
        params: { page: paginaActual, limit: 8 }, // ajustá el limit si querés
      });
      setPeliculas(res.data.data);
      setTotalPaginas(res.data.totalPages);
    } catch (error) {
      console.error('Error al obtener películas paginadas:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPeliculas(pagina);
  }, [pagina]);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPagina(nuevaPagina);
    }
  };

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

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Películas</h1>
      
        <div className="flex gap-2">
        <button
          onClick={() => navigate('/admin/peliculas/importar')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Importar películas
        </button>

        <button
          onClick={() => navigate('/admin/peliculas/nueva')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Crear Nueva Película
        </button>
        </div>
      </div>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
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
        <button
            onClick={() => navigate(-1)}
            className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
            Volver
        </button>
      </div>
      )}

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
  );
};

export default PaginadoPeliculas;
