import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRouteNoLogin = () => {
  const { isAuthenticated } = useAuth();

  // Dacă ești logat -> te trimitem la Dashboard (nu ai ce căuta la login)
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Dacă NU ești logat -> "Outlet" va fi înlocuit de <Login />
  return <Outlet />;
};