import { useMemo, useRef, useState } from 'react';
import {
  BookCheck,
  BookOpen,
  Check,
  FilePlus2,
  GraduationCap,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  EDUCATION_STAGES,
  findStageById,
  OPTIONAL_REFERENCE_DOCUMENTS,
} from '../data/education';
import { parseZoteroFile } from '../services/zoteroParser';
import type { EducationStageId, PromptFormState, ZoteroReference } from '../types/prompt';

interface EducationContextSectionProps {
  state: PromptFormState;
  isEditorialSlides: boolean;
  zoteroLibrary: ZoteroReference[];
  onImportZoteroRefs: (refs: ZoteroReference[]) => void;
  onClearZoteroLibrary: () => void;
  onChangeStage: (stage: EducationStageId) => void;
  onUpdateField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  onNotify: (msg: string) => void;
}

export function EducationContextSection({
  state,
  isEditorialSlides,
  zoteroLibrary,
  onImportZoteroRefs,
  onClearZoteroLibrary,
  onChangeStage,
  onUpdateField,
  onNotify,
}: EducationContextSectionProps) {
  const [zoteroSearch, setZoteroSearch] = useState('');
  const [zoteroError, setZoteroError] = useState<string | null>(null);
  const zoteroFileRef = useRef<HTMLInputElement>(null);

  const activeStage = findStageById(state.stage);
  const selectedRefs = state.selectedZoteroRefs ?? [];
  const availableExtraDocs = OPTIONAL_REFERENCE_DOCUMENTS.filter(
    (doc) => !doc.onlyStages || (state.stage !== '' && doc.onlyStages.includes(state.stage))
  );

  const filteredZotero = useMemo(() => {
    const q = zoteroSearch.trim().toLowerCase();
    if (!q) return zoteroLibrary;
    return zoteroLibrary.filter(
      (ref) =>
        ref.title.toLowerCase().includes(q) ||
        ref.authors.some((a) => a.toLowerCase().includes(q)) ||
        (ref.year ?? '').includes(q) ||
        (ref.source ?? '').toLowerCase().includes(q) ||
        (ref.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }, [zoteroLibrary, zoteroSearch]);

  const toggleExtraDoc = (docId: string) => {
    const current = state.selectedExtraDocs ?? [];
    const exists = current.includes(docId);
    const next = exists ? current.filter((id) => id !== docId) : [...current, docId];
    onUpdateField('selectedExtraDocs', next);
  };

  const toggleZoteroRef = (ref: ZoteroReference) => {
    const exists = selectedRefs.some((item) => item.id === ref.id);
    const next = exists
      ? selectedRefs.filter((item) => item.id !== ref.id)
      : [...selectedRefs, ref];
    onUpdateField('selectedZoteroRefs', next);
  };

  const handleZoteroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setZoteroError(null);
    try {
      const content = await file.text();
      const parsed = parseZoteroFile(content, file.name);
      onImportZoteroRefs(parsed);
      onNotify(`${parsed.length} referência(s) do Zotero importada(s)!`);
    } catch (err) {
      setZoteroError(
        err instanceof Error ? err.message : 'Não foi possível ler o arquivo do Zotero.'
      );
    } finally {
      e.target.value = '';
    }
  };

  return (
    <section className="ufma-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="ufma-step-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold">
          2
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-[var(--text)] sm:text-lg">
            Contexto Escolar, Tema e Consulta aos Documentos Oficiais
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Educação Básica: Infantil, Fundamental, Médio Regular, Médio Técnico e EJA com seleção
            automática da BNCC pela IA.
          </p>
        </div>
      </div>

      {/* Etapas de Ensino */}
      <div className="mb-4">
        <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
          <GraduationCap className="h-3.5 w-3.5 text-[var(--accent)]" />
          Etapa da Educação Básica
        </label>
        <div className="flex flex-wrap gap-2">
          {EDUCATION_STAGES.map((stage) => {
            const active = stage.id === state.stage;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onChangeStage(stage.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${active
                  ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0] shadow-xs'
                  : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                  }`}
              >
                {stage.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ano / Série e Componente */}
      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="yearOrTrack"
            className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
          >
            Ano / Série / Faixa Etária ou Segmento
          </label>
          <select
            id="yearOrTrack"
            value={state.yearOrTrack}
            disabled={!activeStage}
            onChange={(e) => onUpdateField('yearOrTrack', e.target.value)}
            className="ufma-input px-3 py-2.5 text-sm disabled:opacity-60"
          >
            <option value="">
              {activeStage ? 'Selecione o ano / série / segmento...' : 'Selecione primeiro a etapa acima...'}
            </option>
            {activeStage?.yearsOrTracks.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="component"
            className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
          >
            {state.stage === 'educacao_infantil'
              ? 'Campo de Experiência (BNCC)'
              : state.stage === 'ensino_tecnico'
                ? 'Área / Componente Técnico'
                : 'Componente Curricular'}
          </label>
          <select
            id="component"
            value={state.component}
            disabled={!activeStage}
            onChange={(e) => onUpdateField('component', e.target.value)}
            className="ufma-input px-3 py-2.5 text-sm disabled:opacity-60"
          >
            <option value="">
              {activeStage ? 'Selecione o componente curricular...' : 'Selecione primeiro a etapa acima...'}
            </option>
            {activeStage?.components.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tema */}
      <div className="mb-4">
        <label htmlFor="topic" className="mb-1.5 block text-xs font-semibold text-[var(--text)]">
          Tema Central / Assunto <span className="text-[var(--bad)]">*</span>
        </label>
        <input
          id="topic"
          type="text"
          value={state.topic}
          onChange={(e) => onUpdateField('topic', e.target.value)}
          placeholder={
            isEditorialSlides
              ? 'Ex.: Transição Energética e Mudanças Climáticas no Brasil'
              : 'Ex.: Frações equivalentes no cotidiano, Pensamento Algorítmico, Ciclo da Água...'
          }
          className="ufma-input px-3.5 py-2.5 text-sm"
        />
      </div>

      {/* Comando Fixo de Leitura Oficial + Intencionalidade Pedagógica */}
      <div className="ufma-tealbox mb-4 p-4">
        <div className="flex items-start gap-3">
          <BookCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal)]" />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[var(--text)]">
                BNCC, Objetivos e Intencionalidade Pedagógica Automáticos (Comando Fixo Ativo)
              </span>
              {activeStage && (
                <span className="rounded-full border border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_16%,transparent)] px-2 py-0.5 text-[10px] font-bold text-[var(--text)]">
                  {activeStage.badge}
                </span>
              )}
            </div>
            {activeStage ? (
              <p className="text-[11.5px] leading-relaxed text-[var(--muted)]">
                Você <strong>não precisa procurar códigos nem redigir objetivos manualmente</strong>. O
                prompt instrui a IA a consultar o documento oficial{' '}
                <strong className="text-[var(--text)]">{activeStage.officialDocument}</strong>,
                selecionar as Competências e Habilidades mais adequadas e{' '}
                <strong className="text-[var(--text)]">
                  elaborar os Objetivos de Aprendizagem com intencionalidade pedagógica
                </strong>{' '}
                em todos os recursos em que for cabível.
              </p>
            ) : (
              <p className="text-[11.5px] leading-relaxed text-[var(--muted)]">
                Selecione a <strong>Etapa da Educação Básica</strong> acima para ativar o documento
                oficial correspondente (BNCC, BNCC Computação, CNCT ou DCNs da EJA). A IA consultará
                automaticamente as competências, habilidades e formulará os objetivos com
                intencionalidade pedagógica.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Campo Opcional: Outros documentos + Importação Offline do Zotero */}
      <div className="ufma-subbox space-y-4 p-4">
        <div>
          <div className="mb-2.5 flex items-start gap-2">
            <FilePlus2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <div>
              <label
                htmlFor="additionalDocuments"
                className="block text-xs font-bold text-[var(--text)]"
              >
                Outros documentos para a IA consultar (opcional)
              </label>
              <p className="text-[11px] text-[var(--muted)]">
                Marque referenciais complementares, escreva o nome de documentos da sua rede/escola
                ou importe sua biblioteca do <strong>Zotero</strong> abaixo.
              </p>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {availableExtraDocs.map((doc) => {
              const active = (state.selectedExtraDocs ?? []).includes(doc.id);
              return (
                <button
                  key={doc.id}
                  type="button"
                  title={doc.fullReference}
                  onClick={() => toggleExtraDoc(doc.id)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                      : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {doc.label}
                </button>
              );
            })}
          </div>

          <textarea
            id="additionalDocuments"
            rows={2}
            value={state.additionalDocuments}
            onChange={(e) => onUpdateField('additionalDocuments', e.target.value)}
            placeholder="Ex.: Documento Curricular do meu município, Matriz do SAEB, Projeto Político-Pedagógico da escola, capítulo 4 do livro didático PNLD, ou o PDF em anexo..."
            className="ufma-input px-3 py-2 text-xs"
          />
        </div>

        {/* Integração Zotero Offline (.json, .bib, .ris) */}
        <div className="border-t border-[var(--border)] pt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[var(--accent)]" />
              <div>
                <span className="text-xs font-bold text-[var(--text)]">
                  Importar Referências do Zotero (100% offline)
                </span>
                <p className="text-[11px] text-[var(--faint)]">
                  No Zotero: clique direito na coleção → <em>Exportar Coleção</em> →{' '}
                  <strong>CSL JSON (.json)</strong>, <strong>BibTeX (.bib)</strong> ou{' '}
                  <strong>RIS (.ris)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => zoteroFileRef.current?.click()}
                className="ufma-btn inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              >
                <Upload className="h-3.5 w-3.5 text-[var(--accent)]" />
                Importar do Zotero
              </button>
              <input
                ref={zoteroFileRef}
                type="file"
                accept=".json,.bib,.bibtex,.ris,application/json,text/plain"
                onChange={handleZoteroFileChange}
                className="hidden"
              />

              {zoteroLibrary.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClearZoteroLibrary();
                    onUpdateField('selectedZoteroRefs', []);
                    onNotify('Acervo Zotero limpo deste navegador.');
                  }}
                  title="Limpar acervo Zotero importado"
                  className="rounded-full border border-[var(--border)] p-1.5 text-[var(--faint)] hover:border-[var(--bad)] hover:text-[var(--bad)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {zoteroError && (
            <p className="mt-2 rounded-lg border border-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_12%,transparent)] px-3 py-1.5 text-xs text-[var(--text)]">
              {zoteroError}
            </p>
          )}

          {/* Referências selecionadas para o prompt atual */}
          {selectedRefs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedRefs.map((ref) => (
                <span
                  key={ref.id}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_16%,transparent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
                >
                  <span className="truncate max-w-[260px]">
                    {ref.authors[0]?.split(',')[0] ?? 'Obra'}
                    {ref.year ? ` (${ref.year})` : ''} — {ref.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleZoteroRef(ref)}
                    aria-label={`Remover ${ref.title}`}
                    className="rounded-full p-0.5 hover:bg-black/15"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Lista pesquisável do acervo Zotero salvo localmente */}
          {zoteroLibrary.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--faint)]" />
                  <input
                    type="text"
                    value={zoteroSearch}
                    onChange={(e) => setZoteroSearch(e.target.value)}
                    placeholder={`Filtrar ${zoteroLibrary.length} referência(s) do Zotero por título, autor ou ano...`}
                    className="ufma-input py-1.5 pr-3 pl-8 text-xs"
                  />
                </div>

                <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
                  <input
                    type="checkbox"
                    checked={state.includeZoteroAbstracts !== false}
                    onChange={(e) => onUpdateField('includeZoteroAbstracts', e.target.checked)}
                    className="h-3.5 w-3.5 accent-[var(--teal)]"
                  />
                  Incluir resumos/notas no prompt
                </label>
              </div>

              <div className="custom-scrollbar max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {filteredZotero.map((ref) => {
                  const selected = selectedRefs.some((item) => item.id === ref.id);
                  return (
                    <button
                      key={ref.id}
                      type="button"
                      onClick={() => toggleZoteroRef(ref)}
                      className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all ${
                        selected
                          ? 'border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_14%,var(--surface-2))] text-[var(--text)]'
                          : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? 'border-[var(--teal)] bg-[var(--teal)] text-white'
                            : 'border-[var(--border-strong)]'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-snug text-[var(--text)]">{ref.title}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                          {ref.authors.length > 0 ? ref.authors.slice(0, 3).join('; ') : 'Autor não informado'}
                          {ref.year ? ` · ${ref.year}` : ''}
                          {ref.source ? ` · ${ref.source}` : ''}
                        </p>
                        {ref.abstractNote && (
                          <span className="mt-1 inline-block rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                            Contém resumo (abstract)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
                {filteredZotero.length === 0 && (
                  <p className="py-2 text-center text-xs text-[var(--muted)]">
                    Nenhuma referência encontrada para &ldquo;{zoteroSearch}&rdquo;.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
