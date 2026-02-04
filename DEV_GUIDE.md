# 🧑‍💻 Guia do Desenvolvedor - Sistema Multi-Domínio Vivant

## 🎯 Visão Geral Técnica

Este documento é um guia completo para desenvolvedores que irão trabalhar ou dar continuidade ao sistema multi-domínio da Vivant.

---

## 📐 Arquitetura

### Fluxo de Requisição

```
┌─────────────────────────────────────────────────────────┐
│  1. Cliente acessa: vivantcapital.com.br                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. Middleware (middleware.ts)                          │
│     - Lê hostname via headers                           │
│     - Detecta marca: "capital"                          │
│     - Faz rewrite para /(dashboard)/dashboard/simulador │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Layout Root (app/layout.tsx)                        │
│     - generateMetadata() detecta marca                  │
│     - Define title/description dinâmicos                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. Layout Dashboard (app/(dashboard)/layout.tsx)       │
│     - getBrandConfig() retorna config da marca          │
│     - Header mostra "Vivant Capital"                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. Página renderizada (simulador)                      │
│     - Conteúdo específico da marca                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Como Adicionar uma Nova Marca

### Exemplo: Adicionando "Vivant Club"

#### 1. Atualizar `lib/domain.ts`

```typescript
export type VivantBrand = "capital" | "residences" | "care" | "club";

const BRAND_CONFIGS: Record<VivantBrand, BrandConfig> = {
  // ... marcas existentes
  club: {
    name: "Vivant Club",
    title: "Vivant Club | Programa de Benefícios Exclusivos",
    description: "Acesse benefícios e experiências premium em toda a rede Vivant.",
    domain: "vivantclub.com.br",
  },
};

export function detectBrand(): VivantBrand {
  const headersList = headers();
  const hostname = headersList.get("host") || "";
  const domain = hostname.split(":")[0];

  if (domain.includes("vivantcapital.com.br")) return "capital";
  if (domain.includes("vivantcare.com.br")) return "care";
  if (domain.includes("vivantclub.com.br")) return "club"; // NOVO
  
  return "residences"; // Default
}
```

#### 2. Atualizar `middleware.ts`

```typescript
export function middleware(request: NextRequest): NextResponse {
  const hostname = request.headers.get("host") || "";
  const domain = hostname.split(":")[0];
  
  if (domain.includes("vivantcapital.com.br")) {
    return NextResponse.rewrite(new URL("/(dashboard)/dashboard/simulador", request.url));
  }
  
  if (domain.includes("vivantcare.com.br")) {
    return NextResponse.rewrite(new URL("/(dashboard)/portal-cotista", request.url));
  }
  
  // NOVO: Vivant Club
  if (domain.includes("vivantclub.com.br")) {
    return NextResponse.rewrite(new URL("/(dashboard)/club", request.url));
  }
  
  return NextResponse.rewrite(new URL("/(marketing)", request.url));
}
```

#### 3. Criar a Página

Crie: `app/(dashboard)/club/page.tsx`

```typescript
"use client";

export default function VivantClubPage(): JSX.Element {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-serif font-bold text-vivant-navy">
        Vivant Club
      </h1>
      <p className="text-lg text-slate-600">
        Bem-vindo ao programa de benefícios exclusivos.
      </p>
    </div>
  );
}
```

#### 4. Testar

Adicione no arquivo hosts:
```
127.0.0.1 vivantclub.com.br
```

Acesse: `http://vivantclub.com.br:3000`

---

## 🎨 Sistema de Design

### Cores Principais

```typescript
// tailwind.config.ts já configurado
"vivant-navy": "#1A2F4B"   // Headers, textos importantes
"vivant-gold": "#D4AF37"   // CTAs, destaques premium
```

### Como Usar

```tsx
// Texto principal
<h1 className="text-vivant-navy">Título</h1>

// Botão principal
<Button className="bg-vivant-navy hover:bg-vivant-navy/90">
  Acessar
</Button>

// Destaque dourado
<div className="border-vivant-gold">
  Conteúdo premium
</div>
```

### Tipografia

```tsx
// Display (títulos)
<h1 className="font-serif">Vivant Residences</h1>

// Body (corpo de texto)
<p className="font-sans">Descrição do serviço...</p>
```

---

## 🔧 Utilitários Disponíveis

### Detecção de Marca

```typescript
import { detectBrand, getBrandConfig } from "@/lib/domain";

// Em Server Components
const brand = detectBrand(); // "capital" | "residences" | "care"
const config = getBrandConfig();

console.log(config.name); // "Vivant Capital"
console.log(config.title); // "Vivant Capital | Engenharia..."
```

### Uso em Client Components

Para client components, passe via props:

```tsx
// page.tsx (Server Component)
export default function Page() {
  const brandConfig = getBrandConfig();
  
  return <ClientComponent brand={brandConfig.name} />;
}

// client-component.tsx
"use client";

interface Props {
  brand: string;
}

export function ClientComponent({ brand }: Props) {
  return <div>Marca atual: {brand}</div>;
}
```

---

## 📦 Estrutura de Componentes Recomendada

### Componente Específico de Marca

```tsx
// components/capital/simulador-hero.tsx
export function SimuladorHero(): JSX.Element {
  return (
    <div className="bg-vivant-navy text-white p-8 rounded-lg">
      <h2 className="text-3xl font-serif mb-4">
        Análise Financeira Inteligente
      </h2>
      <p>Simule sua operação em segundos</p>
    </div>
  );
}
```

