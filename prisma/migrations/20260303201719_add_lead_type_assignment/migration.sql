-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "SystemEventSeverity" AS ENUM ('INFO', 'WARN', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SystemEventStatus" AS ENUM ('OK', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "SystemTaskStatus" AS ENUM ('OPEN', 'DONE', 'CANCELED');

-- CreateEnum
CREATE TYPE "SystemTaskPriority" AS ENUM ('LOW', 'MED', 'HIGH');

-- CreateEnum
CREATE TYPE "LeadFinalStatus" AS ENUM ('WON', 'LOST');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('ACTIVE', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "LeadActivityType" AS ENUM ('NOTE', 'CALL', 'WHATSAPP', 'VISIT', 'PROPOSAL', 'STATUS_CHANGE');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DISPONIVEL', 'ULTIMAS_COTAS', 'PRE_LANCAMENTO', 'VENDIDO');

-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('PENDENTE', 'CONFIRMADA', 'NAO_UTILIZADA', 'EM_USO', 'FINALIZADA', 'CANCELADA', 'DISPONIVEL_TROCA');

-- CreateEnum
CREATE TYPE "StatusTroca" AS ENUM ('ABERTA', 'EM_NEGOCIACAO', 'ACEITA', 'CONCLUIDA', 'CANCELADA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "TipoTroca" AS ENUM ('MESMA_PROPRIEDADE', 'QUALQUER_PROPRIEDADE', 'PROPRIEDADE_ESPECIFICA');

-- CreateEnum
CREATE TYPE "TipoCobranca" AS ENUM ('CONDOMINIO', 'LIMPEZA', 'MANUTENCAO', 'SEGURO', 'IPTU', 'TAXA_GESTAO', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusCobranca" AS ENUM ('PENDENTE', 'VENCIDA', 'PAGA', 'PAGA_PARCIAL', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoAssembleia" AS ENUM ('ORDINARIA', 'EXTRAORDINARIA', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "StatusAssembleia" AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoPauta" AS ENUM ('INFORMATIVA', 'DELIBERATIVA', 'ELETIVA');

-- CreateEnum
CREATE TYPE "TipoVoto" AS ENUM ('FAVOR', 'CONTRA', 'ABSTENCAO');

-- CreateEnum
CREATE TYPE "TipoAutor" AS ENUM ('ADMINISTRACAO', 'COTISTA', 'SISTEMA');

-- CreateEnum
CREATE TYPE "TipoMensagem" AS ENUM ('AVISO', 'COMUNICADO', 'URGENTE', 'MANUTENCAO', 'EVENTO', 'LEMBRETE');

-- CreateEnum
CREATE TYPE "PrioridadeMensagem" AS ENUM ('BAIXA', 'NORMAL', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('ESTATUTO', 'REGIMENTO_INTERNO', 'ATA', 'CONTRATO', 'MANUAL', 'PLANTA', 'LAUDO', 'OUTROS');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "defaultRoute" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "group" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "companyId" TEXT,
    "granted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tutorial_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tutorial_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "help_contents" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "shortText" TEXT,
    "videoUrl" TEXT,
    "audienceRole" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_events" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "type" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "productKey" TEXT,
    "severity" "SystemEventSeverity" NOT NULL DEFAULT 'INFO',
    "status" "SystemEventStatus" NOT NULL DEFAULT 'OK',
    "message" TEXT NOT NULL,
    "meta" JSONB,

    CONSTRAINT "system_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_tasks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),
    "status" "SystemTaskStatus" NOT NULL DEFAULT 'OPEN',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedToUserId" TEXT,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "productKey" TEXT,
    "priority" "SystemTaskPriority" NOT NULL DEFAULT 'MED',
    "meta" JSONB,

    CONSTRAINT "system_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_types" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "initialStageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_type_assignments" (
    "id" TEXT NOT NULL,
    "leadTypeId" TEXT NOT NULL,
    "defaultOwnerUserId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_type_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_loss_reasons" (
    "id" TEXT NOT NULL,
    "leadTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_loss_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_stages" (
    "id" TEXT NOT NULL,
    "leadTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "finalStatus" "LeadFinalStatus",
    "slaHours" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "whatsTemplate" TEXT,
    "playbookChecklist" JSONB,
    "nextActionType" TEXT,
    "helpText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "leadTypeId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "source" TEXT,
    "notes" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'ACTIVE',
    "lossReasonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "type" "LeadActivityType" NOT NULL,
    "message" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "destinoId" TEXT NOT NULL,
    "condominio" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priceValue" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "area" INTEGER NOT NULL,
    "maxGuests" INTEGER,
    "fraction" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "monthlyFee" TEXT NOT NULL,
    "weeks" TEXT NOT NULL,
    "totalCotas" INTEGER,
    "images" JSONB NOT NULL,
    "features" JSONB NOT NULL,
    "appreciation" TEXT NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "climate" TEXT NOT NULL,
    "lifestyle" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "appreciation" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotistas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" TIMESTAMP(3),
    "inviteToken" TEXT,
    "inviteTokenExpiry" TIMESTAMP(3),
    "invitedBy" TEXT,
    "invitedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotas_propriedade" (
    "id" TEXT NOT NULL,
    "cotistaId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "numeroCota" TEXT NOT NULL,
    "percentualCota" DECIMAL(5,2) NOT NULL,
    "semanasAno" INTEGER NOT NULL DEFAULT 8,
    "semanasConfig" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataAquisicao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotas_propriedade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "cotaId" TEXT NOT NULL,
    "cotistaId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "numeroSemana" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" "StatusReserva" NOT NULL DEFAULT 'PENDENTE',
    "confirmadoEm" TIMESTAMP(3),
    "checkInEm" TIMESTAMP(3),
    "checkOutEm" TIMESTAMP(3),
    "limpezaSolicitada" BOOLEAN NOT NULL DEFAULT false,
    "limpezaRealizada" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "trocaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trocas_semanas" (
    "id" TEXT NOT NULL,
    "cotistaSolicitante" TEXT NOT NULL,
    "reservaOferecida" TEXT,
    "status" "StatusTroca" NOT NULL DEFAULT 'ABERTA',
    "tipo" "TipoTroca" NOT NULL DEFAULT 'QUALQUER_PROPRIEDADE',
    "propriedadeDesejada" TEXT,
    "semanasDesejadas" JSONB,
    "observacoes" TEXT,
    "cotistaConclusao" TEXT,
    "reservaRecebida" TEXT,
    "concluidaEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trocas_semanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cobrancas" (
    "id" TEXT NOT NULL,
    "cotaId" TEXT NOT NULL,
    "tipo" "TipoCobranca" NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "valorPago" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "mesReferencia" INTEGER NOT NULL,
    "anoReferencia" INTEGER NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" "StatusCobranca" NOT NULL DEFAULT 'PENDENTE',
    "urlBoleto" TEXT,
    "urlComprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cobrancas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assembleias" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoAssembleia" NOT NULL,
    "dataRealizacao" TIMESTAMP(3) NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" "StatusAssembleia" NOT NULL DEFAULT 'AGENDADA',
    "quorumMinimo" DECIMAL(5,2) NOT NULL,
    "quorumAlcancado" DECIMAL(5,2),
    "ataUrl" TEXT,
    "documentosUrls" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assembleias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pautas_assembleia" (
    "id" TEXT NOT NULL,
    "assembleiaId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoPauta" NOT NULL,
    "requererVotacao" BOOLEAN NOT NULL DEFAULT false,
    "votacaoAberta" BOOLEAN NOT NULL DEFAULT false,
    "aprovada" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pautas_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votos_assembleia" (
    "id" TEXT NOT NULL,
    "pautaId" TEXT NOT NULL,
    "cotistaId" TEXT NOT NULL,
    "voto" "TipoVoto" NOT NULL,
    "justificativa" TEXT,
    "votadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votos_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "autorId" TEXT,
    "autorNome" TEXT NOT NULL,
    "autorTipo" "TipoAutor" NOT NULL DEFAULT 'ADMINISTRACAO',
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoMensagem" NOT NULL DEFAULT 'AVISO',
    "prioridade" "PrioridadeMensagem" NOT NULL DEFAULT 'NORMAL',
    "anexosUrls" JSONB,
    "fixada" BOOLEAN NOT NULL DEFAULT false,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visualizacoes_mensagem" (
    "id" TEXT NOT NULL,
    "mensagemId" TEXT NOT NULL,
    "cotistaId" TEXT NOT NULL,
    "visualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visualizacoes_mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoDocumento" NOT NULL,
    "categoria" TEXT,
    "url" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "versao" TEXT NOT NULL DEFAULT '1.0',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "cotistaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "user_roles_companyId_idx" ON "user_roles"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_companyId_key" ON "user_roles"("userId", "roleId", "companyId");

-- CreateIndex
CREATE INDEX "user_permissions_permissionId_idx" ON "user_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "user_permissions_companyId_idx" ON "user_permissions"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permissionId_companyId_key" ON "user_permissions"("userId", "permissionId", "companyId");

-- CreateIndex
CREATE INDEX "user_tutorial_progress_userId_idx" ON "user_tutorial_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_tutorial_progress_userId_key_key" ON "user_tutorial_progress"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "help_contents_key_key" ON "help_contents"("key");

-- CreateIndex
CREATE INDEX "help_contents_key_idx" ON "help_contents"("key");

-- CreateIndex
CREATE INDEX "system_events_createdAt_idx" ON "system_events"("createdAt");

-- CreateIndex
CREATE INDEX "system_events_type_idx" ON "system_events"("type");

-- CreateIndex
CREATE INDEX "system_events_severity_idx" ON "system_events"("severity");

-- CreateIndex
CREATE INDEX "system_events_status_idx" ON "system_events"("status");

-- CreateIndex
CREATE INDEX "system_tasks_status_idx" ON "system_tasks"("status");

-- CreateIndex
CREATE INDEX "system_tasks_dueAt_idx" ON "system_tasks"("dueAt");

-- CreateIndex
CREATE INDEX "system_tasks_assignedToUserId_idx" ON "system_tasks"("assignedToUserId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_types_key_key" ON "lead_types"("key");

-- CreateIndex
CREATE UNIQUE INDEX "lead_type_assignments_leadTypeId_key" ON "lead_type_assignments"("leadTypeId");

-- CreateIndex
CREATE INDEX "lead_type_assignments_leadTypeId_idx" ON "lead_type_assignments"("leadTypeId");

-- CreateIndex
CREATE INDEX "lead_type_assignments_defaultOwnerUserId_idx" ON "lead_type_assignments"("defaultOwnerUserId");

-- CreateIndex
CREATE INDEX "lead_loss_reasons_leadTypeId_idx" ON "lead_loss_reasons"("leadTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_loss_reasons_leadTypeId_order_key" ON "lead_loss_reasons"("leadTypeId", "order");

-- CreateIndex
CREATE INDEX "lead_stages_leadTypeId_idx" ON "lead_stages"("leadTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_stages_leadTypeId_order_key" ON "lead_stages"("leadTypeId", "order");

-- CreateIndex
CREATE INDEX "leads_leadTypeId_idx" ON "leads"("leadTypeId");

-- CreateIndex
CREATE INDEX "leads_stageId_idx" ON "leads"("stageId");

-- CreateIndex
CREATE INDEX "leads_ownerUserId_idx" ON "leads"("ownerUserId");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_lossReasonId_idx" ON "leads"("lossReasonId");

-- CreateIndex
CREATE INDEX "lead_activities_leadId_idx" ON "lead_activities"("leadId");

-- CreateIndex
CREATE INDEX "lead_activities_actorUserId_idx" ON "lead_activities"("actorUserId");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_destinoId_idx" ON "properties"("destinoId");

-- CreateIndex
CREATE INDEX "properties_published_idx" ON "properties"("published");

-- CreateIndex
CREATE INDEX "properties_slug_idx" ON "properties"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");

-- CreateIndex
CREATE INDEX "destinations_published_idx" ON "destinations"("published");

-- CreateIndex
CREATE INDEX "destinations_slug_idx" ON "destinations"("slug");

-- CreateIndex
CREATE INDEX "destinations_order_idx" ON "destinations"("order");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cotistas_email_key" ON "cotistas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cotistas_cpf_key" ON "cotistas"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "cotistas_inviteToken_key" ON "cotistas"("inviteToken");

-- CreateIndex
CREATE INDEX "cotistas_email_idx" ON "cotistas"("email");

-- CreateIndex
CREATE INDEX "cotistas_cpf_idx" ON "cotistas"("cpf");

-- CreateIndex
CREATE INDEX "cotistas_inviteToken_idx" ON "cotistas"("inviteToken");

-- CreateIndex
CREATE INDEX "cotas_propriedade_cotistaId_idx" ON "cotas_propriedade"("cotistaId");

-- CreateIndex
CREATE INDEX "cotas_propriedade_propertyId_idx" ON "cotas_propriedade"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "cotas_propriedade_cotistaId_propertyId_numeroCota_key" ON "cotas_propriedade"("cotistaId", "propertyId", "numeroCota");

-- CreateIndex
CREATE INDEX "reservas_cotistaId_idx" ON "reservas"("cotistaId");

-- CreateIndex
CREATE INDEX "reservas_status_idx" ON "reservas"("status");

-- CreateIndex
CREATE INDEX "reservas_ano_numeroSemana_idx" ON "reservas"("ano", "numeroSemana");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_cotaId_ano_numeroSemana_key" ON "reservas"("cotaId", "ano", "numeroSemana");

-- CreateIndex
CREATE INDEX "trocas_semanas_cotistaSolicitante_idx" ON "trocas_semanas"("cotistaSolicitante");

-- CreateIndex
CREATE INDEX "trocas_semanas_status_idx" ON "trocas_semanas"("status");

-- CreateIndex
CREATE INDEX "cobrancas_cotaId_idx" ON "cobrancas"("cotaId");

-- CreateIndex
CREATE INDEX "cobrancas_status_idx" ON "cobrancas"("status");

-- CreateIndex
CREATE INDEX "cobrancas_dataVencimento_idx" ON "cobrancas"("dataVencimento");

-- CreateIndex
CREATE INDEX "cobrancas_anoReferencia_mesReferencia_idx" ON "cobrancas"("anoReferencia", "mesReferencia");

-- CreateIndex
CREATE INDEX "assembleias_propertyId_idx" ON "assembleias"("propertyId");

-- CreateIndex
CREATE INDEX "assembleias_status_idx" ON "assembleias"("status");

-- CreateIndex
CREATE INDEX "assembleias_dataRealizacao_idx" ON "assembleias"("dataRealizacao");

-- CreateIndex
CREATE INDEX "pautas_assembleia_assembleiaId_idx" ON "pautas_assembleia"("assembleiaId");

-- CreateIndex
CREATE INDEX "votos_assembleia_pautaId_idx" ON "votos_assembleia"("pautaId");

-- CreateIndex
CREATE INDEX "votos_assembleia_cotistaId_idx" ON "votos_assembleia"("cotistaId");

-- CreateIndex
CREATE UNIQUE INDEX "votos_assembleia_pautaId_cotistaId_key" ON "votos_assembleia"("pautaId", "cotistaId");

-- CreateIndex
CREATE INDEX "mensagens_propertyId_idx" ON "mensagens"("propertyId");

-- CreateIndex
CREATE INDEX "mensagens_tipo_idx" ON "mensagens"("tipo");

-- CreateIndex
CREATE INDEX "mensagens_createdAt_idx" ON "mensagens"("createdAt");

-- CreateIndex
CREATE INDEX "visualizacoes_mensagem_mensagemId_idx" ON "visualizacoes_mensagem"("mensagemId");

-- CreateIndex
CREATE UNIQUE INDEX "visualizacoes_mensagem_mensagemId_cotistaId_key" ON "visualizacoes_mensagem"("mensagemId", "cotistaId");

-- CreateIndex
CREATE INDEX "documentos_propertyId_idx" ON "documentos"("propertyId");

-- CreateIndex
CREATE INDEX "documentos_tipo_idx" ON "documentos"("tipo");

-- CreateIndex
CREATE INDEX "notificacoes_cotistaId_idx" ON "notificacoes"("cotistaId");

-- CreateIndex
CREATE INDEX "notificacoes_lida_idx" ON "notificacoes"("lida");

-- CreateIndex
CREATE INDEX "notificacoes_createdAt_idx" ON "notificacoes"("createdAt");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tutorial_progress" ADD CONSTRAINT "user_tutorial_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_types" ADD CONSTRAINT "lead_types_initialStageId_fkey" FOREIGN KEY ("initialStageId") REFERENCES "lead_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_type_assignments" ADD CONSTRAINT "lead_type_assignments_leadTypeId_fkey" FOREIGN KEY ("leadTypeId") REFERENCES "lead_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_type_assignments" ADD CONSTRAINT "lead_type_assignments_defaultOwnerUserId_fkey" FOREIGN KEY ("defaultOwnerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_loss_reasons" ADD CONSTRAINT "lead_loss_reasons_leadTypeId_fkey" FOREIGN KEY ("leadTypeId") REFERENCES "lead_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_stages" ADD CONSTRAINT "lead_stages_leadTypeId_fkey" FOREIGN KEY ("leadTypeId") REFERENCES "lead_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_leadTypeId_fkey" FOREIGN KEY ("leadTypeId") REFERENCES "lead_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "lead_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_lossReasonId_fkey" FOREIGN KEY ("lossReasonId") REFERENCES "lead_loss_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotas_propriedade" ADD CONSTRAINT "cotas_propriedade_cotistaId_fkey" FOREIGN KEY ("cotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotas_propriedade" ADD CONSTRAINT "cotas_propriedade_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_cotaId_fkey" FOREIGN KEY ("cotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_cotistaId_fkey" FOREIGN KEY ("cotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_trocaId_fkey" FOREIGN KEY ("trocaId") REFERENCES "trocas_semanas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trocas_semanas" ADD CONSTRAINT "trocas_semanas_cotistaSolicitante_fkey" FOREIGN KEY ("cotistaSolicitante") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobrancas" ADD CONSTRAINT "cobrancas_cotaId_fkey" FOREIGN KEY ("cotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assembleias" ADD CONSTRAINT "assembleias_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pautas_assembleia" ADD CONSTRAINT "pautas_assembleia_assembleiaId_fkey" FOREIGN KEY ("assembleiaId") REFERENCES "assembleias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votos_assembleia" ADD CONSTRAINT "votos_assembleia_pautaId_fkey" FOREIGN KEY ("pautaId") REFERENCES "pautas_assembleia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votos_assembleia" ADD CONSTRAINT "votos_assembleia_cotistaId_fkey" FOREIGN KEY ("cotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "cotistas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visualizacoes_mensagem" ADD CONSTRAINT "visualizacoes_mensagem_mensagemId_fkey" FOREIGN KEY ("mensagemId") REFERENCES "mensagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_cotistaId_fkey" FOREIGN KEY ("cotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
