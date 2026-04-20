import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/Main/ProtectedRoute.tsx";
import Login from "./Pages/Login.tsx";
import ProtectedRouteAfterLogin from "./components/Main/ProtectedRouteNoLogin.tsx";
import Dashboard from "./Pages/Dashboard.tsx";
import Navbar from "./components/Main/Navbar.tsx";
// 1. IMPORTĂM PAZNICUL
import { Toaster } from "sonner";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import Records from "./Pages/Records.tsx";

function App() {
  return (
    <div className="w-screen  h-screen">
      <BrowserRouter>
        <LoadingProvider>
          <AuthProvider>
            <Routes>
              {/* prettier-ignore */}
              <Route path="/login" element={<ProtectedRouteAfterLogin><Login /></ProtectedRouteAfterLogin>} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Navbar />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/live" element={<Dashboard />} />
                  <Route path="/active" element={<Dashboard />} />
                  <Route path="/history" element={<Dashboard />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </LoadingProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
