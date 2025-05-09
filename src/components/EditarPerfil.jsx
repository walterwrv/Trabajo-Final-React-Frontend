import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';


const EditarPerfil = () => {
  const { id } = useParams(); // Suponiendo que pasás el id del perfil en la ruta
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const categoriaOriginalRef = useRef(null);
  const { modoOscuro } = useTheme();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/${id}`, {
          headers: { Authorization: `${token}` }
        });

        const perfil = res.data.profile;
        categoriaOriginalRef.current = perfil.ageCategory;
        // Setear los valores iniciales en el formulario
        setValue('name', perfil.name);
        setValue('ageCategory', perfil.ageCategory);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };

    cargarPerfil();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      
      const token = localStorage.getItem('token');

      // Verificamos si hubo cambio de Adulto a Infantil
      const categoriaAnterior = categoriaOriginalRef.current;
      const categoriaNueva = data.ageCategory;
      
      if (categoriaAnterior === 'Adulto' && categoriaNueva === 'Infantil') {
      await axios.delete(`${import.meta.env.VITE_API_URL}/profiles/${id}/watchlist`, {
        headers: { Authorization: `${token}` }
      });
    }
      await axios.put(`${import.meta.env.VITE_API_URL}/profiles/${id}`, data, {
        headers: { Authorization: `${token}` }
      });
      navigate('/administrar-perfiles');
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: `Perfil actualizado con éxito`,
      });
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al actualizar perfil';
      const detalle = error.response?.data?.error?.message || '';
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar a la watchlist',
        html: `<strong>${mensaje}</strong>${detalle ? `<br/><small>${detalle}</small>` : ''}`,
      });
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className={`mt-4 bg-gray-100 p-4 rounded shadow ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
    
      <div className="mb-2">
        <label className="block text-sm font-medium">Nombre del Perfil</label>
        <input {...register('name', { required: 'El nombre de perfil es obligatorio' })} className="w-full p-2 border rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Categoría de Edad</label>
        <select {...register('ageCategory', { required: 'La categoría por edad es obligatoria' })} className={`w-full p-2 border rounded ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
          <option value="">Seleccionar</option>
          <option value="Adulto">Adulto</option>
          <option value="Infantil">Infantil</option>
        </select>
        {errors.ageCategory && <p className="text-red-500 text-sm">{errors.ageCategory.message}</p>}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Actualizar</button>
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

export default EditarPerfil;
