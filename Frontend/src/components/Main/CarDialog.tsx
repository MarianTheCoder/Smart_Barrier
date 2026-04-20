import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: any; // Dacă există, suntem în modul Edit
}

export default function CarDialog({ isOpen, onClose, onSave, editData }: Props) {
  const [numeProprietar, setNumeProprietar] = useState("");
  const [numarInmatriculare, setNumarInmatriculare] = useState("");
  const [active, setActive] = useState(true);
  console.log("Edit data in dialog:", editData);
  useEffect(() => {
    if (editData) {
      setNumeProprietar(editData.nume_proprietar);
      setNumarInmatriculare(editData.numar_inmatriculare);
      setActive(editData.isActive);
    } else {
      setNumeProprietar("");
      setNumarInmatriculare("");
      setActive(true);
    }
  }, [editData, isOpen]);

  const formatPlate = (val: string) => {
    const raw = val
      .replace(/[^A-Z0-9]/gi, "")
      .toUpperCase()
      .slice(0, 7);
    let final = "";
    for (let i = 0; i < raw.length; i++) {
      const char = raw[i];
      if (i < 2) {
        if (/[A-Z]/.test(char)) final += char;
      } else if (i < 4) {
        if (/[0-9]/.test(char)) final += char;
      } else {
        if (/[A-Z]/.test(char)) final += char;
      }
    }
    let display = "";
    if (final.length > 0) display += final.slice(0, 2);
    if (final.length > 2) display += "-" + final.slice(2, 4);
    if (final.length > 4) display += "-" + final.slice(4, 7);
    return display;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCar} className="text-primary" />
            {editData ? "Editează Vehicul" : "Înregistrare Nouă"}
          </DialogTitle>
          <DialogDescription>Asigurați-vă că formatul plăcuței este XX-NN-XXX.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Nume Proprietar</Label>
            <Input value={numeProprietar} onChange={(e) => setNumeProprietar(e.target.value)} placeholder="Nume Complet" />
          </div>
          <div className="space-y-2">
            <Label>Număr Înmatriculare</Label>
            <Input
              value={numarInmatriculare}
              onChange={(e) => setNumarInmatriculare(formatPlate(e.target.value))}
              className="font-mono text-center text-2xl h-14"
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/50">
            <Label className="font-bold">Acces Activ</Label>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onSave({ nume_proprietar: numeProprietar, numar_inmatriculare: numarInmatriculare, isActive: active, id: editData?.id })}
            className="w-full h-12 font-bold"
          >
            {editData ? "ACTUALIZEAZĂ" : "SALVEAZĂ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
