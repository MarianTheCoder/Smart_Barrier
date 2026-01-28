import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Importăm ce am făcut la Pasul 1
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Luăm funcția de login din context

  // Aici e magia TSX: Specificăm tipul evenimentului (e)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Nu lăsa pagina să facă refresh
    
    // SIMULARE BACKEND (Aici vom pune axios mai târziu)
    console.log("Se încearcă logarea...", email, password);

    // Simulăm că backend-ul ne-a dat OK
    if(email && password) {
        login("token_fals_12345", { id: "1", username: "Admin", role: "admin" });
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
                    placeholder="admin@parcare.ro" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // TS știe automat că e un input text
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Parolă</Label>
                <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full mt-4" type="submit">Autentificare</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}