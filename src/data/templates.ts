import { SCHOOL_INFRASTRUCTURE_RESOURCES } from './education';
import type {
  DemoPreset,
  PromptFormState,
  ResourceCategoryId,
  ResourceTemplate,
  SlidePaletteOption,
  SlidePromptConfig,
  SlideTypographyOption,
} from '../types/prompt';

export interface CategoryMeta {
  id: ResourceCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export const RESOURCE_CATEGORIES: CategoryMeta[] = [
  {
    id: 'didaticos',
    label: 'Recursos Didáticos',
    shortLabel: 'Didáticos',
    description: 'Planos de aula, sequências didáticas, roteiros de aula e apostilas/guias de estudo.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    accentBorder: 'border-indigo-200',
  },
  {
    id: 'avaliacoes',
    label: 'Avaliações e Rubricas',
    shortLabel: 'Avaliações',
    description: 'Provas formais, banco de questões, rubricas analíticas e gabaritos comentados.',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
  },
  {
    id: 'documentais',
    label: 'Documentos Pedagógicos',
    shortLabel: 'Documentais',
    description: 'PEI e adaptações inclusivas, relatórios descritivos, projetos interdisciplinares, atas e ofícios.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-800',
    accentBorder: 'border-amber-200',
  },
  {
    id: 'complementares',
    label: 'Materiais Complementares',
    shortLabel: 'Complementares',
    description: 'Slides editoriais premium (modelo direção de arte), estudos de caso, jogos e gamificação.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    accentBorder: 'border-rose-200',
  },
];

export const SLIDE_PALETTE_OPTIONS: SlidePaletteOption[] = [
  {
    id: 'auto_editorial',
    name: 'Proposta Editorial Inteligente (Padrão do Modelo)',
    description: 'A IA propõe até 3 cores + neutros coerentes com o tema (ex.: off-white #F5F2EC, grafite #1C1C1E + acento sóbrio).',
    colors: ['#F5F2EC', '#1C1C1E', '#8C5E3C'],
    promptInstruction:
      'no máximo 3 cores + neutros. Proponha uma paleta coerente com o tema (ex.: off-white #F5F2EC, grafite #1C1C1E, um acento sóbrio) e use-a em todos os slides.',
  },
  {
    id: 'kinfolk_warm',
    name: 'Kinfolk Areia & Terracota',
    description: 'Editorial orgânico, quente e acolhedor — ideal para Humanas, Artes e Projetos.',
    colors: ['#F5F2EC', '#1C1C1E', '#B45B3E'],
    promptInstruction:
      'use rigorosamente a paleta editorial off-white #F5F2EC (fundo), grafite #1C1C1E (texto principal) e terracota sóbrio #B45B3E (único acento) em todos os slides.',
  },
  {
    id: 'monocle_slate',
    name: 'Monocle Marinho & Âmbar',
    description: 'Elegante e analítico — excelente para Ciências, Matemática e Gestão.',
    colors: ['#F7F7F5', '#162338', '#C88A2E'],
    promptInstruction:
      'use rigorosamente a paleta papel claro #F7F7F5 (fundo), azul-marinho profundo #162338 (títulos/contraste) e âmbar sóbrio #C88A2E (acento pontual) em todos os slides.',
  },
  {
    id: 'apple_dark_keynote',
    name: 'Keynote Grafite & Névoa',
    description: 'Alto impacto cinematográfico — ideal para Tecnologia, Computação e Ensino Técnico.',
    colors: ['#111214', '#F4F4F2', '#4F8EF7'],
    promptInstruction:
      'use rigorosamente a paleta grafite escuro #111214 (fundo cinematográfico), branco névoa #F4F4F2 (texto legível) e azul-aço #4F8EF7 (acento técnico discreto) em todos os slides.',
  },
  {
    id: 'botanical_sage',
    name: 'Botânico Sálvia & Marfim',
    description: 'Sereno e natural — perfeito para Biologia, Meio Ambiente e Educação Infantil.',
    colors: ['#F6F5F0', '#1F2922', '#3B6E57'],
    promptInstruction:
      'use rigorosamente a paleta marfim #F6F5F0 (fundo), verde-carvão #1F2922 (tipografia) e verde-sálvia #3B6E57 (acento natural) em todos os slides.',
  },
  {
    id: 'ufma_institucional',
    name: 'UFMA Institucional (Vinho & Dourado)',
    description: 'Identidade oficial UFMA 2024 — ideal para apresentações acadêmicas e PROFCOMP-MA.',
    colors: ['#FAF7F2', '#8D0333', '#D4B277'],
    promptInstruction:
      'use rigorosamente a paleta institucional UFMA 2024: fundo marfim #FAF7F2, vinho institucional #8D0333 (títulos e destaque principal) e dourado sóbrio #D4B277 (detalhes e divisórias) em todos os slides.',
  },
];

export const SLIDE_TYPOGRAPHY_OPTIONS: SlideTypographyOption[] = [
  {
    id: 'editorial_serif_sans',
    name: 'Editorial Clássico (Padrão do Modelo)',
    displayFont: 'Playfair Display / Cormorant / DM Serif',
    bodyFont: 'Inter / Manrope',
    promptInstruction:
      '1 serifada elegante para títulos (ex.: Playfair Display, Cormorant, DM Serif) + 1 sans-serif limpa para o texto (ex.: Inter, Manrope). Títulos grandes, com contraste forte de tamanho e peso.',
  },
  {
    id: 'swiss_modern',
    name: 'Suíço Contemporâneo (Keynote)',
    displayFont: 'Plus Jakarta Sans / Neue Haas',
    bodyFont: 'Inter / DM Sans',
    promptInstruction:
      '1 sans-serif geométrica de alto impacto para títulos (ex.: Plus Jakarta Sans ou DM Sans em peso bold/semibold) + 1 sans-serif neutra de alta legibilidade para o corpo (ex.: Inter). Títulos grandes, com contraste forte de tamanho e peso.',
  },
  {
    id: 'literary_magazine',
    name: 'Revista Literária',
    displayFont: 'Fraunces / Instrument Serif',
    bodyFont: 'Source Sans 3 / Inter',
    promptInstruction:
      '1 serifada editorial contemporânea para títulos (ex.: Fraunces ou Instrument Serif) + 1 sans-serif humanista para corpo (ex.: Source Sans 3 ou Inter). Títulos grandes, com contraste forte de tamanho e peso.',
  },
  {
    id: 'tech_precision',
    name: 'Precisão Técnica & Computação',
    displayFont: 'Space Grotesk / Sora',
    bodyFont: 'Inter + JetBrains Mono (dados/código)',
    promptInstruction:
      '1 sans-serif moderna para títulos (ex.: Space Grotesk ou Sora) + Inter para corpo + JetBrains Mono apenas para códigos, métricas e rótulos técnicos. Títulos grandes, com contraste forte de tamanho e peso.',
  },
];

export const SLIDE_AESTHETIC_PROFILES: Record<
  SlidePromptConfig['aestheticStyle'],
  { label: string; persona: string; aestheticLine: string }
> = {
  editorial_minimalista: {
    label: 'Editorial Minimalista (Apple / Kinfolk / Monocle — Modelo Original)',
    persona:
      'Você é diretor de arte e designer de apresentações sênior, com o padrão visual de keynotes da Apple, relatórios anuais de marcas de luxo e editoriais da Kinfolk/Monocle. Crie uma apresentação de slides com design premium.',
    aestheticLine:
      'minimalista, editorial e sofisticada. Muito espaço em branco (negative space), nada de poluição visual.',
  },
  ludico_editorial: {
    label: 'Editorial Lúdico & Acolhedor (Ideal para Ed. Infantil / EF Anos Iniciais)',
    persona:
      'Você é diretor de arte editorial especializado em design educacional infantil de alto padrão (como livros ilustrados premiados e editoriais pedagógicos contemporâneos). Crie uma apresentação de slides visualmente encantadora, limpa e com design premium.',
    aestheticLine:
      'editorial acolhedora, leve e organizada. Muito espaço em branco (negative space), leitura intuitiva para a faixa etária e zero poluição visual.',
  },
  tecnico_moderno: {
    label: 'Keynote Tecnológico & Profissional (Ideal para Ensino Técnico / Computação)',
    persona:
      'Você é diretor de arte e designer de apresentações sênior, com o padrão visual de keynotes da Apple, conferências de tecnologia e relatórios de design da Stripe/Linear. Crie uma apresentação de slides com design premium.',
    aestheticLine:
      'minimalista, contemporânea e precisa. Muito espaço em branco (negative space), foco em clareza visual e nada de poluição.',
  },
  cientifico_clean: {
    label: 'Editorial Científico & Visual (Ideal para Ciências da Natureza e Matemática)',
    persona:
      'Você é diretor de arte e designer de apresentações sênior com o padrão editorial da National Geographic, Quanta Magazine e keynotes da Apple. Crie uma apresentação de slides didática com design premium.',
    aestheticLine:
      'minimalista, editorial e rigorosa. Muito espaço em branco (negative space), destaque para dados e fotografia científica real, sem poluição visual.',
  },
};

export const RESOURCE_TEMPLATES: ResourceTemplate[] = [
  // ==================== 1. RECURSOS DIDÁTICOS ====================
  {
    id: 'plano_aula',
    category: 'didaticos',
    name: 'Plano de Aula Completo (BNCC)',
    shortName: 'Plano de Aula',
    description:
      'Estrutura completa com objetivos, sensibilização, desenvolvimento passo a passo, mediação docente, recursos e avaliação formativa.',
    badge: 'Mais usado',
    persona:
      'Você é um(a) especialista sênior em Design Instrucional, Didática e Currículo Brasileiro (BNCC e CNCT), com ampla experiência prática em sala de aula.',
    outputDeliverables: [
      'Cabeçalho pedagógico completo (Etapa, Ano/Módulo, Componente, Duração, Habilidades BNCC/CNCT)',
      'Objetivos de aprendizagem claros e mensuráveis alinhados à Taxonomia de Bloom',
      'Roteiro cronometrado por momentos da aula (Sensibilização/Acolhida, Desenvolvimento/Prática Guiada, Sistematização e Fechamento)',
      'Perguntas disparadoras e estratégias de mediação docente',
      'Lista de recursos didáticos (incluindo alternativa de baixo custo/offline)',
      'Estratégia de avaliação formativa e evidências de aprendizagem esperadas',
    ],
    specificFields: [
      {
        key: 'numAulas',
        label: 'Quantidade de aulas e duração',
        type: 'text',
        placeholder: 'Ex.: 2 aulas de 50 minutos',
        defaultValue: '',
      },
      {
        key: 'recursosDisponiveis',
        label: 'Infraestrutura e recursos disponíveis',
        type: 'chips',
        chipOptions: SCHOOL_INFRASTRUCTURE_RESOURCES,
        defaultValue: [],
      },
      {
        key: 'incluirAtividadeSala',
        label: 'Incluir atividade prática pronta para aplicar na aula',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'sequencia_didatica',
    category: 'didaticos',
    name: 'Sequência Didática Multiaulas',
    shortName: 'Sequência Didática',
    description:
      'Planejamento encadeado de várias aulas com progressão cognitiva, diagnóstico inicial, oficinas práticas e produto final.',
    persona:
      'Você é um(a) coordenador(a) pedagógico(a) e especialista em sequências didáticas investigativas e progressão da aprendizagem na Educação Básica e Técnica.',
    outputDeliverables: [
      'Visão geral da sequência didática, justificativa e competências mobilizadas',
      'Mapa de progressão das aulas (tabela resumo com objetivo, atividade e evidência por aula)',
      'Detalhamento passo a passo de cada aula da sequência',
      'Descrição do produto final ou culminância dos estudantes',
      'Instrumento de avaliação processual ao longo das etapas',
    ],
    specificFields: [
      {
        key: 'totalAulas',
        label: 'Número total de aulas / encontros',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: 5 aulas, 10 encontros (1 bimestre)...',
        options: [
          { value: '3 aulas', label: '3 aulas (curta)' },
          { value: '4 aulas (2 semanas)', label: '4 aulas (2 semanas)' },
          { value: '6 aulas (3 semanas)', label: '6 aulas (3 semanas)' },
          { value: '8 aulas (1 mês)', label: '8 aulas (1 mês)' },
        ],
      },
      {
        key: 'produtoFinal',
        label: 'Produto final esperado dos estudantes (opcional)',
        type: 'select',
        optional: true,
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Descreva outro produto final esperado...',
        options: [
          { value: 'Apresentação oral / Seminário em grupo', label: 'Apresentação oral / Seminário em grupo' },
          { value: 'Cartaz científico, mural ou infográfico', label: 'Cartaz científico, mural ou infográfico' },
          { value: 'Podcast, vídeo curto ou documentário', label: 'Podcast, vídeo curto ou documentário' },
          { value: 'Protótipo, maquete ou experimento prático', label: 'Protótipo, maquete ou experimento prático' },
          { value: 'Produção textual (jornal, livreto, dossiê ou relatório)', label: 'Produção textual (jornal, livreto ou relatório)' },
          { value: 'Aplicativo, código-fonte, site ou jogo didático', label: 'Aplicativo, código-fonte, site ou jogo didático' },
          { value: 'Feira, mostra cultural ou intervenção comunitária', label: 'Feira, mostra cultural ou intervenção comunitária' },
        ],
      },
      {
        key: 'articulacaoInterdisciplinar',
        label: 'Articulação interdisciplinar (opcional)',
        type: 'text',
        placeholder: 'Ex.: Integrar Matemática com Ciências ou Português com Computação',
        defaultValue: '',
      },
    ],
  },
  {
    id: 'roteiro_aula',
    category: 'didaticos',
    name: 'Roteiro de Aula / Atividade Prática',
    shortName: 'Roteiro de Atividade',
    description:
      'Guia operacional direto para condução de oficina, laboratório, prática em grupo ou roteiro impresso para o estudante.',
    persona:
      'Você é um(a) professor(a) autor(a) especialista em oficinas práticas, metodologias mão na massa e roteiros didáticos claros para estudantes.',
    outputDeliverables: [
      'Instruções passo a passo em linguagem direta para o estudante',
      'Organização dos grupos/papéis e gerenciamento do tempo por bloco',
      'Desafio prático principal e critérios de conclusão',
      'Dicas de mediação e possíveis dúvidas dos alunos (Guia rápido do professor)',
    ],
    specificFields: [
      {
        key: 'formatoAgrupamento',
        label: 'Formato de trabalho dos alunos',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Assembleia, roda de conversa, monitoria...',
        options: [
          { value: 'Individual', label: 'Individual' },
          { value: 'Em duplas', label: 'Em duplas' },
          { value: 'Grupos de 3 a 4 estudantes', label: 'Grupos de 3 a 4 estudantes' },
          { value: 'Estações rotativas', label: 'Estações rotativas' },
        ],
      },
      {
        key: 'ambientePratica',
        label: 'Ambiente da prática',
        type: 'text',
        placeholder: 'Ex.: Sala de aula comum, laboratório de informática, pátio, biblioteca...',
        defaultValue: '',
      },
    ],
  },
  {
    id: 'apostila_guia',
    category: 'didaticos',
    name: 'Apostila / Guia de Estudo',
    shortName: 'Apostila / Guia',
    description:
      'Material textual didático completo com explicação acessível, exemplos do cotidiano brasileiro, glossário e exercícios de fixação.',
    persona:
      'Você é um(a) autor(a) de materiais didáticos e editor(a) pedagógico(a), especialista em transposição didática clara, rigorosa e envolvente.',
    outputDeliverables: [
      'Texto-base estruturado com subtítulos claros e linguagem adequada à faixa etária',
      'Boxes didáticos ("Para refletir", "Na prática / Cotidiano", "Atenção aos erros comuns")',
      'Glossário de termos-chave essenciais do tema',
      'Resumo esquemático / mapa conceitual em texto para revisão rápida',
      'Série de exercícios de fixação progressivos com gabarito ao final',
    ],
    specificFields: [
      {
        key: 'extensaoMaterial',
        label: 'Extensão aproximada do guia',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: 8 páginas com estudos de caso...',
        options: [
          { value: 'Curta (1 página — ficha de estudo)', label: 'Curta (1 página — ficha resumo)' },
          { value: 'Média (2 a 3 páginas equivalentes)', label: 'Média (2 a 3 páginas)' },
          { value: 'Completa (4 a 6 páginas — capítulo de apostila)', label: 'Completa (4 a 6 páginas)' },
        ],
      },
      {
        key: 'qtdExercicios',
        label: 'Quantidade de exercícios de fixação ao final',
        type: 'text',
        placeholder: 'Ex.: 5 questões (3 objetivas e 2 subjetivas)',
        defaultValue: '',
      },
    ],
  },

  // ==================== 2. AVALIAÇÕES E RUBRICAS ====================
  {
    id: 'prova_avaliacao',
    category: 'avaliacoes',
    name: 'Prova / Avaliação Formal',
    shortName: 'Prova Formal',
    description:
      'Avaliação contextualizada com equilíbrio de dificuldade, questões objetivas e subjetivas alinhadas à BNCC e gabarito separado.',
    persona:
      'Você é um(a) especialista em Avaliação Educacional, Psicometria Escolar e elaboração de itens alinhados à BNCC.',
    outputDeliverables: [
      'Cabeçalho formal da avaliação (Escola, Turma, Data, Instruções ao estudante e Pontuação)',
      'Questões contextualizadas com situações-problema, textos-base curtos ou dados reais',
      'Distribuição equilibrada entre níveis fácil, médio e desafiador',
      'Alternativas com distratores pedagogicamente plausíveis (sem pegadinhas ambíguas)',
      'Matriz de referência (questão × habilidade BNCC × nível cognitivo) e gabarito comentado ao final',
    ],
    specificFields: [
      {
        key: 'qtdObjetivas',
        label: 'Questões objetivas (múltipla escolha)',
        type: 'number',
        placeholder: 'Ex.: 6',
        defaultValue: '',
      },
      {
        key: 'qtdDiscursivas',
        label: 'Questões subjetivas / discursivas (abertas)',
        type: 'number',
        placeholder: 'Ex.: 4',
        defaultValue: '',
      },
      {
        key: 'estiloItens',
        label: 'Estilo e referência das questões',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Olimpíada de Matemática (OBMEP), vestibular local...',
        options: [
          { value: 'Contextualizado (padrão BNCC / SAEB)', label: 'Contextualizado (BNCC / SAEB)' },
          { value: 'Contextualizado (padrão BNCC / ENEM)', label: 'Contextualizado (BNCC / ENEM)' },
          { value: 'Direto e objetivo (verificação conceitual)', label: 'Direto e objetivo (conceitual)' },
          { value: 'Prático / Estudo de caso técnico (EPT)', label: 'Prático / Técnico-profissionalizante' },
          { value: 'Diagnóstico (sondagem de conhecimentos prévios)', label: 'Diagnóstico / Sondagem' },
        ],
      },
      {
        key: 'valorTotal',
        label: 'Valor total da prova',
        type: 'text',
        placeholder: 'Ex.: 10,0 pontos',
        defaultValue: '',
      },
    ],
  },
  {
    id: 'banco_questoes',
    category: 'avaliacoes',
    name: 'Banco de Questões Comentadas',
    shortName: 'Banco de Questões',
    description:
      'Coleção de itens categorizados por nível cognitivo com análise pedagógica das respostas, critérios de correção e distratores.',
    persona:
      'Você é um(a) elaborador(a) de itens avaliativos especialista em análise de distratores, questões subjetivas e diagnóstico de lacunas de aprendizagem.',
    outputDeliverables: [
      'Lista de questões numeradas com indicação de dificuldade e habilidade BNCC/CNCT',
      'Gabarito comentado ou expectativa de resposta detalhada para cada questão',
      'Análise pedagógica dos erros mais comuns / distratores',
      'Sugestão rápida de intervenção para as dificuldades identificadas',
    ],
    specificFields: [
      {
        key: 'quantidadeItens',
        label: 'Quantidade de questões no banco',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: 8 questões, 20 questões, 4 fáceis e 6 médias...',
        options: [
          { value: '5 questões progressivas', label: '5 questões' },
          { value: '10 questões (4 fáceis, 4 médias, 2 difíceis)', label: '10 questões (progressivas)' },
          { value: '15 questões (5 fáceis, 6 médias, 4 difíceis)', label: '15 questões (banco amplo)' },
        ],
      },
      {
        key: 'tipoQuestoes',
        label: 'Formato / tipos das questões',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Questões com tirinhas, gráficos, redação curta...',
        options: [
          { value: 'Múltipla escolha (4 ou 5 alternativas)', label: 'Múltipla escolha (objetivas)' },
          { value: 'Subjetivas / Discursivas (respostas abertas argumentativas)', label: 'Subjetivas / Discursivas (abertas)' },
          { value: 'Verdadeiro ou Falso com justificativa', label: 'Verdadeiro ou Falso com justificativa' },
          { value: 'Associação / Correspondência de colunas', label: 'Associação / Correspondência' },
          { value: 'Preenchimento de lacunas / Completar', label: 'Preenchimento de lacunas' },
          { value: 'Situação-problema / Estudo de caso contextualizado', label: 'Situação-problema / Estudo de caso' },
          { value: 'Misto (objetivas, subjetivas/discursivas e associação)', label: 'Misto (objetivas + subjetivas)' },
        ],
      },
    ],
  },
  {
    id: 'rubrica_avaliativa',
    category: 'avaliacoes',
    name: 'Rubrica Avaliativa Analítica',
    shortName: 'Rubrica Avaliativa',
    description:
      'Matriz com critérios claros, descritores observáveis por nível de desempenho e guia de feedback formativo para projetos e produções.',
    persona:
      'Você é um(a) especialista em Avaliação Formativa e Construção de Rubricas Analíticas baseadas em evidências observáveis.',
    outputDeliverables: [
      'Tabela completa da rubrica (Critérios nas linhas × Níveis de desempenho nas colunas)',
      'Descritores objetivos, observáveis e sem subjetividade vaga em cada célula',
      'Distribuição de pesos ou pontuação por critério',
      'Versão simplificada para autoavaliação do próprio estudante',
    ],
    specificFields: [
      {
        key: 'atividadeAvaliada',
        label: 'Tipo de atividade / entrega avaliada',
        type: 'text',
        placeholder: 'Ex.: Seminário oral, redação, projeto prático, código-fonte, maquete...',
        defaultValue: '',
      },
      {
        key: 'escalaNiveis',
        label: 'Escala de níveis de desempenho',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: 5 níveis (de 0 a 10)...',
        options: [
          { value: '4 níveis (Insuficiente, Em desenvolvimento, Proficiente, Avançado)', label: '4 níveis (Insuficiente → Avançado)' },
          { value: '4 níveis (Inicial, Básico, Adequado, Exemplar)', label: '4 níveis (Inicial → Exemplar)' },
          { value: '3 níveis (Não atingiu, Atingiu parcialmente, Atingiu plenamente)', label: '3 níveis (Simples)' },
        ],
      },
      {
        key: 'qtdCriterios',
        label: 'Quantidade de critérios',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: 3 critérios ou 8 critérios...',
        options: [
          { value: '4 critérios avaliativos', label: '4 critérios' },
          { value: '5 critérios avaliativos', label: '5 critérios' },
          { value: '6 critérios avaliativos', label: '6 critérios' },
        ],
      },
    ],
  },
  {
    id: 'gabarito_devolutiva',
    category: 'avaliacoes',
    name: 'Gabarito Comentado e Devolutiva Formativa',
    shortName: 'Gabarito & Devolutiva',
    description:
      'Gera chaves de correção, expectativas de resposta, mapa de erros frequentes e sugestões de recomposição da aprendizagem.',
    persona:
      'Você é um(a) especialista em Avaliação para a Aprendizagem e Recomposição Escolar, focado(a) em devolutivas construtivas.',
    outputDeliverables: [
      'Padrão de resposta esperada (integral e parcial) para cada questão ou critério',
      'Mapeamento dos erros mais comuns dos estudantes e suas possíveis causas',
      'Modelos de comentários de devolutiva formativa (encorajadores e objetivos)',
      'Sugestão de atividade rápida de recomposição/reforço para quem teve dificuldade',
    ],
    specificFields: [
      {
        key: 'questoesBase',
        label: 'Cole aqui as questões ou descreva a atividade a corrigir',
        type: 'textarea',
        placeholder: 'Cole os enunciados das questões ou descreva brevemente a tarefa avaliada...',
        defaultValue: '',
      },
    ],
  },

  // ==================== 3. DOCUMENTOS PEDAGÓGICOS ====================
  {
    id: 'pei_adaptacao',
    category: 'documentais',
    name: 'PEI / Adaptação Curricular Inclusiva',
    shortName: 'PEI / Inclusão',
    description:
      'Plano Educacional Individualizado ético e prático com mapeamento de potencialidades, barreiras, adaptações DUA e metas bimestrais.',
    badge: 'Proteção LGPD',
    isDocumentWithPrivacy: true,
    persona:
      'Você é um(a) especialista em Educação Especial na Perspectiva da Educação Inclusiva, Atendimento Educacional Especializado (AEE) e Desenho Universal para a Aprendizagem (DUA).',
    outputDeliverables: [
      'Identificação anonimizada e síntese das potencialidades, interesses e barreiras de acesso',
      'Objetivos prioritários adaptados a partir da BNCC/CNCT (sem infantilizar ou empobrecer o currículo)',
      'Estratégias de flexibilização (acesso, metodologia, temporalidade, recursos e avaliação)',
      'Metas de curto e médio prazo com indicadores observáveis de acompanhamento',
      'Orientações de articulação entre professor regente, AEE e família',
    ],
    specificFields: [
      {
        key: 'perfilEstudante',
        label: 'Perfil e necessidades educacionais (SEM nome real — use "Estudante A")',
        type: 'textarea',
        placeholder: 'Ex.: Estudante A, 7º ano, diagnóstico de TEA nível 1 e sensibilidade auditiva; forte interesse em tecnologia e mapas visuais; dificuldade em textos longos sem mediação.',
        defaultValue: '',
        helperText: 'LGPD: Nunca insira nome completo, CPF ou dados pessoais sensíveis do estudante.',
      },
      {
        key: 'periodoVigencia',
        label: 'Período de acompanhamento',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Ano letivo completo, 6 semanas...',
        options: [
          { value: '1 Bimestre (com revisão intermediária)', label: '1 Bimestre' },
          { value: '1 Trimestre', label: '1 Trimestre' },
          { value: '1 Semestre letivo', label: '1 Semestre' },
        ],
      },
    ],
  },
  {
    id: 'relatorio_parecer',
    category: 'documentais',
    name: 'Relatório Descritivo / Parecer Pedagógico',
    shortName: 'Relatório / Parecer',
    description:
      'Redação ética, acolhedora e baseada em evidências de desenvolvimento cognitivo, socioemocional e encaminhamentos pedagógicos.',
    badge: 'Proteção LGPD',
    isDocumentWithPrivacy: true,
    persona:
      'Você é um(a) pedagogo(a) e orientador(a) educacional especialista em escrita de pareceres descritivos éticos, livres de rótulos e fundamentados em evidências observáveis.',
    outputDeliverables: [
      'Texto descritivo fluido e respeitoso estruturado por dimensões (Cognitiva/Aprendizagem, Socioemocional/Interação, Autonomia)',
      'Destaque inicial para avanços e potencialidades observadas no período',
      'Descrição construtiva dos aspectos em desenvolvimento (sem linguagem estigmatizante)',
      'Mediações realizadas pela escola e recomendações práticas de parceria com a família',
    ],
    specificFields: [
      {
        key: 'tipoParecer',
        label: 'Tipo de relatório / parecer',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Relatório de projeto, conselho participativo...',
        options: [
          { value: 'Parecer Descritivo Individual (Bimestral/Trimestral)', label: 'Parecer Individual (Bimestral/Trimestral)' },
          { value: 'Relatório Pedagógico da Turma (Diagnóstico / Conselho de Classe)', label: 'Relatório Coletivo da Turma' },
          { value: 'Relatório de Acompanhamento para Equipe Multiprofissional', label: 'Encaminhamento Multiprofissional' },
        ],
      },
      {
        key: 'evidenciasObservadas',
        label: 'Evidências e observações-chave (use apelido/código ex.: "Estudante X")',
        type: 'textarea',
        placeholder: 'Ex.: Participa bem de atividades práticas em dupla, evoluiu na interpretação de gráficos, ainda precisa de apoio para organizar prazos e revisar escrita...',
        defaultValue: '',
        helperText: 'LGPD: Insira apenas observações pedagógicas anonimizadas.',
      },
    ],
  },
  {
    id: 'projeto_pedagogico',
    category: 'documentais',
    name: 'Projeto Pedagógico Interdisciplinar',
    shortName: 'Projeto Pedagógico',
    description:
      'Documento formal de projeto escolar ou integrador com justificativa, problema norteador, cronograma, áreas envolvidas e culminância.',
    persona:
      'Você é um(a) gestor(a) e articulador(a) pedagógico(a) especialista em elaboração de projetos interdisciplinares escolares e projetos integradores da EPT.',
    outputDeliverables: [
      'Título criativo, Tema Gerador e Problema Norteador',
      'Justificativa pedagógica e relevância social/comunitária',
      'Objetivo geral e objetivos específicos articulados às Competências Gerais da BNCC',
      'Matriz de integração entre os componentes curriculares participantes',
      'Cronograma por etapas, recursos necessários, evento de culminância e avaliação do projeto',
    ],
    specificFields: [
      {
        key: 'componentesEnvolvidos',
        label: 'Componentes / Áreas integradas',
        type: 'text',
        placeholder: 'Ex.: Ciências, Geografia, Língua Portuguesa e Computação',
        defaultValue: '',
      },
      {
        key: 'duracaoProjeto',
        label: 'Duração do projeto',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: 2 semanas, 1 trimestre, ano letivo...',
        options: [
          { value: '1 mês (4 semanas)', label: '1 mês (4 semanas)' },
          { value: '1 Bimestre (8 semanas)', label: '1 Bimestre (8 semanas)' },
          { value: '1 Semestre letivo', label: '1 Semestre letivo' },
        ],
      },
    ],
  },
  {
    id: 'documento_institucional',
    category: 'documentais',
    name: 'Documento Institucional (Ata, Ofício ou Comunicado)',
    shortName: 'Ata / Ofício / Comunicado',
    description:
      'Redação formal ou acolhedora para rotina escolar: Atas de Conselho/Reunião, Ofícios, Comunicados às Famílias e Encaminhamentos.',
    isDocumentWithPrivacy: true,
    persona:
      'Você é um(a) especialista em Redação Oficial Escolar, Gestão Pedagógica e Comunicação Institucional na Educação Básica e Técnica.',
    outputDeliverables: [
      'Estrutura padronizada adequada ao gênero documental escolhido (cabeçalho, corpo, encaminhamentos e fechamento/assinaturas)',
      'Linguagem clara, objetiva, impessoal (quando oficial) ou acolhedora (quando destinado às famílias)',
      'Campos marcáveis entre colchetes [EXEMPLO] para preenchimento rápido de dados reais fora da IA',
    ],
    specificFields: [
      {
        key: 'subtipoDocumento',
        label: 'Tipo de documento institucional',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Memorando, Declaração, Convite para evento...',
        options: [
          { value: 'Ata de Reunião Pedagógica / Conselho de Classe', label: 'Ata de Reunião / Conselho de Classe' },
          { value: 'Ofício Institucional (Direção / Secretaria / Parceiros)', label: 'Ofício Institucional' },
          { value: 'Comunicado Escolar às Famílias / Responsáveis', label: 'Comunicado às Famílias' },
          { value: 'Termo / Autorização para Atividade Pedagógica', label: 'Autorização / Circular Escolar' },
        ],
      },
      {
        key: 'pontosPrincipais',
        label: 'Pauta, deliberações ou informações essenciais',
        type: 'textarea',
        placeholder: 'Liste os tópicos principais, datas, encaminhamentos ou objetivos do documento...',
        defaultValue: '',
      },
    ],
  },

  // ==================== 4. MATERIAIS COMPLEMENTARES ====================
  {
    id: 'slides_editorial',
    category: 'complementares',
    name: 'Slides Editoriais Premium (Direção de Arte)',
    shortName: 'Slides Premium',
    description:
      'Segue fielmente o modelo de Direção de Arte Editorial (Apple Keynote / Kinfolk / Monocle): paleta, tipografia, fotografia editorial verificada, arco narrativo em 5 atos e checklist de revisão.',
    badge: 'Modelo Exclusivo',
    isFeatured: true,
    isEditorialSlides: true,
    persona: SLIDE_AESTHETIC_PROFILES.editorial_minimalista.persona,
    outputDeliverables: [
      'Prévia executiva em 5 linhas (paleta hex, fontes e roteiro de títulos)',
      'Apresentação completa slide a slide com layouts variados e máx. 25 palavras por slide',
      'Direção fotográfica editorial com sugestões de busca/fontes reais (Unsplash/Pexels) e contraste AA',
      'Notas do apresentador curtas em cada slide',
      'Auto-revisão final contra o checklist de qualidade visual',
    ],
    specificFields: [],
  },
  {
    id: 'estudo_caso',
    category: 'complementares',
    name: 'Estudo de Caso / Situação-Problema',
    shortName: 'Estudo de Caso',
    description:
      'Narrativa realista contextualizada ao cotidiano brasileiro ou profissional com dilema central, dados/pistas e roteiro de debate.',
    persona:
      'Você é um(a) especialista em Aprendizagem Baseada em Problemas (PBL) e elaboração de Estudos de Caso interdisciplinares e técnicos.',
    outputDeliverables: [
      'Narrativa envolvente e verossímil com personagens, cenário e dilema central',
      'Conjunto de dados, pistas ou evidências para análise pelos estudantes',
      'Questões norteadoras em ordem crescente de complexidade',
      'Guia do professor com possibilidades de solução e pontos de debate ético/técnico',
    ],
    specificFields: [
      {
        key: 'contextoCaso',
        label: 'Cenário do estudo de caso',
        type: 'text',
        placeholder: 'Ex.: Uma escola pública, um bairro urbano, uma startup local, uma clínica ou indústria...',
        defaultValue: '',
      },
      {
        key: 'focoDilema',
        label: 'Natureza do dilema',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Dilema histórico, jurídico, tecnológico...',
        options: [
          { value: 'Investigação científica / Resolução técnica de problema', label: 'Investigação / Resolução técnica' },
          { value: 'Dilema ético, cidadão ou socioambiental', label: 'Dilema ético / socioambiental' },
          { value: 'Tomada de decisão em gestão / projeto', label: 'Tomada de decisão / gestão' },
        ],
      },
    ],
  },
  {
    id: 'atividade_gamificada',
    category: 'complementares',
    name: 'Atividade Gamificada / Jogo Didático',
    shortName: 'Gamificação / Jogo',
    description:
      'Cria missões, escape room pedagógico, jogo de cartas ou tabuleiro didático com regras claras, narrativa envolvente e materiais imprimíveis.',
    persona:
      'Você é um(a) Game Designer Educacional especialista em gamificação significativa (não superficial) e aprendizagem lúdica alinhada à BNCC.',
    outputDeliverables: [
      'Narrativa/temática envolvente e objetivo pedagógico oculto e explícito',
      'Mecânicas de jogo, regras claras, sistema de progresso/pontuação e tempo de partida',
      'Conteúdo completo das cartas, missões, enigmas ou desafios prontos para imprimir',
      'Momento de debriefing (reflexão pedagógica pós-jogo para consolidar o aprendizado)',
    ],
    specificFields: [
      {
        key: 'mecanicaJogo',
        label: 'Formato do jogo / gamificação',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Caça ao tesouro, Bingo didático, Quiz em equipes, Gincana...',
        options: [
          { value: 'Missão / Escape Room Pedagógico em grupos', label: 'Escape Room / Missão de Enigmas' },
          { value: 'Jogo de Cartas / Quiz Estratégico imprimível', label: 'Jogo de Cartas imprimível' },
          { value: 'Trilha / Tabuleiro Didático em sala', label: 'Tabuleiro / Trilha Didática' },
          { value: 'RPG Narrativo / Simulação de Papéis', label: 'RPG Narrativo / Simulação' },
        ],
      },
      {
        key: 'temaNarrativo',
        label: 'Universo / narrativa sugerida (opcional)',
        type: 'text',
        placeholder: 'Ex.: Expedição espacial, detetives da história, laboratório secreto, startup...',
        defaultValue: '',
      },
    ],
  },
  {
    id: 'sala_invertida',
    category: 'complementares',
    name: 'Guia de Sala de Aula Invertida',
    shortName: 'Sala Invertida',
    description:
      'Combina roteiro assíncrono de preparação pré-aula (vídeo/leitura + checagem) com dinâmica presencial ativa e mão na massa.',
    persona:
      'Você é um(a) especialista em Ensino Híbrido e Sala de Aula Invertida (Flipped Classroom), com foco em autonomia estudantil e uso produtivo do tempo presencial.',
    outputDeliverables: [
      'Roteiro Pré-Aula (para o aluno estudar antes: guia de leitura/vídeo + 3 perguntas de checagem)',
      'Diagnóstico relâmpago nos primeiros 10 minutos da aula presencial',
      'Atividade presencial colaborativa de aplicação profunda',
      'Fechamento metacognitivo (bilhete de saída)',
    ],
    specificFields: [
      {
        key: 'acessoDigitalAlunos',
        label: 'Acesso dos alunos fora da escola',
        type: 'select',
        defaultValue: '',
        allowOther: true,
        otherPlaceholder: 'Ex.: Acesso no laboratório da escola no contraturno...',
        options: [
          { value: 'Acesso amplo à internet e celular/computador', label: 'Acesso amplo à internet' },
          { value: 'Acesso parcial (oferecer opção digital e opção impressa)', label: 'Acesso parcial (digital + impresso)' },
          { value: 'Sem internet em casa (100% material impresso)', label: 'Offline (100% impresso)' },
        ],
      },
    ],
  },
];

export function getTemplateById(templateId: string): ResourceTemplate {
  return RESOURCE_TEMPLATES.find((t) => t.id === templateId) ?? RESOURCE_TEMPLATES[0];
}

export function getTemplatesByCategory(category: ResourceCategoryId): ResourceTemplate[] {
  return RESOURCE_TEMPLATES.filter((t) => t.category === category);
}

export function createDefaultSlideConfig(): SlidePromptConfig {
  return {
    slideCount: '',
    slideCountCustom: '',
    audienceCustom: '',
    impactObjective: '',
    baseMaterial: '',
    aestheticStyle: 'editorial_minimalista',
    paletteId: 'auto_editorial',
    customPaletteNote: '',
    typographyId: 'editorial_serif_sans',
    maxWordsPerSlide: '',
    maxWordsCustom: '',
    includePhotographyRules: true,
    photoSources: 'Unsplash, Pexels',
    includeNarrativeArc: true,
    narrativeCustomNotes: '',
    includeFiveLinePreview: true,
    includeSpeakerNotes: true,
    includeSelfReviewChecklist: true,
    alignWithBncc: true,
  };
}

export function getDefaultSpecificValues(
  template: ResourceTemplate
): Record<string, string | boolean | string[]> {
  const result: Record<string, string | boolean | string[]> = {};
  for (const field of template.specificFields) {
    result[field.key] = Array.isArray(field.defaultValue)
      ? [...field.defaultValue]
      : field.defaultValue;
  }
  return result;
}

export function createInitialPromptState(): PromptFormState {
  return {
    category: 'didaticos',
    templateId: '',
    selectedTemplateIds: [],
    stage: '',
    yearOrTrack: '',
    component: '',
    topic: '',
    selectedExtraDocs: [],
    additionalDocuments: '',
    selectedDeviceSources: [],
    includeSourceExcerpts: true,
    bloomLevel: 'aplicar',
    methodology: '',
    tone: '',
    outputFormat: '',
    durationOrExtent: '',
    classContext: '',
    inclusionEnabled: false,
    inclusionProfiles: [],
    inclusionNotes: '',
    extraConstraints: '',
    depth: 'estruturado',
    targetAI: 'universal',
    specificValues: {},
    slideConfig: createDefaultSlideConfig(),
  };
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'demo_slides_editorial',
    label: 'Slides Editoriais (Modelo Direção de Arte)',
    subtitle: 'Ensino Médio • Biologia / Mudanças Climáticas',
    badge: 'Modelo Slides',
    category: 'complementares',
    state: {
      category: 'complementares',
      templateId: 'slides_editorial',
      selectedTemplateIds: ['slides_editorial'],
      stage: 'ensino_medio',
      yearOrTrack: '2ª série do Ensino Médio',
      component: 'Biologia (Ciências da Natureza)',
      topic: 'Transição Energética e Mudanças Climáticas no Brasil',
      selectedExtraDocs: ['enem'],
      additionalDocuments: '',
      bloomLevel: 'avaliar',
      slideConfig: {
        ...createDefaultSlideConfig(),
        slideCount: '12',
        audienceCustom: 'Estudantes da 2ª série do Ensino Médio (16–17 anos) em aula interdisciplinar',
        impactObjective:
          'Despertar senso de urgência informada, fazer compreender dados reais da matriz energética brasileira e engajar os alunos a proporem um plano de redução de desperdício na escola',
        baseMaterial:
          'Foco em: 1) O que é efeito estufa x aquecimento global; 2) Por que a matriz elétrica brasileira é majoritariamente renovável, mas o desmatamento pesa nas emissões; 3) O papel das energias solar e eólica no Nordeste; 4) Ação prática estudantil.',
        aestheticStyle: 'editorial_minimalista',
        paletteId: 'auto_editorial',
        typographyId: 'editorial_serif_sans',
        maxWordsPerSlide: '25',
        includePhotographyRules: true,
        includeNarrativeArc: true,
        includeFiveLinePreview: true,
        includeSpeakerNotes: true,
        includeSelfReviewChecklist: true,
        alignWithBncc: true,
      },
    },
  },
  {
    id: 'demo_plano_computacao',
    label: 'Plano de Aula BNCC Computação',
    subtitle: 'EF Anos Finais • 8º ano • Algoritmos',
    badge: 'Didático',
    category: 'didaticos',
    state: {
      category: 'didaticos',
      templateId: 'plano_aula',
      selectedTemplateIds: ['plano_aula'],
      stage: 'ef_anos_finais',
      yearOrTrack: '8º ano',
      component: 'Computação / Pensamento Computacional (BNCC)',
      topic: 'Decomposição de Problemas e Pensamento Algorítmico no Cotidiano',
      selectedExtraDocs: ['bncc_computacao', 'dctma'],
      additionalDocuments: '',
      bloomLevel: 'criar',
      methodology: 'Cultura Maker / Mão na Massa',
      tone: 'Didático, claro e engajador (adequado à faixa etária)',
      outputFormat: 'Documento estruturado em Markdown com títulos, tabelas e listas prontas para impressão',
      classContext: 'Turma de 32 alunos em escola pública com acesso limitado ao laboratório de informática.',
      inclusionEnabled: true,
      inclusionProfiles: [
        'Desenho Universal para a Aprendizagem (DUA — múltiplos meios de representação e expressão)',
      ],
      specificValues: {
        numAulas: '2 aulas de 50 minutos',
        recursosDisponiveis: [
          'Quadro e papel',
          'Sem internet em sala',
          'Papel cartão e post-its (atividade desplugada)',
        ],
        incluirAtividadeSala: true,
      },
    },
  },
  {
    id: 'demo_prova_tecnico',
    label: 'Avaliação',
    subtitle: 'Médio Técnico • Banco de Dados e SQL',
    badge: 'Avaliação',
    category: 'avaliacoes',
    state: {
      category: 'avaliacoes',
      templateId: 'prova_avaliacao',
      selectedTemplateIds: ['prova_avaliacao'],
      stage: 'ensino_tecnico',
      yearOrTrack: 'Médio Técnico Integrado — 2º ano',
      component: 'Banco de Dados e Análise de Dados',
      topic: 'Modelagem Relacional (DER), Chaves Primárias/Estrangeiras e Consultas SQL SELECT/JOIN',
      selectedExtraDocs: ['bncc_computacao'],
      additionalDocuments: 'Projeto Pedagógico do Curso Técnico em Informática / Desenvolvimento de Sistemas',
      bloomLevel: 'aplicar',
      tone: 'Profissional e orientado ao mercado (ideal para Ensino Técnico)',
      outputFormat: 'Documento estruturado em Markdown com títulos, tabelas e listas prontas para impressão',
      specificValues: {
        qtdObjetivas: '6',
        qtdDiscursivas: '3',
        estiloItens: 'Prático / Estudo de caso técnico (EPT)',
        valorTotal: '10,0 pontos',
      },
    },
  },
  {
    id: 'demo_eja_financas',
    label: 'Estudo de Caso EJA',
    subtitle: 'EJA • Matemática Aplicada e Orçamento',
    badge: 'EJA',
    category: 'complementares',
    state: {
      category: 'complementares',
      templateId: 'estudo_caso',
      selectedTemplateIds: ['estudo_caso'],
      stage: 'eja',
      yearOrTrack: 'EJA — 2º Segmento (Ensino Fundamental Anos Finais — Fases/Etapas)',
      component: 'Matemática Aplicada ao Cotidiano e Finanças',
      topic: 'Juros, Porcentagens e Planejamento do Orçamento Familiar',
      selectedExtraDocs: ['dctma'],
      additionalDocuments: 'Código de Defesa do Consumidor (artigos básicos sobre juros e compras parceladas)',
      bloomLevel: 'avaliar',
      methodology: 'Estudo de Caso e Debate Estruturado',
      tone: 'Didático, claro e engajador (adequado à faixa etária)',
      classContext:
        'Turma noturna da EJA composta por trabalhadores adultos entre 22 e 55 anos; evitar qualquer linguagem infantilizada.',
      specificValues: {
        contextoCaso: 'Compra de um eletrodoméstico essencial por uma família trabalhadora brasileira',
        focoDilema: 'Tomada de decisão em gestão / projeto',
      },
    },
  },
  {
    id: 'demo_pei_inclusivo',
    label: 'PEI Inclusivo com DUA (LGPD)',
    subtitle: 'EF Anos Iniciais • 4º ano • Matemática',
    badge: 'Documental',
    category: 'documentais',
    state: {
      category: 'documentais',
      templateId: 'pei_adaptacao',
      selectedTemplateIds: ['pei_adaptacao'],
      stage: 'ef_anos_iniciais',
      yearOrTrack: '4º ano',
      component: 'Matemática',
      topic: 'Resolução de Problemas com Multiplicação e Material Concreto',
      selectedExtraDocs: ['lbi'],
      additionalDocuments: '',
      bloomLevel: 'compreender',
      tone: 'Acolhedor, empático e construtivo (ideal para pareceres e famílias)',
      inclusionEnabled: true,
      inclusionProfiles: [
        'Desenho Universal para a Aprendizagem (DUA — múltiplos meios de representação e expressão)',
        'TEA (Transtorno do Espectro Autista — previsibilidade, comandos literais e apoio visual)',
      ],
      specificValues: {
        perfilEstudante:
          'Estudante A (9 anos), TEA nível 1 de suporte. Demonstra grande interesse por blocos de montar e padrões visuais; apresenta sobrecarga diante de enunciados extensos e ambientes ruidosos.',
        periodoVigencia: '1 Bimestre (com revisão intermediária)',
      },
    },
  },
];
