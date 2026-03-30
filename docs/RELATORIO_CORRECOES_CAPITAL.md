# Relatório de correções – Módulo Vivant Capital

**Data:** Março 2025  
**Objetivo:** Analisar o esquema do Capital e listar o que está faltando ou quebrado para o uso no dia a dia (vincular investidor a ativo, distribuições, etc.).

---

## 1. Visão geral do fluxo atual

| Área | O que existe | O que falta (problema) |
|------|----------------|------------------------|
| **Capital** (dashboard) | Cards com totais e links | Nada crítico |
| **Ativos** | Lista, Vincular imóvel, Configurar, Excluir | Nada crítico |
| **Investidores** | Lista, Vincular usuário (criar perfil) | Nada crítico |
| **Participações** | Só lista de participações | **Não há botão nem tela para criar participação** (investidor × ativo × cotas) |
| **Distribuições** | Lista, Ver detalhes por distribuição | **Não há botão para criar nova distribuição** |
| **Solicitações** | Lista, Ver/decidir por solicitação | Criadas pelo investidor no portal; admin só aprova/recusa. OK |
| **Relatórios** | Página com placeholders “em breve” | Funcionalidade futura |

---

## 2. Correções prioritárias

### 2.1 Participações – Criar nova participação (prioridade alta)

**Problema:**  
Na aba **Participações** só aparece a lista. Não existe botão nem formulário para cadastrar uma nova participação (vincular um investidor a um ativo com X cotas). Por isso o investidor fica com “0 participação(ões)” e nunca “entra no vínculo”.

**O que a API já oferece:**  
- `POST /api/admin/capital/participacoes`  
- Body: `investorProfileId`, `assetConfigId`, `numeroCotas` (obrigatórios), `valorAportado` (opcional), `dataEntrada`, `status`.  
- O backend calcula `percentualTotal` e pode calcular `valorAportado` a partir de cotas × valor por cota do ativo.

**Correção recomendada:**

1. Na página **Participações** (`app/(admin)/admin/capital/participacoes/page.tsx`):
   - Adicionar um botão **“Nova participação”** (visível para quem tem `capital.manage`), ao lado do título.
2. Criar um componente cliente (modal ou sheet) **“Nova participação”** com:
   - **Investidor:** select buscando perfis de investidor (GET `/api/admin/capital/investidores` ou lista já carregada).
   - **Ativo:** select de ativos (GET `/api/admin/capital/ativos` ou lista já carregada).
   - **Número de cotas:** input numérico (obrigatório).
   - **Valor aportado:** input opcional; se vazio, preencher com (cotas × valor por cota do ativo selecionado).
   - Botão **Salvar** que chama `POST /api/admin/capital/participacoes` e, em sucesso, fecha o modal e dá `router.refresh()`.
3. Mensagem quando a lista estiver vazia: orientar a clicar em **“Nova participação”** para vincular investidor a ativo.

**Arquivos a criar/alterar:**

- `app/(admin)/admin/capital/participacoes/page.tsx` – adicionar botão e (se for modal) import do componente.
- Novo: `app/(admin)/admin/capital/participacoes/nova-participacao-modal.tsx` (ou `nova-participacao-sheet.tsx`) – formulário e chamada à API.

---

### 2.2 Distribuições – Criar nova distribuição (prioridade média)

**Problema:**  
Na aba **Distribuições** só existe lista e “Ver detalhes”. Não há como criar uma nova distribuição (competência, receita, custos, etc.) por ativo.

**O que a API já oferece:**  
- `POST /api/admin/capital/distribuicoes`  
- Body: `assetConfigId`, `competencia`, `receitaBruta`, `custos` (obrigatórios); `taxaAdministracaoValor`, `reservaValor`, `resultadoDistribuivel`, `status` opcionais.  
- A API cria a distribuição e os itens por investidor (participações ativas no ativo).

**Correção recomendada:**

1. Na página **Distribuições** (`app/(admin)/admin/capital/distribuicoes/page.tsx`):
   - Adicionar botão **“Nova distribuição”** (para `capital.manage`).
2. Criar componente cliente (modal ou página) **“Nova distribuição”** com:
   - **Ativo:** select (ativos do Capital).
   - **Competência:** input (ex.: `2025-01`, formato mês/ano).
   - **Receita bruta**, **Custos** (obrigatórios).
   - **Taxa administração**, **Reserva** (opcionais).
   - Cálculo opcional de resultado distribuível (receita − custos − taxa − reserva).
   - Botão **Criar** chamando `POST /api/admin/capital/distribuicoes` e refresh.

**Arquivos a criar/alterar:**

- `app/(admin)/admin/capital/distribuicoes/page.tsx` – botão “Nova distribuição”.
- Novo: componente de formulário (modal ou página) para criar distribuição.

---

## 3. Melhorias opcionais

### 3.1 Participações – Editar / cancelar participação

- Hoje não existe `PATCH` nem `DELETE` em `/api/admin/capital/participacoes/[id]`.
- Para mudar status (ex.: ATIVO → RESGATADO/CANCELADO) ou ajustar dados, seria necessário:
  - Criar rota `app/api/admin/capital/participacoes/[id]/route.ts` com `PATCH` (e, se desejado, `DELETE` ou “cancelar” via status).

### 3.2 Ativo (Configurar) – Listar participações do ativo

- Na página de configurar ativo (`/admin/capital/ativos/[id]`), pode-se exibir a lista de participações daquele ativo e um link **“Adicionar participação”** que abre o mesmo fluxo de nova participação com o ativo já pré-preenchido.

### 3.3 Relatórios

- Página de Relatórios hoje é só placeholder (“em breve”). Pode ficar para uma segunda fase (relatórios financeiros, exportação, etc.).

---

## 4. Resumo das correções

| # | Onde | O que fazer | Prioridade |
|---|------|-------------|------------|
| 1 | Participações | Botão **“Nova participação”** + modal/página com formulário (investidor, ativo, cotas, valor opcional) e POST para a API existente. | **Alta** |
| 2 | Distribuições | Botão **“Nova distribuição”** + formulário (ativo, competência, receita, custos, etc.) e POST para a API existente. | **Média** |
| 3 | Participações (API) | Opcional: PATCH/DELETE em `participacoes/[id]` para editar ou cancelar participação. | Baixa |
| 4 | Ativo [id] | Opcional: listar participações do ativo e “Adicionar participação” com ativo pré-preenchido. | Baixa |

---

## 5. Conclusão

O módulo Capital está **quase completo em backend** (APIs de participação e distribuição já existem), mas **falta a interface** para:

1. **Participações:** criar vínculo investidor × ativo × cotas (por isso não há “como fazer” hoje na tela).
2. **Distribuições:** criar nova distribuição por ativo/competência.

Implementar o item 1 (Nova participação) resolve o problema de “não ter botão nem como fazer” em Participações e permite que o investidor passe a ter participações e apareçam “suas respectivas coisas” (cotas, distribuições, etc.). O item 2 completa o ciclo de uso do Capital para distribuição de resultados.
