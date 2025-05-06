
import { AppRouter } from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import { PerfilProvider } from './context/PerfilContext';

function App() {
  return (
    <>
      <div className='bg-gray-300'>
        <PerfilProvider>
          <AppRouter />
          <ToastContainer position="top-right" autoClose={3000} />
        </PerfilProvider>
      </div>
    </>
    
         
  );
}

export default App;

