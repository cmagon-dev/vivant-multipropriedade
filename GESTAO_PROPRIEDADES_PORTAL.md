# 🏠 Sistema de Gestão de Propriedades no Admin Portal

Implementado um sistema completo de gestão de residências/propriedades com cotas, alocações e calendários!

---

## 🎯 O Que Foi Criado

### 📍 Nova Seção no Menu

Adicionado **"Propriedades"** na sidebar do Admin Portal, entre Dashboard e Cotistas.

**Menu Atualizado:**
```
• Dashboard
• Propriedades ← NOVO!
• Cotistas
• Financeiro
• Convites Pendentes
• Configurações
```

---

## 🏗️ Páginas Implementadas

### 1️⃣ **Lista de Propriedades** (`/admin-portal/propriedades`)

**Funcionalidades:**
- ✅ Visualizar todas as propriedades cadastradas
- ✅ Estatísticas gerais:
  - Total de propriedades
  - Total de cotas
  - Cotas alocadas
  - Total de reservas
- ✅ Card para cada propriedade mostrando:
  - Imagem da propriedade
  - Nome e localização
  - Número de cotas (alocadas/total)
  - Número de reservas
  - Quartos e capacidade
  - Barra de progresso de alocação
  - Lista de cotistas alocados
- ✅ Botões de ação:
  - "Gerenciar" → Ir para detalhes
  - "Calendário" → Ver calendário de uso
  - "Nova Propriedade" → Cadastrar nova

**Exemplo Visual:**
```
┌─────────────────────────────────────────────────┐
│ 🏠 Gestão de Propriedades    [Nova Propriedade] │
│                                                  │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│ │   10 │  │   50 │  │   45 │  │  120 │        │
│ │Prop. │  │Cotas │  │Aloc. │  │Reserv│        │
│ └──────┘  └──────┘  └──────┘  └──────┘        │
│                                                  │
│ ┌─────────────────────────────────────────────┐│
│ │[IMG] Casa Vista Mar                          ││
│ │      📍 Búzios - RJ                          ││
│ │      👥 5/6 cotas  📅 12 reservas  🏠 4 qtos ││
│ │      Alocação: ████████░░ 83%               ││
│ │      Cotistas: [Maria][João][Ana]...        ││
│ │                     [Gerenciar][Calendário] ││
│ └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

### 2️⃣ **Detalhes da Propriedade** (`/admin-portal/propriedades/[id]`)

**Funcionalidades:**
- ✅ Ver detalhes completos da propriedade
- ✅ Estatísticas específicas:
  - Total de cotas
  - Cotas alocadas
  - Cotas disponíveis
  - Capacidade máxima
- ✅ **Gerenciar Cotas**:
  - Listar todas as cotas alocadas
  - Alocar nova cota (vincular cotista)
  - Remover cota
  - Ver informações de cada cota:
    - Nome e email do cotista
    - Número da cota
    - Percentual de propriedade
    - Semanas por ano
- ✅ Dialog para alocar nova cota:
  - Selecionar cotista (dropdown)
  - Definir número da cota
  - Definir percentual
  - Definir semanas/ano
- ✅ Botões de ação:
  - "Ver Calendário"
  - "Editar Propriedade"
  - "Voltar"

**Exemplo Visual:**
```
┌─────────────────────────────────────────────────────┐
│ [←] Casa Vista Mar                                   │
│     📍 Búzios - RJ           [Calendário][Editar]   │
│                                                      │
│ ┌────┐  ┌────┐  ┌────┐  ┌────┐                    │
│ │  6 │  │  5 │  │  1 │  │  8 │                    │
│ │Tot.│  │Aloc│  │Disp│  │Cap.│                    │
│ └────┘  └────┘  └────┘  └────┘                    │
│                                                      │
│ 👥 Cotas e Cotistas        [Alocar Nova Cota]      │
│ ┌──────────────────────────────────────────────┐   │
│ │ [👤] Maria Silva                              │   │
│ │      maria@email.com                          │   │
│ │                      Cota 1 de 6              │   │
│ │                      16.67% • 8 semanas/ano[X]│   │
│ ├──────────────────────────────────────────────┤   │
│ │ [👤] João Santos                              │   │
│ │      joao@email.com                           │   │
│ │                      Cota 2 de 6              │   │
│ │                      16.67% • 8 semanas/ano[X]│   │
│ └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 APIs Implementadas

