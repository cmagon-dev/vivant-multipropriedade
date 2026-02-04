# 🏗️ Arquitetura Multi-Domínio Vivant

## 📋 Visão Geral

Sistema de roteamento inteligente baseado em domínio para três marcas distintas da Vivant:

- **Vivant Capital** (`vivantcapital.com.br`) → Engenharia Financeira
- **Vivant Residences** (`vivantresidences.com.br`) → Multipropriedade Premium
- **Vivant Care** (`vivantcare.com.br`) → Portal do Cotista

---

## 🎯 Implementações Realizadas

### 1. Middleware de Roteamento Dinâmico

**Arquivo:** `middleware.ts`

```typescript
Lógica de Rewrite por Domínio:
├─ vivantcapital.com.br   → /(dashboard)/dashboard/simulador
├─ vivantcare.com.br      → /(dashboard)/portal-cotista
└─ vivantresidences.com.br → /(marketing)/
```

**Características:**
- Detecção automática de hostname
- Suporte a desenvolvimento local (remove porta automaticamente)
- Exclusão inteligente de rotas estáticas (`_next`, `api`, assets)

---

### 2. Sistema de Branding Dinâmico

**Arquivo:** `lib/domain.ts`

Utilitários para detecção de marca e configuração:

- `detectBrand()`: Identifica a marca baseada no hostname
- `getBrandConfig()`: Retorna configurações específicas da marca

**Configurações por Marca:**

| Marca | Title | Descrição Curta |
|-------|-------|-----------------|
| **Capital** | Vivant Capital \| Engenharia Financeira e Viabilidade | Análise de viabilidade e engenharia financeira |
| **Residences** | Vivant Residences \| Multipropriedade de Alto Padrão | Modelo fracionado inteligente para investidores |
| **Care** | Vivant Care \| Gestão de Propriedade e Pós-Venda | Portal exclusivo para cotistas Vivant |

---

### 3. Metadados Dinâmicos

**Arquivo:** `app/layout.tsx`

- Função `generateMetadata()` assíncrona
- Detecção automática do domínio via headers
- Metadados OpenGraph incluídos
- Suporte a SEO por marca

---

### 4. Portal do Cotista (Vivant Care)

**Arquivo:** `app/(dashboard)/portal-cotista/page.tsx`

