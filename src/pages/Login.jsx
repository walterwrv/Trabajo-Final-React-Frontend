import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";


const schema = Yup.object({
  email: Yup.string().email("Email inválido").required("Campo obligatorio"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo obligatorio"),
});



export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setError("");
    try {
      await login(data.email, data.password);
      console.log('Login exitoso');
      navigate("/seleccionar-perfil"); // redirige si el login fue exitoso
    } catch (err) {
      setError("Credenciales incorrectas o error del servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Iniciar Sesión</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Contraseña</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Ingresar
        </button>
        <p className="mt-4 text-sm text-center">
          ¿No tenés una cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
