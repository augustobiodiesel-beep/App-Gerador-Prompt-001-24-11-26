import { describe, expect, it } from 'vitest';
import { getStageById } from '../data/education';
import {
  createDefaultSlideConfig,
  createInitialPromptState,
  DEMO_PRESETS,
} from '../data/templates';
import { analyzePromptQuality, buildPrompt, estimatePromptStats } from './promptBuilder';

describe('promptBuilder engine', () => {
  it('inicia com estado completamente vazio quando não usa exemplo pronto', () => {
    const emptyState = createInitialPromptState();
    expect(emptyState.selectedTemplateIds).toEqual([]);
    expect(emptyState.stage).toBe('');
    expect(emptyState.yearOrTrack).toBe('');
    expect(emptyState.component).toBe('');
    expect(emptyState.topic).toBe('');
    expect(emptyState.methodology).toBe('');
    expect(emptyState.tone).toBe('');
    expect(emptyState.outputFormat).toBe('');
    expect(emptyState.inclusionEnabled).toBe(false);

    const quality = analyzePromptQuality(emptyState);
    expect(quality.score).toBe(0);
    expect(quality.level).toBe('Inicial');
  });

  it('gera o prompt de Slides Editoriais seguindo fielmente o modelo de Direção de Arte, opções personalizadas e comando fixo da BNCC', () => {
    const base = createInitialPromptState();
    const state = {
      ...base,
      category: 'complementares' as const,
      templateId: 'slides_editorial',
      selectedTemplateIds: ['slides_editorial'],
      stage: 'ensino_medio' as const,
      yearOrTrack: '2ª série do Ensino Médio',
      component: 'Biologia (Ciências da Natureza)',
      topic: 'Energia Solar e Sustentabilidade',
      selectedExtraDocs: ['enem'],
      additionalDocuments: 'Relatório do IPCC (resumo didático)',
      slideConfig: {
        ...createDefaultSlideConfig(),
        slideCount: '__outro__',
        slideCountCustom: '18',
        maxWordsPerSlide: '__outro__',
        maxWordsCustom: '30',
        audienceCustom: 'Estudantes do 2º ano do Ensino Médio',
        impactObjective: 'Entender a transição energética e propor soluções na escola',
        baseMaterial: 'Dados da matriz elétrica brasileira',
      },
    };

    const prompt = buildPrompt(state);

    expect(prompt).toContain('Você é diretor de arte e designer de apresentações sênior');
    expect(prompt).toContain('Kinfolk/Monocle');
    expect(prompt).toContain('COMANDO FIXO DE ALINHAMENTO CURRICULAR OFICIAL');
    expect(prompt).toContain('Selecione automaticamente as Competências Gerais');
    expect(prompt).toContain('Matriz de Referência do ENEM');
    expect(prompt).toContain('Relatório do IPCC (resumo didático)');
    expect(prompt).toContain('18 slides');
    expect(prompt).toContain('Máx. 30 palavras de texto corrido por slide');
    expect(prompt).toContain('Taxonomia de Bloom Revisada');
    expect(prompt).toContain('## Fotografia (prioridade máxima)');
    expect(prompt).toContain('## Estrutura narrativa');
    expect(prompt).toContain('## Entrega');
    expect(prompt).toContain('mostre em 5 linhas');
    expect(prompt).toContain('revise cada slide contra este checklist');
  });

  it('permite multisseleção de recursos entre categorias e articula todos em um único prompt estruturado', () => {
    const state = {
      ...createInitialPromptState(),
      selectedTemplateIds: ['plano_aula', 'slides_editorial', 'banco_questoes'],
      templateId: 'plano_aula',
      stage: 'ef_anos_finais' as const,
      yearOrTrack: '8º ano',
      component: 'Computação / Pensamento Computacional (BNCC)',
      topic: 'Algoritmos e Decomposição no Cotidiano',
      specificValues: {
        quantidadeItens: '__outro__',
        quantidadeItens__other: '12 questões progressivas',
        tipoQuestoes: 'Subjetivas / Discursivas (abertas)',
      },
      slideConfig: {
        ...createDefaultSlideConfig(),
        slideCount: '8–10',
        maxWordsPerSlide: '20',
      },
    };

    const prompt = buildPrompt(state);

    expect(prompt).toContain('Conjunto articulado com 3 recursos');
    expect(prompt).toContain('Parte 1 — Plano de Aula Completo');
    expect(prompt).toContain('Parte 2 — Slides Editoriais Premium');
    expect(prompt).toContain('Parte 3 — Banco de Questões');
    expect(prompt).toContain('Diretrizes Obrigatórias de Direção de Arte para os Slides Editoriais');
    expect(prompt).toContain('12 questões progressivas');
    expect(prompt).toContain('Subjetivas / Discursivas (abertas)');
    expect(prompt).toContain('Complemento da BNCC de Computação (Resolução CNE/CEB nº 1/2022)');
    expect(prompt).toContain('Taxonomia de Bloom Revisada');
  });

  it('exclui referências ao ENEM para etapas fora do Ensino Médio Regular e Médio Técnico', () => {
    const fundamentalState = {
      ...createInitialPromptState(),
      selectedTemplateIds: ['prova_avaliacao'],
      templateId: 'prova_avaliacao',
      stage: 'ef_anos_finais' as const,
      yearOrTrack: '7º ano',
      component: 'Ciências',
      topic: 'Ecossistemas Brasileiros',
      selectedExtraDocs: ['enem', 'dctma'],
      specificValues: {
        estiloItens: 'Contextualizado (padrão BNCC / ENEM)',
      },
    };

    const promptFund = buildPrompt(fundamentalState);
    expect(promptFund).not.toContain('Matriz de Referência do ENEM');
    expect(promptFund).not.toContain('padrão BNCC / ENEM');
    expect(promptFund).toContain('Documento Curricular do Território Maranhense');

    const medioState = {
      ...fundamentalState,
      stage: 'ensino_medio' as const,
      yearOrTrack: '2ª série do Ensino Médio',
    };
    const promptMedio = buildPrompt(medioState);
    expect(promptMedio).toContain('Matriz de Referência do ENEM');
    expect(promptMedio).toContain('padrão BNCC / ENEM');
  });

  it('lista os 3 eixos da BNCC Computação até o 9º ano e as 7 competências do EM acima do 9º ano', () => {
    const efFinal = getStageById('ef_anos_finais');
    expect(efFinal.components).toContain('Computação / Pensamento Computacional (BNCC)');
    expect(efFinal.components).toContain('Computação / Mundo Digital (BNCC)');
    expect(efFinal.components).toContain('Computação / Cultura Digital (BNCC)');

    const em = getStageById('ensino_medio');
    const emCompCompetencies = em.components.filter((c) => c.startsWith('Computação (BNCC EM'));
    expect(emCompCompetencies).toHaveLength(7);
  });

  it('inclui cláusula de proteção LGPD em documentos pedagógicos como PEI e Relatórios', () => {
    const state = {
      ...createInitialPromptState(),
      category: 'documentais' as const,
      selectedTemplateIds: ['pei_adaptacao'],
      templateId: 'pei_adaptacao',
      stage: 'ef_anos_iniciais' as const,
      yearOrTrack: '4º ano',
      component: 'Matemática',
      topic: 'Adaptação em Matemática — Multiplicação',
    };

    const prompt = buildPrompt(state);

    expect(prompt).toContain('LGPD');
    expect(prompt).toContain('[NOME DO ESTUDANTE]');
    expect(prompt).toContain('COMANDO FIXO — Consulta Obrigatória ao Documento Oficial');
  });

  it('suporta o Ensino Médio Técnico (BNCC + CNCT) e EJA com seus documentos oficiais específicos', () => {
    const presetTec = DEMO_PRESETS.find((p) => p.id === 'demo_prova_tecnico')!;
    expect(presetTec.label).toBe('Avaliação');

    const stateTec = {
      ...createInitialPromptState(),
      ...presetTec.state,
    };

    const promptTec = buildPrompt(stateTec);

    expect(promptTec).toContain('Ensino Médio Técnico');
    expect(promptTec).toContain('Catálogo Nacional de Cursos Técnicos (CNCT');
    expect(promptTec).toContain('Projeto Pedagógico do Curso Técnico em Informática');

    const presetEja = DEMO_PRESETS.find((p) => p.id === 'demo_eja_financas')!;
    const stateEja = {
      ...createInitialPromptState(),
      ...presetEja.state,
    };

    const promptEja = buildPrompt(stateEja);
    expect(promptEja).toContain('EJA — Educação de Jovens e Adultos');
    expect(promptEja).toContain('Resolução CNE/CEB nº 1/2021');
    expect(promptEja).toContain('Código de Defesa do Consumidor');
  });

  it('calcula pontuação de qualidade e estatísticas de tokens corretamente', () => {
    const emptyState = createInitialPromptState();
    const initialQuality = analyzePromptQuality(emptyState);

    const richState = {
      ...emptyState,
      selectedTemplateIds: ['plano_aula'],
      templateId: 'plano_aula',
      stage: 'ef_anos_iniciais' as const,
      yearOrTrack: '5º ano',
      component: 'Ciências',
      topic: 'Ciclo Hidrológico na Comunidade Local',
      classContext: 'Turma de 25 alunos do 5º ano com perfil participativo',
      inclusionEnabled: true,
    };
    const richQuality = analyzePromptQuality(richState);

    expect(richQuality.score).toBeGreaterThan(initialQuality.score);
    expect(richQuality.score).toBe(100);
    expect(richQuality.level).toBe('Exemplar');

    const stats = estimatePromptStats(buildPrompt(richState));
    expect(stats.words).toBeGreaterThan(100);
    expect(stats.estimatedTokens).toBeGreaterThan(stats.words);
  });

  it('injeta fontes anexadas do dispositivo com fundamentação obrigatória no prompt', () => {
    const state = {
      ...createInitialPromptState(),
      selectedTemplateIds: ['plano_aula'],
      templateId: 'plano_aula',
      stage: 'ef_anos_finais' as const,
      yearOrTrack: '8º ano',
      component: 'Computação / Pensamento Computacional (BNCC)',
      topic: 'Pensamento Computacional Desplugado',
      selectedDeviceSources: [
        {
          id: 'src-1',
          name: 'Computação na Educação Básica: Fundamentos e Práticas',
          fileName: 'computacao_praticas.txt',
          fileExt: 'TXT',
          excerpt: 'Abordagem prática dos pilares do Pensamento Computacional.',
          requiresManualAttach: false,
        },
        {
          id: 'src-2',
          name: 'Apostila de Algoritmos',
          fileName: 'Apostila_Algoritmos.pdf',
          fileExt: 'PDF',
          requiresManualAttach: true,
        },
      ],
      includeSourceExcerpts: true,
    };

    const prompt = buildPrompt(state);

    expect(prompt).toContain('Fontes e Materiais Anexados pelo(a) Docente');
    expect(prompt).toContain('computacao_praticas.txt');
    expect(prompt).toContain('Conteúdo/trecho extraído: Abordagem prática dos pilares');
    expect(prompt).toContain('Apostila_Algoritmos.pdf');
    expect(prompt).toContain('arquivo anexado pelo(a) docente');
  });
});
