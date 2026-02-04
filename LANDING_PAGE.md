# Landing Page Vivant - Documentação

## 🎨 Design System

### Tipografia

A landing page utiliza um sistema de tipografia sofisticado que combina elegância com legibilidade:

#### Fontes Implementadas

- **Playfair Display** (Serif) - Títulos e Headlines
  - Usada para transmitir sofisticação e luxo
  - Aplicada em: H1, H2, títulos de cards
  - Classe Tailwind: `font-serif`

- **Inter** (Sans-serif) - Corpo e UI
  - Fonte moderna e altamente legível
  - Aplicada em: parágrafos, botões, navegação
  - Classe Tailwind: `font-sans` (padrão)

### Paleta de Cores

Extraída do conceito da marca Vivant:

```css
--navy-blue: #1A2F4B     /* Texto principal, navbar, CTA */
--off-white: #F8F9FA     /* Background principal */
--white: #FFFFFF         /* Cards, overlay */
```

**Aplicações:**
- 🔵 **Navy Blue (#1A2F4B)**: Headers, textos, botões outline, footer
- ⚪ **Off-white (#F8F9FA)**: Background das seções alternadas
- ⚪ **White**: Cards, navbar com blur, CTAs

---

## 📐 Estrutura da Página

### 1. Navbar Fixa (Sticky)

**Componente**: `components/marketing/navbar.tsx`

**Características:**
- ✅ Posição fixa no topo (z-index: 50)
- ✅ Efeito blur quando scroll > 10px
- ✅ Transição suave de transparente para branco/80% + backdrop-blur
- ✅ Responsivo com menu mobile (hamburguer)

**Elementos:**
```
Logo (esquerda) | Menu Central | CTA (direita)
    Vivant      | Casas | Modelo | Sobre | [Portal do Investidor]
```

**Código:**
```typescript
// Efeito de scroll
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 10);
  window.addEventListener("scroll", handleScroll);
}, []);

// Classe dinâmica
className={isScrolled 
  ? "bg-white/80 backdrop-blur-md shadow-sm" 
  : "bg-transparent"
}
```

---

### 2. Hero Section

**Altura**: 100vh (tela cheia)

**Composição em camadas:**

1. **Background Layer (z-0)**
   - Imagem de casa moderna minimalista (Unsplash)
   - Gradient overlay (Navy Blue com opacidade)
   - `bg-gradient-to-b from-[#1A2F4B]/70 to-[#F8F9FA]`

2. **Content Layer (z-10)**
   - Badge superior: "Investimento Inteligente"
   - Headline H1: "A nova era da multipropriedade..."
   - Subheadline com descrição
   - Dois CTAs (Primário + Secundário)
   - Scroll indicator animado

**CTAs:**
```typescript
// Primário (sólido branco)
<Button className="bg-white text-[#1A2F4B]">
  Simulador de Viabilidade →
</Button>

// Secundário (outline branco)
<Button variant="outline" className="border-2 border-white text-white">
  Conheça o Modelo
</Button>
```

---

### 3. Seção de Benefícios

**Background**: Branco
**Layout**: Grid 3 colunas (responsivo)

**Cards:**

| Ícone | Título | Descrição |
|-------|--------|-----------|
| 🛡️ Shield | Segurança Jurídica | Modelo 100% regulamentado |
| 📈 TrendingUp | Alta Rentabilidade | Margens de 35-45% |
| 🎯 Target | Gestão Simplificada | Cuidamos de tudo |

**Estilização:**
- Cards com shadow-lg e hover:shadow-xl
- Ícone em círculo com background Navy Blue/10%
- Transição suave no hover

---

### 4. Seção de Fluxo de Investimento

**ID**: `#modelo` (anchor link)
**Background**: Off-white (#F8F9FA)

#### Fluxo Visual (3 Steps)

**Layout**: Grid 3 colunas com setas entre os cards

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ 1. AQUISIÇÃO │  →  │2.FRACIONAMENTO│  →  │3.RENTABILIDADE│
│   🏠 Home    │      │  👥 Users    │      │ 📈 TrendingUp│
└─────────────┘      └─────────────┘      └─────────────┘
```

**Card de Aquisição:**
- Ícone: Home (casa)
- Título: "1. Aquisição"
- Descrição: Seleção estratégica de propriedades

**Card de Fracionamento:**
- Ícone: Users (pessoas)
- Título: "2. Fracionamento"
- Badge: "Divisão em 6 cotas"
- Descrição: Escritura pública

**Card de Rentabilidade:**
- Ícone: TrendingUp (gráfico)
- Título: "3. Rentabilidade"
- Badge: "Retorno garantido"
- Descrição: Gestão profissional

#### Quadro Financeiro

Card especial com breakdown da estrutura:

```
✓ VGV Total (Vendas)      → Preço × Quantidade
✓ Imposto RET (4%)        → Deduzido do VGV
✓ Split 50/50             → Garantia + Operacional
✓ Margem Final            → 35-45% (em verde)
```

---

### 5. CTA Section (Call-to-Action)

**Background**: Gradient Navy Blue
**Propósito**: Conversão final para o simulador

**Estrutura:**
- Headline: "Pronto para começar?"
- Subheadline explicativa
- CTA grande e destacado: "Acessar Simulador de Viabilidade"

**Estilização:**
```typescript
// Background gradient
className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]"

// Botão de destaque
<Button 
  size="lg" 
  className="bg-white text-[#1A2F4B] h-16 px-10"
>
  Acessar Simulador →
</Button>
```

---

### 6. Footer

**Background**: Navy Blue (#1A2F4B)
**Texto**: Branco com opacidades

**Layout**: Grid 3 colunas

1. **Coluna 1**: Branding
   - Logo "Vivant"
   - Tagline

2. **Coluna 2**: Links Rápidos
   - Casas
   - Modelo de Negócio
   - Sobre

3. **Coluna 3**: Contato
   - Email
   - Telefone

**Copyright**: Centralizado com divisor superior

---

## 🎯 Componentes Shadcn/UI Utilizados

### Button
```typescript
import { Button } from "@/components/ui/button";

// Variantes usadas:
- default (sólido)
- outline (contorno)

// Tamanhos:
- lg (botões principais)
- default (navegação)
```

### Card
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } 
  from "@/components/ui/card";

// Aplicações:
- Cards de benefícios (3x)
- Cards de fluxo (3x)
- Card de estrutura financeira (1x)
```

### Ícones (Lucide React)
```typescript
import { 
  Home, Users, TrendingUp, CheckCircle, 
  ArrowRight, Sparkles, Shield, Target, Menu, X 
} from "lucide-react";
```

---

## 📱 Responsividade

### Breakpoints Tailwind

```typescript
// Mobile-first approach
sm:   640px   // Botões lado a lado
md:   768px   // Grid 2-3 colunas, menu desktop
lg:   1024px  // Grid dashboard (simulador)
xl:   1280px  // Containers maiores
2xl:  1536px  // Max-width
```

### Mobile Features

1. **Navbar**:
   - Menu hamburguer (< 768px)
   - Dropdown com backdrop blur
   - Links empilhados verticalmente

2. **Hero**:
   - Texto responsivo (text-5xl → text-7xl)
   - CTAs empilhados em mobile

3. **Grids**:
   - 1 coluna em mobile
   - 2-3 colunas em desktop

---

## 🚀 Performance e Otimizações

### Server Components

A página é um **Server Component** por padrão:

```typescript
// app/(marketing)/page.tsx
export default function HomePage(): JSX.Element {
  // Sem "use client" - renderizado no servidor
}
```

**Benefícios:**
- Menor JavaScript enviado ao cliente
- SEO otimizado
- Tempo de carregamento rápido

### Client Components

Apenas onde necessário:

```typescript
// components/marketing/navbar.tsx
"use client";  // Precisa de hooks (useState, useEffect)
```

### Fontes Otimizadas

```typescript
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",  // FOUT prevenir
  variable: "--font-inter",
});
```

**Vantagens:**
- Auto-hospedagem (sem requisições externas)
- Preload automático
- Font-display: swap (evita FOIT)

---

## 🎨 Animações e Transições

### Navbar Blur Effect

```css
transition-all duration-300
backdrop-blur-md
```

### Cards Hover

```css
hover:shadow-xl transition-shadow
hover:bg-[#1A2F4B] hover:text-white
```

### Scroll Indicator

```css
animate-bounce  /* Tailwind built-in */
```

### Setas do Fluxo

```typescript
<ArrowRight className="text-[#1A2F4B]/30" />
// Opacidade reduzida para efeito sutil
```

---

## 🔗 Rotas e Navegação

### Links Internos

```typescript
// Navegação para simulador
<Link href="/dashboard/simulador">Portal do Investidor</Link>

// Anchor links (mesma página)
<Link href="#modelo">Modelo de Negócio</Link>
<Link href="#casas">Casas</Link>
<Link href="#sobre">Sobre</Link>
```

### IDs de Seção

```typescript
<section id="modelo">  // Permite navegação por hash
<section id="casas">
<section id="sobre">
```

---

## 📊 Estrutura de Conteúdo

### Hierarquia de Informação

1. **Hero** (Atenção)
   - Frase de impacto
   - Proposta de valor
   - CTAs principais

2. **Benefícios** (Interesse)
   - 3 pilares de valor
   - Ícones + textos curtos

3. **Fluxo** (Desejo)
   - Como funciona
   - Transparência financeira
   - Prova de viabilidade

4. **CTA** (Ação)
   - Conversão direta
   - Simulador como próximo passo

5. **Footer** (Suporte)
   - Informações complementares
   - Contatos

---

## 🎯 SEO e Acessibilidade

### Metadata

```typescript
export const metadata: Metadata = {
  title: "Vivant Multipropriedade | A Nova Era da Multipropriedade...",
  description: "Invista em multipropriedade de casas de alto padrão...",
};
```

### Semântica HTML

```html
<header>  <!-- Navbar -->
<main>    <!-- Conteúdo principal -->
  <section>  <!-- Hero, Benefits, Flow, CTA -->
<footer>  <!-- Rodapé -->
```

### Alt Text (Futuro)

```typescript
// Imagens devem ter alt descritivo
<img alt="Casa moderna de alto padrão em condomínio fechado" />
```

---

## 🛠️ Arquivos Criados/Modificados

### Novos Arquivos

1. `components/marketing/navbar.tsx` (Client Component)
2. `app/(marketing)/page.tsx` (Server Component - atualizado)
3. `LANDING_PAGE.md` (Esta documentação)

### Arquivos Modificados

1. `app/layout.tsx`
   - Adicionada fonte Playfair Display
   - Configuradas CSS variables

2. `tailwind.config.ts`
   - Adicionadas fontes ao tema
   - `font-serif` e `font-sans` configurados

---

## 🎨 Exemplos de Código

### Gradient Text

```typescript
<h1 className="font-serif text-white">
  A nova era da multipropriedade de alto padrão
</h1>
```

### Card com Ícone

```typescript
<Card className="border-none shadow-lg">
  <CardHeader>
    <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center">
      <Shield className="w-6 h-6 text-[#1A2F4B]" />
    </div>
    <CardTitle className="font-serif text-[#1A2F4B]">
      Segurança Jurídica
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-[#1A2F4B]/70">
      Modelo 100% regulamentado...
    </p>
  </CardContent>
</Card>
```

### Badge com Ícone

```typescript
<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
  <Sparkles className="w-4 h-4 text-white" />
  <span className="text-white text-sm font-medium">
    Investimento Inteligente em Imóveis
  </span>
</div>
```

---

## 📈 Métricas de Conversão

### CTAs na Página

1. **Hero Section**: 2 botões
   - Primário: Simulador (conversão direta)
   - Secundário: Conheça o Modelo (engajamento)

2. **Navbar**: 1 botão
   - Portal do Investidor (sempre visível)

3. **CTA Section**: 1 botão
   - Simulador (conversão final)

**Total**: 4 oportunidades de conversão

---

## 🚀 Próximos Passos (Sugestões)

- [ ] Adicionar seção de depoimentos
- [ ] Galeria de propriedades (#casas)
- [ ] Seção sobre a empresa (#sobre)
- [ ] Formulário de contato
- [ ] Integração com Analytics
- [ ] Testes A/B de CTAs
- [ ] Otimização de imagens (Next/Image)
- [ ] Lazy loading de seções
- [ ] Animações com Framer Motion

---

## ✅ Checklist de Implementação

- [x] Tipografia: Playfair Display + Inter
- [x] Cores: Navy Blue (#1A2F4B) + Off-white (#F8F9FA)
- [x] Header fixo com blur effect
- [x] Logo à esquerda
- [x] Menu central
- [x] Botão "Portal do Investidor" (outline)
- [x] Hero Section com frase de impacto
- [x] Imagem de fundo elegante
- [x] Seção de Fluxo (3 cards)
- [x] Ícones do Lucide
- [x] Representação visual: Aquisição → Fracionamento → Rentabilidade
- [x] CTA para simulador
- [x] Componentes Shadcn/UI (Button, Card)
- [x] Server Component por padrão
- [x] Responsividade completa
- [x] Zero erros de lint

---

**🎉 Landing Page 100% Funcional!**

Acesse: http://localhost:3001/
