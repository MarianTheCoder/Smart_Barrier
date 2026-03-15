import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';

export const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isSet, setIsSet] = useState(false); // Un mic flag să știm că s-a inițializat

  useEffect(() => {
    // 1. Când trimitem date (REQUEST): Atașăm Token-ul
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Când primim date (RESPONSE): Verificăm erorile
    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Dacă serverul zice "401 Unauthorized" (token expirat/fals)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn("Sesiune expirată. Te delogăm...");
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    setIsSet(true);

    // Curățenie când componenta dispare
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [token, logout, navigate]);

  // Afișăm aplicația doar după ce interceptorii sunt setați (opțional, dar recomandat)
  return isSet ? <>{children}</> : null;
};