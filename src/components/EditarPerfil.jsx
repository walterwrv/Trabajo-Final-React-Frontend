import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditarPerfil = () => {
  const { id } = useParams(); // Suponiendo que pasás el id del perfil en la ruta
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(' id ',id)
        const res = await axios.get(`http://localhost:5000/api/profiles/${id}`, {
          headers: { Authorization: `${token}` }
        });

        const perfil = res.data.profile;
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
      await axios.put(`http://localhost:5000/api/profiles/${id}`, data, {
        headers: { Authorization: `${token}` }
      });
      navigate('/administrar-perfiles');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 bg-gray-100 p-4 rounded shadow">
    <button
      onClick={() => navigate('/administrar-perfiles')}
      className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      Volver
    </button>
      <div className="mb-2">
        <label className="block text-sm font-medium">Nombre del Perfil</label>
        <input {...register('name', { required: true })} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Categoría de Edad</label>
        <select {...register('ageCategory', { required: true })} className="w-full p-2 border rounded">
          <option value="">Seleccionar</option>
          <option value="Adulto">Adulto</option>
          <option value="Infantil">Infantil</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  );
};

export default EditarPerfil;
