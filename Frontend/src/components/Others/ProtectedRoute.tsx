import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // Dacă nu ești logat, "call /login" (redirect)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Dacă ești logat, Outlet randează pagina pe care ai cerut-o (Dashboard, History, etc.)
  return <Outlet />;
};