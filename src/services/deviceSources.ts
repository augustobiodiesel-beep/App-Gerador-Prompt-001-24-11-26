import type { DeviceSource } from '../types/prompt';

const MAX_EXCERPT_CHARS = 2400;

function makeSourceId(name: string, idx = 0): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return `src-${base || 'arquivo'}-${Date.now().toString(36)}-${idx}`;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace('.', ',')} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

function stripExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || fileName;
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCharCode(Number(num)));
}

function stripHtmlTags(text: string): string {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clipExcerpt(text: string, maxChars = MAX_EXCERPT_CHARS): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars).trim()}...`;
}

/**
 * Extrai texto simples de um arquivo .docx (ZIP com word/document.xml) 100% offline no navegador.
 * Retorna undefined se o ambiente não suportar DecompressionStream ou o arquivo for inválido.
 */
async function tryExtractDocxText(buffer: ArrayBuffer): Promise<string | undefined> {
  if (typeof DecompressionStream === 'undefined') return undefined;
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder('utf-8');

  // Procura assinatura do End of Central Directory (0x06054b50)
  let eocdOffset = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) return undefined;

  const cdOffset = view.getUint32(eocdOffset + 16, true);
  const cdEntries = view.getUint16(eocdOffset + 10, true);
  let pos = cdOffset;

  for (let e = 0; e < cdEntries; e++) {
    if (pos + 46 > bytes.length || view.getUint32(pos, true) !== 0x02014b50) break;
    const compressionMethod = view.getUint16(pos + 10, true);
    const compressedSize = view.getUint32(pos + 20, true);
    const nameLen = view.getUint16(pos + 28, true);
    const extraLen = view.getUint16(pos + 30, true);
    const commentLen = view.getUint16(pos + 32, true);
    const localHeaderOffset = view.getUint32(pos + 42, true);

    const entryName = decoder.decode(bytes.subarray(pos + 46, pos + 46 + nameLen));
    pos += 46 + nameLen + extraLen + commentLen;

    if (entryName !== 'word/document.xml') continue;

    if (localHeaderOffset + 30 > bytes.length || view.getUint32(localHeaderOffset, true) !== 0x04034b50) {
      return undefined;
    }
    const localNameLen = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
    const compressed = bytes.subarray(dataStart, dataStart + compressedSize);

    let xml = '';
    if (compressionMethod === 0) {
      xml = decoder.decode(compressed);
    } else if (compressionMethod === 8) {
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      writer.write(compressed);
      writer.close();
      const response = new Response(ds.readable);
      xml = await response.text();
    } else {
      return undefined;
    }

    const plain = decodeXmlEntities(
      xml
        .replace(/<\/w:p>/g, '\n')
        .replace(/<w:tab\/>/g, ' ')
        .replace(/<[^>]+>/g, '')
    );
    const cleaned = clipExcerpt(plain);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  return undefined;
}

/**
 * Faz o parse de arquivos de texto puro ou estruturados (.txt, .md, .csv, .html, .json, .bib, .ris)
 * enviados diretamente do dispositivo do(a) docente.
 */
export function parseTextDeviceFile(
  content: string,
  fileName: string,
  sizeBytes?: number
): DeviceSource[] {
  const ext = getFileExtension(fileName);
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error(`O arquivo "${fileName}" está vazio.`);
  }

  // Se for HTML, remove tags mantendo o texto legível
  if (ext === 'html' || ext === 'htm') {
    const plain = clipExcerpt(stripHtmlTags(trimmed));
    return [
      {
        id: makeSourceId(fileName),
        name: stripExtension(fileName),
        fileName,
        fileExt: ext.toUpperCase(),
        sizeBytes,
        excerpt: plain || undefined,
        requiresManualAttach: false,
      },
    ];
  }

  // Se for JSON de lista de referências (com title), extrai cada item; caso contrário trata como texto/dados
  if (ext === 'json') {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const list = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown[] }).items)
          ? ((parsed as { items: unknown[] }).items)
          : null;

      if (list && list.length > 0) {
        const mapped: DeviceSource[] = [];
        list.forEach((raw, idx) => {
          if (!raw || typeof raw !== 'object') return;
          const obj = raw as Record<string, unknown>;
          if (typeof obj.title !== 'string' || !obj.title.trim()) return;
          const title = stripHtmlTags(obj.title);
          const authors: string[] = [];
          if (Array.isArray(obj.author)) {
            for (const a of obj.author) {
              if (a && typeof a === 'object') {
                const rec = a as Record<string, unknown>;
                const full = [rec.family, rec.given].filter((v) => typeof v === 'string' && v.trim()).join(', ');
                if (full) authors.push(full);
                else if (typeof rec.literal === 'string' && rec.literal.trim()) authors.push(rec.literal.trim());
              }
            }
          }
          const abstractRaw =
            (typeof obj.abstract === 'string' && obj.abstract) ||
            (typeof obj.abstractNote === 'string' && obj.abstractNote) ||
            undefined;
          const yearMatch = JSON.stringify(obj.issued ?? obj.year ?? obj.date ?? '').match(/\b(1[89]\d{2}|20\d{2})\b/);
          const source =
            (typeof obj['container-title'] === 'string' && obj['container-title'].trim()) ||
            (typeof obj.publisher === 'string' && obj.publisher.trim()) ||
            undefined;
          mapped.push({
            id: makeSourceId(title, idx),
            name: title,
            fileName,
            fileExt: 'JSON',
            sizeBytes,
            authors: authors.length ? authors : undefined,
            year: yearMatch ? yearMatch[1] : undefined,
            source,
            excerpt: abstractRaw ? clipExcerpt(stripHtmlTags(abstractRaw), 600) : undefined,
            requiresManualAttach: false,
          });
        });
        if (mapped.length > 0) return mapped;
      }
    } catch {
      // Fall through to plain text handling
    }
  }

  return [
    {
      id: makeSourceId(fileName),
      name: stripExtension(fileName),
      fileName,
      fileExt: (ext || 'TXT').toUpperCase(),
      sizeBytes,
      excerpt: clipExcerpt(trimmed),
      requiresManualAttach: false,
    },
  ];
}

const PLAIN_TEXT_EXTS = new Set(['txt', 'md', 'markdown', 'csv', 'tsv', 'html', 'htm', 'json', 'bib', 'bibtex', 'ris', 'xml']);

/**
 * Lê um ou mais arquivos selecionados diretamente do dispositivo do usuário (computador ou celular).
 */
export async function readDeviceFile(file: File): Promise<DeviceSource[]> {
  const ext = getFileExtension(file.name);

  if (PLAIN_TEXT_EXTS.has(ext) || file.type.startsWith('text/')) {
    const text = await file.text();
    return parseTextDeviceFile(text, file.name, file.size);
  }

  if (ext === 'docx') {
    let extracted: string | undefined;
    try {
      const buffer = await file.arrayBuffer();
      extracted = await tryExtractDocxText(buffer);
    } catch {
      extracted = undefined;
    }

    return [
      {
        id: makeSourceId(file.name),
        name: stripExtension(file.name),
        fileName: file.name,
        fileExt: 'DOCX',
        sizeBytes: file.size,
        excerpt: extracted,
        requiresManualAttach: !extracted,
      },
    ];
  }

  // PDFs, apresentações, planilhas, imagens e demais documentos do dispositivo
  return [
    {
      id: makeSourceId(file.name),
      name: stripExtension(file.name),
      fileName: file.name,
      fileExt: (ext || 'ARQUIVO').toUpperCase(),
      sizeBytes: file.size,
      requiresManualAttach: true,
    },
  ];
}

/**
 * Formata uma fonte enviada pelo dispositivo para inserção clara no prompt gerado.
 */
export function formatDeviceSourceForPrompt(
  source: DeviceSource,
  includeExcerpt = true
): string {
  const authorPrefix =
    source.authors && source.authors.length > 0 ? `${source.authors.slice(0, 4).join('; ')}` : '';
  const yearPart = source.year ? ` (${source.year})` : '';
  const originPart = source.source ? ` — ${source.source}` : '';
  const fileTag = `[${source.fileExt}: ${source.fileName}]`;

  let line = authorPrefix
    ? `${authorPrefix}${yearPart}. "${source.name}"${originPart} ${fileTag}`
    : `"${source.name}" ${fileTag}`;

  if (includeExcerpt && source.excerpt) {
    const clipped =
      source.excerpt.length > 900 ? `${source.excerpt.slice(0, 897).trim()}...` : source.excerpt;
    line += ` | Conteúdo/trecho extraído: ${clipped}`;
  } else if (source.requiresManualAttach) {
    line += ' | (arquivo anexado pelo(a) docente junto a este prompt na IA)';
  }

  return line;
}