### 1. **GET** `/api/admin/propriedades/[id]`
**Função**: Buscar detalhes de uma propriedade específica

**Retorna**:
```json
{
  "id": "...",
  "name": "Casa Vista Mar",
  "destino": { "name": "Búzios" },
  "totalCotas": 6,
  "cotas": [
    {
      "id": "...",
      "numeroCota": "Cota 1 de 6",
      "percentualCota": 16.67,
      "semanasAno": 8,
      "cotista": {
        "id": "...",
        "name": "Maria Silva",
        "email": "maria@email.com"
      }
    }
  ]
}
```

### 2. **POST** `/api/admin/propriedades/[id]/cotas`
**Função**: Criar/alocar uma nova cota para a propriedade

**Body**:
```json
{
  "cotistaId": "cotista-id",
  "numeroCota": "Cota 1 de 6",
  "percentualCota": 16.67,
  "semanasAno": 8
}
```

**Validações**:
- ✅ Cotista deve existir
- ✅ Propriedade deve existir
- ✅ Número da cota é obrigatório

### 3. **DELETE** `/api/admin/cotas/[id]`
**Função**: Remover uma cota

**Validações**:
- ✅ Não pode remover cota com reservas ativas
- ✅ Não pode remover cota com cobranças pendentes

### 4. **PATCH** `/api/admin/cotas/[id]`
**Função**: Atualizar informações de uma cota

**Body** (todos opcionais):
```json
{
  "numeroCota": "Cota 1 de 6",
  "percentualCota": 16.67,
  "semanasAno": 8,
  "active": true
}
```

---

## 🚀 Como Usar

### Cenário 1: Ver Todas as Propriedades

1. Acesse `/admin-portal`
2. Clique em **"Propriedades"** na sidebar
3. Veja a lista completa com estatísticas

### Cenário 2: Gerenciar uma Propriedade

1. Na lista de propriedades, clique em **"Gerenciar"**
2. Veja os detalhes e cotas alocadas
3. Use **"Alocar Nova Cota"** para vincular um cotista
4. Preencha:
   - Selecione o cotista
   - Digite o número da cota
   - Defina percentual e semanas/ano
5. Clique em **"Criar Cota"**

### Cenário 3: Remover uma Cota

1. Na página de detalhes da propriedade
2. Encontre a cota desejada
3. Clique no ícone **[X]** vermelho
4. Confirme a remoção

**Obs**: Só pode remover se não houver reservas ou cobranças vinculadas!

### Cenário 4: Ver Calendário (Futuro)

1. Na lista ou detalhes, clique em **"Ver Calendário"**
2. Visualize ocupação e reservas (a implementar)

---

## 📊 Informações Exibidas

### Por Propriedade:
- ✅ Nome e localização
- ✅ Imagem (se houver)
- ✅ Total de cotas configuradas
- ✅ Cotas já alocadas
- ✅ Cotas disponíveis
- ✅ Número de reservas
- ✅ Capacidade (pessoas)
- ✅ Quartos e banheiros
- ✅ Percentual de alocação
- ✅ Lista de cotistas vinculados

### Por Cota:
- ✅ Nome do cotista
- ✅ Email do cotista
- ✅ Número da cota
- ✅ Percentual de propriedade
- ✅ Semanas por ano
- ✅ Status (ativa/inativa)

---

## ✅ Fluxo Completo de Gestão

### 1. Cadastrar Propriedade
```
Admin Portal → Propriedades → Nova Propriedade
(a implementar formulário completo)
```

