import type { BloomLevelId, BnccSkill, EducationStage, EducationStageId } from '../types/prompt';

const BNCC_COMPUTACAO_EIXOS_ATE_9ANO = [
  'Computação / Pensamento Computacional (BNCC)',
  'Computação / Mundo Digital (BNCC)',
  'Computação / Cultura Digital (BNCC)',
];

const BNCC_COMPUTACAO_COMPETENCIAS_EM = [
  'Computação (BNCC EM - C1): Possibilidades e limites da Computação',
  'Computação (BNCC EM - C2): Análise crítica, privacidade e segurança digital',
  'Computação (BNCC EM - C3): Técnicas computacionais para problemas contemporâneos',
  'Computação (BNCC EM - C4): Criação de conteúdos e artefatos computacionais',
  'Computação (BNCC EM - C5): Projetos investigativos e decisões éticas',
  'Computação (BNCC EM - C6): Expressão e partilha em mídias e tecnologias',
  'Computação (BNCC EM - C7): Autonomia, cidadania e responsabilidade digital',
];

export const EDUCATION_STAGES: EducationStage[] = [
  {
    id: 'educacao_infantil',
    label: 'Educação Infantil',
    shortLabel: 'Ed. Infantil',
    badge: 'BNCC • Campos de Experiência',
    referenceLabel: 'Campos de Experiência e Objetivos de Aprendizagem e Desenvolvimento (BNCC)',
    officialDocument:
      'Base Nacional Comum Curricular — BNCC (MEC, Etapa da Educação Infantil: Direitos de Aprendizagem, Campos de Experiência e Objetivos de Aprendizagem e Desenvolvimento)',
    officialDocumentUrl: 'https://basenacionalcomum.mec.gov.br/',
    yearsOrTracks: [
      'Bebês (0 a 1 ano e 6 meses)',
      'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)',
      'Crianças pequenas (4 anos a 5 anos e 11 meses)',
    ],
    components: [
      'O eu, o outro e o nós',
      'Corpo, gestos e movimentos',
      'Traços, sons, cores e formas',
      'Escuta, fala, pensamento e imaginação',
      'Espaços, tempos, quantidades, relações e transformações',
      ...BNCC_COMPUTACAO_EIXOS_ATE_9ANO,
    ],
  },
  {
    id: 'ef_anos_iniciais',
    label: 'Ensino Fundamental — Anos Iniciais',
    shortLabel: 'EF Anos Iniciais',
    badge: 'BNCC • 1º ao 5º ano',
    referenceLabel: 'Competências e Habilidades BNCC — Ensino Fundamental (Anos Iniciais)',
    officialDocument:
      'Base Nacional Comum Curricular — BNCC (MEC, Etapa do Ensino Fundamental — Anos Iniciais: Competências Gerais, Competências Específicas e Habilidades)',
    officialDocumentUrl: 'https://basenacionalcomum.mec.gov.br/',
    yearsOrTracks: ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'],
    components: [
      'Língua Portuguesa',
      'Matemática',
      'Ciências',
      'História',
      'Geografia',
      'Arte',
      'Educação Física',
      'Ensino Religioso',
      ...BNCC_COMPUTACAO_EIXOS_ATE_9ANO,
      'Projeto Interdisciplinar',
    ],
  },
  {
    id: 'ef_anos_finais',
    label: 'Ensino Fundamental — Anos Finais',
    shortLabel: 'EF Anos Finais',
    badge: 'BNCC • 6º ao 9º ano',
    referenceLabel: 'Competências e Habilidades BNCC — Ensino Fundamental (Anos Finais)',
    officialDocument:
      'Base Nacional Comum Curricular — BNCC (MEC, Etapa do Ensino Fundamental — Anos Finais: Competências Gerais, Competências Específicas e Habilidades)',
    officialDocumentUrl: 'https://basenacionalcomum.mec.gov.br/',
    yearsOrTracks: ['6º ano', '7º ano', '8º ano', '9º ano'],
    components: [
      'Língua Portuguesa',
      'Matemática',
      'Ciências',
      'História',
      'Geografia',
      'Língua Inglesa',
      'Arte',
      'Educação Física',
      'Ensino Religioso',
      ...BNCC_COMPUTACAO_EIXOS_ATE_9ANO,
      'Projeto Interdisciplinar',
    ],
  },
  {
    id: 'ensino_medio',
    label: 'Ensino Médio Regular',
    shortLabel: 'Médio Regular',
    badge: 'BNCC • 1ª a 3ª série',
    referenceLabel: 'Competências e Habilidades BNCC — Ensino Médio',
    officialDocument:
      'Base Nacional Comum Curricular — BNCC (MEC, Etapa do Ensino Médio: Competências Gerais, Competências Específicas da Área e Habilidades)',
    officialDocumentUrl: 'https://basenacionalcomum.mec.gov.br/',
    yearsOrTracks: [
      '1ª série do Ensino Médio',
      '2ª série do Ensino Médio',
      '3ª série do Ensino Médio',
      'Itinerário Formativo / Eletiva',
    ],
    components: [
      'Linguagens e suas Tecnologias (Língua Portuguesa / Literatura)',
      'Língua Inglesa / Espanhola',
      'Arte / Educação Física',
      'Matemática e suas Tecnologias',
      'Física (Ciências da Natureza)',
      'Química (Ciências da Natureza)',
      'Biologia (Ciências da Natureza)',
      'História (Ciências Humanas)',
      'Geografia (Ciências Humanas)',
      'Filosofia / Sociologia',
      'Projeto de Vida',
      ...BNCC_COMPUTACAO_COMPETENCIAS_EM,
    ],
  },
  {
    id: 'ensino_tecnico',
    label: 'Ensino Médio Técnico',
    shortLabel: 'Médio Técnico',
    badge: 'BNCC + CNCT • EPT',
    referenceLabel: 'BNCC do Ensino Médio Integrada ao Catálogo Nacional de Cursos Técnicos (CNCT)',
    officialDocument:
      'BNCC do Ensino Médio (MEC) integrada ao Catálogo Nacional de Cursos Técnicos (CNCT — MEC) e às Diretrizes Curriculares Nacionais Gerais para a Educação Profissional e Tecnológica (DCNEPT)',
    officialDocumentUrl: 'https://cnct.mec.gov.br/',
    yearsOrTracks: [
      'Médio Técnico Integrado — 1º ano',
      'Médio Técnico Integrado — 2º ano',
      'Médio Técnico Integrado — 3º ano',
      'Médio Técnico Integrado — 4º ano',
      'Técnico Concomitante / Subsequente — Módulo I',
      'Técnico Concomitante / Subsequente — Módulo II',
      'Técnico Concomitante / Subsequente — Módulo III',
    ],
    components: [
      'Informática / Desenvolvimento de Sistemas',
      'Redes de Computadores e Segurança da Informação',
      'Banco de Dados e Análise de Dados',
      'Eletrônica / Automação Industrial / Mecatrônica',
      'Administração / Gestão e Negócios',
      'Enfermagem / Saúde e Segurança do Trabalho',
      'Agropecuária / Meio Ambiente',
      'Logística / Edificações / Eletrotécnica',
      'Empreendedorismo e Inovação Tecnológica',
      'Prática Profissional / Projeto Integrador',
      ...BNCC_COMPUTACAO_COMPETENCIAS_EM,
    ],
  },
  {
    id: 'eja',
    label: 'EJA — Educação de Jovens e Adultos',
    shortLabel: 'EJA',
    badge: 'BNCC • EJA / Andragogia',
    referenceLabel: 'Habilidades BNCC contextualizadas para a Educação de Jovens e Adultos (EJA)',
    officialDocument:
      'Base Nacional Comum Curricular — BNCC (MEC) articulada às Diretrizes Operacionais e Curriculares Nacionais para a Educação de Jovens e Adultos (Resolução CNE/CEB nº 1/2021)',
    officialDocumentUrl: 'https://basenacionalcomum.mec.gov.br/',
    yearsOrTracks: [
      'EJA — 1º Segmento (Alfabetização e Anos Iniciais)',
      'EJA — 2º Segmento (Ensino Fundamental Anos Finais — Fases/Etapas)',
      'EJA — Ensino Médio (Etapa I / II / III)',
      'PROEJA — EJA Integrada à Educação Profissional',
    ],
    components: [
      'Língua Portuguesa e Letramento Social',
      'Matemática Aplicada ao Cotidiano e Finanças',
      'Ciências da Natureza e Saúde',
      'História, Cidadania e Mundo do Trabalho',
      'Geografia e Território Local',
      'Língua Inglesa / Espanhola',
      'Arte e Cultura Popular',
      'Projeto de Vida e Mundo do Trabalho',
      ...BNCC_COMPUTACAO_COMPETENCIAS_EM,
    ],
  },
];

