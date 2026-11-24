import type { ZoteroReference } from '../types/prompt';

function makeRefId(title: string, year?: string, idx = 0): string {
  const base = `${title}-${year ?? ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return `zot-${base || 'item'}-${idx}`;
}

function cleanLatexText(input: string): string {
  return input
    .replace(/\\['`^"~c]\{?([a-zA-Z])\}?/g, (match, letter: string) => {
      const accentMap: Record<string, Record<string, string>> = {
        "'": { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', c: 'ć', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' },
        '`': { a: 'à', e: 'è', A: 'À', E: 'È' },
        '^': { a: 'â', e: 'ê', o: 'ô', A: 'Â', E: 'Ê', O: 'Ô' },
        '~': { a: 'ã', o: 'õ', n: 'ñ', A: 'Ã', O: 'Õ', N: 'Ñ' },
        '"': { u: 'ü', U: 'Ü' },
        c: { c: 'ç', C: 'Ç' },
      };
      const accent = match[1];
      return accentMap[accent]?.[letter] ?? letter;
    })
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatCslAuthor(author: Record<string, unknown>): string {
  const literal = typeof author.literal === 'string' ? author.literal.trim() : '';
  if (literal) return literal;
  const family = typeof author.family === 'string' ? author.family.trim() : '';
  const given = typeof author.given === 'string' ? author.given.trim() : '';
  if (family && given) return `${family}, ${given}`;
  return family || given;
}

function formatZoteroCreator(creator: Record<string, unknown>): string {
  const name = typeof creator.name === 'string' ? creator.name.trim() : '';
  if (name) return name;
  const last = typeof creator.lastName === 'string' ? creator.lastName.trim() : '';
  const first = typeof creator.firstName === 'string' ? creator.firstName.trim() : '';
  if (last && first) return `${last}, ${first}`;
  return last || first;
}

function extractYear(raw: unknown): string | undefined {
  if (!raw) return undefined;
  if (typeof raw === 'number') return String(raw);
  if (typeof raw === 'string') {
    const m = raw.match(/\b(1[89]\d{2}|20\d{2})\b/);
    return m ? m[1] : undefined;
  }
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj['date-parts']) && Array.isArray(obj['date-parts'][0])) {
      const y = obj['date-parts'][0][0];
      if (y) return String(y);
    }
    if (typeof obj.raw === 'string') return extractYear(obj.raw);
    if (typeof obj.literal === 'string') return extractYear(obj.literal);
  }
  return undefined;
}

/**
 * Faz o parse de arquivos JSON exportados pelo Zotero (CSL-JSON ou Zotero JSON / BetterBibTeX).
 */
