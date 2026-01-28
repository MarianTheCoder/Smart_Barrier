import { useAuth } from "@/context/AuthContext";
import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/button";

export default function Navbar() {
  const { logout, user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Navigare */}
      <div className="border-b p-4 flex justify-between items-center bg-card">
        <div className="font-bold text-xl text-primary">Smart Parking</div>
        <div className="flex gap-4">
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/history" className="hover:underline">Istoric</Link>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.username}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
        </div>
      </div>
        <Outlet />
    </div>
  );
}