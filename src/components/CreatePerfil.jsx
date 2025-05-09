import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';

const CreatePerfil = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const { modoOscuro } = useTheme(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setCargando(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/profiles/create`, data, {
        headers: { Authorization: `${token}` }
      });
      reset(); // Limpia el formulario
      navigate('/administrar-perfiles'); // Cambiá esta ruta por la que uses en tu app
      Swal.fire({
        icon: 'success',
        title: 'Perfil creado',
        text: `Perfil creado con éxito`,
      });
    } catch (error) {
      
      const mensaje = error.response?.data?.message || 'Error al crear perfil';
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 p-4 max-w-md mx-auto ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        
        <div>
          <label className="block mb-1 font-semibold">Nombre del perfil</label>
          <input
            type="text"
            {...register('name', { required: 'El nombre de perfil es obligatorio' })}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Categoría de edad</label>
          <select
            {...register('ageCategory', { required: 'La categoría por edad es obligatoria' })}
            className={`w-full p-2 border rounded ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
          >
            <option value="Infantil">Infantil</option>
            <option value="Adulto">Adulto</option>
          </select>
          {errors.ageCategory && <p className="text-red-500 text-sm">{errors.ageCategory.message}</p>}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear perfil
        </button>
      </form>
      <button
        type="button"
        onClick={() => navigate('/administrar-perfiles')}
        className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Volver
      </button>
  </>
  );
};

export default CreatePerfil;
