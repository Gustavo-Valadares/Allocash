import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Wallet, PieChart, UserPlus, Save, Sparkles, RefreshCw, Trash2, Layers, ChevronRight, Check } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const SET_GRADIENTS = [
  "from-violet-500 to-indigo-600 text-white",
  "from-cyan-400 to-sky-500 text-white",
  "from-fuchsia-500 to-pink-600 text-white",
  "from-emerald-400 to-teal-600 text-white",
  "from-amber-400 to-orange-500 text-white",
  "from-slate-700 to-slate-900 text-white",
];
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReserveCard from "@/components/ReserveCard";
import ReserveModal from "@/components/ReserveModal";
import SetNameModal from "@/components/SetNameModal";
import { toast } from "@/hooks/use-toast";

interface Reserve {
  id: string;
  name: string;
  percentage: number;
}

interface ReserveSet {
  id: string;
  name: string;
  reserves: Reserve[];
  createdAt: number;
}

const STORAGE_KEY = "budget.reserveSets";

const Index = () => {
  const [capital, setCapital] = useState("");
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReserve, setEditingReserve] = useState<Reserve | null>(null);

  const [sets, setSets] = useState<ReserveSet[]>([]);
  const [setNameModalOpen, setSetNameModalOpen] = useState(false);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [setsOpen, setSetsOpen] = useState(true);
  const [reservesOpen, setReservesOpen] = useState(true);

  // Load saved sets
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSets(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist sets
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
  }, [sets]);

  const capitalValue = parseFloat(capital.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;

  const totalPercentage = useMemo(
    () => reserves.reduce((sum, r) => sum + r.percentage, 0),
    [reserves]
  );

  const remainingPercentage = 100 - totalPercentage;

  const handleSave = (name: string, percentage: number) => {
    if (editingReserve) {
      setReserves((prev) =>
        prev.map((r) => (r.id === editingReserve.id ? { ...r, name, percentage } : r))
      );
    } else {
      setReserves((prev) => [...prev, { id: crypto.randomUUID(), name, percentage }]);
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

  const handleSaveSet = (name: string) => {
    if (reserves.length === 0) return;
    if (activeSetId) {
      // Update existing set
      setSets((prev) =>
        prev.map((s) =>
          s.id === activeSetId ? { ...s, name, reserves: [...reserves] } : s
        )
      );
      toast({ title: "Conjunto atualizado", description: `"${name}" foi atualizado.` });
    } else {
      const newSet: ReserveSet = {
        id: crypto.randomUUID(),
        name,
        reserves: [...reserves],
        createdAt: Date.now(),
      };
      setSets((prev) => [newSet, ...prev]);
      setActiveSetId(newSet.id);
      toast({ title: "Conjunto salvo", description: `"${name}" foi adicionado em Meus conjuntos.` });
    }
  };

  const handleApplySet = (set: ReserveSet) => {
    setReserves(set.reserves.map((r) => ({ ...r, id: crypto.randomUUID() })));
    setActiveSetId(set.id);
    toast({ title: "Conjunto aplicado", description: `"${set.name}" foi carregado.` });
  };

  const handleDeleteSet = (id: string) => {
    setSets((prev) => prev.filter((s) => s.id !== id));
    if (activeSetId === id) setActiveSetId(null);
  };

  const handleNewSet = () => {
    setReserves([]);
    setActiveSetId(null);
  };

  const activeSet = sets.find((s) => s.id === activeSetId);

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

        {/* Meus Conjuntos */}
        <Collapsible open={setsOpen} onOpenChange={setSetsOpen} asChild>
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-lg font-semibold group">
                  <Layers className="h-5 w-5" />
                  Meus conjuntos
                  <span className="text-xs text-muted-foreground font-normal">({sets.length})</span>
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform ${setsOpen ? "rotate-90" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              {reserves.length > 0 && (
                <Button size="sm" variant="outline" onClick={handleNewSet} className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo conjunto</span>
                </Button>
              )}
            </div>

            <CollapsibleContent className="space-y-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              {sets.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground text-sm">
                    Nenhum conjunto salvo. Crie reservas abaixo e clique em "Salvar conjunto".
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sets.map((set) => {
                    const isActive = set.id === activeSetId;
                    return (
                      <Card
                        key={set.id}
                        className={`transition-all ${isActive ? "border-primary ring-1 ring-primary/40" : ""}`}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{set.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {set.reserves.length} reservas
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                              onClick={() => handleDeleteSet(set.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {set.reserves.slice(0, 4).map((r) => (
                              <span
                                key={r.id}
                                className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground"
                              >
                                {r.name} {r.percentage}%
                              </span>
                            ))}
                            {set.reserves.length > 4 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                                +{set.reserves.length - 4}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant={isActive ? "secondary" : "default"}
                            className="w-full gap-2"
                            onClick={() => handleApplySet(set)}
                            disabled={isActive}
                          >
                            <FolderOpen className="h-4 w-4" />
                            {isActive ? "Aplicado" : "Aplicar"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CollapsibleContent>
          </section>
        </Collapsible>

        {/* Reserve Cards */}
        <Collapsible open={reservesOpen} onOpenChange={setReservesOpen} asChild>
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-left group">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      {activeSet ? `Reservas — ${activeSet.name}` : "Reservas"}
                      <span className="text-xs text-muted-foreground font-normal">({reserves.length})</span>
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${reservesOpen ? "rotate-90" : ""}`}
                      />
                    </h2>
                    {activeSet && (
                      <p className="text-xs text-muted-foreground">Editando conjunto salvo</p>
                    )}
                  </div>
                </button>
              </CollapsibleTrigger>
              <div className="flex gap-2">
                {reserves.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSetNameModalOpen(true)}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">{activeSet ? "Atualizar conjunto" : "Salvar conjunto"}</span>
                  </Button>
                )}
                <Button onClick={handleNew} size="sm" disabled={remainingPercentage <= 0}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Reserva
                </Button>
              </div>
            </div>

            <CollapsibleContent className="space-y-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              {reserves.length > 0 && (
                <div className="space-y-2">
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
                  {totalPercentage < 100 && (
                    <p className="text-xs text-muted-foreground">
                      {remainingPercentage.toFixed(1)}% restante para alocar
                    </p>
                  )}
                </div>
              )}
              {reserves.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <PieChart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma reserva criada.</p>
                  <p className="text-sm">
                    Clique em "Nova Reserva" para começar ou aplique um conjunto salvo.
                  </p>
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
            </CollapsibleContent>
          </section>
        </Collapsible>
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

      <SetNameModal
        open={setNameModalOpen}
        onClose={() => setSetNameModalOpen(false)}
        onSave={handleSaveSet}
        initialName={activeSet?.name ?? ""}
      />
    </div>
  );
};

export default Index;