export const OPTIONAL_REFERENCE_DOCUMENTS: {
  id: string;
  label: string;
  fullReference: string;
  onlyStages?: EducationStageId[];
}[] = [
  {
    id: 'bncc_computacao',
    label: 'BNCC Computação (Res. CNE/CEB nº 1/2022)',
    fullReference:
      'Normas sobre Computação na Educação Básica — Complemento à BNCC (Resolução CNE/CEB nº 1/2022) e PNED (Lei nº 14.533/2023)',
  },
  {
    id: 'dctma',
    label: 'DCTMA (Currículo do Maranhão)',
    fullReference:
      'Documento Curricular do Território Maranhense (DCTMA — Educação Infantil, Ensino Fundamental e Ensino Médio)',
  },
  {
    id: 'saeb',
    label: 'Matriz de Referência SAEB',
    fullReference: 'Matrizes de Referência do SAEB (INEP/MEC)',
  },
  {
    id: 'enem',
    label: 'Matriz de Referência ENEM',
    fullReference: 'Matriz de Referência do ENEM (INEP/MEC — Eixos Cognitivos e Competências)',
    onlyStages: ['ensino_medio', 'ensino_tecnico'],
  },
  {
    id: 'lbi',
    label: 'LBI — Inclusão (Lei nº 13.146/2015)',
    fullReference:
      'Lei Brasileira de Inclusão da Pessoa com Deficiência (LBI — Lei nº 13.146/2015) e Política Nacional de Educação Especial',
  },
  {
    id: 'leis_etnico_raciais',
    label: 'Leis nº 10.639/2003 e 11.645/2008',
    fullReference:
      'Leis nº 10.639/2003 e nº 11.645/2008 (História e Cultura Afro-Brasileira, Africana e Indígena)',
  },
  {
    id: 'pnld',
    label: 'Guia do Livro Didático (PNLD)',
    fullReference: 'Orientações do Programa Nacional do Livro e do Material Didático (PNLD / MEC)',
  },
  {
    id: 'ppp_escola',
    label: 'PPP / Documento anexado no chat',
    fullReference:
      'Projeto Político-Pedagógico (PPP) da escola ou documento/PDF que o(a) docente anexará nesta conversa',
  },
];

