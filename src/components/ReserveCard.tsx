import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ReserveCardProps {
  name: string;
  percentage: number;
  value: number;
  onEdit: () => void;
  onDelete: () => void;
}

const ReserveCard = ({ name, percentage, value, onEdit, onDelete }: ReserveCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
      <div
        className="absolute bottom-0 left-0 h-1 bg-primary transition-all"
        style={{ width: `${percentage}%` }}
      />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{name}</p>
            <p className="text-sm font-semibold text-foreground/70 shrink-0">
              {percentage}%
            </p>
          </div>
          <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="bg-accent/50 rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">Valor alocado</p>
          <p className="text-base font-semibold text-accent-foreground">
            R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReserveCard;
