import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useState } from 'react';

// Esquema de validación con Yup
const schema = Yup.object({
  email: Yup.string()
    .email('Debe ser un correo válido')
    .required('El correo es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const Register = () => {

  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setCargando(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, data);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: `Iniciá sesión.`,
      });
      navigate('/login');
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al registrarse';
      const detalle = error.response?.data?.error?.message || '';
      Swal.fire({
        icon: 'error',
        title: 'Error',
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-300 shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Crear cuenta</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            {...register('email')}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            {...register('password')}
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