export function parseZoteroJson(content: string): ZoteroReference[] {
  const parsed = JSON.parse(content) as unknown;
  let items: unknown[] = [];

  if (Array.isArray(parsed)) {
    items = parsed;
  } else if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.items)) {
      items = obj.items;
    } else if (typeof obj.title === 'string') {
      items = [obj];
    }
  }

  const refs: ZoteroReference[] = [];

  items.forEach((rawItem, idx) => {
    if (!rawItem || typeof rawItem !== 'object') return;
    const item = rawItem as Record<string, unknown>;
    const rawTitle = typeof item.title === 'string' ? stripHtml(item.title) : '';
    if (!rawTitle) return;

    const authors: string[] = [];
    if (Array.isArray(item.author)) {
      for (const a of item.author) {
        if (a && typeof a === 'object') {
          const formatted = formatCslAuthor(a as Record<string, unknown>);
          if (formatted) authors.push(formatted);
        }
      }
    } else if (Array.isArray(item.creators)) {
      for (const c of item.creators) {
        if (c && typeof c === 'object') {
          const formatted = formatZoteroCreator(c as Record<string, unknown>);
          if (formatted) authors.push(formatted);
        }
      }
    }

    const year = extractYear(item.issued) ?? extractYear(item.date) ?? extractYear(item.year);

    const source =
      (typeof item['container-title'] === 'string' && item['container-title'].trim()) ||
      (typeof item.publicationTitle === 'string' && item.publicationTitle.trim()) ||
      (typeof item.bookTitle === 'string' && item.bookTitle.trim()) ||
      (typeof item.publisher === 'string' && item.publisher.trim()) ||
      undefined;

    const abstractRaw =
      (typeof item.abstract === 'string' && item.abstract) ||
      (typeof item.abstractNote === 'string' && item.abstractNote) ||
      undefined;

    const doi =
      (typeof item.DOI === 'string' && item.DOI.trim()) ||
      (typeof item.doi === 'string' && item.doi.trim()) ||
      undefined;

    const url =
      (typeof item.URL === 'string' && item.URL.trim()) ||
      (typeof item.url === 'string' && item.url.trim()) ||
      undefined;

    const itemType =
      (typeof item.type === 'string' && item.type) ||
      (typeof item.itemType === 'string' && item.itemType) ||
      undefined;

    const notes =
      typeof item.note === 'string' && item.note.trim()
        ? stripHtml(item.note)
        : Array.isArray(item.notes)
        ? item.notes
            .map((n) =>
              typeof n === 'string'
                ? stripHtml(n)
                : n &&
                  typeof n === 'object' &&
                  typeof (n as Record<string, unknown>).note === 'string'
                ? stripHtml((n as Record<string, unknown>).note as string)
                : ''
            )
            .filter(Boolean)
            .join(' | ') || undefined
        : undefined;

    const tags = Array.isArray(item.tags)
      ? item.tags
          .map((t) =>
            typeof t === 'string'
              ? t.trim()
              : t && typeof t === 'object' && typeof (t as Record<string, unknown>).tag === 'string'
              ? ((t as Record<string, unknown>).tag as string).trim()
              : ''
          )
          .filter(Boolean)
      : undefined;

    refs.push({
      id:
        typeof item.id === 'string' && item.id.trim()
          ? `zot-${item.id.trim()}`
          : makeRefId(rawTitle, year, idx),
      title: rawTitle,
      authors,
      year,
      itemType,
      source,
      abstractNote: abstractRaw ? stripHtml(abstractRaw) : undefined,
      url,
      doi,
      tags,
      notes,
    });
  });

  return refs;
}

/**
 * Faz o parse de arquivos BibTeX / BibLaTeX (.bib) exportados pelo Zotero.
 */
export function parseBibtex(content: string): ZoteroReference[] {
  const refs: ZoteroReference[] = [];
  const entryStartRegex = /@([a-zA-Z]+)\s*\{\s*([^,\s]+)\s*,/g;
  const starts: { type: string; key: string; bodyStart: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = entryStartRegex.exec(content)) !== null) {
    const type = match[1].toLowerCase();
    if (type === 'comment' || type === 'preamble' || type === 'string') continue;
    starts.push({
      type,
      key: match[2].trim(),
      bodyStart: match.index + match[0].length,
    });
  }

  for (let i = 0; i < starts.length; i++) {
    const { type, key, bodyStart } = starts[i];
    let depth = 1;
    let pos = bodyStart;
    while (pos < content.length && depth > 0) {
      if (content[pos] === '{') depth++;
      else if (content[pos] === '}') depth--;
      pos++;
    }
    const body = content.slice(bodyStart, Math.max(bodyStart, pos - 1));

    const fields: Record<string, string> = {};
    let idx = 0;
    while (idx < body.length) {
      while (idx < body.length && /[\s,]/.test(body[idx])) idx++;
      if (idx >= body.length) break;

      const nameStart = idx;
      while (idx < body.length && /[a-zA-Z0-9_-]/.test(body[idx])) idx++;
      const fieldName = body.slice(nameStart, idx).toLowerCase();
      if (!fieldName) {
        idx++;
        continue;
      }

      while (idx < body.length && /\s/.test(body[idx])) idx++;
      if (body[idx] !== '=') {
        idx++;
        continue;
      }
      idx++;
      while (idx < body.length && /\s/.test(body[idx])) idx++;

      let value = '';
      if (body[idx] === '{') {
        idx++;
        let vDepth = 1;
        const vStart = idx;
        while (idx < body.length && vDepth > 0) {
          if (body[idx] === '{') vDepth++;
          else if (body[idx] === '}') vDepth--;
          idx++;
        }
        value = body.slice(vStart, Math.max(vStart, idx - 1));
      } else if (body[idx] === '"') {
        idx++;
        const vStart = idx;
        while (idx < body.length && !(body[idx] === '"' && body[idx - 1] !== '\\')) idx++;
        value = body.slice(vStart, idx);
        idx++;
      } else {
        const vStart = idx;
        while (idx < body.length && body[idx] !== ',' && body[idx] !== '\n') idx++;
        value = body.slice(vStart, idx);
      }

      fields[fieldName] = cleanLatexText(value);
    }

    const title = fields.title;
    if (!title) continue;

    const authors = fields.author
      ? fields.author
          .split(/\s+and\s+/i)
          .map((a) => a.trim())
          .filter(Boolean)
      : [];

    const year = extractYear(fields.year || fields.date);
    const source =
      fields.journal || fields.journaltitle || fields.booktitle || fields.publisher || undefined;
    const tags = fields.keywords
      ? fields.keywords
          .split(/[;,]/)
          .map((k) => k.trim())
          .filter(Boolean)
      : undefined;

    refs.push({
      id: `bib-${key}`,
      title,
      authors,
      year,
      itemType: type,
      source,
      abstractNote: fields.abstract || undefined,
      doi: fields.doi || undefined,
      url: fields.url || undefined,
      tags,
      notes: fields.note || fields.annote || undefined,
    });
  }

  return refs;
}

