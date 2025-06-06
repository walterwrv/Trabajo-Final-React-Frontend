import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePerfil } from '../context/PerfilContext'; // Importamos el contexto
import jwt_decode from 'jwt-decode';
import { useTheme } from '../context/ThemeContext'; 



const ProfileSelector = () => {
  const [profiles, setProfiles] = useState([]);
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { setPerfilSeleccionado } = usePerfil(); // Usamos el contexto
  const { modoOscuro } = useTheme(); 

   useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setRol(decoded.role);
    }
  }, [token]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/all`, {
          headers: { Authorization: `${token}` }
        });
        // console.log('Res-> ',res.data.profiles);
        setProfiles(res.data.profiles);
        
      } catch (error) {
        console.error('Error al obtener perfiles', error);
      }
    };

    if (token) {
      fetchProfiles();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSelect = (profile) => {
    localStorage.setItem('perfilSeleccionado', JSON.stringify(profile));
    setPerfilSeleccionado(profile); // Actualizamos el perfil seleccionado en el contexto
    navigate('/catalogo');
  };

  return (
    <>
    <div className={`min-h-screen flex flex-col items-center justify-center ${modoOscuro === "oscuro" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-2xl font-semibold mb-6">¿Quién está viendo?</h1>
      <div className="grid grid-cols-2 gap-6">
        {profiles.map((profile) => (
          <button
            key={profile._id}
            onClick={() => handleSelect(profile)}
            className={`bg-gray-500 ${modoOscuro === "oscuro" ? "text-white" : "text-gray-900"} p-4 rounded-xl hover:bg-gray-700 transition`}
          >
            <p className="text-lg">{profile.name}</p>
          </button>
        ))}
      </div>
      {/* Mostrar solo si el rol es dueño */}
      {(rol === 'owner') && (
        <button
          onClick={() => navigate('/administrar-perfiles')}
            className="mt-8 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Administrar Perfiles
        </button>
      )}
    </div>
    
    </>
  );
};

export default ProfileSelector;
