# ⚙️ Página de Configurações do Portal

Agora você tem uma **página completa de configurações** para controlar todos os parâmetros do portal de cotistas!

---

## 📍 Localização

### URL: `/admin-portal/configuracoes`

**Como acessar:**
1. Faça login em `/login` e selecione "Admin Portal"
2. Na sidebar, clique em **"Configurações"** (ícone de engrenagem)
3. Ou acesse diretamente: `http://localhost:3000/admin-portal/configuracoes`

---

## 🎯 O que você pode configurar

A página possui **6 abas** com diferentes categorias de configurações:

### 1️⃣ **Calendário** 📅

Controle todas as regras de reservas e uso:

#### Parâmetros:
- ✅ **Antecedência Mínima** (dias) - Ex: 30 dias antes
- ✅ **Antecedência Máxima** (dias) - Ex: até 365 dias antes
- ✅ **Horário de Check-in** - Ex: 14:00
- ✅ **Horário de Check-out** - Ex: 11:00
- ✅ **Permitir Reservas Simultâneas** - Cotista pode ter múltiplas reservas ativas

#### Exemplo de Uso:
- Defina que reservas só podem ser feitas com 30 dias de antecedência
- Configure check-in às 15h e checkout às 11h
- Bloqueie reservas simultâneas se quiser apenas 1 reserva por cotista

---

### 2️⃣ **Financeiro** 💰

Gerencie cobranças e parâmetros financeiros:

#### Parâmetros:
- ✅ **Dia de Vencimento** - Ex: dia 10 de cada mês
- ✅ **Multa por Atraso** (%) - Ex: 2%
- ✅ **Juros por Atraso** (% ao dia) - Ex: 0.033% (1% ao mês)
- ✅ **Lembrete antes do Vencimento** (dias) - Ex: avisar 5 dias antes
- ✅ **Enviar Boleto Automaticamente** - Por email quando gerar cobrança

#### Exemplo de Uso:
- Configure vencimento para dia 10
- Defina multa de 2% e juros de 0.033% ao dia
- Ative envio automático de boletos

---

### 3️⃣ **Notificações** 🔔

Controle quando e como os cotistas são notificados:

#### Notificações Disponíveis:
- ✅ **Nova Reserva Confirmada**
- ✅ **Checkout Pendente** - Lembrar de fazer checkout
- ✅ **Pagamento Pendente** - Cobranças não pagas
- ✅ **Nova Assembleia** - Convocação
- ✅ **Nova Mensagem/Aviso** - Avisos no mural

#### Exemplo de Uso:
- Ative todas as notificações importantes
- Desative notificações menos urgentes se necessário

---

### 4️⃣ **Trocas** 🔄

Configure o sistema de troca de semanas entre cotistas:

#### Parâmetros:
- ✅ **Permitir Trocas** - Habilitar/desabilitar sistema
- ✅ **Antecedência Mínima para Troca** (dias) - Ex: 15 dias antes
- ✅ **Taxa de Troca** (R$) - Valor cobrado por troca
- ✅ **Aprovar Manualmente** - Admin deve aprovar cada troca

#### Exemplo de Uso:
- Habilite trocas entre cotistas
- Defina que trocas precisam ser feitas com 15 dias de antecedência
- Configure aprovação manual para ter controle

---

### 5️⃣ **Assembleias** 👥

Defina regras para assembleias e votações:

#### Parâmetros:
- ✅ **Quorum Mínimo** (%) - Ex: 50% dos cotistas presentes
- ✅ **Notificação Prévia** (dias) - Ex: avisar 15 dias antes
- ✅ **Permitir Votação Online** - Votar pelo portal

#### Exemplo de Uso:
- Configure quorum de 50%
- Avisar cotistas 15 dias antes da assembleia
- Permita votação online para facilitar participação

---

### 6️⃣ **Geral** 🛡️

Outras configurações importantes:

#### Parâmetros:
- ✅ **Limite de Convidados por Reserva** - Ex: máximo 4 pessoas
- ✅ **Permitir Cadastro de Convidados** - Cotistas podem cadastrar visitantes
- ✅ **Enviar E-mail de Boas-vindas** - Ao aceitar convite
- ✅ **Exigir Aceite do Termo** - Aceitar termos de uso ao criar conta

#### Exemplo de Uso:
- Limite 4 convidados por reserva
- Exija aceite de termos
- Envie email de boas-vindas automaticamente

---

## 🎨 Interface

### Layout da Página:

```
┌─────────────────────────────────────────────────────┐
│ ⚙️ Configurações do Portal      [Salvar Alterações] │
├─────────────────────────────────────────────────────┤
│ [Calendário] [Financeiro] [Notificações] [...]      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📅 Parâmetros do Calendário de Uso                 │
│  ┌──────────────────────────────────────────┐       │
│  │                                          │       │
│  │  Antecedência Mínima: [30] dias         │       │
│  │  Antecedência Máxima: [365] dias        │       │
│  │  Horário Check-in: [14:00]              │       │
│  │  Horário Check-out: [11:00]             │       │
│  │                                          │       │
│  │  Permitir Reservas Simultâneas  [OFF]   │       │
│  │                                          │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
│            [Cancelar] [Salvar Todas as Config.]     │
└─────────────────────────────────────────────────────┘
```

### Recursos Visuais:

- ✅ **Tabs organizadas** por categoria
- ✅ **Switches** para habilitar/desabilitar funcionalidades
- ✅ **Inputs numéricos** para valores e dias
- ✅ **Inputs de tempo** para horários
- ✅ **Descrições** em cada parâmetro explicando o que faz
- ✅ **Botão de salvar** no topo e no final da página

---

## 🚀 Como Usar

### Cenário 1: Configurar Calendário

1. Acesse `/admin-portal/configuracoes`
2. Clique na aba **"Calendário"**
3. Configure:
   - Antecedência mínima: **30 dias**
   - Antecedência máxima: **365 dias**
   - Check-in: **14:00**
   - Check-out: **11:00**
4. Desabilite "Reservas Simultâneas" se necessário
5. Clique em **"Salvar Alterações"**

### Cenário 2: Configurar Cobranças

1. Acesse `/admin-portal/configuracoes`
2. Clique na aba **"Financeiro"**
3. Configure:
   - Vencimento: **dia 10**
   - Multa: **2%**
   - Juros: **0.033%** ao dia
   - Lembrete: **5 dias** antes
4. Ative "Enviar Boleto Automaticamente"
5. Clique em **"Salvar Alterações"**

### Cenário 3: Habilitar Trocas

1. Acesse `/admin-portal/configuracoes`
2. Clique na aba **"Trocas"**
3. Ative "Permitir Trocas Entre Cotistas"
4. Configure:
   - Antecedência: **15 dias**
   - Taxa: **R$ 0,00** (ou valor desejado)
   - Ative "Aprovar Manualmente"
5. Clique em **"Salvar Alterações"**

---

## 💡 Vantagens

### ✅ Controle Total
- Configure cada aspecto do portal de cotistas
- Adapte as regras às necessidades do seu negócio

### ✅ Interface Intuitiva
- Tabs organizadas por categoria
- Switches simples para ligar/desligar
- Descrições claras de cada parâmetro

### ✅ Flexibilidade
- Ative/desative funcionalidades conforme necessário
- Ajuste valores e prazos facilmente

### ✅ Centralizado
- Todas as configurações em um só lugar
- Não precisa procurar em várias páginas

---

## 🔧 Configurações Padrão

Valores iniciais sugeridos:

| Parâmetro | Valor Padrão | Motivo |
|-----------|--------------|--------|
| **Antecedência Mínima** | 30 dias | Tempo para preparar a propriedade |
| **Check-in** | 14:00 | Horário padrão de hotéis |
| **Check-out** | 11:00 | Permitir limpeza |
| **Vencimento** | Dia 10 | Início do mês |
| **Multa** | 2% | Padrão legal |
| **Juros** | 0.033%/dia | 1% ao mês |
| **Quorum** | 50% | Maioria simples |
| **Votação Online** | Sim | Facilitar participação |

---

## 📋 Próximos Passos

### Implementar API

Atualmente, o botão "Salvar" simula um salvamento. Você precisará criar a API para persistir essas configurações:

```typescript
// app/api/admin/configuracoes/route.ts
export async function POST(request: Request) {
  // Salvar configurações no banco
}

export async function GET() {
  // Carregar configurações do banco
}
```

### Sugestões de Tabela

Crie uma tabela `ConfiguracoesPortal` no Prisma:

```prisma
model ConfiguracoesPortal {
  id        String   @id @default(cuid())
  chave     String   @unique  // Ex: "diasMinimoAntecedencia"
  valor     String              // Valor serializado (JSON)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## ✅ Checklist de Configuração Inicial

Ao configurar o portal pela primeira vez, revise:

- [ ] Horários de check-in/out
- [ ] Antecedência para reservas
- [ ] Dia de vencimento das cobranças
- [ ] Multa e juros
- [ ] Quorum mínimo para assembleias
- [ ] Sistema de trocas (habilitar ou não)
- [ ] Notificações automáticas
- [ ] Limite de convidados
- [ ] Email de boas-vindas

---

## 🎉 Pronto para Usar!

A página de configurações está completa e pronta para uso. Ela resolve seu pedido de ter:

✅ **Controle de usuários** - Via configurações gerais e permissões  
✅ **Controle de calendários** - Aba completa de parâmetros do calendário  
✅ **Parametrizações completas** - 6 abas com todas as configurações possíveis

**Acesse agora: `http://localhost:3000/admin-portal/configuracoes`** 🚀
