import {
  BLOOM_LEVELS,
  getStageById,
  OPTIONAL_REFERENCE_DOCUMENTS,
} from '../data/education';
import {
  getTemplateById,
  SLIDE_AESTHETIC_PROFILES,
  SLIDE_PALETTE_OPTIONS,
  SLIDE_TYPOGRAPHY_OPTIONS,
} from '../data/templates';
import type {
  PromptFormState,
  PromptQualityAnalysis,
  QualityCheckItem,
  TargetAI,
} from '../types/prompt';

export interface PromptStats {
  words: number;
  characters: number;
  estimatedTokens: number;
  lines: number;
}

export interface PromptLayer {
  number: string;
  title: string;
  kind: 'fixa' | 'contexto' | 'pedido' | 'inclusão' | 'qualidade';
  content: string;
  note: string;
}

/**
 * Converte o prompt gerado em camadas numeradas e explicadas (no padrão visual
 * do Caderno de Contexto UFMA / PROFCOMP-MA) para inspeção pedagógica.
 */
export function splitPromptIntoLayers(promptText: string, isEditorialSlides: boolean): PromptLayer[] {
  const blocks = promptText
    .split(/\n{2,}(?=#+\s)/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length <= 1) {
    return [
      {
        number: '1',
        title: 'Prompt completo',
        kind: 'pedido',
        content: promptText.trim(),
        note: 'Prompt enxuto pronto para copiar e colar em qualquer IA.',
      },
    ];
  }

  return blocks.map((block, index) => {
    const firstLine = block.split(/\r?\n/)[0] ?? '';
    const cleanTitle = firstLine.replace(/^#+\s*(\d+\.\s*)?/, '').trim();
    const isHeading = /^#+\s/.test(firstLine);

    if (isEditorialSlides) {
      if (index === 0 && !isHeading) {
        return {
          number: '0',
          title: 'Persona & Direção Visual',
          kind: 'fixa',
          content: block,
          note: 'Define o padrão visual de diretor de arte (Apple Keynote / Kinfolk / Monocle).',
        };
      }
      const lower = cleanTitle.toLowerCase();
      const kind: PromptLayer['kind'] = lower.includes('conteúdo')
        ? 'contexto'
        : lower.includes('acessibilidade')
        ? 'inclusão'
        : lower.includes('entrega')
        ? 'qualidade'
        : 'pedido';
      const note = lower.includes('conteúdo')
        ? 'Apresenta tema, público, objetivo, material de base e o comando fixo de leitura oficial da BNCC.'
        : lower.includes('direção')
        ? 'Controla paleta, tipografia, grid, limite de palavras por slide e variedade de layouts.'
        : lower.includes('fotografia')
        ? 'Garante fotos editoriais reais em bancos gratuitos (Unsplash/Pexels) com contraste AA e créditos.'
        : lower.includes('narrativa')
        ? 'Organiza a apresentação em 5 atos (Capa, Gancho, Desenvolvimento, Momento Uau e Fechamento).'
        : lower.includes('acessibilidade')
        ? 'Garante alt-text, contraste acessível e princípios do DUA.'
        : 'Exige prévia em 5 linhas, notas do apresentador e checklist de auto-revisão antes da entrega.';

      return {
        number: String(index),
        title: cleanTitle || `Camada ${index}`,
        kind,
        content: block,
        note,
      };
    }

    const lower = cleanTitle.toLowerCase();
    const kind: PromptLayer['kind'] = lower.includes('papel')
      ? 'fixa'
      : lower.includes('contexto')
      ? 'contexto'
      : lower.includes('inclus') || lower.includes('ética')
      ? 'inclusão'
      : lower.includes('formato')
      ? 'qualidade'
      : 'pedido';

    const note = lower.includes('papel')
      ? 'Ancora a IA na especialidade pedagógica adequada ao recurso solicitado.'
      : lower.includes('contexto')
      ? 'Inclui etapa, turma e o comando fixo para a IA consultar o documento oficial (BNCC/CNCT/EJA) e selecionar competências e habilidades.'
      : lower.includes('diretrizes')
      ? 'Especifica metodologia, tom linguístico e parâmetros exclusivos do recurso.'
      : lower.includes('estrutura')
      ? 'Lista os blocos obrigatórios para evitar respostas genéricas ou incompletas.'
      : lower.includes('inclus') || lower.includes('ética')
      ? 'Assegura acessibilidade (DUA / LBI) e conformidade com a LGPD em documentos escolares.'
      : 'Define idioma, formato de saída, rigor factual e critérios de revisão crítica.';

    return {
      number: String(index + 1),
      title: cleanTitle || `Camada ${index + 1}`,
      kind,
      content: block,
      note,
    };
  });
}

function getTargetAIInstruction(targetAI: TargetAI): string | null {
  switch (targetAI) {
    case 'chatgpt':
      return 'Otimização para ChatGPT: organize a saída em seções claras com Markdown limpo e, caso o material fique longo, mantenha o mesmo nível de profundidade do início ao fim sem resumir o final.';
    case 'gemini':
      return 'Otimização para Google Gemini: estruture em formato pronto para exportação para Google Docs/Slides, usando tabelas Markdown bem alinhadas e tópicos objetivos.';
    case 'claude':
      return 'Otimização para Claude: utilize raciocínio pedagógico cuidadoso, escrita natural em português brasileiro e formatação limpa pronta para uso em sala ou impressão.';
    case 'copilot':
      return 'Otimização para Microsoft Copilot: estruture os blocos de forma compatível com Word/PowerPoint, com títulos claros e hierarquia direta.';
    default:
      return null;
  }
}

/**
 * Resolve lista consolidada de documentos complementares opcionais solicitados pelo(a) docente.
 */
function resolveAdditionalDocuments(state: PromptFormState): string[] {
  const docs: string[] = [];

  for (const id of state.selectedExtraDocs ?? []) {
    const found = OPTIONAL_REFERENCE_DOCUMENTS.find((d) => d.id === id);
    if (found) {
      docs.push(found.fullReference);
    }
  }

  if (state.additionalDocuments && state.additionalDocuments.trim()) {
    const customLines = state.additionalDocuments
      .split(/\r?\n|;/)
      .map((item) => item.trim())
      .filter(Boolean);
    for (const line of customLines) {
      if (!docs.includes(line)) {
        docs.push(line);
      }
    }
  }

  return docs;
}

/**
 * Comando fixo inserido automaticamente nos prompts para que a IA leia o documento
 * oficial da etapa (BNCC / CNCT / DCNs EJA) e selecione por conta própria as
 * competências e habilidades mais adequadas ao pedido.
 */
function buildFixedOfficialCurriculumCommand(state: PromptFormState, compact = false): string {
  const stage = getStageById(state.stage);
  const isComputingComponent = /computa|algoritm|dados|sistemas|redes|rob[oó]tica/i.test(
    state.component
  );
  const extraDocs = resolveAdditionalDocuments(state);

  const primaryDoc = isComputingComponent
    ? `${stage.officialDocument}, em conjunto com o Complemento da BNCC de Computação (Resolução CNE/CEB nº 1/2022)`
    : stage.officialDocument;

  if (compact) {
    const extraClause =
      extraDocs.length > 0
        ? ` Consulte também os seguintes documentos complementares solicitados pelo(a) docente: ${extraDocs.join('; ')}.`
        : '';

    return (
      `COMANDO FIXO DE ALINHAMENTO CURRICULAR OFICIAL: Antes de produzir o material, leia e consulte o documento oficial da ${primaryDoc} (${stage.officialDocumentUrl}) para a etapa "${stage.label}" (${state.yearOrTrack}) e componente "${state.component}". ` +
      `Selecione automaticamente as Competências Gerais, Competências Específicas e Habilidades (com códigos alfanuméricos oficiais e descrições fiéis) que mais se adequam ao tema e ao pedido acima, justificando brevemente a escolha. Nunca invente códigos inexistentes — caso não tenha certeza de algum código exato, indique o texto da habilidade e sinalize para conferência docente.` +
      extraClause
    );
  }

  const lines: string[] = [
    `**COMANDO FIXO — Consulta Obrigatória ao Documento Oficial (${stage.badge}):**`,
    `- Leia e consulte o documento oficial: **${primaryDoc}** (referência oficial: ${stage.officialDocumentUrl}).`,
    `- A partir desse documento oficial, **selecione automaticamente** as **Competências Gerais**, **Competências Específicas** e **Habilidades / Objetivos de Aprendizagem** (citando os códigos alfanuméricos oficiais e suas descrições fiéis) que **mais se adequam** à etapa (${stage.label} — ${state.yearOrTrack}), ao componente (${state.component}), ao tema e ao objetivo solicitados.`,
    `- Apresente a lista das competências e habilidades selecionadas com uma breve justificativa pedagógica de sua pertinência ao recurso criado.`,
    `- **Rigor normativo**: jamais invente ou altere códigos oficiais; caso não consiga verificar um código específico com 100% de certeza, descreva a habilidade fielmente e sinalize "[verificar código oficial]" para validação docente.`,
  ];

  if (extraDocs.length > 0) {
    lines.push('- **Documentos complementares adicionais solicitados pelo(a) docente para consulta obrigatória:**');
    for (const doc of extraDocs) {
      lines.push(`  - ${doc}`);
    }
    lines.push(
      '- Articule explicitamente o material gerado também às diretrizes, descritores ou conteúdos presentes nesses documentos complementares.'
    );
  }

  return lines.join('\n');
}

/**
 * Gera o prompt de Slides Editoriais seguindo fielmente o modelo de Direção de Arte
 * fornecido pelo usuário (Apple Keynote / Kinfolk / Monocle), integrado ao comando
 * fixo de leitura oficial da BNCC/CNCT/EJA e documentos opcionais.
 */
export function buildEditorialSlidePrompt(state: PromptFormState): string {
  const stage = getStageById(state.stage);
  const cfg = state.slideConfig;
  const aesthetic =
    SLIDE_AESTHETIC_PROFILES[cfg.aestheticStyle] ?? SLIDE_AESTHETIC_PROFILES.editorial_minimalista;
  const palette =
    SLIDE_PALETTE_OPTIONS.find((p) => p.id === cfg.paletteId) ?? SLIDE_PALETTE_OPTIONS[0];
  const typography =
    SLIDE_TYPOGRAPHY_OPTIONS.find((t) => t.id === cfg.typographyId) ?? SLIDE_TYPOGRAPHY_OPTIONS[0];

  const topicText = state.topic.trim() || '[tema da aula ou apresentação]';
  const audienceText =
    cfg.audienceCustom.trim() ||
    `Estudantes de ${stage.label} (${state.yearOrTrack}) — componente: ${state.component}`;
  const objectiveText =
    cfg.impactObjective.trim() ||
    `Formule automaticamente um objetivo de aprendizagem e impacto claro e mensurável (o que a turma deve sentir, entender e ser capaz de fazer ao final), alinhado às habilidades oficiais selecionadas e conduzindo toda a apresentação com intencionalidade pedagógica.`;
  const slideCountText = cfg.slideCount.trim() || '10–15';
  const maxWordsText = cfg.maxWordsPerSlide.trim() || '25';
  const baseMaterialText =
    cfg.baseMaterial.trim() ||
    '[cole aqui o texto, tópicos, plano de aula ou artigo de base, se houver]';

  const sections: string[] = [];

  // Persona (fiel ao modelo)
  sections.push(aesthetic.persona);

  // ## Conteúdo
  const contentLines = [
    '## Conteúdo',
    `- Tema: ${topicText}`,
    `- Público: ${audienceText}`,
    `- Objetivo: ${objectiveText}`,
    `- Quantidade: ${slideCountText} slides`,
    `- Idioma: português do Brasil`,
  ];

  if (cfg.alignWithBncc) {
    contentLines.push(
      `- Contexto escolar: ${stage.label} (${state.yearOrTrack}) — ${state.component}`
    );
    contentLines.push(`- ${buildFixedOfficialCurriculumCommand(state, true)}`);
  }

  contentLines.push(`- Material de base (se houver): ${baseMaterialText}`);
  sections.push(contentLines.join('\n'));

  // ## Direção de arte
  const paletteLine = cfg.customPaletteNote.trim()
    ? `${palette.promptInstruction} Observação adicional de cor: ${cfg.customPaletteNote.trim()}.`
    : palette.promptInstruction;

  const artLines = [
    '## Direção de arte',
    `- Estética: ${aesthetic.aestheticLine}`,
    `- Paleta: ${paletteLine}`,
    `- Tipografia: ${typography.promptInstruction}`,
    '- Grid consistente, margens generosas e alinhamento rigoroso.',
    `- Hierarquia clara: 1 ideia por slide. Máx. ${maxWordsText} palavras de texto corrido por slide; prefira frases curtas e de impacto.`,
    '- Varie os layouts: foto full-bleed com título sobreposto, split 50/50 foto+texto, número gigante como destaque, citação centralizada, grade de 3 itens, slide de transição só com uma palavra.',
    '- Nada de clip-art, ícones genéricos, gradientes chamativos, sombras pesadas ou bullets em excesso.',
  ];
  sections.push(artLines.join('\n'));

  // ## Fotografia (prioridade máxima)
  if (cfg.includePhotographyRules) {
    const sources = cfg.photoSources.trim() || 'Unsplash, Pexels';
    const photoLines = [
      '## Fotografia (prioridade máxima)',
      '- Use fotos reais de alta qualidade em quase todos os slides, no estilo de fotografia editorial: luz natural, profundidade de campo, composição cinematográfica, tons harmonizados com a paleta.',
      `- Procure as imagens em bancos gratuitos (${sources}) e use apenas URLs que você verificou que existem. Nunca invente links de imagem (caso não tenha acesso à web, forneça o descritivo fotográfico exato + termos de busca em inglês para o professor baixar).`,
      '- Quando houver texto sobre foto, aplique overlay escuro ou gradiente sutil para garantir legibilidade (contraste AA).',
      '- Mantenha coerência: mesma temperatura de cor e mesmo "clima" em todas.',
      '- Indique no slide a fonte/autor da foto em letra pequena e discreta.',
    ];
    sections.push(photoLines.join('\n'));
  }

  // ## Estrutura narrativa
  if (cfg.includeNarrativeArc) {
    const narrativeLines = [
      '## Estrutura narrativa',
      '1. Capa impactante (foto full-bleed + título forte)',
      '2. Gancho: uma pergunta, dado surpreendente ou citação',
      '3. Desenvolvimento em blocos com transições visuais',
      '4. Um slide de "momento uau" (dado gigante ou imagem marcante)',
      '5. Fechamento memorável + chamada para ação',
    ];
    if (cfg.narrativeCustomNotes.trim()) {
      narrativeLines.push(`- Diretriz narrativa complementar: ${cfg.narrativeCustomNotes.trim()}`);
    }
    sections.push(narrativeLines.join('\n'));
  }

  // Inclusão / Acessibilidade
  if (state.inclusionEnabled && (state.inclusionProfiles.length > 0 || state.inclusionNotes.trim())) {
    const incLines = ['## Acessibilidade e Inclusão (DUA)'];
    if (state.inclusionProfiles.length > 0) {
      incLines.push(
        `- Garantir acessibilidade visual e cognitiva considerando: ${state.inclusionProfiles.join('; ')}.`
      );
    }
    incLines.push(
      '- Incluir texto alternativo (alt-text) breve para cada foto sugerida e manter alto contraste tipográfico (mínimo WCAG AA).'
    );
    if (state.inclusionNotes.trim()) {
      incLines.push(`- Observações específicas da turma: ${state.inclusionNotes.trim()}`);
    }
    sections.push(incLines.join('\n'));
  }

  // ## Entrega
  const deliveryLines = ['## Entrega'];
  if (cfg.includeFiveLinePreview) {
    deliveryLines.push(
      '- Antes de criar, mostre em 5 linhas: paleta (hex), fontes e o roteiro dos slides (título de cada um). Depois gere a apresentação completa.'
    );
  } else {
    deliveryLines.push('- Gere diretamente a apresentação completa slide a slide.');
  }

  if (cfg.includeSpeakerNotes) {
    deliveryLines.push('- Inclua notas do apresentador curtas em cada slide.');
  }

  if (cfg.includeSelfReviewChecklist) {
    deliveryLines.push(
      '- Ao final, revise cada slide contra este checklist: 1 ideia só? texto legível? foto de alta qualidade e coerente? alinhamento consistente? Corrija o que falhar antes de entregar.'
    );
  }

  if (state.extraConstraints.trim()) {
    deliveryLines.push(`- Restrições e observações adicionais: ${state.extraConstraints.trim()}`);
  }

  const aiHint = getTargetAIInstruction(state.targetAI);
  if (aiHint) {
    deliveryLines.push(`- ${aiHint}`);
  }

  if (state.depth === 'avancado') {
    deliveryLines.push(
      '- Modo iterativo: ao finalizar, sugira 3 perguntas estratégicas que o professor pode responder para refinar ainda mais o visual ou adaptar os slides para uma segunda aula.'
    );
  }

  sections.push(deliveryLines.join('\n'));

  return sections.join('\n\n');
}

/**
 * Gera prompts pedagógicos estruturados com comando fixo de leitura oficial da BNCC/CNCT/EJA
 * e suporte opcional a documentos adicionais indicados pelo(a) docente.
 */
export function buildPedagogicalPrompt(state: PromptFormState): string {
  const template = getTemplateById(state.templateId);
  if (template.isEditorialSlides) {
    return buildEditorialSlidePrompt(state);
  }

  const stage = getStageById(state.stage);
  const bloom = BLOOM_LEVELS.find((b) => b.id === state.bloomLevel) ?? BLOOM_LEVELS[2];
  const topicText = state.topic.trim() || '[inserir tema ou assunto principal]';
  const objectiveDirective =
    `Sempre que cabível ao recurso solicitado (${template.name}), formule explicitamente os **Objetivos de Aprendizagem** claros, observáveis e mensuráveis (alinhados ao nível cognitivo ${bloom.label} — verbos como *${bloom.verbs}* — e às competências/habilidades selecionadas do documento oficial; ou, em documentos estritamente institucionais, a finalidade pedagógica/institucional). Conduza toda a elaboração do recurso com **intencionalidade pedagógica** explícita, garantindo coerência rigorosa entre objetivos, desenvolvimento, mediação e evidências/verificação da aprendizagem.`;

  // Modo Direto (Enxuto)
  if (state.depth === 'direto') {
    const lines: string[] = [
      `${template.persona}`,
      '',
      `Crie um(a) **${template.name}** em português do Brasil com as especificações abaixo:`,
      `- Etapa e Turma: ${stage.label} — ${state.yearOrTrack}`,
      `- Componente / Área: ${state.component}`,
      `- Tema: ${topicText}`,
      `- Objetivos de Aprendizagem e Intencionalidade Pedagógica: ${objectiveDirective}`,
      `- ${buildFixedOfficialCurriculumCommand(state, true)}`,
      `- Metodologia / Abordagem: ${state.methodology}`,
      `- Tom e linguagem: ${state.tone}`,
    ];

    for (const field of template.specificFields) {
      const val = state.specificValues[field.key];
      if (typeof val === 'boolean') {
        if (val) lines.push(`- ${field.label}: Sim`);
      } else if (Array.isArray(val)) {
        if (val.length > 0) lines.push(`- ${field.label}: ${val.join('; ')}`);
      } else if (typeof val === 'string' && val.trim()) {
        lines.push(`- ${field.label}: ${val.trim()}`);
      }
    }

    if (state.inclusionEnabled && state.inclusionProfiles.length > 0) {
      lines.push(`- Inclusão / DUA: contemplar adaptações para ${state.inclusionProfiles.join('; ')}.`);
    }

    if (template.isDocumentWithPrivacy) {
      lines.push(
        '- Ética e LGPD: utilize linguagem profissional sem rótulos e mantenha quaisquer nomes fictícios ou campos entre [COLCHETES] para proteção de dados pessoais.'
      );
    }

    lines.push(`- Formato de entrega: ${state.outputFormat}`);
    if (state.extraConstraints.trim()) {
      lines.push(`- Observações extras: ${state.extraConstraints.trim()}`);
    }

    const aiHint = getTargetAIInstruction(state.targetAI);
    if (aiHint) lines.push(`- ${aiHint}`);

    return lines.join('\n');
  }

  // Modo Estruturado (Recomendado) e Modo Avançado (CoT / Iterativo)
  const sections: string[] = [];

  // 1. Papel e Especialidade
  sections.push(`# 1. Papel e Especialidade (Persona)\n${template.persona}`);

  // 2. Contexto Escolar e Consulta Oficial às Competências e Habilidades
  const contextLines = [
    '# 2. Contexto Escolar, Intencionalidade Pedagógica e Alinhamento Curricular Oficial',
    `- **Recurso solicitado**: ${template.name}`,
    `- **Etapa de Ensino**: ${stage.label} (${stage.badge})`,
    `- **Ano / Série / Segmento**: ${state.yearOrTrack}`,
    `- **Componente Curricular / Campo**: ${state.component}`,
    `- **Tema Central**: ${topicText}`,
    `- **Nível Cognitivo (Taxonomia de Bloom Revisada)**: ${bloom.label} — priorize ações como *${bloom.verbs}*.`,
    `- **Objetivos de Aprendizagem e Intencionalidade Pedagógica (geração obrigatória pela IA)**: ${objectiveDirective}`,
    '',
    buildFixedOfficialCurriculumCommand(state, false),
  ];

  if (state.classContext.trim()) {
    contextLines.push('');
    contextLines.push(`- **Realidade e perfil da turma**: ${state.classContext.trim()}`);
  }

  sections.push(contextLines.join('\n'));

  // 3. Diretrizes Didáticas e Parâmetros do Recurso
  const paramLines = [
    '# 3. Diretrizes Pedagógicas e Parâmetros do Recurso',
    `- **Metodologia / Abordagem**: ${state.methodology}`,
    `- **Tom e Registro Linguístico**: ${state.tone}`,
  ];

  if (state.durationOrExtent.trim() && template.category !== 'documentais') {
    paramLines.push(`- **Tempo / Extensão prevista**: ${state.durationOrExtent.trim()}`);
  }

  for (const field of template.specificFields) {
    const val = state.specificValues[field.key];
    if (typeof val === 'boolean') {
      paramLines.push(`- **${field.label}**: ${val ? 'Sim (obrigatório)' : 'Não incluir'}`);
    } else if (Array.isArray(val)) {
      if (val.length > 0) {
        paramLines.push(`- **${field.label}**: ${val.join('; ')}`);
      }
    } else if (typeof val === 'string' && val.trim()) {
      paramLines.push(`- **${field.label}**: ${val.trim()}`);
    }
  }

  sections.push(paramLines.join('\n'));

  // 4. Estrutura Obrigatória da Entrega
  const structureLines = [
    '# 4. Estrutura Obrigatória do Material',
    'Organize a resposta contendo obrigatoriamente os seguintes elementos:',
    ...template.outputDeliverables.map((item, idx) => `${idx + 1}. ${item}`),
  ];
  sections.push(structureLines.join('\n'));

  // 5. Educação Inclusiva, DUA e Ética
  const ethicsLines: string[] = [];
  if (state.inclusionEnabled) {
    ethicsLines.push('# 5. Educação Inclusiva, Acessibilidade e DUA');
    if (state.inclusionProfiles.length > 0) {
      ethicsLines.push(
        `- Inclua uma seção prática de **Adaptações e Flexibilizações (DUA)** contemplando: ${state.inclusionProfiles.join('; ')}.`
      );
    } else {
      ethicsLines.push(
        '- Aplique princípios do Desenho Universal para a Aprendizagem (DUA), oferecendo múltiplos meios de engajamento, representação e expressão.'
      );
    }
    if (state.inclusionNotes.trim()) {
      ethicsLines.push(
        `- Necessidades específicas informadas pelo professor: ${state.inclusionNotes.trim()}`
      );
    }
  }

  if (template.isDocumentWithPrivacy) {
    if (ethicsLines.length === 0) {
      ethicsLines.push('# 5. Diretrizes Éticas e Proteção de Dados (LGPD)');
    }
    ethicsLines.push(
      '- **Conformidade LGPD e Ética Pedagógica**: adote linguagem respeitosa, baseada em evidências observáveis e livre de rótulos patologizantes; utilize marcadores como `[NOME DO ESTUDANTE]`, `[DATA]` e `[ASSINATURA]` onde houver dados identificáveis.'
    );
  }

  if (ethicsLines.length > 0) {
    sections.push(ethicsLines.join('\n'));
  }

  // 6. Formato de Saída, Restrições e Verificação
  const stepNum = ethicsLines.length > 0 ? 6 : 5;
  const outputLines = [
    `# ${stepNum}. Formato de Saída e Critérios de Qualidade`,
    `- **Idioma**: Português do Brasil (adequado à realidade escolar brasileira).`,
    `- **Formato**: ${state.outputFormat}.`,
    '- **Rigor e veracidade**: não invente dados estatísticos, citações bibliográficas ou códigos oficiais inexistentes; caso sugira referências externas, sinalize para conferência docente.',
  ];

  if (state.extraConstraints.trim()) {
    outputLines.push(`- **Restrições adicionais do professor**: ${state.extraConstraints.trim()}`);
  }

  const aiHint = getTargetAIInstruction(state.targetAI);
  if (aiHint) {
    outputLines.push(`- **${aiHint}**`);
  }

  if (state.depth === 'avancado') {
    outputLines.push(
      '- **Raciocínio Pedagógico (Passo a Passo)**: antes de redigir o material final, faça uma breve análise de 3 tópicos verificando a coerência entre as competências/habilidades selecionadas do documento oficial, o nível da Taxonomia de Bloom e a faixa etária.'
    );
    outputLines.push(
      '- **Autoavaliação e Iteração**: ao concluir, verifique se todos os itens da seção 4 foram atendidos e apresente 3 perguntas rápidas para ajudar o professor a personalizar ainda mais a próxima versão.'
    );
  }

  sections.push(outputLines.join('\n'));

  return sections.join('\n\n');
}

export function buildPrompt(state: PromptFormState): string {
  const template = getTemplateById(state.templateId);
  if (template.isEditorialSlides) {
    return buildEditorialSlidePrompt(state);
  }
  return buildPedagogicalPrompt(state);
}

export function estimatePromptStats(text: string): PromptStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return { words: 0, characters: 0, estimatedTokens: 0, lines: 0 };
  }
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const characters = trimmed.length;
  const lines = trimmed.split(/\r?\n/).length;
  const estimatedTokens = Math.round(words * 1.35);
  return { words, characters, estimatedTokens, lines };
}

