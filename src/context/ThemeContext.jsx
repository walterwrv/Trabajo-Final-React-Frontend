// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
 
  const [modoOscuro, setModoOscuro] = useState(() => localStorage.getItem("modo") || "claro");

 

  useEffect(() => {
    localStorage.setItem("modo", modoOscuro);
  }, [modoOscuro]);


  const toggleTheme = () => {
    setModoOscuro(modoOscuro === "claro" ? "oscuro" : "claro");
  };

  return (
    <ThemeContext.Provider value={{ modoOscuro, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
