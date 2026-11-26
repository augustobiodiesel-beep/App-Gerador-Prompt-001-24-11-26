import { describe, expect, it } from 'vitest';
import {
  createTextDeviceSource,
  createUrlDeviceSources,
  formatDeviceSourceForPrompt,
  formatFileSize,
  parseTextDeviceFile,
  readDeviceFile,
} from './deviceSources';

describe('deviceSources service', () => {
  it('lê arquivo .txt/.md do dispositivo e extrai o conteúdo para o prompt', () => {
    const sources = parseTextDeviceFile(
      'Plano Municipal de Educação do Maranhão.\nMeta 5: alfabetização até o 3º ano.',
      'plano_municipal.txt',
      1024
    );

    expect(sources).toHaveLength(1);
    expect(sources[0].name).toBe('plano municipal');
    expect(sources[0].fileExt).toBe('TXT');
    expect(sources[0].requiresManualAttach).toBe(false);
    expect(sources[0].excerpt).toContain('Meta 5: alfabetização');

    const formatted = formatDeviceSourceForPrompt(sources[0], true);
    expect(formatted).toContain('plano_municipal.txt');
    expect(formatted).toContain('Conteúdo/trecho extraído');
  });

  it('registra arquivos PDF/imagens do dispositivo indicando anexo manual junto à IA', async () => {
    const fakePdf = new File(['%PDF-1.4 fake content'], 'Apostila_Biologia_2EM.pdf', {
      type: 'application/pdf',
    });
    const sources = await readDeviceFile(fakePdf);

    expect(sources).toHaveLength(1);
    expect(sources[0].fileExt).toBe('PDF');
    expect(sources[0].fileName).toBe('Apostila_Biologia_2EM.pdf');
    expect(sources[0].requiresManualAttach).toBe(true);

    const formatted = formatDeviceSourceForPrompt(sources[0], true);
    expect(formatted).toContain('Apostila_Biologia_2EM.pdf');
    expect(formatted).toContain('arquivo anexado pelo(a) docente');
  });

  it('aceita endereços/links de sites (único ou múltiplos) e formata como fonte obrigatória', () => {
    const sources = createUrlDeviceSources(
      'basenacionalcomum.mec.gov.br/abase\nhttps://www.gov.br/inep/pt-br'
    );

    expect(sources).toHaveLength(2);
    expect(sources[0].kind).toBe('url');
    expect(sources[0].url).toBe('https://basenacionalcomum.mec.gov.br/abase');
    expect(sources[1].url).toBe('https://www.gov.br/inep/pt-br');

    const formatted = formatDeviceSourceForPrompt(sources[0], true);
    expect(formatted).toContain('[SITE / LINK]');
    expect(formatted).toContain('https://basenacionalcomum.mec.gov.br/abase');
    expect(formatted).toContain('uma das fontes obrigatórias');
  });

  it('aceita textos copiados/colados como fonte e preserva o conteúdo para o prompt', () => {
    const src = createTextDeviceSource(
      'A matriz elétrica brasileira possui mais de 80% de participação de fontes renováveis, com destaque para hidrelétrica, eólica e solar.',
      'Dados Matriz Elétrica Brasil'
    );

    expect(src.kind).toBe('text');
    expect(src.fileExt).toBe('TEXTO');
    expect(src.name).toBe('Dados Matriz Elétrica Brasil');

    const formatted = formatDeviceSourceForPrompt(src, true);
    expect(formatted).toContain('[TEXTO COPIADO]');
    expect(formatted).toContain('matriz elétrica brasileira');
  });

  it('lê arquivos JSON bibliográficos ou estruturados enviados do dispositivo', () => {
    const json = JSON.stringify([
      {
        title: 'Educação Midiática na Escola Pública',
        author: [{ family: 'Silva', given: 'Maria' }],
        issued: { 'date-parts': [[2025]] },
        abstract: 'Estudo sobre letramento digital na Educação Básica.',
      },
    ]);
    const sources = parseTextDeviceFile(json, 'referencias.json', 512);
    expect(sources).toHaveLength(1);
    expect(sources[0].authors).toEqual(['Silva, Maria']);
    expect(sources[0].year).toBe('2025');
    expect(formatFileSize(1536)).toBe('1,5 KB');
  });
});
