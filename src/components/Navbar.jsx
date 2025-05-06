import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePerfil } from '../context/PerfilContext';
import jwt_decode from 'jwt-decode';
import { Settings } from 'lucide-react';


const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { setPerfilSeleccionado, perfilSeleccionado } = usePerfil();
  const [rol, setRol] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfilSeleccionado');
    setPerfilSeleccionado(null);
    navigate('/login');
  };

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      console.log('role ',decoded.role)
      setRol(decoded.role);
    }
  }, [token]);


  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        NodoCinee
      </Link>

      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="md:hidden focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d={menuAbierto ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>

      <div className={`md:flex items-center gap-4 ${menuAbierto ? 'block' : 'hidden'} md:block`}>
        {perfilSeleccionado && (
          <>
            <span className="text-sm block md:inline mb-2 md:mb-0">Perfil: {perfilSeleccionado.name}</span>
            
            
            
            
          </>
        )}
        {(rol === 'admin') && (
          <button
            onClick={() => navigate('/admin')}
            className=" flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-sm block"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
