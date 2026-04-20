import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  numar_inmatriculare: string;
}

export default function DeleteConfirm({ isOpen, onClose, onConfirm, numar_inmatriculare }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmă ștergerea</DialogTitle>
          <DialogDescription>
            Ești sigur că vrei să ștergi vehiculul cu numărul <span className="font-bold text-primary">{numar_inmatriculare}</span>? Această acțiune
            nu poate fi anulată.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Șterge definitiv
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
