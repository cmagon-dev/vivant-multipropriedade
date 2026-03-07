# Exemplo Prático de Uso

## 🎯 Caso de Uso Real

### Cenário: Análise de Propriedade em Praia Grande/SP

**Contexto**: A Vivant deseja analisar a viabilidade financeira de uma propriedade na orla de Praia Grande para converter em multipropriedade.

---

## 📊 Dados de Entrada

### Propriedade: Apartamento Frente Mar

| Parâmetro | Valor |
|-----------|-------|
| **Preço por Cota** | R$ 85.000,00 |
| **Quantidade de Cotas** | 52 (1 por semana/ano) |
| **CAPEX Mobília** | R$ 180.000,00 |

**Justificativa dos Valores:**
- **R$ 85.000/cota**: Baseado em pesquisa de mercado para apartamentos frente mar
- **52 cotas**: Modelo de 1 semana por cota (52 semanas/ano)
- **R$ 180.000 CAPEX**: Mobília completa, decoração, eletrodomésticos, enxoval

---

## 💰 Cálculo Passo a Passo

### 1️⃣ VGV Total (Valor Geral de Vendas)

```
VGV Total = Preço da Cota × Quantidade de Cotas
VGV Total = R$ 85.000,00 × 52
VGV Total = R$ 4.420.000,00
```

**📌 Resultado**: R$ 4.420.000,00

---

### 2️⃣ Imposto RET (Real Estate Transfer)

```
Imposto RET = VGV Total × 4%
Imposto RET = R$ 4.420.000,00 × 0,04
Imposto RET = R$ 176.800,00
```

**📌 Resultado**: R$ 176.800,00 (deduzido do VGV)

---

### 3️⃣ VGV Líquido

```
VGV Líquido = VGV Total - Imposto RET
VGV Líquido = R$ 4.420.000,00 - R$ 176.800,00
VGV Líquido = R$ 4.243.200,00
```

**📌 Resultado**: R$ 4.243.200,00 (base para split)

---

### 4️⃣ Split 50/50 do VGV Líquido

#### 🛡️ Conta Escrow (Bolsão de Garantia)

```
Conta Escrow = VGV Líquido × 50%
Conta Escrow = R$ 4.243.200,00 × 0,5
Conta Escrow = R$ 2.121.600,00
```

**📌 Função**: Garantia para manutenção, imprevistos, reservas

#### 🏢 Operacional Vivant

```
Operacional Vivant = VGV Líquido × 50%
Operacional Vivant = R$ 4.243.200,00 × 0,5
Operacional Vivant = R$ 2.121.600,00
```

**📌 Função**: Capital para operação e investimentos

---

### 5️⃣ Dedução do CAPEX

```
Saldo Final = Operacional Vivant - CAPEX Mobília
Saldo Final = R$ 2.121.600,00 - R$ 180.000,00
Saldo Final = R$ 1.941.600,00
```

**📌 Resultado**: R$ 1.941.600,00 (lucro operacional)

---

### 6️⃣ Margem Operacional

```
Margem Operacional = (Saldo Final / VGV Total) × 100
Margem Operacional = (R$ 1.941.600,00 / R$ 4.420.000,00) × 100
Margem Operacional = 43,92%
```

**📌 Resultado**: 43,92% de margem operacional

---

## 📈 Análise de Viabilidade

### ✅ Indicadores Positivos

| Métrica | Valor | Status |
|---------|-------|--------|
| **Margem Operacional** | 43,92% | 🟢 Excelente |
| **VGV Total** | R$ 4,42 MM | 🟢 Alto |
| **Bolsão de Garantia** | R$ 2,12 MM | 🟢 Robusto |
| **Saldo Operacional** | R$ 1,94 MM | 🟢 Saudável |

### 💡 Interpretação

#### 🎯 Margem de 43,92%
- **Benchmark**: Margem saudável > 30%
- **Status**: MUITO BOM ✨
- **Implicação**: Alta viabilidade econômica

#### 🛡️ Bolsão de Garantia: R$ 2,12 MM
- Suficiente para 10+ anos de manutenção
- Cobertura para imprevistos e reformas
- Segurança financeira elevada

#### 💰 Saldo Operacional: R$ 1,94 MM
- Capital disponível para expansão
- ROI atrativo para investidores
- Payback acelerado

---

## 🔄 Análise de Sensibilidade

### Cenário Pessimista (-20% nas vendas)

```
Cotas Vendidas: 42 de 52 (80%)
VGV Real: R$ 3.570.000,00
Margem: ~35% (ainda viável)
```

### Cenário Otimista (preço premium +15%)