export function isEnemStage(stage: EducationStageId | ''): boolean {
  return stage === 'ensino_medio' || stage === 'ensino_tecnico';
}

export const BNCC_GENERAL_COMPETENCIES: { id: number; title: string; summary: string }[] = [
  { id: 1, title: 'Conhecimento', summary: 'Valorizar e utilizar conhecimentos historicamente construídos.' },
  { id: 2, title: 'Pensamento Científico e Crítico', summary: 'Investigar causas, elaborar hipóteses e resolver problemas com criatividade.' },
  { id: 3, title: 'Repertório Cultural', summary: 'Valorizar e fruir as diversas manifestações artísticas e culturais.' },
  { id: 4, title: 'Comunicação', summary: 'Utilizar diferentes linguagens (verbal, corporal, visual, sonora e digital).' },
  { id: 5, title: 'Cultura Digital', summary: 'Compreender, utilizar e criar tecnologias digitais de forma crítica e ética.' },
  { id: 6, title: 'Trabalho e Projeto de Vida', summary: 'Valorizar saberes e vivências para escolhas alinhadas ao projeto de vida.' },
  { id: 7, title: 'Argumentação', summary: 'Argumentar com base em fatos, dados e informações confiáveis.' },
  { id: 8, title: 'Autoconhecimento e Autocuidado', summary: 'Conhecer-se, cuidar da saúde física e emocional e lidar com emoções.' },
  { id: 9, title: 'Empatia e Cooperação', summary: 'Exercitar empatia, diálogo, resolução de conflitos e cooperação.' },
  { id: 10, title: 'Responsabilidade e Cidadania', summary: 'Agir pessoal e coletivamente com autonomia, ética e sustentabilidade.' },
];

