import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log('tokeeeee', token);
  console.log('children', children);
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;