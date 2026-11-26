import {
  findStageById,
  isEnemStage,
  OPTIONAL_REFERENCE_DOCUMENTS,
} from '../data/education';
import {
  getTemplateById,
  RESOURCE_TEMPLATES,
  SLIDE_AESTHETIC_PROFILES,
  SLIDE_PALETTE_OPTIONS,
  SLIDE_TYPOGRAPHY_OPTIONS,
} from '../data/templates';
import { formatDeviceSourceForPrompt } from '../services/deviceSources';
import type {
  PromptFormState,
  PromptQualityAnalysis,
  QualityCheckItem,
  ResourceTemplate,
  SlidePromptConfig,
  TemplateFieldDefinition,
} from '../types/prompt';

const CUSTOM_OPTION_SENTINEL = '__outro__';

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
 * Retorna a lista de templates selecionados pelo(a) docente (com fallback para prompts antigos
 * salvos com apenas templateId).
 */
export function resolveSelectedTemplates(state: PromptFormState): ResourceTemplate[] {
  const ids =
    state.selectedTemplateIds && state.selectedTemplateIds.length > 0
      ? state.selectedTemplateIds
      : state.templateId
        ? [state.templateId]
        : [];

  const uniqueIds = Array.from(new Set(ids));
  return uniqueIds
    .map((id) => RESOURCE_TEMPLATES.find((t) => t.id === id))
    .filter((t): t is ResourceTemplate => Boolean(t));
}

function resolveSlideCount(cfg: SlidePromptConfig): string {
  if (cfg.slideCount === CUSTOM_OPTION_SENTINEL) {
    return cfg.slideCountCustom?.trim() || '10–15';
  }
  return cfg.slideCount.trim() || '10–15';
}

function resolveMaxWordsPerSlide(cfg: SlidePromptConfig): string {
  if (cfg.maxWordsPerSlide === CUSTOM_OPTION_SENTINEL) {
    return cfg.maxWordsCustom?.trim() || '25';
  }
  return cfg.maxWordsPerSlide.trim() || '25';
}

function resolveSpecificFieldDisplayValue(
  field: TemplateFieldDefinition,
  specificValues: Record<string, string | boolean | string[]>,
  allowEnem: boolean
): string | null {
  const raw = specificValues[field.key];
  if (typeof raw === 'boolean') {
    return raw ? 'Sim (obrigatório)' : null;
  }
  if (Array.isArray(raw)) {
    return raw.length > 0 ? raw.join('; ') : null;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (trimmed === CUSTOM_OPTION_SENTINEL) {
      const customVal = String(specificValues[`${field.key}__other`] ?? '').trim();
      if (!customVal) return null;
      if (!allowEnem && /\bENEM\b/i.test(customVal)) return null;
      return customVal;
    }
    if (!allowEnem && /\bENEM\b/i.test(trimmed)) {
      return null;
    }
    return trimmed;
  }
  return null;
}

/**
 * Converte o prompt gerado em camadas numeradas e explicadas (no padrão visual
 * do Caderno de Contexto UFMA / PROFCOMP-MA) para inspeção pedagógica.
 */
