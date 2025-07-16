import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const ProtectedRoute = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // Kullanıcı yoksa veya token yoksa login sayfasına yönlendir
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
