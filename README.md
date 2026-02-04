# Vivant Multipropriedade - Simulador Financeiro

Sistema de análise financeira desenvolvido para o modelo de negócio de multipropriedade da Vivant.

## 🚀 Tecnologias

- **Next.js 14.2.0** - Framework React com App Router
- **TypeScript** (Modo Estrito) - Tipagem estática completa
- **Tailwind CSS** - Estilização utility-first
- **Shadcn/UI** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Decimal.js** - Cálculos financeiros de alta precisão

## 📁 Estrutura do Projeto

```
vivant-multipropriedade/
├── app/
│   ├── (marketing)/          # Route group para páginas de marketing
│   │   ├── page.tsx          # Página inicial
│   │   └── layout.tsx
│   ├── (dashboard)/          # Route group para dashboard
│   │   ├── dashboard/
│   │   │   └── simulador/
│   │   │       └── page.tsx  # Página do simulador
│   │   └── layout.tsx
│   ├── globals.css           # Estilos globais + Tailwind
│   └── layout.tsx            # Layout raiz
├── components/
│   ├── dashboard/
│   │   ├── property-form.tsx     # Formulário de entrada
│   │   └── analysis-cards.tsx    # Cards de análise
│   └── ui/                   # Componentes Shadcn/UI
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   ├── math/
│   │   └── calculator.ts     # Lógica de cálculo financeiro
│   ├── validations/
│   │   └── property.ts       # Schemas Zod
│   └── utils.ts              # Utilitários (cn)
└── package.json
```

## 💡 Lógica de Negócio

### Fluxo de Cálculo

O sistema implementa a seguinte metodologia de análise financeira:

1. **VGV Total** = Preço da Cota × Quantidade de Cotas
2. **Imposto RET** = 4% do VGV Total
3. **VGV Líquido** = VGV Total - Imposto RET
4. **Split 50/50** do VGV Líquido:
   - 50% → Conta Escrow (Bolsão de Garantia)
   - 50% → Operacional Vivant
5. **Saldo Final** = Operacional Vivant - CAPEX Mobília
6. **Margem Operacional** = (Saldo Final / VGV Total) × 100%

### Exemplo de Uso

**Entrada:**
- Preço da Cota: R$ 50.000,00
- Quantidade de Cotas: 100
- CAPEX Mobília: R$ 500.000,00

**Saída:**
- VGV Total: R$ 5.000.000,00
- Imposto RET (4%): R$ 200.000,00
- VGV Líquido: R$ 4.800.000,00
- Conta Escrow (50%): R$ 2.400.000,00
- Operacional Vivant (50%): R$ 2.400.000,00
- Saldo Final: R$ 1.900.000,00
- Margem Operacional: 38%

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar build de produção
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 📊 Funcionalidades

### ✅ Implementadas

- [x] Formulário de entrada com validação completa
- [x] Cálculos financeiros com precisão decimal
- [x] Dashboard responsivo com cards coloridos
- [x] Validação em tempo real com Zod
- [x] TypeScript estrito (sem uso de 'any')
- [x] Route groups para separação de contextos
- [x] Componentes reutilizáveis com Shadcn/UI

### 🎨 Interface

- **Cards Informativos:**
  - 🔵 VGV Total (Azul)
  - 🟢 Margem Operacional (Verde)
  - 🟣 Bolsão de Garantia (Roxo)
  - 🟠 Saldo Final (Laranja)

- **Formulário Validado:**
  - Preço da Cota (R$ 1.000 - R$ 10.000.000)
  - Quantidade de Cotas (1 - 1.000 unidades)
  - CAPEX Mobília (R$ 0 - R$ 5.000.000)

## 🔒 Rigor Técnico

- ✅ TypeScript com configuração estrita
- ✅ Proibição explícita de `any`
- ✅ Validação de tipos em runtime com Zod
- ✅ Cálculos financeiros com Decimal.js (precisão de 20 dígitos)
- ✅ Aliases configurados (@/*)
- ✅ Componentes totalmente tipados

## 📝 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm start        # Executar build
npm run lint     # Linter ESLint
```

## 🤝 Contribuição

Este projeto foi desenvolvido seguindo as melhores práticas de:

- Clean Architecture
- Type Safety
- Component Composition
- Separation of Concerns

## 📄 Licença

Projeto interno da Vivant Multipropriedade.