/**
 * Faz o parse de arquivos RIS (.ris) exportados pelo Zotero / SciELO / Periódicos CAPES.
 */
export function parseRis(content: string): ZoteroReference[] {
  const refs: ZoteroReference[] = [];
  const lines = content.split(/\r?\n/);

  let current: {
    type?: string;
    title?: string;
    authors: string[];
    year?: string;
    source?: string;
    abstractParts: string[];
    doi?: string;
    url?: string;
    tags: string[];
    notes: string[];
  } | null = null;

  const flush = () => {
    if (!current || !current.title) {
      current = null;
      return;
    }
    refs.push({
      id: makeRefId(current.title, current.year, refs.length),
      title: current.title.trim(),
      authors: current.authors,
      year: current.year,
      itemType: current.type,
      source: current.source,
      abstractNote: current.abstractParts.join(' ').trim() || undefined,
      doi: current.doi,
      url: current.url,
      tags: current.tags.length ? current.tags : undefined,
      notes: current.notes.join(' | ').trim() || undefined,
    });
    current = null;
  };

  for (const line of lines) {
    const m = line.match(/^([A-Z0-9]{2})\s{1,2}-\s?(.*)$/);
    if (!m) continue;
    const tag = m[1];
    const value = m[2].trim();

    if (tag === 'TY') {
      flush();
      current = { type: value, authors: [], abstractParts: [], tags: [], notes: [] };
      continue;
    }

    if (tag === 'ER') {
      flush();
      continue;
    }

    if (!current) {
      current = { authors: [], abstractParts: [], tags: [], notes: [] };
    }

    if (tag === 'TI' || tag === 'T1') {
      if (!current.title) current.title = value;
    } else if (tag === 'AU' || tag === 'A1') {
      if (value) current.authors.push(value);
    } else if (tag === 'PY' || tag === 'Y1' || tag === 'DA') {
      if (!current.year) current.year = extractYear(value);
    } else if (tag === 'JO' || tag === 'JF' || tag === 'T2' || tag === 'PB') {
      if (!current.source && value) current.source = value;
    } else if (tag === 'AB' || tag === 'N2') {
      if (value) current.abstractParts.push(value);
    } else if (tag === 'DO') {
      if (value) current.doi = value;
    } else if (tag === 'UR' || tag === 'L2') {
      if (!current.url && value) current.url = value;
    } else if (tag === 'KW') {
      if (value) current.tags.push(value);
    } else if (tag === 'N1') {
      if (value) current.notes.push(stripHtml(value));
    }
  }

  flush();
  return refs;
}

