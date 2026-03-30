export type HelpTopic = {
  slug: string;
  title: string;
  module: string;
  shortDescription: string;
  routeReference: string;
  content: string;
};

export const HELP_TOPICS: HelpTopic[] = [
  // Visão do Dono / Dashboard
  {
    slug: "visao-do-dono",
    title: "Visão do Dono",
    module: "Dashboard",
    shortDescription: "Visão consolidada do desempenho do negócio para o dono.",
    routeReference: "/admin/overview",
    content: `## 1. O que é

A **Visão do Dono** é a tela principal de entrada do painel administrativo. Ela reúne, em um só lugar, um resumo do que está acontecendo no negócio e atalhos rápidos para as áreas mais usadas.

## 2. Para que serve

Serve para o dono ou gestor ter uma visão geral do sistema sem precisar entrar em cada módulo. Você enxerga números importantes e, com um clique, vai direto para a área desejada (vendas, propriedades, Vivant Care, etc.).

## 3. Como funciona

A tela exibe cards ou blocos com indicadores e links. Cada bloco representa um módulo ou tema (por exemplo: comercial, casas, Vivant Care). Ao clicar em um bloco, você é levado à tela correspondente no menu.

## 4. Como usar na prática

1. Faça login no painel administrativo.
2. Se você tiver permissão de "Visão do Dono", ao acessar o admin será levado automaticamente para esta tela.
3. Use os cards/atalhos para ir às áreas que precisa (Leads, Casas, Cotistas, etc.).
4. Consulte os números exibidos para ter uma ideia rápida do estado do negócio.

## 5. Boas práticas

- Acesse a Visão do Dono no início do dia para ter uma noção do que merece atenção.
- Use os atalhos em vez de procurar no menu quando já souber para onde quer ir.
- Se algum número parecer estranho, entre no módulo correspondente para conferir os detalhes.

## 6. Erros comuns

- Esperar ver todas as métricas do negócio nesta tela: ela é um resumo; os detalhes ficam em cada módulo.
- Não encontrar um atalho: apenas os módulos para os quais você tem permissão aparecem. Se não vê algo, pode ser restrição de acesso.

## 7. Resultado esperado ao usar corretamente

Você consegue, em poucos segundos, entender o estado geral do sistema e ir rapidamente para a área que precisa trabalhar, sem se perder no menu.`,
  },
  {
    slug: "inicio-comercial",
    title: "Início Comercial",
    module: "Comercial / CRM",
    shortDescription: "Entrada rápida para o painel comercial e funil de vendas.",
    routeReference: "/dashboard/comercial",
    content: `## 1. O que é

O **Início Comercial** é a página de entrada da área comercial. É a “home” do time de vendas: um painel que mostra o que importa para o dia a dia comercial e dá acesso rápido aos leads e às ferramentas de acompanhamento.

## 2. Para que serve

Serve para concentrar, em uma única tela, as informações e atalhos que o comercial precisa: visão geral de métricas, acesso à lista de leads e ao funil. Quem trabalha com vendas pode começar o dia por essa tela e dali ir para onde precisar.

## 3. Como funciona

A tela exibe um resumo da atividade comercial (por exemplo: quantidade de leads, etapas do funil ou indicadores configurados) e links ou botões que levam às telas de Leads e, quando existir, à configuração de Funis/CRM. Tudo fica a um clique.

## 4. Como usar na prática

1. No menu do admin, clique em **Início Comercial** (ou acesse pelo atalho da Visão do Dono, se estiver disponível).
2. Veja os números e resumos exibidos na tela.
3. Use os botões ou links para abrir a lista de **Leads** ou a tela de **Funis / CRM**, conforme sua permissão.
4. Use essa página como ponto de partida sempre que for trabalhar com vendas.

## 5. Boas práticas

- Adote o hábito de abrir o Início Comercial ao começar o trabalho comercial.
- Confira os números antes de mergulhar nos leads para ter noção da carga e das prioridades.
- Combine o uso dessa tela com a de Leads para não perder oportunidades em andamento.

## 6. Erros comuns

- Procurar cadastro de novo lead apenas no Início Comercial: o cadastro e a gestão dos leads ficam na tela **Leads**; o Início Comercial só resume e direciona.
- Achar que ali se configura o funil: a configuração de etapas e funis fica em **Funis / CRM**; o Início Comercial é focado em visão geral e acesso rápido.

## 7. Resultado esperado ao usar corretamente

Você tem um ponto fixo para começar o trabalho comercial, enxerga rapidamente o estado das vendas e chega em um ou dois cliques na lista de leads ou na gestão do funil, ganhando tempo e organização.`,
  },
  // CRM
  {
    slug: "funis-crm",
    title: "Funis / CRM",
    module: "Comercial / CRM",
    shortDescription: "Configuração e acompanhamento de funis de vendas e leads.",
    routeReference: "/admin/crm",
    content: `## 1. O que é

**Funis / CRM** é a área onde se configura e acompanha o funil de vendas. O funil é a sequência de etapas que um lead percorre desde o primeiro contato até o fechamento (ou perda). Nesta tela você enxerga esse fluxo e pode ajustar etapas, nomes e regras conforme o processo da sua equipe.

## 2. Para que serve

Serve para o dono ou gestor comercial definir como o processo de vendas está organizado: quais etapas existem, em que ordem e, quando houver, alertas ou prazos. Quem tem permissão de gestão do CRM usa essa tela para deixar o funil alinhado à realidade da operação e para acompanhar o andamento dos leads nas etapas.

## 3. Como funciona

A tela mostra o funil em formato de colunas ou etapas. Cada etapa agrupa os leads que estão naquele momento do processo. Dependendo da configuração, é possível ver quantos leads há em cada etapa, mover leads entre etapas e acessar regras ou alertas (como prazos por etapa). A movimentação diária dos leads costuma ser feita na tela de **Leads**; aqui o foco é a visão do funil e a configuração.

## 4. Como usar na prática

1. Acesse **Funis / CRM** pelo menu (seção Comercial).
2. Visualize as etapas do funil e a distribuição dos leads.
3. Se você tiver permissão de gestão, use as opções disponíveis para editar etapas, criar novas ou ajustar nomes/ordem.
4. Use essa tela para reuniões de acompanhamento: “quantos na etapa X”, “onde está o gargalo”, etc.
5. Para mover um lead de etapa ou ver detalhes do lead, vá à tela **Leads**.

## 5. Boas práticas

- Mantenha o funil com poucas etapas e nomes claros, para toda a equipe entender.
- Revise as etapas de tempos em tempos e remova ou renomeie o que não é mais usado.
- Use o funil como base para falar com a equipe sobre onde estão os leads e onde travaram.

## 6. Erros comuns

- Achar que aqui se cadastra ou edita o lead: cadastro e edição de dados do lead ficam na tela **Leads**; Funis/CRM é visão e configuração do processo.
- Criar muitas etapas: funil com muitas colunas fica confuso e difícil de operar no dia a dia.
- Ignorar a diferença entre “ver” e “gerenciar”: só quem tem permissão de gestão do CRM altera etapas e configurações.

## 7. Resultado esperado ao usar corretamente

O funil reflete o processo real de vendas da empresa; a equipe e o gestor conseguem enxergar onde estão os leads e onde está o gargalo, e as configurações ficam estáveis e fáceis de explicar para novos usuários.`,
  },
  {
    slug: "leads",
    title: "Leads",
    module: "Comercial / CRM",
    shortDescription: "Gestão operacional dos leads em andamento.",
    routeReference: "/dashboard/comercial/leads",
    content: `## 1. O que é

A tela de **Leads** é onde você vê e opera o dia a dia dos contatos comerciais. Os leads aparecem em um quadro (kanban) organizado por etapas do funil, e é ali que você abre cada lead, atualiza dados, anota informações, move entre etapas e marca como ganho ou perdido.

## 2. Para que serve

Serve para a equipe comercial acompanhar e trabalhar cada oportunidade: ver quem está em qual etapa, o que foi combinado, quando foi o último contato e o que falta fazer. Toda a operação de vendas (registrar contato, mover no funil, fechar negócio ou perda) é feita a partir dessa tela.

## 3. Como funciona

Os leads são exibidos em colunas, uma para cada etapa do funil (por exemplo: Novo contato, Prospecção, Proposta, Fechado). Cada cartão representa um lead; ao clicar, você abre o detalhe para ver histórico, notas e dados. Dependendo da permissão, você pode arrastar o cartão para outra coluna (mudar etapa), editar dados, registrar atividades (ligação, e-mail, WhatsApp) e marcar como ganho ou perda.

## 4. Como usar na prática

1. Acesse **Leads** pelo menu (Comercial) ou pelo atalho do Início Comercial.
2. Escolha o funil ou tipo de lead, se houver filtro.
3. Navegue pelas colunas para ver em qual etapa está cada lead.
4. Clique em um lead para abrir o detalhe: dados do cliente, notas, atividades e histórico.
5. Para avançar o lead, arraste o cartão para a coluna da próxima etapa ou use o botão de mover etapa.
6. Registre ligações, reuniões e mensagens nas atividades do lead para manter o histórico.
7. Quando o negócio fechar (ganho ou perda), use a ação correspondente e, se existir, informe o motivo da perda.

## 5. Boas práticas

- Mantenha os dados do lead atualizados (nome, telefone, e-mail) e preencha o motivo quando marcar como perdido.
- Registre toda interação (ligação, e-mail, visita) para o histórico ficar útil para você e para o time.
- Mova o lead de etapa só quando de fato avançar no processo; evite pular etapas sem necessidade.
- Revise leads parados há muito tempo na mesma etapa e defina próxima ação ou encerre.

## 6. Erros comuns

- Não registrar atividades: o histórico fica vazio e ninguém sabe o que já foi feito com o lead.
- Deixar leads “esquecidos” em etapas antigas: isso distorce o funil e as métricas; ou avance ou marque como perdido.
- Procurar configuração do funil aqui: etapas e configurações do processo ficam em **Funis / CRM**; em Leads você só opera os cartões.

## 7. Resultado esperado ao usar corretamente

Todos os contatos comerciais estão organizados por etapa, com histórico claro de contatos e decisões. A equipe sabe o que fazer com cada lead, e o gestor consegue acompanhar o funil e os resultados com base em dados reais.`,
  },
  {
    slug: "tarefas",
    title: "Tarefas",
    module: "Comercial / Operações",
    shortDescription: "Lista de tarefas e pendências ligadas ao CRM e operações.",
    routeReference: "/admin/tasks",
    content: `## 1. O que é

A tela de **Tarefas** é a lista central de pendências e afazeres do sistema. Reúne tarefas criadas para você ou para a equipe, ligadas ao CRM, às operações ou a outros módulos, para ninguém perder o que precisa ser feito.

## 2. Para que serve

Serve para o dono e a equipe enxergarem em um só lugar o que está pendente: ligar para um lead, enviar um documento, revisar uma cobrança, etc. Assim você prioriza o dia e garante que nada importante fique esquecido.

## 3. Como funciona

As tarefas são listadas na tela, geralmente com título, descrição, data (e às vezes responsável e status). Você pode filtrar por período, status ou responsável, marcar como concluída e, quando houver permissão, criar ou editar tarefas. Algumas tarefas podem ter vínculo com um lead ou com outra entidade do sistema.

## 4. Como usar na prática

1. Acesse **Tarefas** pelo menu (seção Comercial).
2. Veja a lista de tarefas pendentes e, se existir filtro, use para ver “minhas tarefas”, “esta semana” ou “atrasadas”.
3. Clique em uma tarefa para ver os detalhes e, se precisar, marque como concluída.
4. Se você tiver permissão de gestão de tarefas, use o botão ou opção para criar nova tarefa (título, data, responsável, etc.).
5. Use a tela no início do dia para planejar o que fazer e ao longo do dia para ir “batendo” as pendências.

## 5. Boas práticas

- Consulte a lista de tarefas todo dia e priorize o que é urgente.
- Ao concluir uma tarefa, marque como feita para a lista refletir a realidade.
- Crie tarefas quando combinar algo com um lead ou quando surgir uma pendência operacional, para não depender só da memória.
- Se houver responsável, atribua corretamente para cada um saber o que é seu.

## 6. Erros comuns

- Nunca marcar tarefas como concluídas: a lista fica cheia de itens já resolvidos e perde a utilidade.
- Criar tarefas sem data ou sem critério: fica difícil saber o que fazer primeiro.
- Procurar aqui a lista de leads: leads ficam na tela **Leads**; Tarefas é só para pendências e afazeres.

## 7. Resultado esperado ao usar corretamente

As pendências da equipe ficam visíveis e organizadas; nada importante é esquecido e todos sabem o que fazer. A tela vira uma referência diária para planejar e executar o trabalho comercial e operacional.`,
  },
  {
    slug: "eventos",
    title: "Eventos",
    module: "Comercial / Auditoria",
    shortDescription: "Eventos importantes registrados para acompanhamento do dono.",
    routeReference: "/admin/events",
    content: `## 1. O que é

A tela de **Eventos** mostra um registro dos acontecimentos relevantes no sistema. O sistema grava automaticamente certas ações (por exemplo: alterações importantes, alertas, conclusões de processos) e exibe aqui para o dono ou gestor acompanhar o que está ocorrendo sem precisar abrir cada módulo.

## 2. Para que serve

Serve para ter uma visão cronológica do que aconteceu no negócio: quem fez o quê, quando e em qual parte do sistema. Ajuda a acompanhar a operação, a identificar problemas e a ter clareza sobre ações recentes da equipe ou do próprio sistema.

## 3. Como funciona

Os eventos são listados em ordem (geralmente do mais recente para o mais antigo). Cada linha pode trazer tipo do evento, data e hora, mensagem ou descrição e, quando existir, o usuário que realizou a ação ou a tela/módulo relacionado. Dependendo da configuração, há filtros por tipo, período ou severidade (informação, aviso, erro).

## 4. Como usar na prática

1. Acesse **Eventos** pelo menu (seção Comercial).
2. Leia a lista para ver o que ocorreu recentemente.
3. Use os filtros, se houver, para restringir por período ou tipo de evento.
4. Clique em um evento para ver mais detalhes, quando disponível.
5. Use essa tela em revisões periódicas (por exemplo semanal) ou quando precisar entender “o que aconteceu” em um caso específico.

## 5. Boas práticas

- Consulte os eventos com certa frequência para detectar erros ou comportamentos estranhos cedo.
- Não confie só na memória: use o histórico de eventos para explicar ou investigar situações.
- Se existir severidade (aviso/erro), priorize a leitura dos itens mais críticos.

## 6. Erros comuns

- Esperar que todos os passos do dia a dia apareçam aqui: só entram os eventos que o sistema está configurado para registrar; muitas ações de rotina podem não gerar evento.
- Procurar aqui a lista de leads ou de tarefas: Eventos é um log/histórico; Leads e Tarefas têm suas próprias telas.
- Ignorar avisos ou erros repetidos: eles podem indicar problema de processo ou de uso que vale corrigir.

## 7. Resultado esperado ao usar corretamente

Você tem uma visão objetiva e ordenada do que está acontecendo no sistema, consegue rastrear ações importantes e usar esse histórico para tomar decisões e melhorar processos.`,
  },
  // Propriedades
  {
    slug: "casas",
    title: "Casas",
    module: "Propriedades",
    shortDescription: "Cadastro e gestão de imóveis/casas do ecossistema.",
    routeReference: "/admin/casas",
    content: "",
  },
  {
    slug: "destinos",
    title: "Destinos",
    module: "Propriedades",
    shortDescription: "Cadastro e organização dos destinos onde há propriedades.",
    routeReference: "/admin/destinos",
    content: "",
  },
  // Vivant Care (macro)
  {
    slug: "vivant-care",
    title: "Vivant Care",
    module: "Vivant Care",
    shortDescription: "Visão geral do módulo Vivant Care dentro do admin.",
    routeReference: "/admin/vivant-care",
    content: "",
  },
  {
    slug: "cotistas-care",
    title: "Cotistas",
    module: "Vivant Care",
    shortDescription: "Gestão de cotistas que acessam o portal do cotista.",
    routeReference: "/admin/vivant-care/cotistas",
    content: "",
  },
  {
    slug: "convites-care",
    title: "Convites",
    module: "Vivant Care",
    shortDescription: "Criação e acompanhamento de convites enviados a cotistas.",
    routeReference: "/admin/vivant-care/convites",
    content: "",
  },
  {
    slug: "propriedades-care",
    title: "Propriedades do Care",
    module: "Vivant Care",
    shortDescription: "Propriedades disponibilizadas dentro do portal do cotista.",
    routeReference: "/admin/vivant-care/propriedades",
    content: "",
  },
  {
    slug: "financeiro-care",
    title: "Financeiro do Care",
    module: "Vivant Care",
    shortDescription: "Cobranças, faturas e fluxo financeiro do portal do cotista.",
    routeReference: "/admin/vivant-care/financeiro/cobrancas",
    content: "",
  },
  {
    slug: "avisos-care",
    title: "Avisos",
    module: "Vivant Care",
    shortDescription: "Comunicados e avisos enviados aos cotistas.",
    routeReference: "/admin/vivant-care/avisos",
    content: "",
  },
  {
    slug: "documentos-care",
    title: "Documentos",
    module: "Vivant Care",
    shortDescription: "Documentos disponibilizados para os cotistas.",
    routeReference: "/admin/vivant-care/documentos",
    content: "",
  },
  {
    slug: "assembleias-care",
    title: "Assembleias",
    module: "Vivant Care",
    shortDescription: "Configuração e acompanhamento de assembleias de cotistas.",
    routeReference: "/admin/vivant-care/assembleias",
    content: "",
  },
  {
    slug: "trocas-care",
    title: "Trocas de Semanas",
    module: "Vivant Care",
    shortDescription: "Gestão de solicitações de troca de semanas dos cotistas.",
    routeReference: "/admin/vivant-care/trocas",
    content: "",
  },
  // Vivant Capital (macro)
  {
    slug: "vivant-capital",
    title: "Vivant Capital",
    module: "Vivant Capital",
    shortDescription: "Visão geral dos investimentos sobre imóveis.",
    routeReference: "/admin/capital",
    content: "",
  },
  {
    slug: "ativos-capital",
    title: "Ativos",
    module: "Vivant Capital",
    shortDescription: "Configuração de imóveis como ativos de capital.",
    routeReference: "/admin/capital/ativos",
    content: "",
  },
  {
    slug: "investidores-capital",
    title: "Investidores",
    module: "Vivant Capital",
    shortDescription: "Perfis de investidores que participam dos ativos.",
    routeReference: "/admin/capital/investidores",
    content: "",
  },
  {
    slug: "participacoes-capital",
    title: "Participações",
    module: "Vivant Capital",
    shortDescription: "Relação investidor × ativo (cotas, percentuais).",
    routeReference: "/admin/capital/participacoes",
    content: "",
  },
  {
    slug: "distribuicoes-capital",
    title: "Distribuições",
    module: "Vivant Capital",
    shortDescription: "Distribuições de resultados por competência.",
    routeReference: "/admin/capital/distribuicoes",
    content: "",
  },
  {
    slug: "solicitacoes-capital",
    title: "Solicitações",
    module: "Vivant Capital",
    shortDescription: "Solicitações de liquidez (antecipação/resgate).",
    routeReference: "/admin/capital/solicitacoes",
    content: "",
  },
  {
    slug: "relatorios-capital",
    title: "Relatórios",
    module: "Vivant Capital",
    shortDescription: "Relatórios financeiros e documentos do módulo Capital.",
    routeReference: "/admin/capital/relatorios",
    content: "",
  },
  // Administração
  {
    slug: "usuarios-admin",
    title: "Usuários",
    module: "Administração",
    shortDescription: "Gestão de usuários administrativos do sistema.",
    routeReference: "/admin/usuarios",
    content: "",
  },
  {
    slug: "permissoes-admin",
    title: "Permissões",
    module: "Administração",
    shortDescription: "Configuração de roles e permissões (RBAC).",
    routeReference: "/admin/roles",
    content: "",
  },
];

export function getHelpTopicBySlug(slug: string): HelpTopic | undefined {
  return HELP_TOPICS.find((t) => t.slug === slug);
}

