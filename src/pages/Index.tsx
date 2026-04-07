import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Wallet, PieChart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import ReserveCard from "@/components/ReserveCard";
import ReserveModal from "@/components/ReserveModal";

interface Reserve {
  id: string;
  name: string;
  percentage: number;
}

const Index = () => {
  const [capital, setCapital] = useState("");
  const [reserves, setReserves] = useState<Reserve[]>([
    { id: "1", name: "Necessidades", percentage: 50 },
    { id: "2", name: "Investimentos", percentage: 30 },
    { id: "3", name: "Lazer", percentage: 20 },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReserve, setEditingReserve] = useState<Reserve | null>(null);

  const capitalValue = parseFloat(capital.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;

  const totalPercentage = useMemo(
    () => reserves.reduce((sum, r) => sum + r.percentage, 0),
    [reserves]
  );

  const remainingPercentage = 100 - totalPercentage;

  const handleSave = (name: string, percentage: number) => {
    if (editingReserve) {
      setReserves((prev) =>
        prev.map((r) =>
          r.id === editingReserve.id ? { ...r, name, percentage } : r
        )
      );
    } else {
      setReserves((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name, percentage },
      ]);
    }
    setEditingReserve(null);
  };

  const handleDelete = (id: string) => {
    setReserves((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (reserve: Reserve) => {
    setEditingReserve(reserve);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingReserve(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Gestão de Orçamento</h1>
                <p className="text-sm text-muted-foreground">
                  Distribua seu capital por porcentagem
                </p>
              </div>
            </div>
            <Link to="/signup">
              <Button variant="outline" size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Cadastrar</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Capital Input */}
        <section className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Capital Total
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              R$
            </span>
            <Input
              className="pl-11 h-12 sm:h-14 text-xl sm:text-2xl font-semibold"
              placeholder="0,00"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              inputMode="decimal"
            />
          </div>
        </section>

        {/* Percentage bar */}
        <section className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <PieChart className="h-4 w-4" />
              Alocação total
            </span>
            <span
              className={`font-semibold ${
                totalPercentage === 100
                  ? "text-primary"
                  : totalPercentage > 100
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {totalPercentage.toFixed(1)}% / 100%
            </span>
          </div>
          <Progress value={Math.min(totalPercentage, 100)} className="h-2" />
          {totalPercentage > 100 && (
            <p className="text-xs text-destructive">
              A soma das porcentagens excede 100%!
            </p>
          )}
          {totalPercentage < 100 && reserves.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {remainingPercentage.toFixed(1)}% restante para alocar
            </p>
          )}
        </section>

        {/* Reserve Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Reservas</h2>
            <Button
              onClick={handleNew}
              size="sm"
              disabled={remainingPercentage <= 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nova Reserva
            </Button>
          </div>

          {reserves.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <PieChart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma reserva criada.</p>
              <p className="text-sm">Clique em "Nova Reserva" para começar.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reserves.map((reserve) => (
                <ReserveCard
                  key={reserve.id}
                  name={reserve.name}
                  percentage={reserve.percentage}
                  value={(capitalValue * reserve.percentage) / 100}
                  onEdit={() => handleEdit(reserve)}
                  onDelete={() => handleDelete(reserve.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <ReserveModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingReserve(null);
        }}
        onSave={handleSave}
        reserve={editingReserve}
        remainingPercentage={remainingPercentage}
      />
    </div>
  );
};

export default Index;
