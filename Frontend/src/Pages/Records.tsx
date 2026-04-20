import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faCar, faEllipsis, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { toast } from "sonner";
import RomanianEmblem from "@/assets/Romanian_Emblem.png";

// Importăm componentele create mai sus
import CarDialog from "../components/Main/CarDialog";
import DeleteConfirm from "../components/Main/DeleteConfirm";
import api from "@/utils/AxiosInterceptor";

export default function Records() {
  const [records, setRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // State-uri pentru Dialoguri
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);

  // FETCH DATA
  const fetchCars = async () => {
    try {
      const res = await api.get("/cars/getAllCars");
      const formatted = res.data.map((c: any) => ({
        id: c.id,
        nume_proprietar: c.nume_proprietar,
        numar_inmatriculare: c.numar_inmatriculare,
        isActive: c.activ === 1,
        createdAt: new Date(c.data_creare).toLocaleDateString("ro-RO"),
      }));
      setRecords(formatted);
    } catch (err) {
      toast.error("Eroare la încărcarea datelor");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // CRUD HANDLERS
  const handleSave = async (data: any) => {
    if (!data.nume_proprietar || !data.numar_inmatriculare || data.numar_inmatriculare.length < 7) {
      toast.error("Toate câmpurile sunt obligatorii");
      return;
    }
    try {
      if (selectedCar) {
        await api.put(`/cars/updateCar/${data.id}`, data);
        toast.success("Actualizat!");
      } else {
        await api.post("/cars/addCar", data);
        toast.success("Adăugat!");
      }
      setDialogOpen(false);
      fetchCars();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Eroare la salvare");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/cars/deleteCar/${selectedCar.id}`);
      toast.success("Șters cu succes");
      setDeleteOpen(false);
      fetchCars();
    } catch (err) {
      toast.error("Eroare la ștergere");
    }
  };

  const filteredRecords = records.filter(
    (r) => r.numar_inmatriculare.includes(searchTerm.toUpperCase()) || r.nume_proprietar.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    // MODIFICARE: h-full și overflow-hidden pe părinte
    <div className="p-6 space-y-6 h-full w-full flex flex-col overflow-hidden">
      {/* HEADER SECTION - shrink-0 pentru a nu se comprima */}
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary text-2xl">
            <FontAwesomeIcon icon={faCar} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Gestiune Acces</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Numar Vehicule: <span className="text-primary">{records.length}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Caută..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button
            className="-black"
            onClick={() => {
              setSelectedCar(null);
              setDialogOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="" />
            Adaugă
          </Button>
        </div>
      </div>

      {/* MODIFICARE: Wrapper nou pentru scroll care ocupă restul spațiului (flex-1) */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredRecords.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-center text-lg p-4 px-12 bg-muted rounded-lg">Nu există înregistrări.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="border-2 gap-2 py-0 hover:border-primary/80 transition-all bg-card overflow-hidden shadow-sm">
                <div className="p-3 border-b flex justify-between items-start bg-muted/20">
                  <div className="truncate ">
                    <span className="text-[10px] font-black text-primary uppercase">Proprietar</span>
                    <h4 className="font-black text-base truncate ">{record.nume_proprietar}</h4>
                  </div>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <Button size="icon-xs" variant="outline">
                        <FontAwesomeIcon icon={faEllipsis} />
                      </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          setSelectedCar(record);
                          setDialogOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-primary mr-2" /> Editează
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          setSelectedCar(record);
                          setDeleteOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-destructive mr-2" /> Șterge
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>

                <CardContent className="p-3 space-y-4 ">
                  <div className="w-full bg-white border-2 border-black rounded-md flex items-center h-14 relative overflow-hidden shadow-inner">
                    <div className="w-8 h-full bg-blue-700 flex gap-1 flex-col items-center justify-center text-white py-1">
                      <img src={RomanianEmblem} alt="RO" className="w-6 h-6 object-contain" />
                      <span className="font-bold text-xs">RO</span>
                    </div>
                    <span className="flex-1 text-center font-mono text-black font-black text-2xl tracking-tighter uppercase">
                      {record.numar_inmatriculare}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Adăugat la</span>
                      <span className="text-xs font-bold">{record.createdAt}</span>
                    </div>
                    <Badge variant={record.isActive ? "default" : "destructive"} className="px-3 font-black text-[10px]">
                      {record.isActive ? "ACTIV" : "INACTIV"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* MODALELE EXTERNE */}
      <CarDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} editData={selectedCar} />
      <DeleteConfirm
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        numar_inmatriculare={selectedCar?.numar_inmatriculare || ""}
      />
    </div>
  );
}
