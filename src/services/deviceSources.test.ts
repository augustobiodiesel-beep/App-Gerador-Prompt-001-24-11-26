import { describe, expect, it } from 'vitest';
import {
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