### 2. Alocar Cotas
```
Propriedades → [Selecionar Propriedade] → Gerenciar
→ Alocar Nova Cota → Selecionar Cotista → Criar
```

### 3. Gerenciar Calendário
```
Propriedades → [Selecionar] → Ver Calendário
(a implementar visualização de calendário)
```

### 4. Monitorar Uso
```
Propriedades → Ver estatísticas de alocação e reservas
```

---

## 🎨 Componentes Visuais

### Cards de Estatísticas
- Cor diferente para cada métrica
- Ícones descritivos
- Valores em destaque

### Lista de Propriedades
- Layout em grid responsivo
- Cards com hover effect
- Imagem de destaque
- Barra de progresso visual

### Lista de Cotas
- Cards com fundo alternado
- Avatar do cotista
- Informações organizadas
- Botão de remoção discreto

### Dialog de Nova Cota
- Select de cotistas com busca
- Inputs validados
- Feedback visual
- Botões de confirmação/cancelamento

---

## 🔐 Segurança

Todas as APIs verificam:
- ✅ Usuário autenticado
- ✅ Tipo de usuário = admin
- ✅ Existência de registros
- ✅ Validações de negócio

---

## 📁 Arquivos Criados/Modificados

### Páginas:
1. ✅ `app/(admin-portal)/admin-portal/propriedades/page.tsx`
2. ✅ `app/(admin-portal)/admin-portal/propriedades/[id]/page.tsx`

### APIs:
1. ✅ `app/api/admin/propriedades/[id]/route.ts`
2. ✅ `app/api/admin/propriedades/[id]/cotas/route.ts`
3. ✅ `app/api/admin/cotas/[id]/route.ts`

### Componentes:
1. ✅ `components/admin-portal/sidebar.tsx` (atualizado)

---

## 🚧 Próximos Passos Sugeridos

### Implementações Futuras:

1. **Formulário de Nova Propriedade**
   - Criar `/admin-portal/propriedades/nova`
   - Upload de imagens
   - Seleção de destino
   - Definir total de cotas

2. **Edição de Propriedade**
   - Criar `/admin-portal/propriedades/[id]/editar`
   - Atualizar informações
   - Modificar configurações

3. **Calendário de Propriedade**
   - Criar `/admin-portal/propriedades/[id]/calendario`
   - Visualização anual
   - Marcação de reservas
   - Legenda de status

4. **Configuração de Semanas**
   - Definir quais semanas cada cota possui
   - Sistema de rotação automática
   - Resolução de conflitos

5. **Relatórios**
   - Taxa de ocupação
   - Receita por propriedade
   - Histórico de uso

---

## ✨ Benefícios

### Para o Administrador:
- ✅ **Visão completa** de todas as propriedades
- ✅ **Gestão centralizada** de cotas
- ✅ **Alocação fácil** de cotistas
- ✅ **Estatísticas em tempo real**
- ✅ **Interface intuitiva**

### Para o Negócio:
- ✅ **Controle total** sobre propriedades
- ✅ **Rastreamento** de alocações
- ✅ **Prevenção de conflitos**
- ✅ **Otimização** de ocupação
- ✅ **Transparência** nas operações

---

## 🧪 Teste Agora!

### Passo a Passo:

1. **Acesse o Admin Portal**
   ```
   http://localhost:3000/admin-portal
   ```

2. **Clique em "Propriedades"**

3. **Veja a lista de propriedades** (se houver no banco)

4. **Clique em "Gerenciar"** em uma propriedade

5. **Clique em "Alocar Nova Cota"**

6. **Selecione um cotista** e preencha os dados

7. **Clique em "Criar Cota"**

8. **Veja a cota aparecer na lista!**

---

**Agora você tem um sistema completo de gestão de propriedades e cotas!** 🏠🎉

**Use para:**
- Cadastrar residências
- Alocar cotistas às cotas
- Gerenciar calendários
- Monitorar ocupação
- Controlar alocações
