# Gestão de Destinos

## Criar Destinos via Script

Para popular o banco com os 3 destinos principais da Vivant:

```bash
npm run destinos:criar
```

Este comando cria:
- 🚤 Porto Rico - PR (Caribe Paranaense)
- 🏞️ Represa Capivara - PR (Natureza e tranquilidade)
- 🏖️ Litoral Catarinense - SC (Praias paradisíacas)

Cada destino inclui:
- ✅ Informações completas (descrição, clima, estilo de vida)
- ✅ 4 destaques personalizados
- ✅ 3 imagens de exemplo
- ✅ Dados de valorização
- ✅ Status publicado (pronto para o site)

## Criar/Editar Destinos pelo Portal Admin

Acesse: `http://localhost:3000/admin/destinos/novo`

### Campos Obrigatórios

#### Informações Básicas
- **Nome do Destino**: Ex: "Porto Rico"
- **Slug**: URL amigável (auto-gerado, ex: "porto-rico-pr")
- **Estado**: Ex: "Paraná"
- **Emoji**: Ícone do destino (ex: 🚤)
- **Ordem**: Posição na home (1, 2, 3...)
- **Gradiente Tailwind**: Ex: "from-blue-500 to-cyan-400"
- **Subtítulo**: Frase curta (ex: "O Caribe Paranaense")
- **Localização/Distâncias**: Ex: "120 km de Maringá | 580 km de Curitiba"

#### Imagens
- Adicione até 8 imagens do destino
- Arraste e solte ou clique para selecionar
- A primeira imagem será a principal
- Formatos aceitos: PNG, JPG, WEBP (máx 5MB cada)

#### Descrições
- **Descrição Geral**: Texto rico sobre o destino (mín. 50 caracteres)
- **Clima**: Características climáticas e melhores épocas (mín. 20 caracteres)
- **Estilo de Vida**: Como é viver/passar férias no destino (mín. 20 caracteres)
- **Valorização**: Dados sobre valorização imobiliária

#### Destaques (Exatamente 4)
Cada destaque tem:
- **Emoji**: Ícone visual (ex: 🌊)
- **Título**: Nome curto (ex: "Águas Cristalinas")
- **Descrição**: Texto detalhado

**Interface melhorada:**
- Cards visuais em grid 2x2
- Edição inline com botão "Editar"
- Adicionar novos destaques facilmente
- Remover destaques existentes

#### Publicação
- Toggle para publicar/despublicar
- Quando publicado, aparece na home e página de destinos

## Onde os Destinos Aparecem

### 1. Home (`/`)
- Seção "Nossos Destinos"
- Mostra até 4 destinos publicados
- Com imagem (se disponível) ou gradiente de cor
- Cards centralizados e responsivos

### 2. Página de Destinos (`/destinos`)
- Página dedicada com todos os destinos
- Sistema de abas para navegar entre destinos
- Exibe imagem principal ou gradiente
- Mostra todas as informações detalhadas

### 3. Portal Admin (`/admin/destinos`)
- Listagem de todos os destinos
- Filtros e busca
- Edição e exclusão (se sem propriedades vinculadas)

## Estrutura de Dados

```typescript
interface Destination {
  name: string;           // Nome do destino
  slug: string;           // URL slug
  state: string;          // Estado (UF)
  emoji: string;          // Emoji representativo
  color: string;          // Gradiente Tailwind
  subtitle: string;       // Subtítulo curto
  location: string;       // Distâncias
  description: string;    // Descrição completa
  climate: string;        // Informações climáticas
  lifestyle: string;      // Estilo de vida
  images: string[];       // URLs das imagens
  features: Array<{       // 4 destaques
    icon: string;         // Emoji
    title: string;        // Título
    desc: string;         // Descrição
  }>;
  appreciation: string;   // Valorização
  published: boolean;     // Publicado?
  order: number;          // Ordem na home
}
```

## Dicas

1. **Imagens de qualidade**: Use fotos em alta resolução que representem bem o destino
2. **Gradientes**: Escolha cores que combinem com a identidade do destino
3. **Destaques**: Destaque os 4 principais atrativos do local
4. **Ordem**: Use números sequenciais (1, 2, 3) para controlar a ordem na home
5. **Publicação**: Só publique quando todas as informações estiverem completas
