import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Others/ProtectedRoute';
import Login from './Pages/Login'; 
// import History from './pages/History';     // Creează fișierul rapid
import { ProtectedRouteNoLogin } from './components/Others/ProtectedRouteNoLogin';
import Dashboard from './Pages/Dashboard/Dashboard';
import Navbar from './components/Others/Navbar';


function App() {
  return (
    <div className='w-screen h-screen'>
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
    </div>
  );
}

export default App;