export const CURATED_BNCC_SKILLS: BnccSkill[] = [
  // Educação Infantil
  {
    code: 'EI03EO03',
    stage: 'educacao_infantil',
    component: 'O eu, o outro e o nós',
    description: 'Ampliar as relações interpessoais, desenvolvendo atitudes de participação e cooperação.',
  },
  {
    code: 'EI03EF01',
    stage: 'educacao_infantil',
    component: 'Escuta, fala, pensamento e imaginação',
    description: 'Expressar ideias, desejos e sentimentos sobre suas vivências por meio da linguagem oral e escrita.',
  },
  {
    code: 'EI03ET01',
    stage: 'educacao_infantil',
    component: 'Espaços, tempos, quantidades, relações e transformações',
    description: 'Estabelecer relações de comparação entre objetos, observando suas propriedades.',
  },
  {
    code: 'EI03CO01',
    stage: 'educacao_infantil',
    component: 'Computação na Educação Infantil (BNCC Computação)',
    description: 'Reconhecer padrão de repetição em sequência de sons, movimentos, desenhos e objetos.',
  },
  // EF Anos Iniciais
  {
    code: 'EF03LP08',
    stage: 'ef_anos_iniciais',
    component: 'Língua Portuguesa',
    description: 'Identificar e diferenciar, em textos, substantivos e verbos e suas funções na oração.',
  },
  {
    code: 'EF04MA06',
    stage: 'ef_anos_iniciais',
    component: 'Matemática',
    description: 'Resolver e elaborar problemas envolvendo diferentes significados da multiplicação.',
  },
  {
    code: 'EF05CI02',
    stage: 'ef_anos_iniciais',
    component: 'Ciências',
    description: 'Aplicar os conhecimentos sobre as mudanças de estado físico da água para explicar o ciclo hidrológico.',
  },
  {
    code: 'EF05CO01',
    stage: 'ef_anos_iniciais',
    component: 'Computação / Pensamento Computacional (BNCC)',
    description: 'Reconhecer objetos do mundo real e/ou digital que podem ser representados através de listas que estabelecem uma organização.',
  },
  // EF Anos Finais
  {
    code: 'EF07CI04',
    stage: 'ef_anos_finais',
    component: 'Ciências',
    description: 'Avaliar o papel do equilíbrio termodinâmico para a manutenção da vida na Terra e o funcionamento de máquinas térmicas.',
  },
  {
    code: 'EF08MA04',
    stage: 'ef_anos_finais',
    component: 'Matemática',
    description: 'Resolver e elaborar problemas envolvendo cálculo de porcentagens, incluindo o uso de tecnologias digitais.',
  },
  {
    code: 'EF09LP01',
    stage: 'ef_anos_finais',
    component: 'Língua Portuguesa',
    description: 'Analisar o fenômeno da disseminação de notícias falsas nas redes sociais e desenvolver estratégias para reconhecê-las.',
  },
  {
    code: 'EF08HI15',
    stage: 'ef_anos_finais',
    component: 'História',
    description: 'Identificar e analisar o equilíbrio das forças e os sujeitos envolvidos nas disputas políticas durante o Primeiro e o Segundo Reinado.',
  },
  {
    code: 'EF08CO01',
    stage: 'ef_anos_finais',
    component: 'Computação / Cultura Digital (BNCC)',
    description: 'Construir soluções de problemas usando a técnica de recursão e decomposição algorítmica.',
  },
  // Ensino Médio
  {
    code: 'EM13LGG703',
    stage: 'ensino_medio',
    component: 'Linguagens e suas Tecnologias (Língua Portuguesa / Literatura)',
    description: 'Utilizar diferentes linguagens, mídias e ferramentas digitais em processos de produção coletiva, colaborativa e projetos autorais.',
  },
  {
    code: 'EM13MAT302',
    stage: 'ensino_medio',
    component: 'Matemática e suas Tecnologias',
    description: 'Construir modelos empregando as funções polinomiais de 1º ou 2º graus para resolver problemas em contextos diversos.',
  },
  {
    code: 'EM13CNT306',
    stage: 'ensino_medio',
    component: 'Biologia (Ciências da Natureza)',
    description: 'Avaliar os riscos envolvidos em atividades cotidianas, aplicando conhecimentos das Ciências da Natureza para justificar o uso de equipamentos e comportamentos de segurança.',
  },
  {
    code: 'EM13CHS101',
    stage: 'ensino_medio',
    component: 'História (Ciências Humanas)',
    description: 'Identificar, analisar e comparar diferentes fontes e narrativas expressas em diversas linguagens, com vistas à compreensão de ideias filosóficas e processos históricos.',
  },
  {
    code: 'EM13CO01',
    stage: 'ensino_medio',
    component: 'Computação / Robótica / Ciência de Dados (BNCC)',
    description: 'Explorar e construir a solução de problemas por meio da reutilização de partes de soluções existentes (modularização e abstração).',
  },
  // Ensino Técnico
  {
    code: 'CNCT-DS-01',
    stage: 'ensino_tecnico',
    component: 'Informática / Desenvolvimento de Sistemas',
    description: 'Modelar, desenvolver e testar aplicações web e sistemas computacionais aplicando boas práticas de engenharia de software e versionamento.',
  },
  {
    code: 'CNCT-BD-02',
    stage: 'ensino_tecnico',
    component: 'Banco de Dados e Análise de Dados',
    description: 'Projetar bancos de dados relacionais, executar consultas SQL otimizadas e estruturar relatórios analíticos orientados à tomada de decisão.',
  },
  {
    code: 'CNCT-ADM-01',
    stage: 'ensino_tecnico',
    component: 'Administração / Gestão e Negócios',
    description: 'Planejar e executar rotinas administrativas, financeiras e de gestão de projetos com foco em produtividade e ética organizacional.',
  },
  {
    code: 'CNCT-SEG-01',
    stage: 'ensino_tecnico',
    component: 'Redes de Computadores e Segurança da Informação',
    description: 'Configurar infraestrutura de redes locais e aplicar políticas de segurança da informação, backup e proteção de dados (LGPD).',
  },
  // EJA — Educação de Jovens e Adultos (BNCC contextualizada)
  {
    code: 'EF08MA04 (EJA)',
    stage: 'eja',
    component: 'Matemática Aplicada ao Cotidiano e Finanças',
    description: 'Resolver e elaborar problemas envolvendo porcentagens, juros, orçamento familiar e direitos do consumidor no cotidiano adulto.',
  },
  {
    code: 'EF69LP03 (EJA)',
    stage: 'eja',
    component: 'Língua Portuguesa e Letramento Social',
    description: 'Compreender e produzir textos jornalísticos, profissionais e cidadãos (currículo, requerimento, leitura crítica de notícias).',
  },
  {
    code: 'EM13CHS401 (EJA)',
    stage: 'eja',
    component: 'História, Cidadania e Mundo do Trabalho',
    description: 'Identificar e analisar as relações entre sujeitos, grupos, classes sociais e transformações no mundo do trabalho e direitos trabalhistas.',
  },
  {
    code: 'EM13CO18 (EJA)',
    stage: 'eja',
    component: 'Inclusão Digital e Computação (BNCC)',
    description: 'Utilizar serviços digitais, segurança de dados pessoais e ferramentas produtivas de forma crítica, autônoma e segura no cotidiano e no trabalho.',
  },
];

