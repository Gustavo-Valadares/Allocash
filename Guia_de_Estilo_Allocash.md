# Guia de Estilo - Allocash

Valores extraídos do código (`src/index.css`, `tailwind.config.ts`, `src/components/ui/*`, `src/pages/Index.tsx`). O app roda em Dark Mode fixo (`<html class="dark">` em `index.html`).

## **1. Paleta de Cores**

| Papel | Descrição | HEX | Token |
|---|---|---|---|
| Fundo Principal | Azul escuro/Chumbo sólido | `#0E121B` | `--background` (222 30% 8%) |
| Cor Primária (Ação/Destaque) | Verde Esmeralda | `#10B77F` | `--primary` (160 84% 39%) |
| Superfícies (Cards) | Cinza azulado escuro | `#171C26` | `--card` (222 25% 12%) |
| Superfícies (Inputs, trilha, bordas) | Cinza escuro | `#252B37` | `--secondary` / `--input` / `--border` (220 20% 18%) |
| Texto Principal | Branco gelo | `#F1F5F9` | `--foreground` (210 40% 96%) |
| Texto Secundário | Cinza claro | `#7B899D` | `--muted-foreground` (215 15% 55%) |
| Feedback/Destrutivo | Vermelho | `#DC2828` (texto/ícone, `text-destructive` em modo claro) e `#7F1D1D` (fundo de botão destrutivo no dark) | `--destructive` |
| Feedback/Sucesso | Igual ao primário (Verde Esmeralda) | `#10B77F` | `--success` (160 84% 39%) |
| Feedback/Aviso (Warning) | Âmbar | `#F59F0A` | `--warning` (38 92% 50%) |
| Informação (extra) | Azul | `#3C83F6` | `--info` (217 91% 60%) |
| Destaque suave (tags, hover) | Verde escuro / verde claro | `#17362B` / `#43EFB6` | `--accent` / `--accent-foreground` |

## **2. Tipografia**

Família de Fontes Primária: Sem serifa (Sans-serif).
- Corpo e rótulos: **Inter** (pesos 300–700).
- Títulos: **Space Grotesk** (pesos 500–700), aplicada a `h1`–`h6`.
- Ambas via Google Fonts; fallback `sans-serif`.

Hierarquia:

- Títulos (H1): Space Grotesk Bold, **20px** (`text-xl`).
- Valores de balanço: Bold/Semibold. Capital total no input: **24px** Semibold (18px em mobile); valor do card de reserva: **16px** Bold/Semibold.
- Subtítulos (H2/H3): Peso regular/semibold, cor secundária. **18px** (`text-lg`) para títulos de seção; **14px** (`text-sm`) para subtítulo do header.
- Rótulos e Corpo de texto: Inter Regular/Medium, **14px** (`text-sm`); rótulos auxiliares e tags **12px** (`text-xs`).

## **3. Iconografia**

Estilo Visual: Ícones em linha (stroke), minimalistas e sem preenchimento.

Aplicações mapeadas: Carteira (`Wallet`), avatar (`UserPlus`), funil (`Filter`), adição (`Plus`), edição (`ClipboardEdit`), exclusão (`Trash2`), salvar (`Check`), arrastar (`GripVertical`), carregando (`Loader2`).

Biblioteca de Ícones: **Lucide** (`lucide-react` 0.462).

Espessura da linha (Stroke width): **2px** (padrão do Lucide, em viewBox 24x24). Tamanhos usados: 12px (tags), 16px (botões/ações), 20px (ícone do header), 48px (estado vazio).

## **4. Componentes e Geometria**

Arredondamento (Border-radius): base `--radius` = **12px** (0.75rem).
- Botões e inputs: **10px** (`rounded-md`, radius − 2px).
- Cards de reserva/filtro: **16px** (`rounded-2xl`); ícone do header: 12px (`rounded-xl`).
- Tags e barras de progresso: totalmente arredondado (`rounded-full`).

Campos de Entrada (Inputs): altura 40px (44px no capital em mobile, 56px em desktop), fundo escuro, borda fina de 1px `#252B37`. Ativos (focus) recebem anel de **2px** Verde `#10B77F` com offset de 2px.
- Disabled: opacidade 50% e cursor `not-allowed`.
- Erro: não há estado de erro de campo dedicado; erros são exibidos como texto de 12px em vermelho (`text-destructive`) abaixo do campo (ex.: percentual excedido).

Botões Primários: Preenchimento Verde, texto branco, ícone à esquerda (gap 8px), altura 40px (36px `sm`, 44px `lg`).
- Hover: fundo Verde a 90% de opacidade.
- Focus: anel de 2px verde com offset.
- Disabled: opacidade 50% e sem eventos de ponteiro.

Cards Interativos: Inativos com borda 1px `#252B37` e sombra leve; hover com borda verde a 50%; Ativos com tag indicativa verde (`bg-primary/10`, texto verde, 12px) e item não clicável.

Barras de Progresso: Trilha cinza `#252B37`, preenchimento verde sólido `#10B77F`, formato pílula; altura 16px (componente) e 4px (faixa inferior do card de reserva).

## **5. Espaçamento e Layout (Grid)**

Sistema de Grid Mobile: **4 colunas**, gutter de 16px; em desktop, container centralizado com largura máxima de 1024px (`max-w-5xl`). Os cards de reserva usam grid responsivo, e os filtros salvos rolam horizontalmente com snap em mobile.

Margens laterais da tela: **16px** (`px-4`). Respeita a safe-area superior (`env(safe-area-inset-top)`) no header e no input fixo.

Sistema de espaçamento: base de **4px**, com paddings predominantes em múltiplos de 4/8px (4, 8, 12, 16, 20, 24, 32). Cards usam 20px de padding interno; seções, 24px (32px em telas ≥ 640px) de espaçamento vertical.

## **6. Acessibilidade**

Taxa de contraste do texto principal (`#F1F5F9` sobre `#0E121B`): **17,1:1** (AAA).

Taxa de contraste do Verde Primário (`#10B77F`) sobre Fundo Escuro (`#0E121B`): **7,2:1** (AAA para texto e elementos gráficos).

Observações do cálculo (WCAG 2.1):
- Texto secundário `#7B899D` sobre fundo: 5,3:1; sobre card: 4,8:1 (AA).
- Branco sobre botão verde (`#10B77F`): **2,6:1**, abaixo do mínimo AA (4,5:1). Ponto a corrigir: escurecer o texto do botão (ex.: `#0E121B`, 7,2:1) ou o verde do botão.
- Vermelho `#DC2828` sobre fundo: 3,9:1 (AA apenas para texto grande/ícones).

Tamanho mínimo de área de toque (Touch Target): **44x44px** (meta). Atualmente: botões 40px de altura (44px no `lg`), input de capital 44px; ícones de ação de 28px e alça de arrastar de 24px ficam abaixo da meta.

## **7. Microinterações**

Transições e Animações: `transition-colors` / `transition-all` (150ms, ease padrão do Tailwind) em botões, cards e barras de progresso; acordeões e seções colapsáveis **0.2s ease-out** (fade + altura); ícone de seta gira 90° (`rotate-90`) ao expandir; ações de card aparecem em hover (`transition-opacity`); drag and drop com `@dnd-kit` (transform animado, cursor `grab`/`grabbing`).

Feedback de Carregamento (Loading): ícone `Loader2` girando (`animate-spin`, 12px) dentro da tag verde do filtro em aplicação, com os demais filtros desabilitados durante o processo. Confirmações de ação via toast (ex.: "Filtro salvo", "Filtro atualizado").
