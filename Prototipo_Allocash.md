# Criar protótipos — Allocash

## 1. Ferramenta para a criação do protótipo

**Lovable**

## 2. Protótipo digital navegável

https://preview--allocash-magic-wand.lovable.app/?__lovable_sha=b7aad5c3

## 3. Affordances, princípios e diretrizes

### Affordances

- Atende.
- Botões têm preenchimento sólido e ícone com rótulo.
- A alça de arrastar usa ícone de grip e cursor `grab`/`grabbing`.
- Cards de filtro mudam a borda no hover e mostram que são clicáveis.
- O input de capital tem prefixo "R$" e teclado numérico (`inputMode="decimal"`).
- Seções colapsáveis têm seta que gira.
- Botões desabilitados ficam opacos e sem clique.

### Princípios da Gestalt (Aula 2)

- **Proximidade:** atende. Valor e rótulo ficam juntos dentro de cada card.
- **Similaridade:** atende. Todos os cards têm o mesmo estilo, e as tags são sempre verdes.
- **Região comum:** atende. Cards e header têm fundo e borda próprios.
- **Figura e fundo:** atende. O input de capital é fixo, com fundo desfocado.
- **Continuidade:** atende parcialmente. Os filtros rolam na horizontal com snap.
- **Fechamento:** não se aplica.

### Princípios e Diretrizes (SILVA, B; BARBOSA, S; 2010 — Aula 3)

- **Consistência:** atende. Há um único sistema de cores, fontes, ícones e raios.
- **Feedback:** atende. Há toasts, spinner de carregamento e destaque do filtro ativo.
- **Prevenção de erros:** atende parcialmente. O botão de nova reserva é desabilitado quando o percentual chega a 100%. Não há confirmação de exclusão.
- **Reconhecimento em vez de memorização:** atende. Os ícones têm rótulos e os filtros salvos ficam visíveis.
- **Estética e design minimalista:** atende. A tela é limpa, com uma cor de destaque.
- **Controle e liberdade do usuário:** atende parcialmente. É possível remover filtros e editar reservas, mas não há desfazer.
- **Ajuda e documentação:** não atende.

## 4. Critérios de usabilidade e acessibilidade (Aula 1)

### Usabilidade

- **Eficiência:** atende. O capital é digitado uma vez e o cálculo é imediato.
- **Facilidade de aprendizado:** atende. O fluxo é curto e a tela é única.
- **Satisfação:** atende. O visual é moderno e o Dark Mode é padrão.
- **Mobile-first:** atende. O layout é responsivo, o input fica fixo e respeita a safe-area.
- **Visibilidade do status:** atende. A barra de progresso mostra o percentual restante e o erro aparece em vermelho.

### Acessibilidade

- **Contraste:** atende em parte. Texto principal 17,1:1 e verde 7,2:1. O branco sobre o botão verde dá 2,6:1, o que não atende.
- **Navegação por teclado e foco visível:** atende. Os componentes são Radix, com anel de foco de 2px.
- **Rótulos ARIA:** atende parcialmente. Só 2 ícones têm `aria-label` e 2 elementos têm `title`.
- **Idioma:** atende. O HTML declara `pt-BR`.
- **Área de toque:** não atende totalmente. Os ícones de ação de 28px e a alça de 24px ficam abaixo de 44px.
- **Não depender só de cor:** atende parcialmente. O erro usa texto, mas o filtro ativo depende da cor e da tag.
- **Tema claro:** não atende. Só existe o Dark Mode.

---

# Anexo — Guia de Estilo

## 1. Paleta de Cores

- Fundo Principal: Azul escuro/Chumbo sólido (Dark Mode). **`#0E121B`**
- Cor Primária (Ação/Destaque): Verde Esmeralda. **`#10B77F`**
- Superfícies (Cards): Cinza azulado escuro. **`#171C26`**
- Superfícies (Inputs, trilha, bordas): Cinza escuro. **`#252B37`**
- Texto Principal: Branco gelo. **`#F1F5F9`**
- Texto Secundário: Cinza claro. **`#7B899D`**
- Feedback/Destrutivo: Vermelho. **`#DC2828`** (texto/ícone) e `#7F1D1D` (fundo de botão destrutivo)
- Feedback/Sucesso: igual ao primário. **`#10B77F`**
- Feedback/Aviso (Warning): Âmbar. **`#F59F0A`**
- Informação (extra): Azul. `#3C83F6`
- Destaque suave (tags, hover): `#17362B` / `#43EFB6`

## 2. Tipografia

Família de Fontes Primária: Sem serifa (Sans-serif). **Inter** (corpo e rótulos) e **Space Grotesk** (títulos).

Hierarquia:

- Títulos (H1): Bold/Semibold. **20px**
- Valores de balanço: Bold. **24px** (capital total no input; 18px em mobile) e **16px** (valor do card de reserva)
- Subtítulos (H2/H3): Peso regular, cor secundária. **18px** (seções) e **14px** (subtítulo do header)
- Rótulos e Corpo de texto: Peso regular. **14px**; rótulos auxiliares e tags **12px**

## 3. Iconografia

Estilo Visual: Ícones em linha (stroke), minimalistas e sem preenchimento.

Aplicações mapeadas: Carteira, avatar, funil, adição, edição, exclusão, salvar. Biblioteca de Ícones: **Lucide** (`lucide-react`).

Espessura da linha (Stroke width): **2px**.

## 4. Componentes e Geometria

Arredondamento (Border-radius): **Base 12px; botões e inputs 10px; cards 16px; tags e barras de progresso em pílula (`rounded-full`).**

Campos de Entrada (Inputs): Fundo cinza escuro, borda fina. Ativos recebem borda espessa Verde (anel de 2px). **Disabled: opacidade 50% e cursor `not-allowed`. Erro: não há estado dedicado no campo; a mensagem aparece abaixo, em vermelho (`#DC2828`), com 12px.**

Botões Primários: Preenchimento Verde, texto branco, ícone à esquerda. **Hover: verde a 90% de opacidade. Disabled: opacidade 50% e sem eventos de ponteiro.**

Cards Interativos: Inativos sem borda destacada; Ativos com borda verde e tag indicativa.

Barras de Progresso: Trilha cinza, preenchimento verde sólido.

## 5. Espaçamento e Layout (Grid)

Sistema de Grid Mobile: **4 colunas, gutter de 16px. Em desktop, container centralizado com largura máxima de 1024px.**

Margens laterais da tela: **16px** (respeitando a safe-area superior).

Sistema de espaçamento: **Base de 4px, com paddings em 4, 8, 12, 16, 20, 24 e 32px. Cards têm 20px de padding interno.**

## 6. Acessibilidade

Taxa de contraste do texto principal (Branco sobre Fundo Escuro): **17,1:1 (AAA)**

Taxa de contraste do Verde Primário sobre Fundo Escuro: **7,2:1 (AAA)**

Tamanho mínimo de área de toque (Touch Target): **44x44px**

## 7. Microinterações

Transições e Animações: **150ms ease em cores, bordas e barras de progresso. Seções colapsáveis e acordeões: 0.2s ease-out (fade + altura). A seta gira 90° ao expandir.**

Feedback de Carregamento (Loading): **Ícone girando (`animate-spin`) dentro da tag verde do filtro em aplicação. Os outros filtros ficam desabilitados até terminar.**
