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

interface Reserve {
  id: string;
  name: string;
  percentage: number;
}

interface ReserveModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, percentage: number) => void;
  reserve?: Reserve | null;
  remainingPercentage: number;
}

const ReserveModal = ({ open, onClose, onSave, reserve, remainingPercentage }: ReserveModalProps) => {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");

  useEffect(() => {
    if (reserve) {
      setName(reserve.name);
      setPercentage(String(reserve.percentage));
    } else {
      setName("");
      setPercentage("");
    }
  }, [reserve, open]);

  const maxPercentage = reserve
    ? remainingPercentage + reserve.percentage
    : remainingPercentage;

  const handleSave = () => {
    const pct = parseFloat(percentage);
    if (!name.trim() || isNaN(pct) || pct <= 0 || pct > maxPercentage) return;
    onSave(name.trim(), pct);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{reserve ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
          <DialogDescription>
            Disponível: {maxPercentage.toFixed(1)}%
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Investimentos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentage">Porcentagem (%)</Label>
            <Input
              id="percentage"
              type="number"
              min={0.1}
              max={maxPercentage}
              step={0.1}
              placeholder={`Máx: ${maxPercentage.toFixed(1)}%`}
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveModal;
