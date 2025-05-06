import { useTheme } from '../context/ThemeContext';

const BotonModoOscuro = () => {
  const { modoOscuro, toggleTheme } = useTheme();

  return (
    
    <button
    onClick={toggleTheme}
    className={`px-3 py-1 rounded transition 
              ${modoOscuro === "oscuro" ? "bg-yellow-400 text-gray-900 " : "bg-gray-800 text-white"} hover:opacity-80`}
    >
    {modoOscuro === "oscuro" ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
    </button>




    
  );
};

export default BotonModoOscuro;