### Componente Compartilhado com Variações

```tsx
// components/shared/brand-header.tsx
interface Props {
  brand: "capital" | "residences" | "care";
}

export function BrandHeader({ brand }: Props): JSX.Element {
  const titles = {
    capital: "Engenharia Financeira",
    residences: "Multipropriedade Premium",
    care: "Portal do Cotista",
  };
  
  return (
    <header className="border-b bg-white">
      <h1 className="text-vivant-navy">{titles[brand]}</h1>
    </header>
  );
}
```

---

## 🧪 Testes

### Testar Localmente com Diferentes Domínios

**Método 1: Hosts File (Recomendado)**

Edite `/etc/hosts` (Mac/Linux) ou `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 vivantcapital.com.br
127.0.0.1 vivantcare.com.br
127.0.0.1 vivantresidences.com.br
```

Execute:
```bash
npm run dev
```

Acesse cada domínio na porta 3000.

---

**Método 2: Ferramentas de Dev**

Use extensões de navegador para modificar headers:
- **Chrome:** ModHeader
- **Firefox:** Modify Header Value

Configure:
```
Header: Host
Value: vivantcapital.com.br
```

---

## 🐛 Debugging

### Ver qual marca está sendo detectada

Adicione logs temporários no middleware:

```typescript
export function middleware(request: NextRequest): NextResponse {
  const hostname = request.headers.get("host") || "";
  console.log("🔍 Hostname detectado:", hostname);
  
  // ... resto do código
}
```

### Verificar metadados no browser

```javascript
// Console do navegador
console.log(document.title);
console.log(document.querySelector('meta[property="og:title"]')?.content);
```

---

## 📊 Performance

### Otimizações Implementadas

✅ Static Generation onde possível  
✅ Middleware leve (apenas rewrite, sem processamento pesado)  
✅ Tree-shaking do Tailwind  
✅ SWC Minification  

### Monitoramento

```typescript
// Adicione no middleware para monitorar latência
const start = Date.now();
const response = NextResponse.rewrite(url);
const duration = Date.now() - start;
console.log(`⏱️ Rewrite duration: ${duration}ms`);
return response;
```

---

## 🚨 Erros Comuns

### 1. "Cannot find module '@/lib/domain'"

**Causa:** Path alias não configurado  
**Solução:** Verifique `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### 2. Middleware não está executando

**Causa:** Matcher incorreto  
**Solução:** Verifique o `config.matcher` no `middleware.ts`

```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
```

---

### 3. Build falha com erro de tipo

**Causa:** Uso de `any` ou tipos incorretos  
**Solução:** Execute para ver detalhes:

```bash
npx tsc --noEmit
```

---

## 🔐 Segurança

### Headers Configurados

Já implementados no `next.config.mjs`:

- `X-DNS-Prefetch-Control: on`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`

### Recomendações Adicionais

```typescript
// Valide sempre o hostname
function isValidDomain(hostname: string): boolean {
  const validDomains = [
    'vivantcapital.com.br',
    'vivantresidences.com.br',
    'vivantcare.com.br',
  ];
  
  return validDomains.some(domain => hostname.includes(domain));
}
```

---

## 📝 Checklist para Nova Feature

Ao adicionar uma nova funcionalidade:

- [ ] Funciona corretamente em todos os 3 domínios?
- [ ] Tipos TypeScript estão corretos (sem `any`)?
- [ ] Build passa: `npm run build`
- [ ] Lint passa: `npm run lint`
- [ ] Responsivo (mobile, tablet, desktop)?
- [ ] Cores Vivant Navy aplicadas?
- [ ] Acessibilidade (ARIA labels, semantic HTML)?
- [ ] Documentação atualizada?

---

## 🤝 Boas Práticas

### 1. Sempre use os utilitários de domínio

❌ **Ruim:**
```typescript
const hostname = headers().get("host");
if (hostname?.includes("capital")) { /* ... */ }
```

✅ **Bom:**
```typescript
import { detectBrand } from "@/lib/domain";
const brand = detectBrand();
if (brand === "capital") { /* ... */ }
```

---

### 2. Mantenha a consistência de cores

❌ **Ruim:**
```tsx
<h1 className="text-[#1A2F4B]">Título</h1>
```

✅ **Bom:**
```tsx
<h1 className="text-vivant-navy">Título</h1>
```

---

### 3. Separe lógica de marca

❌ **Ruim:**
```tsx
function Component() {
  const brand = detectBrand();
  
  if (brand === "capital") return <CapitalUI />;
  if (brand === "care") return <CareUI />;
  return <ResidencesUI />;
}
```

✅ **Bom:**
```tsx
// components/capital/capital-page.tsx
export function CapitalPage() { /* ... */ }

// components/care/care-page.tsx
export function CarePage() { /* ... */ }

// Roteamento feito pelo middleware
```

---

## 📚 Recursos Úteis

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Dynamic Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🆘 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação técnica: `MULTI_DOMAIN_SETUP.md`
2. Verifique os exemplos neste guia
3. Execute `npm run build` para ver erros detalhados
4. Use `console.log` no middleware para debugging

---

**Happy Coding! 🚀**

*Guia criado para o sistema multi-domínio Vivant - Fevereiro 2026*