#### Design System:
- **Cores:** Vivant Navy (#1A2F4B) + Vivant Gold (#D4AF37)
- **Tipografia:** Inter (sans) + Playfair Display (serif)
- **Estética:** Minimalista, luxuosa, sofisticada

#### Features Implementadas:

```
┌─────────────────────────────────────────┐
│      Portal do Cotista - Vivant Care    │
├─────────────────────────────────────────┤
│                                          │
│  📅 Calendário de Uso                   │
│  Agendamento e disponibilidade          │
│                                          │
│  📄 Meus Boletos/Extrato                │
│  Histórico financeiro completo          │
│                                          │
│  ✨ Solicitar Concierge                 │
│  Serviços premium sob demanda           │
│                                          │
└─────────────────────────────────────────┘
```

**Componentes UI:**
- 3 Cards responsivos com hover effects
- Ícones Lucide React
- Botões com Vivant Navy
- Rodapé informativo com suporte 24/7

---

### 5. Layout Dashboard Dinâmico

**Arquivo:** `app/(dashboard)/layout.tsx`

- Header com branding dinâmico
- Título e descrição ajustados por domínio
- Tipografia em Vivant Navy
- Container responsivo

---

### 6. Tailwind Customizado

**Arquivo:** `tailwind.config.ts`

Novas cores adicionadas:

```typescript
colors: {
  "vivant-navy": "#1A2F4B",   // Cor principal: headers e textos
  "vivant-gold": "#D4AF37",   // Cor de destaque: CTA e luxo
  // ... cores existentes
}
```

---

## 🧪 Como Testar Localmente

### Método 1: Editar arquivo hosts (Recomendado)

**Windows:** `C:\Windows\System32\drivers\etc\hosts`  
**Mac/Linux:** `/etc/hosts`

Adicione as seguintes linhas:

```
127.0.0.1 vivantcapital.com.br
127.0.0.1 vivantresidences.com.br
127.0.0.1 vivantcare.com.br
```

Depois execute:

```bash
npm run dev
```

Acesse:
- http://vivantcapital.com.br:3000 → Simulador
- http://vivantcare.com.br:3000 → Portal do Cotista
- http://vivantresidences.com.br:3000 → Home Marketing

---

### Método 2: Usar localhost com query params

Adicione temporariamente ao middleware para testes:

```typescript
// Fallback para testes locais via query param
const testDomain = request.nextUrl.searchParams.get("domain");
if (testDomain === "capital") {
  return NextResponse.rewrite(new URL("/(dashboard)/dashboard/simulador", request.url));
}
```

Acesse:
- http://localhost:3000?domain=capital
- http://localhost:3000?domain=care

---

## 📦 Build e Deploy

### Build de Produção

```bash
npm run build
```

**Status:** ✅ Build passou com sucesso  
**Rotas Geradas:**

```
Route (app)                              Size     First Load JS
├ ƒ /                                    13.1 kB         117 kB
├ ƒ /dashboard/simulador                 38.8 kB         136 kB
├ ƒ /portal-cotista                      2.5 kB         99.2 kB
└ ƒ /vivant-capital                      1.77 kB        95.6 kB
```

---

## 🔧 Configurações de Deploy

### Vercel (Recomendado)

No dashboard da Vercel, adicione os 3 domínios:

1. `vivantcapital.com.br`
2. `vivantresidences.com.br`
3. `vivantcare.com.br`

O middleware detectará automaticamente o domínio e fará o roteamento correto.

### Next.js Standalone

Certifique-se de que o servidor recebe os headers corretos:

```javascript
// next.config.mjs
export default {
  // ... outras configs
  experimental: {
    serverActions: true,
  },
};
```

---

## ⚠️ Regras de Ouro Implementadas

✅ **TypeScript Strict:** Nenhum uso de `any`  
✅ **Vivant Navy:** Cor principal (#1A2F4B) em headers e textos  
✅ **Build Success:** `npm run build` passa sem erros de tipo  
✅ **Responsivo:** Grid adaptativo (mobile → tablet → desktop)  
✅ **Acessibilidade:** Componentes semânticos e ARIA labels  

---

## 📂 Estrutura de Arquivos

```
vivant-multipropriedade/
├── middleware.ts                          # Roteamento por domínio
├── lib/
│   └── domain.ts                          # Utilitários de branding
├── app/
│   ├── layout.tsx                         # Metadados dinâmicos
│   ├── (dashboard)/
│   │   ├── layout.tsx                     # Header dinâmico
│   │   ├── dashboard/simulador/page.tsx   # Vivant Capital
│   │   └── portal-cotista/page.tsx        # Vivant Care (NOVO)
│   └── (marketing)/
│       └── page.tsx                       # Vivant Residences
└── tailwind.config.ts                     # Cores customizadas
```

---

## 🎨 Design Tokens

```scss
// Cores Principais
$vivant-navy: #1A2F4B;
$vivant-gold: #D4AF37;

// Tipografia
$font-display: 'Playfair Display', serif;
$font-body: 'Inter', sans-serif;

// Espaçamento
$spacing-base: 1rem (16px);
$container-max: 1400px;
```

---

## 🚀 Próximos Passos Sugeridos

1. **Vivant Care - Funcionalidades:**
   - [ ] Implementar calendário de agendamento real
   - [ ] Integração com sistema de boletos
   - [ ] API de concierge com webhooks

2. **Analytics:**
   - [ ] Google Analytics por domínio
   - [ ] Tracking de conversões separado

3. **Performance:**
   - [ ] Otimizar imagens com `next/image`
   - [ ] Implementar ISR (Incremental Static Regeneration)

4. **SEO:**
   - [ ] Sitemap.xml por domínio
   - [ ] Robots.txt customizado
   - [ ] Structured data (JSON-LD)

---

## 📞 Contato Técnico

**Arquiteto:** AI Assistant Senior  
**Stack:** Next.js 14 + TypeScript + Tailwind CSS  
**Data:** Fevereiro 2026  

---

**Documentação criada automaticamente pela implementação multi-domínio Vivant** 🏗️