```
Preço por Cota: R$ 97.750,00
VGV Total: R$ 5.083.000,00
Margem: ~48% (excelente)
```

---

## 🎨 Como Usar no Sistema

### Passo 1: Acesse o Simulador

```
http://localhost:3001/dashboard/simulador
```

### Passo 2: Preencha o Formulário

- **Preço da Cota**: `85000`
- **Quantidade de Cotas**: `52`
- **Custo de Mobília - CAPEX**: `180000`

### Passo 3: Clique em "Calcular Análise"

O sistema exibirá instantaneamente:

📊 **Cards Principais**
- 🔵 VGV Total: R$ 4.420.000,00
- 🟢 Margem Operacional: 43,92%
- 🟣 Bolsão de Garantia: R$ 2.121.600,00
- 🟠 Saldo Final: R$ 1.941.600,00

📋 **Detalhamento**
- Imposto RET (4%): -R$ 176.800,00
- VGV Líquido: R$ 4.243.200,00
- CAPEX Mobília: -R$ 180.000,00

---

## 💼 Casos de Uso Adicionais

### Caso 2: Propriedade Econômica

```typescript
{
  precoCota: 35000,        // Preço mais acessível
  quantidadeCotas: 104,    // 2 cotas por semana
  custoMobilia: 80000      // Mobília padrão
}
```

**Resultado Esperado**:
- VGV: ~R$ 3,64 MM
- Margem: ~38%
- Público-alvo: Classe média

### Caso 3: Propriedade Premium

```typescript
{
  precoCota: 150000,       // Alto padrão
  quantidadeCotas: 52,     // 1 semana/ano
  custoMobilia: 400000     // Mobília luxo
}
```

**Resultado Esperado**:
- VGV: ~R$ 7,8 MM
- Margem: ~43%
- Público-alvo: Classe alta

---

## 🧮 Validações do Sistema

O sistema implementa as seguintes validações:

### Preço da Cota
- ✅ Mínimo: R$ 1.000,00
- ✅ Máximo: R$ 10.000.000,00
- ❌ Rejeita: valores zero ou negativos

### Quantidade de Cotas
- ✅ Mínimo: 1 cota
- ✅ Máximo: 1.000 cotas
- ❌ Rejeita: frações ou negativos

### CAPEX Mobília
- ✅ Mínimo: R$ 0,00 (aceita zero)
- ✅ Máximo: R$ 5.000.000,00
- ❌ Rejeita: valores negativos

---

## 📊 Comparação de Cenários

| Cenário | VGV Total | Margem | Saldo Final |
|---------|-----------|--------|-------------|
| **Econômico** | R$ 3,64 MM | 38% | R$ 1,30 MM |
| **Padrão** (exemplo) | R$ 4,42 MM | 44% | R$ 1,94 MM |
| **Premium** | R$ 7,80 MM | 43% | R$ 3,35 MM |

---

## 🎓 Dicas de Uso

### ✅ Boas Práticas

1. **Pesquisa de Mercado**
   - Valide preços com concorrentes
   - Considere localização e amenidades
   - Ajuste sazonalidade

2. **CAPEX Realista**
   - Solicite orçamentos detalhados
   - Inclua margem de segurança (10-15%)
   - Considere manutenção inicial

3. **Análise de Múltiplos Cenários**
   - Teste cenário base
   - Simule pessimista (-20%)
   - Simule otimista (+15%)

### ⚠️ Erros Comuns

1. **Subdimensionar CAPEX**
   - Lembre-se: móveis, decoração, enxoval completo
   - Considere equipamentos (TV, ar-condicionado)

2. **Ignorar Impostos**
   - RET já está incluído (4%)
   - Outros impostos podem ser adicionados futuramente

3. **Preço Irrealista**
   - Valide com mercado local
   - Considere perfil do público-alvo

---

## 📞 Suporte

Para dúvidas sobre:
- **Cálculos**: Verificar `lib/math/calculator.ts`
- **Validações**: Verificar `lib/validations/property.ts`
- **Interface**: Verificar `components/dashboard/`

---

## 🚀 Próximas Funcionalidades

Recursos planejados:
- [ ] Comparação lado a lado de propriedades
- [ ] Exportação de relatórios em PDF
- [ ] Gráficos de rentabilidade
- [ ] Histórico de simulações
- [ ] Análise de break-even
- [ ] Projeção de fluxo de caixa

---

**💡 Dica Final**: Este sistema foi projetado para análises rápidas e precisas. Para decisões finais, sempre considere análises complementares de mercado, jurídicas e operacionais.
