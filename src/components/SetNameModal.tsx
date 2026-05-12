import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SetNameModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
}

const SetNameModal = ({ open, onClose, onSave, initialName = "" }: SetNameModalProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Salvar filtro</DialogTitle>
          <DialogDescription>
            Dê um nome para identificar esse filtro de reservas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="set-name">Nome do filtro</Label>
          <Input
            id="set-name"
            placeholder="Ex: Administração salarial"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetNameModal;
