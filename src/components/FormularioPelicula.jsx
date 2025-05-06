import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const FormularioPelicula = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, es edición
  const [cargando, setCargando] = useState(!!id);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      const obtenerPelicula = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/movies/${id}`, {
            headers: { Authorization: `${token}` },
          });
          reset(res.data); // Llena el formulario
        } catch (error) {
          console.error('Error al obtener película:', error);
        } finally {
          setCargando(false);
        }
      };
      obtenerPelicula();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        // Editar
        await axios.put(`http://localhost:5000/api/movies/${id}`, data, {
          headers: { Authorization: `${token}` },
        });
        alert('Película actualizada correctamente');
      } else {
        // Crear
        await axios.post('http://localhost:5000/api/movies/create', data, {
          headers: { Authorization: `${token}` },
        });
        alert('Película creada correctamente');
      }
      navigate('/admin/peliculas/paginado');
    } catch (error) {
      console.error('Error al guardar película:', error);
      alert('Hubo un problema al guardar la película');
    }
  };

  if (cargando) return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Editar Película' : 'Nueva Película'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Título</label>
          <input
            {...register('title', { required: true })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            {...register('description')}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Imagen (URL)</label>
          <input
            {...register('image')}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Categoría</label>
          <input
            {...register('category')}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Clasificación por edad</label>
          <input
            type="number"
            {...register('ageRating')}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {id ? 'Guardar Cambios' : 'Crear Película'}
        </button>
      </form>
      <button
    
    onClick={() => {
      navigate('/admin/peliculas/paginado');  // Vuelve a la vista de selección de perfil
    }}
      className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      Volver
    </button>
    </div>
  );
};

export default FormularioPelicula;
