import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.tsx';
import { ProtectedRoute } from '../components/Others/ProtectedRoute.tsx';
import Login from '../Pages/Login.tsx'; 
import { ProtectedRouteNoLogin } from '../components/Others/ProtectedRouteNoLogin.tsx';
import Dashboard from '../Pages/Dashboard/Dashboard.tsx';
import Navbar from '../components/Others/Navbar.tsx';
// 1. IMPORTĂM PAZNICUL
import { AxiosInterceptor } from '../components/Others/AxiosInterceptor.tsx'; 
import { Toaster } from 'sonner';

function App() {
  return (
    <div className='w-screen dark h-screen'>
    <AuthProvider>
      <BrowserRouter>
        {/* 2. ÎMBRĂCĂM TOTUL ÎN INTERCEPTOR */}
        {/* Trebuie să fie ÎN INTERIORUL AuthProvider și BrowserRouter ca să meargă hooks-urile */}
        <AxiosInterceptor>
            <Routes>
              <Route element={<ProtectedRouteNoLogin />}>
                <Route path="/login" element={<Login />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route element={<Navbar />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position='bottom-right'/>
        </AxiosInterceptor>
      </BrowserRouter>
    </AuthProvider>
    </div>
  );
}

export default App;