import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', data);
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
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
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
