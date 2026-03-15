import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// ATENȚIE: Asigură-te că calea e corectă (noi am făcut src/lib/api.ts, tu ai pus utils)
import { api } from '@/utils/api'; 
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. IMPROVEMENT: Adăugăm starea de loading
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pornim loading-ul
    setLoading(true); 

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      toast.success('Te-ai autentificat cu succes!');
      login(token, user); 
      
    } catch (error: any) { // Folosim 'any' sau un tip specific pentru eroare axios
      console.log('Eroare la autentificare:', error);
      
      // 2. IMPROVEMENT: Încercăm să luăm mesajul de la backend
      // Dacă backend-ul trimite { message: "Parolă greșită" }, îl afișăm pe ăla
      const mesajEroare = error.response?.data?.message || 'Eroare la Server. Încearcă din nou.';
      toast.error(mesajEroare);
      
    } finally {
      // Indiferent dacă a reușit sau a crăpat, oprim loading-ul
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-96 border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Smart Parking</CardTitle>
          <CardDescription>Introdu datele de acces.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" // Ajută browserul să valideze formatul de email
                    placeholder="admin@parcare.ro" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading} // Blocăm inputul în timpul încărcării
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Parolă</Label>
                <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading} // Blocăm inputul
                />
              </div>
              
              {/* Butonul arată "Se încarcă..." și e blocat cât timp așteptăm */}
              <Button className="w-full mt-4" type="submit" disabled={loading}>
                {loading ? 'Se verifică...' : 'Autentificare'}
              </Button>
            
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}