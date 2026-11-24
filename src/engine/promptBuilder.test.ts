import { describe, expect, it } from 'vitest';
import {
  createDefaultSlideConfig,
  createInitialPromptState,
  DEMO_PRESETS,
  getDefaultSpecificValues,
  getTemplateById,
} from '../data/templates';
import { analyzePromptQuality, buildPrompt, estimatePromptStats } from './promptBuilder';

describe('promptBuilder engine', () => {
  it('gera o prompt de Slides Editoriais seguindo fielmente o modelo de Direção de Arte e o comando fixo da BNCC', () => {
    const base = createInitialPromptState();
    const state = {
      ...base,
      category: 'complementares' as const,
      templateId: 'slides_editorial',
      stage: 'ensino_medio' as const,
      yearOrTrack: '2ª série do Ensino Médio',
      component: 'Biologia (Ciências da Natureza)',
      topic: 'Energia Solar e Sustentabilidade',
      selectedExtraDocs: ['enem'],
      additionalDocuments: 'Relatório do IPCC (resumo didático)',
      slideConfig: {
        ...createDefaultSlideConfig(),
        slideCount: '10–15',
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
    expect(prompt).toContain('## Direção de arte');
    expect(prompt).toContain('Máx. 25 palavras de texto corrido por slide');
    expect(prompt).toContain('## Fotografia (prioridade máxima)');
    expect(prompt).toContain('## Estrutura narrativa');
    expect(prompt).toContain('## Entrega');
    expect(prompt).toContain('mostre em 5 linhas');
    expect(prompt).toContain('revise cada slide contra este checklist');
  });

  it('insere comando fixo para a IA ler o documento oficial e gerar objetivos com intencionalidade pedagógica', () => {
    const state = createInitialPromptState();
    state.topic = 'Equilíbrio Termodinâmico e Máquinas Térmicas';
    state.selectedExtraDocs = ['dctma'];
    state.additionalDocuments = 'PPP da Escola Estadual Modelo';
    state.inclusionEnabled = true;

    const prompt = buildPrompt(state);

    expect(prompt).toContain('# 1. Papel e Especialidade (Persona)');
    expect(prompt).toContain('COMANDO FIXO — Consulta Obrigatória ao Documento Oficial');
    expect(prompt).toContain('selecione automaticamente');
    expect(prompt).toContain('intencionalidade pedagógica');
    expect(prompt).toContain('Sempre que cabível ao recurso solicitado');
    expect(prompt).toContain('Base Nacional Comum Curricular — BNCC');
    expect(prompt).toContain('Documento Curricular do Território Maranhense');
    expect(prompt).toContain('PPP da Escola Estadual Modelo');
    expect(prompt).toContain('Taxonomia de Bloom');
    expect(prompt).toContain('Educação Inclusiva, Acessibilidade e DUA');
  });

  it('inclui cláusula de proteção LGPD em documentos pedagógicos como PEI e Relatórios', () => {
    const template = getTemplateById('pei_adaptacao');
    const state = {
      ...createInitialPromptState(),
      category: 'documentais' as const,
      templateId: 'pei_adaptacao',
      topic: 'Adaptação em Matemática — Multiplicação',
      specificValues: getDefaultSpecificValues(template),
    };

    const prompt = buildPrompt(state);

    expect(prompt).toContain('LGPD');
    expect(prompt).toContain('[NOME DO ESTUDANTE]');
    expect(prompt).toContain('COMANDO FIXO — Consulta Obrigatória ao Documento Oficial');
  });

  it('suporta o Ensino Médio Técnico (BNCC + CNCT) e EJA com seus documentos oficiais específicos', () => {
    const presetTec = DEMO_PRESETS.find((p) => p.id === 'demo_prova_tecnico')!;
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
      topic: 'Ciclo Hidrológico na Comunidade Local',
      classContext: 'Turma de 25 alunos do 5º ano com perfil participativo',
    };
    const richQuality = analyzePromptQuality(richState);

    expect(richQuality.score).toBeGreaterThan(initialQuality.score);
    expect(richQuality.score).toBe(100);
    expect(richQuality.level).toBe('Exemplar');

    const stats = estimatePromptStats(buildPrompt(richState));
    expect(stats.words).toBeGreaterThan(100);
    expect(stats.estimatedTokens).toBeGreaterThan(stats.words);
  });
});
