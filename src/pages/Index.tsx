import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Wallet, PieChart, UserPlus, ClipboardEdit, Trash2, Filter, ChevronRight, Check, Loader2, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [setsOpen, setSetsOpen] = useState(true);
  const [reservesOpen, setReservesOpen] = useState(true);

  // Load saved sets
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSets(JSON.parse(raw));
    } catch {
      /* ignore */
    }
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
      toast({ title: "Filtro atualizado", description: `"${name}" foi atualizado.` });
    } else {
      const newSet: ReserveSet = {
        id: crypto.randomUUID(),
        name,
        reserves: [...reserves],
        createdAt: Date.now(),
      };
      setSets((prev) => [newSet, ...prev]);
      setActiveSetId(newSet.id);
      toast({ title: "Filtro salvo", description: `"${name}" foi adicionado em Meus filtros.` });
    }
  };

  const handleApplySet = (set: ReserveSet) => {
    if (set.id === activeSetId || applyingId) return;
    setApplyingId(set.id);
    setTimeout(() => {
      setReserves(set.reserves.map((r) => ({ ...r, id: crypto.randomUUID() })));
      setActiveSetId(set.id);
      setApplyingId(null);
    }, 700);
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleReorderSets = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSets((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="border-b bg-card pt-[env(safe-area-inset-top)]">
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

      {/* Capital Input (sticky) */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b pt-[env(safe-area-inset-top)]">
        <div className="container max-w-5xl mx-auto px-4 py-3 sm:py-4">
          <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-1.5">
            Capital Total
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              R$
            </span>
            <Input
              className="pl-11 h-11 sm:h-14 text-lg sm:text-2xl font-semibold bg-background"
              placeholder="0,00"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      <main className="container max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Meus Filtros */}
        <Collapsible open={setsOpen} onOpenChange={setSetsOpen} asChild>
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-lg font-semibold group">
                  <Filter className="h-5 w-5" />
                  Meus Filtros
                  <span className="text-xs text-muted-foreground font-normal">({sets.length})</span>
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform ${setsOpen ? "rotate-90" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              {activeSet && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNewSet}
                  className="gap-2"
                  title="Remover filtro atual"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Remover filtro</span>
                </Button>
              )}
            </div>

            <CollapsibleContent className="space-y-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              {sets.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground text-sm">
                    Nenhum filtro salvo. Crie reservas abaixo e clique em "Salvar filtro".
                  </CardContent>
                </Card>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleReorderSets}
                >
                  <SortableContext
                    items={sets.map((s) => s.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
                      {sets.map((set) => (
                        <SortableFilterCard
                          key={set.id}
                          set={set}
                          isActive={set.id === activeSetId}
                          isApplying={applyingId === set.id}
                          applyingAny={!!applyingId}
                          onApply={() => handleApplySet(set)}
                          onDelete={() => handleDeleteSet(set.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
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
                    <h2 className="font-semibold flex items-center gap-2">
                      <span className={activeSet ? "text-xl" : "text-lg"}>
                        {activeSet ? activeSet.name : "Reservas"}
                      </span>
                      <span className="text-xs text-muted-foreground font-normal">({reserves.length})</span>
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${reservesOpen ? "rotate-90" : ""}`}
                      />
                    </h2>
                    {activeSet && (
                      <p className="text-xs text-muted-foreground">Editando filtro salvo</p>
                    )}
                  </div>
                </button>
              </CollapsibleTrigger>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSetNameModalOpen(true)}
                  disabled={reserves.length === 0}
                  className="gap-2 disabled:opacity-40"
                  title={reserves.length === 0 ? "Adicione ao menos uma reserva" : undefined}
                >
                  {activeSet ? (
                    <ClipboardEdit className="h-4 w-4" />
                  ) : (
                    <span className="relative inline-flex items-center justify-center">
                      <Filter className="h-4 w-4" />
                      <Plus className="h-2.5 w-2.5 absolute -right-2 -top-1 stroke-[3]" />
                    </span>
                  )}
                  <span className="hidden sm:inline">{activeSet ? "Renomear" : "Novo Filtro"}</span>
                </Button>
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
                    Clique em "Nova Reserva" para começar ou aplique um filtro salvo.
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

interface SortableFilterCardProps {
  set: ReserveSet;
  isActive: boolean;
  isApplying: boolean;
  applyingAny: boolean;
  onApply: () => void;
  onDelete: () => void;
}

function SortableFilterCard({
  set,
  isActive,
  isApplying,
  applyingAny,
  onApply,
  onDelete,
}: SortableFilterCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: set.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`snap-start shrink-0 basis-[78%] sm:basis-[48%] lg:basis-[32%] ${
        isDragging ? "z-10 opacity-80" : ""
      }`}
    >
      <div
        className={`group relative rounded-2xl p-5 h-full w-full bg-card border border-border shadow-sm transition-all hover:border-primary/50 hover:shadow-md ${
          isActive ? "border-primary ring-1 ring-primary" : ""
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <button
                type="button"
                aria-label="Arrastar para reordenar"
                className="mt-0.5 -ml-1 h-6 w-6 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent cursor-grab active:cursor-grabbing touch-none"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onApply}
                disabled={isActive || applyingAny}
                className="min-w-0 text-left disabled:cursor-default"
              >
                <p className="font-bold text-base truncate text-foreground">
                  {set.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {set.reserves.length} reservas
                </p>
              </button>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isApplying && (
                <span className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Aplicando
                </span>
              )}
              {isActive && !isApplying && (
                <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                  <Check className="h-3 w-3" />
                  Aplicado
                </span>
              )}
              <button
                type="button"
                aria-label="Excluir filtro"
                className="h-7 w-7 inline-flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onApply}
            disabled={isActive || applyingAny}
            className="w-full text-left disabled:cursor-default"
          >
            <div className="flex flex-wrap gap-1.5">
              {set.reserves.slice(0, 4).map((r) => (
                <span
                  key={r.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  {r.name} {r.percentage}%
                </span>
              ))}
              {set.reserves.length > 4 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  +{set.reserves.length - 4}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