export const BLOOM_LEVELS: {
  id: BloomLevelId;
  label: string;
  verbs: string;
  description: string;
}[] = [
  {
    id: 'lembrar',
    label: '1. Lembrar',
    verbs: 'identificar, listar, reconhecer, nomear',
    description: 'Recuperar conhecimentos prévios e conceitos essenciais.',
  },
  {
    id: 'compreender',
    label: '2. Compreender',
    verbs: 'explicar, resumir, exemplificar, classificar',
    description: 'Construir significado a partir de textos, exemplos e fenômenos.',
  },
  {
    id: 'aplicar',
    label: '3. Aplicar',
    verbs: 'resolver, executar, demonstrar, implementar',
    description: 'Usar procedimentos e conceitos em situações práticas ou novas.',
  },
  {
    id: 'analisar',
    label: '4. Analisar',
    verbs: 'comparar, diferenciar, investigar, decompor',
    description: 'Examinar partes, relações de causa/efeito e evidências.',
  },
  {
    id: 'avaliar',
    label: '5. Avaliar',
    verbs: 'julgar, argumentar, validar, criticar com critérios',
    description: 'Emitir juízos fundamentados em dados, rubricas e ética.',
  },
  {
    id: 'criar',
    label: '6. Criar',
    verbs: 'projetar, elaborar, prototipar, propor soluções',
    description: 'Produzir artefatos autorais, projetos e soluções originais.',
  },
];

