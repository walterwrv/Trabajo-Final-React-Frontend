
import { AppRouter } from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import { PerfilProvider } from './context/PerfilContext';

function App() {
  return (
    <>
      
        <PerfilProvider>
          <AppRouter />
          <ToastContainer position="top-right" autoClose={3000} />
        </PerfilProvider>
      
    </>
    
         
  );
}

export default App;

