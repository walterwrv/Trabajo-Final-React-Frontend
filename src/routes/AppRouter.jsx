import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
// import RegisterPage from "../pages/Auth/RegisterPage";
import ProfileSelector from "../components/ProfileSelector";
// import MovieCatalog from "../pages/Movies/MovieCatalog";
import PrivateRoute from "../components/PrivateRoute";
import Catalogo from "../components/Catalogo";
import PerfilAdmin from "../components/PerfilAdmin";
import Navbar from "../components/Navbar";
import CreatePerfil from "../components/CreatePerfil";
import EditarPerfil from "../components/EditarPerfil";
import Watchlist from "../components/Watchlist";
import Register from "../components/Register";
import PanelAdmin from '../components/PanelAdmin';
import GestionUsuarios from "../components/GestionUsuarios";
import GestionPeliculas from "../components/GestionPeliculas";
import FormularioPelicula from "../components/FormularioPelicula";
import PaginadoPeliculas from "../components/PaginadoPeliculas";
import ImportarPeliculas from "../components/ImportarPeliculas";



export const AppRouter = () => (

   
      <Routes>
        
        <Route path="/admin" element={<PrivateRoute><Navbar /><PanelAdmin /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}

        
        <Route
          path="/seleccionar-perfil"
          element={
            <PrivateRoute>
              <Navbar />
              <ProfileSelector />
            </PrivateRoute>
          }
        />
        <Route path="/catalogo" element={<PrivateRoute><Navbar /><Catalogo /></PrivateRoute>} />
        <Route path="/administrar-perfiles" element={<PrivateRoute><Navbar /><PerfilAdmin /></PrivateRoute>} />
        <Route path="/crear-perfil" element={<PrivateRoute><Navbar /><CreatePerfil /></PrivateRoute>} />
        <Route path="/editar-perfil/:id" element={<PrivateRoute><Navbar /><EditarPerfil /></PrivateRoute>} />
        <Route path="/watchlist" element={<PrivateRoute><Navbar /><Watchlist /></PrivateRoute>} />
        
        <Route path="/admin/usuarios" element={<PrivateRoute><Navbar /><GestionUsuarios /></PrivateRoute>} />
        
        <Route path="/admin/peliculas" element={<PrivateRoute><Navbar /><GestionPeliculas /></PrivateRoute>} />
        <Route path="/admin/peliculas/paginado" element={<PrivateRoute><Navbar /><PaginadoPeliculas /></PrivateRoute>} />

        <Route path="/admin/peliculas/nueva" element={<PrivateRoute><Navbar /><FormularioPelicula /></PrivateRoute>} />
        <Route path="/admin/peliculas/editar/:id" element={<PrivateRoute><Navbar /><FormularioPelicula /></PrivateRoute>} />
        <Route path="/admin/peliculas/importar" element={<ImportarPeliculas />} />
        


          {/* <Route path="dashboard" element={<p>Dash</p>} /> */}
       

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
);