export function analyzePromptQuality(state: PromptFormState): PromptQualityAnalysis {
  const template = getTemplateById(state.templateId);
  const extraDocs = resolveAdditionalDocuments(state);
  const checks: QualityCheckItem[] = [];

  if (template.isEditorialSlides) {
    const cfg = state.slideConfig;
    checks.push(
      {
        id: 'topic',
        label: 'Tema bem definido',
        passed: state.topic.trim().length >= 5,
        tip: 'Defina um tema específico para a apresentação.',
        weight: 30,
      },
      {
        id: 'objective',
        label: 'Objetivo e intencionalidade pedagógica garantidos',
        passed: true,
        tip: 'Se você deixar o objetivo dos slides em branco, a IA formulará com intencionalidade pedagógica.',
        weight: 15,
      },
      {
        id: 'audience',
        label: 'Público e contexto escolar claros',
        passed: Boolean(cfg.audienceCustom.trim() || state.yearOrTrack),
        tip: 'Informe a turma ou o público específico que assistirá aos slides.',
        weight: 15,
      },
      {
        id: 'art_photo',
        label: 'Direção de arte + fotografia editorial ativas',
        passed: cfg.includePhotographyRules && cfg.includeNarrativeArc,
        tip: 'Mantenha fotografia editorial e arco narrativo em 5 atos ativos.',
        weight: 20,
      },
      {
        id: 'delivery_checklist',
        label: 'Prévia em 5 linhas + checklist de auto-revisão',
        passed: cfg.includeFiveLinePreview && cfg.includeSelfReviewChecklist,
        tip: 'Ative a prévia em 5 linhas e o checklist final de revisão.',
        weight: 10,
      },
      {
        id: 'base_material',
        label: 'Material de base ou consulta oficial à BNCC ativa',
        passed: cfg.baseMaterial.trim().length >= 15 || extraDocs.length > 0 || cfg.alignWithBncc,
        tip: 'Cole tópicos de base ou mantenha a consulta automática à BNCC ativa.',
        weight: 10,
      }
    );
  } else {
    checks.push(
      {
        id: 'topic',
        label: 'Tema específico definido',
        passed: state.topic.trim().length >= 5,
        tip: 'Escreva um tema claro e delimitado (mínimo 5 caracteres).',
        weight: 35,
      },
      {
        id: 'official_curriculum_auto',
        label: 'Comando fixo: BNCC oficial + objetivos com intencionalidade pedagógica',
        passed: true,
        tip: 'Incluído automaticamente para a IA consultar o documento oficial e gerar objetivos com intencionalidade.',
        weight: 25,
      },
      {
        id: 'context',
        label: 'Contexto da turma ou parâmetros do recurso',
        passed:
          state.classContext.trim().length >= 8 ||
          Object.values(state.specificValues).some(
            (v) =>
              (typeof v === 'string' && v.trim().length >= 6) ||
              (Array.isArray(v) && v.length > 0)
          ),
        tip: 'Detalhe o contexto da turma ou os campos específicos do recurso.',
        weight: 20,
      },
      {
        id: 'inclusion',
        label: 'Inclusão / DUA configurada',
        passed: state.inclusionEnabled,
        tip: 'Ative o Desenho Universal para a Aprendizagem (DUA) para maior acessibilidade.',
        weight: 10,
      },
      {
        id: 'structure',
        label: 'Estrutura pedagógica completa (Estruturado/Avançado)',
        passed: state.depth !== 'direto',
        tip: 'Use o modo Estruturado ou Avançado para melhores respostas das IAs.',
        weight: 10,
      }
    );
  }

  const score = checks.reduce((acc, item) => acc + (item.passed ? item.weight : 0), 0);
  const level: PromptQualityAnalysis['level'] =
    score >= 90 ? 'Exemplar' : score >= 75 ? 'Excelente' : score >= 50 ? 'Bom' : 'Inicial';

  return { score, level, checks };
}