/**
 * Detecta automaticamente o formato (.json, .bib ou .ris) e extrai as referências do Zotero.
 */
export function parseZoteroFile(content: string, fileName = ''): ZoteroReference[] {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error('O arquivo selecionado está vazio.');
  }

  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.json') || trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const refs = parseZoteroJson(trimmed);
    if (refs.length === 0) {
      throw new Error(
        'Nenhuma referência válida encontrada no JSON. No Zotero, use Exportar Coleção → CSL JSON ou Zotero JSON.'
      );
    }
    return refs;
  }

  if (lowerName.endsWith('.ris') || /^TY\s{1,2}-/m.test(trimmed)) {
    const refs = parseRis(trimmed);
    if (refs.length === 0) {
      throw new Error('Nenhuma referência válida encontrada no arquivo RIS.');
    }
    return refs;
  }

  if (
    lowerName.endsWith('.bib') ||
    lowerName.endsWith('.bibtex') ||
    /@[a-zA-Z]+\s*\{/.test(trimmed)
  ) {
    const refs = parseBibtex(trimmed);
    if (refs.length === 0) {
      throw new Error('Nenhuma referência válida encontrada no arquivo BibTeX (.bib).');
    }
    return refs;
  }

  throw new Error(
    'Formato não reconhecido. Exporte do Zotero como CSL JSON (.json), BibTeX (.bib) ou RIS (.ris).'
  );
}

/**
 * Formata uma referência do Zotero para inserção clara e fiel dentro do prompt da IA.
 */
export function formatZoteroReferenceForPrompt(
  ref: ZoteroReference,
  includeAbstract = true
): string {
  const authorText =
    ref.authors.length > 0 ? ref.authors.slice(0, 4).join('; ') : 'Autor não informado';
  const yearText = ref.year ? ` (${ref.year})` : '';
  const sourceText = ref.source ? `. ${ref.source}` : '';
  const idPart = ref.doi ? ` | DOI: ${ref.doi}` : ref.url ? ` | URL: ${ref.url}` : '';

  let line = `${authorText}${yearText}. "${ref.title}"${sourceText}${idPart}`;

  if (includeAbstract && ref.abstractNote) {
    const clipped =
      ref.abstractNote.length > 360
        ? `${ref.abstractNote.slice(0, 357).trim()}...`
        : ref.abstractNote;
    line += ` | Resumo/Síntese: ${clipped}`;
  }

  if (includeAbstract && ref.notes) {
    const clippedNote =
      ref.notes.length > 200 ? `${ref.notes.slice(0, 197).trim()}...` : ref.notes;
    line += ` | Nota docente (Zotero): ${clippedNote}`;
  }

  return line;
}

/**
 * Gera um arquivo .ris pronto para importar diretamente no Zotero (catalogação do prompt / recurso).
 */
export function exportPromptToRis(params: {
  title: string;
  stageLabel: string;
  component: string;
  templateName: string;
  promptText: string;
}): string {
  const today = new Date();
  const year = today.getFullYear();
  const dateStr = `${year}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const cleanNote = params.promptText.replace(/\r?\n/g, ' // ').slice(0, 1800);

  return [
    'TY  - ELEC',
    `TI  - ${params.title}`,
    'AU  - PromptDocente (PROFCOMP-MA / UFMA)',
    `PY  - ${year}`,
    `DA  - ${dateStr}`,
    `T2  - ${params.templateName} — ${params.stageLabel} (${params.component})`,
    'PB  - Caderno de Contexto · PROFCOMP-MA / UFMA',
    'UR  - https://promptdocente-profcomp-ufma.vercel.app',
    `KW  - BNCC`,
    `KW  - ${params.stageLabel}`,
    `KW  - ${params.component}`,
    `KW  - ${params.templateName}`,
    `N1  - Prompt gerado: ${cleanNote}`,
    'ER  - ',
  ].join('\r\n');
}
