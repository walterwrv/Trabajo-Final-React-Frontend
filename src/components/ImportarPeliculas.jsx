import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const ImportarPeliculas = () => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [importados, setImportados] = useState([]); // IDs ya importados
  const navigate = useNavigate();

  const handleBuscar = async () => {
    if (!busqueda.trim()) return;
    setCargando(true);
    try {
      const res = await axios.get('http://localhost:5000/api/external/search', {
        params: { title: busqueda }
      });
      setResultados(res.data);
    } catch (error) {
      console.error('Error al buscar en OMDb:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al buscar películas externas',
      });
    } finally {
      setCargando(false);
    }
  };

  const importarPelicula = async (imdbID) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/external/import', { imdbID }, {
        headers: { Authorization: token }
      });

      // Agregar ID a los ya importados
      setImportados((prev) => [...prev, imdbID]);

      Swal.fire({
        icon: 'success',
        title: 'Película importada',
        text: `La película "${res.data.movie.title}" fue importada con éxito.`,
      });
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al importar';
      const detalle = error.response?.data?.error?.message || '';
      Swal.fire({
        icon: 'error',
        title: 'Error al importar',
        html: `<strong>${mensaje}</strong>${detalle ? `<br/><small>${detalle}</small>` : ''}`,
      });
    }
  };

  return (
    <div className="p-4">
        <button
            onClick={() => navigate(-1)}
            className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
            Volver
        </button>
      <h1 className="text-2xl font-bold mb-4">Importar Películas desde OMDb</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por título"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {cargando && <p>Buscando...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resultados.map((movie) => {
          const yaImportada = importados.includes(movie.imdbID);
          return (
            <div key={movie.imdbID} className="border p-2 rounded shadow-sm bg-white">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
                alt={movie.Title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{movie.Title}</h3>
              <p className="text-sm text-gray-600">{movie.Year}</p>
              <button
                onClick={() => importarPelicula(movie.imdbID)}
                disabled={yaImportada}
                className={`mt-2 px-3 py-1 text-white rounded transition ${
                  yaImportada ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {yaImportada ? 'Importada' : 'Importar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImportarPeliculas;
