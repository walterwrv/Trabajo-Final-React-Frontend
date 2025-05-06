
import { AppRouter } from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import { PerfilProvider } from './context/PerfilContext';

function App() {
  return (
    <>
      <div className='bg-gray-300 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors'>
        <PerfilProvider>
          <AppRouter />
          <ToastContainer position="top-right" autoClose={3000} />
        </PerfilProvider>
      </div>
    </>
    
         
  );
}

export default App;

