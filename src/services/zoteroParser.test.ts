import { describe, expect, it } from 'vitest';
import {
  exportPromptToRis,
  formatZoteroReferenceForPrompt,
  parseZoteroFile,
} from './zoteroParser';

describe('zoteroParser', () => {
  it('faz parse de arquivo CSL-JSON exportado pelo Zotero', () => {
    const cslJson = JSON.stringify([
      {
        id: 'item1',
        type: 'article-journal',
        title: 'Pensamento Computacional na Educação Básica Brasileira',
        author: [
          { family: 'Silva', given: 'Maria' },
          { family: 'Santos', given: 'João' },
        ],
        issued: { 'date-parts': [[2024]] },
        'container-title': 'Revista Brasileira de Informática na Educação',
        DOI: '10.5753/rbie.2024.001',
        abstract: 'Estudo sobre a implementação da BNCC de Computação em escolas públicas.',
      },
    ]);

    const refs = parseZoteroFile(cslJson, 'colecao-profcomp.json');
    expect(refs).toHaveLength(1);
    expect(refs[0].title).toBe('Pensamento Computacional na Educação Básica Brasileira');
    expect(refs[0].authors).toEqual(['Silva, Maria', 'Santos, João']);
    expect(refs[0].year).toBe('2024');
    expect(refs[0].source).toBe('Revista Brasileira de Informática na Educação');
    expect(refs[0].doi).toBe('10.5753/rbie.2024.001');
  });

  it('faz parse de arquivo BibTeX (.bib) com acentos LaTeX e chaves aninhadas', () => {
    const bib = [
      '@article{freire2023educacao,',
      "  title = {Pedagogia da {Autonomia}: saberes necess{\\'a}rios {\\`a} pr{\\'a}tica educativa},",
      '  author = {Freire, Paulo and Oliveira, Ana},',
      '  year = {2023},',
      '  publisher = {Paz e Terra},',
      "  abstract = {Reflex{\\~a}o cr{\\'i}tica sobre a doc{\\^e}ncia e intencionalidade pedag{\\'o}gica.}",
      '}',
    ].join('\n');
    const refs = parseZoteroFile(bib, 'referencias.bib');
    expect(refs).toHaveLength(1);
    expect(refs[0].title).toContain('Pedagogia da Autonomia');
    expect(refs[0].title).toContain('necessários');
    expect(refs[0].authors).toEqual(['Freire, Paulo', 'Oliveira, Ana']);
    expect(refs[0].year).toBe('2023');
    expect(refs[0].source).toBe('Paz e Terra');
    expect(refs[0].abstractNote).toContain('Reflexão');
  });

  it('faz parse de arquivo RIS (.ris) exportado pelo Zotero / SciELO', () => {
    const ris = [
      'TY  - JOUR',
      'TI  - Desenho Universal para a Aprendizagem na Escola Inclusiva',
      'AU  - Costa, Fernanda',
      'AU  - Lima, Carlos',
      'PY  - 2022',
      'JO  - Cadernos de Educação Especial',
      'AB  - Estratégias práticas de DUA para turmas heterogêneas.',
      'DO  - 10.1590/dua.2022.12',
      'ER  - ',
    ].join('\n');

    const refs = parseZoteroFile(ris, 'acervo.ris');
    expect(refs).toHaveLength(1);
    expect(refs[0].title).toBe('Desenho Universal para a Aprendizagem na Escola Inclusiva');
    expect(refs[0].authors).toEqual(['Costa, Fernanda', 'Lima, Carlos']);
    expect(refs[0].year).toBe('2022');
    expect(refs[0].doi).toBe('10.1590/dua.2022.12');

    const formatted = formatZoteroReferenceForPrompt(refs[0], true);
    expect(formatted).toContain('Costa, Fernanda; Lima, Carlos (2022)');
    expect(formatted).toContain('Resumo/Síntese: Estratégias práticas de DUA');
  });

  it('gera arquivo .ris válido para importação no Zotero', () => {
    const risOut = exportPromptToRis({
      title: 'Plano de Aula: Algoritmos Desplugados',
      stageLabel: 'EF Anos Finais',
      component: 'Computação',
      templateName: 'Plano de Aula',
      promptText: 'Prompt completo de teste',
    });

    expect(risOut).toContain('TY  - ELEC');
    expect(risOut).toContain('TI  - Plano de Aula: Algoritmos Desplugados');
    expect(risOut).toContain('PB  - Caderno de Contexto · PROFCOMP-MA / UFMA');
    expect(risOut).toContain('ER  - ');
  });
});
