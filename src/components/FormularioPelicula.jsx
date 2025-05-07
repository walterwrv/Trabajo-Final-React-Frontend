import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const FormularioPelicula = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, es edición
  const [cargando, setCargando] = useState(!!id);
  const token = localStorage.getItem('token');
  const { modoOscuro } = useTheme();

  useEffect(() => {
    if (id) {
      const obtenerPelicula = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/movies/${id}`, {
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
        await axios.put(`${import.meta.env.VITE_API_URL}/movies/${id}`, data, {
          headers: { Authorization: `${token}` },
        });
        alert('Película actualizada correctamente');
      } else {
        // Crear
        await axios.post(`${import.meta.env.VITE_API_URL}/movies/create`, data, {
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

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando...</p>
      </div>
    );
  }
  return (
    <div className={`w-full mx-auto p-4 ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Editar Película' : 'Nueva Película'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Título</label>
          <input
            {...register('title', { required: 'El título es obligatorio' })}
            className="w-full border p-2 rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            {...register('description', { required: 'La descripción es obligatoria' })}
            className="w-full border p-2 rounded"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Imagen (URL)</label>
          <input
            {...register('image', { required: 'La imagen es obligatoria' })}
            className="w-full border p-2 rounded"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Categoría</label>
          <input
            {...register('category', { required: 'La categoría es obligatoria' })}
            className="w-full border p-2 rounded"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Clasificación por edad</label>
          <input
            type="number"
            {...register('ageRating', { required: 'La clasificación por edad es obligatoria' })}
            className="w-full border p-2 rounded"
          />
          {errors.ageRating && <p className="text-red-500 text-sm">{errors.ageRating.message}</p>}
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