export const SCHOOL_INFRASTRUCTURE_RESOURCES: string[] = [
  'Quadro e papel',
  'Projetor / TV',
  'Laboratório de informática',
  'Laboratório técnico / ciências',
  'Internet estável',
  'Internet instável',
  'Sem internet em sala',
  'Celulares dos estudantes',
  'Tablets ou notebooks',
  'Biblioteca',
  'Kits de robótica ou eletrônica',
];

export const ACTIVE_METHODOLOGIES: string[] = [
  'Aula Expositiva Dialogada com Prática Guiada',
  'Aprendizagem Baseada em Problemas (ABP / PBL)',
  'Aprendizagem Baseada em Projetos (ABPj)',
  'Rotação por Estações',
  'Sala de Aula Invertida (Flipped Classroom)',
  'Gamificação Educacional',
  'Estudo de Caso e Debate Estruturado',
  'Cultura Maker / Mão na Massa',
  'Design Thinking na Educação',
  'Aprendizagem Cooperativa (Think-Pair-Share / Jigsaw)',
  'Ensino por Investigação',
];

export const INCLUSION_PROFILES: string[] = [
  'Desenho Universal para a Aprendizagem (DUA — múltiplos meios de representação e expressão)',
  'TEA (Transtorno do Espectro Autista — previsibilidade, comandos literais e apoio visual)',
  'TDAH (blocos curtos, instruções passo a passo e pausas ativas)',
  'Dislexia / Dificuldades de Leitura (linguagem clara, frases curtas, destaque visual)',
  'Deficiência Intelectual (adequação de complexidade e apoio concreto)',
  'Baixa Visão / Acessibilidade Visual (descrição textual de imagens e alto contraste)',
  'Altas Habilidades / Superdotação (desafios de aprofundamento e enriquecimento)',
];

export const TONE_OPTIONS: string[] = [
  'Didático, claro e engajador (adequado à faixa etária)',
  'Formal e técnico-pedagógico (ideal para documentos institucionais)',
  'Acolhedor, empático e construtivo (ideal para pareceres e famílias)',
  'Investigativo e provocador (estimula curiosidade científica)',
  'Lúdico e criativo (narrativo e acessível)',
  'Profissional e orientado ao mercado (ideal para Ensino Técnico)',
];

export const OUTPUT_FORMAT_OPTIONS: string[] = [
  'Documento estruturado em Markdown com títulos, tabelas e listas prontas para impressão',
  'Tabela organizadora completa + orientações passo a passo para o professor',
  'Texto pronto para copiar para Word / Google Docs (seções limpas e numeradas)',
  'Material pronto para o aluno (enunciados claros + espaço de resposta) + guia do professor ao final',
];

export function findStageById(stageId: EducationStageId | ''): EducationStage | undefined {
  if (!stageId) return undefined;
  return EDUCATION_STAGES.find((s) => s.id === stageId);
}

export function getStageById(stageId: EducationStageId | ''): EducationStage {
  return findStageById(stageId) ?? EDUCATION_STAGES[2];
}