export function splitPromptIntoLayers(promptText: string, isEditorialSlidesOnly: boolean): PromptLayer[] {
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
        note: 'Prompt pronto para copiar e colar em qualquer IA.',
      },
    ];
  }

  return blocks.map((block, index) => {
    const firstLine = block.split(/\r?\n/)[0] ?? '';
    const cleanTitle = firstLine.replace(/^#+\s*(\d+\.\s*)?/, '').trim();
    const isHeading = /^#+\s/.test(firstLine);

    if (isEditorialSlidesOnly) {
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
      ? 'Ancora a IA na especialidade pedagógica adequada ao(s) recurso(s) solicitado(s).'
      : lower.includes('contexto')
        ? 'Inclui etapa, turma, progressão cognitiva (Bloom) e o comando fixo para a IA consultar o documento oficial (BNCC/CNCT/EJA).'
        : lower.includes('diretrizes') && lower.includes('slides')
          ? 'Aplica o padrão de direção de arte editorial (Apple Keynote / Kinfolk / Monocle) aos slides do pacote.'
          : lower.includes('diretrizes')
            ? 'Especifica metodologia, tom linguístico e parâmetros exclusivos do(s) recurso(s).'
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

/**
 * Resolve lista consolidada de documentos complementares opcionais solicitados pelo(a) docente,
 * garantindo que documentos restritos a determinadas etapas (como ENEM) não vazem para outras etapas.
 */
function resolveAdditionalDocuments(state: PromptFormState): string[] {
  const docs: string[] = [];

  for (const id of state.selectedExtraDocs ?? []) {
    const found = OPTIONAL_REFERENCE_DOCUMENTS.find((d) => d.id === id);
    if (!found) continue;
    if (found.onlyStages && (state.stage === '' || !found.onlyStages.includes(state.stage))) {
      continue;
    }
    docs.push(found.fullReference);
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
 * Diretriz interna fixa da Taxonomia de Bloom Revisada (aplicada automaticamente pelo motor).
 */
const INTERNAL_BLOOM_DIRECTIVE =
  'Aplique de forma progressiva a **Taxonomia de Bloom Revisada** (articulando processos cognitivos do nível básico ao superior — *lembrar, compreender, aplicar, analisar, avaliar e criar*), calibrando verbos de ação, complexidade cognitiva e profundidade à etapa de ensino, à faixa etária e à natureza do(s) recurso(s) solicitado(s).';

/**
 * Comando fixo inserido automaticamente nos prompts para que a IA leia o documento
 * oficial da etapa (BNCC / CNCT / DCNs EJA) e selecione por conta própria as
 * competências e habilidades mais adequadas ao pedido.
 */
function buildFixedOfficialCurriculumCommand(state: PromptFormState, compact = false): string {
  const stage = findStageById(state.stage);
  const yearLabel = state.yearOrTrack.trim() || '[selecionar ano / série / segmento]';
  const componentLabel = state.component.trim() || '[selecionar componente curricular]';
  const isComputingComponent =
    /computa|algoritm|dados|sistemas|redes|rob[oó]tica|pensamento computacional|mundo digital|cultura digital|em13co/i.test(
      state.component
    );
  const extraDocs = resolveAdditionalDocuments(state);
  const deviceSources = state.selectedDeviceSources ?? [];
  const includeExcerpts = state.includeSourceExcerpts !== false;

  const baseDoc = stage
    ? stage.officialDocument
    : 'Base Nacional Comum Curricular — BNCC (MEC) correspondente à etapa da Educação Básica selecionada';
  const docUrl = stage?.officialDocumentUrl ?? 'https://basenacionalcomum.mec.gov.br/';
  const stageBadge = stage?.badge ?? 'Educação Básica · BNCC';
  const stageLabel = stage?.label ?? '[selecionar etapa da Educação Básica]';

  const primaryDoc = isComputingComponent
    ? `${baseDoc}, em conjunto com o Complemento da BNCC de Computação (Resolução CNE/CEB nº 1/2022)`
    : baseDoc;

  if (compact) {
    const extraClause =
      extraDocs.length > 0
        ? ` Consulte também os seguintes documentos complementares solicitados pelo(a) docente: ${extraDocs.join('; ')}.`
        : '';
    const sourcesClause =
      deviceSources.length > 0
        ? ` FONTES OBRIGATÓRIAS ADICIONADAS PELO(A) DOCENTE: Utilize obrigatoriamente como uma das fontes centrais de consulta e fundamentação os seguintes arquivos, textos copiados e/ou endereços/links de sites adicionados pelo(a) docente (consulte os links indicados quando tiver acesso à web, incorpore fielmente os textos colados, cite as fontes utilizadas e nunca invente dados ou links ausentes): ${deviceSources
          .map((s) => formatDeviceSourceForPrompt(s, includeExcerpts))
          .join(' || ')}.`
        : '';

    return (
      `COMANDO FIXO DE ALINHAMENTO CURRICULAR OFICIAL: Antes de produzir o material, leia e consulte o documento oficial da ${primaryDoc} (${docUrl}) para a etapa "${stageLabel}" (${yearLabel}) e componente "${componentLabel}". ` +
      `Selecione automaticamente as Competências Gerais, Competências Específicas e Habilidades (com códigos alfanuméricos oficiais e descrições fiéis) que mais se adequam ao tema e ao pedido acima, justificando brevemente a escolha. Nunca invente códigos inexistentes — caso não tenha certeza de algum código exato, indique o texto da habilidade e sinalize para conferência docente.` +
      extraClause +
      sourcesClause
    );
  }

  const lines: string[] = [
    `**COMANDO FIXO — Consulta Obrigatória ao Documento Oficial (${stageBadge}):**`,
    `- Leia e consulte o documento oficial: **${primaryDoc}** (referência oficial: ${docUrl}).`,
    `- A partir desse documento oficial, **selecione automaticamente** as **Competências Gerais**, **Competências Específicas** e **Habilidades / Objetivos de Aprendizagem** (citando os códigos alfanuméricos oficiais e suas descrições fiéis) que **mais se adequam** à etapa (${stageLabel} — ${yearLabel}), ao componente (${componentLabel}), ao tema e ao objetivo solicitados.`,
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

  if (deviceSources.length > 0) {
    lines.push(
      '- **Fontes Adicionadas pelo(a) Docente — Uso Obrigatório como uma das Fontes (arquivos do dispositivo, textos copiados e/ou links de sites):**'
    );
    for (const src of deviceSources) {
      lines.push(`  - ${formatDeviceSourceForPrompt(src, includeExcerpts)}`);
    }
    lines.push(
      '- **Diretriz obrigatória sobre as fontes adicionadas**: utilize obrigatoriamente os arquivos, textos copiados e/ou endereços/links de sites listados acima como **uma das fontes centrais de consulta e fundamentação** do material gerado. Consulte os links indicados (ou sinalize caso não tenha acesso à web), incorpore fielmente os textos colados, referencie as fontes utilizadas e jamais invente citações, dados ou URLs fora das fontes informadas.'
    );
  }

  return lines.join('\n');
}

/**
 * Monta os blocos de direção de arte de Slides Editoriais (reutilizável tanto no modo slides puro
 * quanto quando Slides Editoriais é combinado com outros recursos).
 */
function buildSlideArtSections(state: PromptFormState): {
  artLines: string[];
  photoLines: string[];
  narrativeLines: string[];
  deliveryLines: string[];
} {
  const cfg = state.slideConfig;
  const aesthetic =
    SLIDE_AESTHETIC_PROFILES[cfg.aestheticStyle] ?? SLIDE_AESTHETIC_PROFILES.editorial_minimalista;
  const palette =
    SLIDE_PALETTE_OPTIONS.find((p) => p.id === cfg.paletteId) ?? SLIDE_PALETTE_OPTIONS[0];
  const typography =
    SLIDE_TYPOGRAPHY_OPTIONS.find((t) => t.id === cfg.typographyId) ?? SLIDE_TYPOGRAPHY_OPTIONS[0];

  const maxWordsText = resolveMaxWordsPerSlide(cfg);
  const paletteLine = cfg.customPaletteNote.trim()
    ? `${palette.promptInstruction} Observação adicional de cor: ${cfg.customPaletteNote.trim()}.`
    : palette.promptInstruction;

  const artLines = [
    `- Estética: ${aesthetic.aestheticLine}`,
    `- Paleta: ${paletteLine}`,
    `- Tipografia: ${typography.promptInstruction}`,
    '- Grid consistente, margens generosas e alinhamento rigoroso.',
    `- Hierarquia clara: 1 ideia por slide. Máx. ${maxWordsText} palavras de texto corrido por slide; prefira frases curtas e de impacto.`,
    '- Varie os layouts: foto full-bleed com título sobreposto, split 50/50 foto+texto, número gigante como destaque, citação centralizada, grade de 3 itens, slide de transição só com uma palavra.',
    '- Nada de clip-art, ícones genéricos, gradientes chamativos, sombras pesadas ou bullets em excesso.',
  ];

  const photoLines: string[] = [];
  if (cfg.includePhotographyRules) {
    const sources = cfg.photoSources.trim() || 'Unsplash, Pexels';
    photoLines.push(
      '- Use fotos reais de alta qualidade em quase todos os slides, no estilo de fotografia editorial: luz natural, profundidade de campo, composição cinematográfica, tons harmonizados com a paleta.',
      `- Procure as imagens em bancos gratuitos (${sources}) e use apenas URLs que você verificou que existem. Nunca invente links de imagem (caso não tenha acesso à web, forneça o descritivo fotográfico exato + termos de busca em inglês para o professor baixar).`,
      '- Quando houver texto sobre foto, aplique overlay escuro ou gradiente sutil para garantir legibilidade (contraste AA).',
      '- Mantenha coerência: mesma temperatura de cor e mesmo "clima" em todas.',
      '- Indique no slide a fonte/autor da foto em letra pequena e discreta.'
    );
  }

  const narrativeLines: string[] = [];
  if (cfg.includeNarrativeArc) {
    narrativeLines.push(
      '1. Capa impactante (foto full-bleed + título forte)',
      '2. Gancho: uma pergunta, dado surpreendente ou citação',
      '3. Desenvolvimento em blocos com transições visuais',
      '4. Um slide de "momento uau" (dado gigante ou imagem marcante)',
      '5. Fechamento memorável + chamada para ação'
    );
    if (cfg.narrativeCustomNotes.trim()) {
      narrativeLines.push(`- Diretriz narrativa complementar: ${cfg.narrativeCustomNotes.trim()}`);
    }
  }

  const deliveryLines: string[] = [];
  if (cfg.includeFiveLinePreview) {
    deliveryLines.push(
      '- Antes de criar os slides, mostre em 5 linhas: paleta (hex), fontes e o roteiro dos slides (título de cada um). Depois gere a apresentação completa.'
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

  return { artLines, photoLines, narrativeLines, deliveryLines };
}

/**
 * Gera o prompt de Slides Editoriais seguindo fielmente o modelo de Direção de Arte
 * fornecido pelo usuário (Apple Keynote / Kinfolk / Monocle), integrado ao comando
 * fixo de leitura oficial da BNCC/CNCT/EJA, Taxonomia de Bloom interna e documentos opcionais.
 */
export function buildEditorialSlidePrompt(state: PromptFormState): string {
  const stage = findStageById(state.stage);
  const cfg = state.slideConfig;
  const aesthetic =
    SLIDE_AESTHETIC_PROFILES[cfg.aestheticStyle] ?? SLIDE_AESTHETIC_PROFILES.editorial_minimalista;

  const yearLabel = state.yearOrTrack.trim() || '[ano / série / segmento]';
  const componentLabel = state.component.trim() || '[componente curricular]';
  const stageLabel = stage?.label ?? '[etapa da Educação Básica]';

  const topicText = state.topic.trim() || '[tema da aula ou apresentação]';
  const audienceText =
    cfg.audienceCustom.trim() ||
    `Estudantes de ${stageLabel} (${yearLabel}) — componente: ${componentLabel}`;
  const objectiveText =
    cfg.impactObjective.trim() ||
    'Formule automaticamente um objetivo de aprendizagem e impacto claro e mensurável (o que a turma deve sentir, entender e ser capaz de fazer ao final), alinhado às habilidades oficiais selecionadas e conduzindo toda a apresentação com intencionalidade pedagógica.';
  const slideCountText = resolveSlideCount(cfg);
  const baseMaterialText =
    cfg.baseMaterial.trim() ||
    '[cole aqui o texto, tópicos, plano de aula ou artigo de base, se houver]';

  const { artLines, photoLines, narrativeLines, deliveryLines } = buildSlideArtSections(state);
  const sections: string[] = [];

  // Persona (fiel ao modelo)
  sections.push(aesthetic.persona);

  // ## Conteúdo
  const contentLines = [
    '## Conteúdo',
    `- Tema: ${topicText}`,
    `- Público: ${audienceText}`,
    `- Objetivo: ${objectiveText}`,
    `- Progressão cognitiva: ${INTERNAL_BLOOM_DIRECTIVE}`,
    `- Quantidade: ${slideCountText} slides`,
    '- Idioma: português do Brasil',
  ];

  if (cfg.alignWithBncc) {
    contentLines.push(`- Contexto escolar: ${stageLabel} (${yearLabel}) — ${componentLabel}`);
    contentLines.push(`- ${buildFixedOfficialCurriculumCommand(state, true)}`);
  } else if ((state.selectedDeviceSources ?? []).length > 0) {
    const includeExcerpts = state.includeSourceExcerpts !== false;
    contentLines.push(
      `- FONTES OBRIGATÓRIAS ADICIONADAS PELO(A) DOCENTE: Utilize obrigatoriamente como uma das fontes centrais de consulta e fundamentação: ${(
        state.selectedDeviceSources ?? []
      )
        .map((s) => formatDeviceSourceForPrompt(s, includeExcerpts))
        .join(' || ')}.`
    );
  }

  contentLines.push(`- Material de base (se houver): ${baseMaterialText}`);
  sections.push(contentLines.join('\n'));

  // ## Direção de arte
  sections.push(['## Direção de arte', ...artLines].join('\n'));

  // ## Fotografia (prioridade máxima)
  if (photoLines.length > 0) {
    sections.push(['## Fotografia (prioridade máxima)', ...photoLines].join('\n'));
  }

  // ## Estrutura narrativa
  if (narrativeLines.length > 0) {
    sections.push(['## Estrutura narrativa', ...narrativeLines].join('\n'));
  }

  // Inclusão / Acessibilidade
  if (state.inclusionEnabled) {
    const incLines = ['## Acessibilidade e Inclusão (DUA)'];
    if (state.inclusionProfiles.length > 0) {
      incLines.push(
        `- Garantir acessibilidade visual e cognitiva considerando: ${state.inclusionProfiles.join('; ')}.`
      );
    } else {
      incLines.push(
        '- Aplicar princípios do Desenho Universal para a Aprendizagem (DUA), favorecendo clareza visual, múltiplos meios de representação e acessibilidade.'
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
  const finalDelivery = ['## Entrega', ...deliveryLines];
  if (state.extraConstraints.trim()) {
    finalDelivery.push(`- Restrições e observações adicionais: ${state.extraConstraints.trim()}`);
  }
  sections.push(finalDelivery.join('\n'));

  return sections.join('\n\n');
}

/**
 * Gera prompts pedagógicos estruturados (sempre no padrão Estruturado completo),
 * suportando 1 ou vários recursos articulados simultaneamente, com Taxonomia de Bloom
 * interna, leitura oficial da BNCC/CNCT/EJA e regra rigorosa de ENEM por etapa.
 */
export function buildPedagogicalPrompt(state: PromptFormState): string {
  const selectedTemplates = resolveSelectedTemplates(state);
  const isSlidesOnly =
    selectedTemplates.length === 1 && Boolean(selectedTemplates[0].isEditorialSlides);
  if (isSlidesOnly) {
    return buildEditorialSlidePrompt(state);
  }

  const stage = findStageById(state.stage);
  const allowEnem = isEnemStage(state.stage);
  const hasSlides = selectedTemplates.some((t) => t.isEditorialSlides);
  const nonSlideTemplates = selectedTemplates.filter((t) => !t.isEditorialSlides);
  const hasPrivacyTemplate = selectedTemplates.some((t) => t.isDocumentWithPrivacy);

  const stageLabel = stage ? `${stage.label} (${stage.badge})` : '[selecione a Etapa da Educação Básica]';
  const yearLabel = state.yearOrTrack.trim() || '[selecione o Ano / Série / Segmento]';
  const componentLabel = state.component.trim() || '[selecione o Componente Curricular]';
  const topicText = state.topic.trim() || '[inserir tema ou assunto principal]';

  const resourceSummary =
    selectedTemplates.length === 0
      ? '[selecione um ou mais recursos no Passo 1]'
      : selectedTemplates.length === 1
        ? selectedTemplates[0].name
        : `Conjunto articulado com ${selectedTemplates.length} recursos: ${selectedTemplates
          .map((t) => t.name)
          .join(' + ')}`;

  const objectiveDirective =
    `Sempre que cabível ao(s) recurso(s) solicitado(s) (${resourceSummary}), formule explicitamente os **Objetivos de Aprendizagem** claros, observáveis e mensuráveis, alinhados às competências/habilidades selecionadas do documento oficial e à progressão cognitiva da Taxonomia de Bloom Revisada (ou, em documentos estritamente institucionais, a finalidade pedagógica/institucional). Conduza toda a elaboração do material com **intencionalidade pedagógica** explícita, garantindo coerência rigorosa entre objetivos, desenvolvimento, mediação e evidências/verificação da aprendizagem.`;

  const sections: string[] = [];

  // 1. Papel e Especialidade (Persona)
  if (selectedTemplates.length === 0) {
    sections.push(
      '# 1. Papel e Especialidade (Persona)\nVocê é um(a) especialista em Educação Básica brasileira, currículo (BNCC, BNCC Computação, CNCT e DCNs da EJA) e design instrucional com alto rigor didático.'
    );
  } else if (selectedTemplates.length === 1) {
    sections.push(`# 1. Papel e Especialidade (Persona)\n${selectedTemplates[0].persona}`);
  } else {
    const personaItems = selectedTemplates.map((t) => `- **Para ${t.shortName}**: ${t.persona}`);
    sections.push(
      [
        '# 1. Papel e Especialidade (Persona Integrada)',
        `Atue de forma integrada reunindo as especialidades necessárias para produzir um pacote pedagógico coeso e articulado contendo **${selectedTemplates.length} recursos complementares** sobre o mesmo tema:`,
        ...personaItems,
      ].join('\n')
    );
  }

  // 2. Contexto Escolar, Intencionalidade Pedagógica e Alinhamento Curricular Oficial
  const contextLines = [
    '# 2. Contexto Escolar, Intencionalidade Pedagógica e Alinhamento Curricular Oficial',
    `- **Recurso(s) solicitado(s)**: ${resourceSummary}`,
    `- **Etapa de Ensino**: ${stageLabel}`,
    `- **Ano / Série / Segmento**: ${yearLabel}`,
    `- **Componente Curricular / Campo**: ${componentLabel}`,
    `- **Tema Central**: ${topicText}`,
    `- **Progressão Cognitiva (Taxonomia de Bloom Revisada — aplicação interna obrigatória)**: ${INTERNAL_BLOOM_DIRECTIVE}`,
    `- **Objetivos de Aprendizagem e Intencionalidade Pedagógica (geração obrigatória pela IA)**: ${objectiveDirective}`,
    '',
    buildFixedOfficialCurriculumCommand(state, false),
  ];

  if (state.classContext.trim()) {
    contextLines.push('');
    contextLines.push(`- **Realidade e perfil da turma**: ${state.classContext.trim()}`);
  }

  sections.push(contextLines.join('\n'));

  // 3. Diretrizes Pedagógicas e Parâmetros do(s) Recurso(s)
  const paramLines = ['# 3. Diretrizes Pedagógicas e Parâmetros do(s) Recurso(s)'];
  if (state.methodology.trim()) {
    paramLines.push(`- **Metodologia / Abordagem**: ${state.methodology.trim()}`);
  }
  if (state.tone.trim()) {
    paramLines.push(`- **Tom e Registro Linguístico**: ${state.tone.trim()}`);
  }
  if (!state.methodology.trim() && !state.tone.trim()) {
    paramLines.push(
      '- **Abordagem e Linguagem**: utilize metodologia ativa e linguagem clara, engajadora e rigorosamente adequada à faixa etária e à etapa de ensino.'
    );
  }

  if (state.durationOrExtent.trim() && !selectedTemplates.every((t) => t.category === 'documentais')) {
    paramLines.push(`- **Tempo / Extensão prevista**: ${state.durationOrExtent.trim()}`);
  }

  for (const tpl of nonSlideTemplates) {
    const fieldLines: string[] = [];
    for (const field of tpl.specificFields) {
      const resolved = resolveSpecificFieldDisplayValue(field, state.specificValues, allowEnem);
      if (resolved) {
        fieldLines.push(`- **${field.label}**: ${resolved}`);
      }
    }
    if (fieldLines.length > 0) {
      if (selectedTemplates.length > 1) {
        paramLines.push(`- **Parâmetros de ${tpl.shortName}**:`);
        for (const fl of fieldLines) {
          paramLines.push(`  ${fl}`);
        }
      } else {
        paramLines.push(...fieldLines);
      }
    }
  }

  sections.push(paramLines.join('\n'));

  // 4. Estrutura Obrigatória do Material
  const structureLines = ['# 4. Estrutura Obrigatória do Material'];
  if (selectedTemplates.length === 0) {
    structureLines.push(
      'Selecione um ou mais recursos no Passo 1 para listar aqui a estrutura detalhada exigida da IA.'
    );
  } else if (selectedTemplates.length === 1) {
    structureLines.push('Organize a resposta contendo obrigatoriamente os seguintes elementos:');
    selectedTemplates[0].outputDeliverables.forEach((item, idx) => {
      structureLines.push(`${idx + 1}. ${item}`);
    });
  } else {
    structureLines.push(
      'Entregue todos os recursos selecionados abaixo de forma **articulada, coerente entre si e claramente separada em partes numeradas**:'
    );
    selectedTemplates.forEach((tpl, partIdx) => {
      structureLines.push(`\n**Parte ${partIdx + 1} — ${tpl.name}:**`);
      tpl.outputDeliverables.forEach((item, idx) => {
        structureLines.push(`${idx + 1}. ${item}`);
      });
    });
  }
  sections.push(structureLines.join('\n'));

  let nextStepNum = 5;

  // Se Slides Editoriais estiver combinado com outros recursos, inclui bloco completo de Direção de Arte
  if (hasSlides) {
    const cfg = state.slideConfig;
    const { artLines, photoLines, narrativeLines, deliveryLines } = buildSlideArtSections(state);
    const slideBlock: string[] = [
      `# ${nextStepNum}. Diretrizes Obrigatórias de Direção de Arte para os Slides Editoriais`,
      `- **Quantidade de slides**: ${resolveSlideCount(cfg)} slides`,
    ];
    if (cfg.audienceCustom.trim()) {
      slideBlock.push(`- **Público específico dos slides**: ${cfg.audienceCustom.trim()}`);
    }
    if (cfg.impactObjective.trim()) {
      slideBlock.push(`- **Objetivo específico dos slides**: ${cfg.impactObjective.trim()}`);
    }
    if (cfg.baseMaterial.trim()) {
      slideBlock.push(`- **Material de base para os slides**: ${cfg.baseMaterial.trim()}`);
    }
    slideBlock.push(...artLines);
    if (photoLines.length > 0) {
      slideBlock.push('**Fotografia Editorial:**', ...photoLines);
    }
    if (narrativeLines.length > 0) {
      slideBlock.push('**Estrutura Narrativa (5 Atos):**', ...narrativeLines);
    }
    slideBlock.push('**Entrega dos Slides:**', ...deliveryLines);
    sections.push(slideBlock.join('\n'));
    nextStepNum += 1;
  }

  // Educação Inclusiva, DUA e Ética / LGPD
  const ethicsLines: string[] = [];
  if (state.inclusionEnabled) {
    ethicsLines.push(`# ${nextStepNum}. Educação Inclusiva, Acessibilidade e DUA`);
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

  if (hasPrivacyTemplate) {
    if (ethicsLines.length === 0) {
      ethicsLines.push(`# ${nextStepNum}. Diretrizes Éticas e Proteção de Dados (LGPD)`);
    }
    ethicsLines.push(
      '- **Conformidade LGPD e Ética Pedagógica**: adote linguagem respeitosa, baseada em evidências observáveis e livre de rótulos patologizantes; utilize marcadores como `[NOME DO ESTUDANTE]`, `[DATA]` e `[ASSINATURA]` onde houver dados identificáveis.'
    );
  }

  if (ethicsLines.length > 0) {
    sections.push(ethicsLines.join('\n'));
    nextStepNum += 1;
  }

  // Formato de Saída e Critérios de Qualidade
  const outputLines = [
    `# ${nextStepNum}. Formato de Saída e Critérios de Qualidade`,
    '- **Idioma**: Português do Brasil (adequado à realidade escolar brasileira).',
    `- **Formato**: ${state.outputFormat.trim() ||
    'Documento estruturado em Markdown com títulos claros, tabelas e listas prontas para uso docente ou impressão'
    }.`,
    '- **Rigor e veracidade**: não invente dados estatísticos, citações bibliográficas ou códigos oficiais inexistentes; caso sugira referências externas, sinalize para conferência docente.',
  ];

  if (!allowEnem && state.stage !== '') {
    outputLines.push(
      '- **Adequação à etapa**: respeite estritamente a faixa etária e o currículo da etapa selecionada (não utilize referências, matrizes ou linguagem de exames do Ensino Médio/ENEM).'
    );
  }

  if (state.extraConstraints.trim()) {
    outputLines.push(`- **Restrições adicionais do professor**: ${state.extraConstraints.trim()}`);
  }

  sections.push(outputLines.join('\n'));

  return sections.join('\n\n');
}

export function buildPrompt(state: PromptFormState): string {
  const selected = resolveSelectedTemplates(state);
  if (selected.length === 1 && selected[0].isEditorialSlides) {
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
  const selectedTemplates = resolveSelectedTemplates(state);
  const isSlidesOnly =
    selectedTemplates.length === 1 && Boolean(selectedTemplates[0].isEditorialSlides);
  const extraDocs = resolveAdditionalDocuments(state);
  const checks: QualityCheckItem[] = [];

  if (isSlidesOnly) {
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
        id: 'stage_audience',
        label: 'Etapa de ensino ou público-alvo informado',
        passed: Boolean(state.stage || cfg.audienceCustom.trim()),
        tip: 'Selecione a etapa escolar ou informe o público específico dos slides.',
        weight: 20,
      },
      {
        id: 'art_photo',
        label: 'Direção de arte + fotografia editorial + arco narrativo ativos',
        passed: cfg.includePhotographyRules && cfg.includeNarrativeArc,
        tip: 'Mantenha fotografia editorial e arco narrativo em 5 atos ativos.',
        weight: 20,
      },
      {
        id: 'delivery_checklist',
        label: 'Prévia em 5 linhas + checklist de auto-revisão',
        passed: cfg.includeFiveLinePreview && cfg.includeSelfReviewChecklist,
        tip: 'Ative a prévia em 5 linhas e o checklist final de revisão.',
        weight: 15,
      },
      {
        id: 'base_material',
        label: 'Material de base ou consulta oficial à BNCC ativa',
        passed:
          cfg.baseMaterial.trim().length >= 15 ||
          extraDocs.length > 0 ||
          (cfg.alignWithBncc && Boolean(state.stage)),
        tip: 'Selecione a etapa (BNCC automática) ou cole tópicos de base.',
        weight: 15,
      }
    );
  } else {
    const hasSpecificDetails =
      state.classContext.trim().length >= 8 ||
      Boolean(state.yearOrTrack && state.component) ||
      Object.entries(state.specificValues).some(([k, v]) => {
        if (k.endsWith('__other')) return typeof v === 'string' && v.trim().length >= 2;
        if (typeof v === 'string') return v.trim().length >= 2 && v !== CUSTOM_OPTION_SENTINEL;
        if (Array.isArray(v)) return v.length > 0;
        return v === true;
      });

    checks.push(
      {
        id: 'resources',
        label: 'Recurso(s) pedagógico(s) selecionado(s)',
        passed: selectedTemplates.length > 0,
        tip: 'Selecione 1 ou mais recursos no Passo 1 (ex.: Plano de Aula, Slides, Prova...).',
        weight: 20,
      },
      {
        id: 'stage',
        label: 'Etapa da Educação Básica selecionada (BNCC oficial ativa)',
        passed: Boolean(state.stage),
        tip: 'Escolha a etapa da Educação Básica no Passo 2 para ativar o documento oficial correspondente.',
        weight: 20,
      },
      {
        id: 'topic',
        label: 'Tema específico definido',
        passed: state.topic.trim().length >= 5,
        tip: 'Escreva um tema claro e delimitado (mínimo 5 caracteres).',
        weight: 30,
      },
      {
        id: 'context',
        label: 'Ano/componente, contexto da turma ou parâmetros do recurso',
        passed: hasSpecificDetails,
        tip: 'Escolha o ano/componente ou preencha detalhes no Passo 3.',
        weight: 20,
      },
      {
        id: 'inclusion',
        label: 'Inclusão / DUA configurada',
        passed: state.inclusionEnabled,
        tip: 'Ative o Desenho Universal para a Aprendizagem (DUA) para maior acessibilidade.',
        weight: 10,
      }
    );
  }

  const score = checks.reduce((acc, item) => acc + (item.passed ? item.weight : 0), 0);
  const level: PromptQualityAnalysis['level'] =
    score >= 90 ? 'Exemplar' : score >= 75 ? 'Excelente' : score >= 50 ? 'Bom' : 'Inicial';

  return { score, level, checks };
}

export { getTemplateById };
