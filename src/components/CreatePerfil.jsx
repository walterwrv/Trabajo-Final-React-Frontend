import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePerfil = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('data ', data)
      console.log('token ', token)
      await axios.post('http://localhost:5000/api/profiles/create', data, {
        headers: { Authorization: `${token}` }
      });
      reset(); // Limpia el formulario
      navigate('/administrar-perfiles'); // Cambiá esta ruta por la que uses en tu app
    } catch (error) {
      console.error('Error al crear perfil:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-md mx-auto">
      <button
        onClick={() => navigate('/administrar-perfiles')}
        className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Volver
      </button>
      <div>
        <label className="block mb-1 font-semibold">Nombre del perfil</label>
        <input
          type="text"
          {...register('name', { required: 'El nombre es obligatorio' })}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Categoría de edad</label>
        <select
          {...register('ageCategory', { required: true })}
          className="w-full p-2 border rounded"
        >
          <option value="Infantil">Infantil</option>
          <option value="Adulto">Adulto</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Crear perfil
      </button>
    </form>
  );
};

export default CreatePerfil;
