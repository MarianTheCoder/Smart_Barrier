// Varianta CORECTĂ pentru setările tale:
import { createContext, useContext, useState, type ReactNode } from 'react';
// 1. Definim forma User-ului (TSX specific)
// Asta ne ajută ca mai târziu, dacă scriem user.nume, să primim eroare (că e username)
interface User {
  id: string;
  username: string;
  role: 'admin' | 'user'; // Poate fi doar una din astea două
}

// 2. Definim ce funcții și date oferim în toată aplicația
interface AuthContextType {
  user: User | null;          // Userul poate fi null (nelogat) sau obiectul User
  token: string | null;       // Tokenul de la backend
  login: (token: string, userData: User) => void; // Funcția de login
  logout: () => void;         // Funcția de logout
  isAuthenticated: boolean;   // Ești logat sau nu?
}

// Creăm contextul gol la început
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Aceasta este componenta "Mamă" care va înveli toată aplicația
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // Citim din localStorage ca să nu te delogheze când dai Refresh la pagină
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Funcția care se apelează când backend-ul zice "OK, uite token-ul"
  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Un mic "cârlig" (hook) ca să folosim auth-ul ușor în alte pagini
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth trebuie folosit în interiorul AuthProvider');
  return context;
};