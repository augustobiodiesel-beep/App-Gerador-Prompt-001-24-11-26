import { useMemo, useRef, useState } from 'react';
import {
  BookCheck,
  Check,
  FilePlus2,
  FileText,
  GraduationCap,
  Paperclip,
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
import { formatFileSize, readDeviceFile } from '../services/deviceSources';
import type { DeviceSource, EducationStageId, PromptFormState } from '../types/prompt';

interface EducationContextSectionProps {
  state: PromptFormState;
  isEditorialSlides: boolean;
  deviceSourcesLibrary: DeviceSource[];
  onImportDeviceSources: (sources: DeviceSource[]) => void;
  onClearDeviceSourcesLibrary: () => void;
  onChangeStage: (stage: EducationStageId) => void;
  onUpdateField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  onNotify: (msg: string) => void;
}

export function EducationContextSection({
  state,
  isEditorialSlides,
  deviceSourcesLibrary,
  onImportDeviceSources,
  onClearDeviceSourcesLibrary,
  onChangeStage,
  onUpdateField,
  onNotify,
}: EducationContextSectionProps) {
  const [sourceSearch, setSourceSearch] = useState('');
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeStage = findStageById(state.stage);
  const selectedSources = state.selectedDeviceSources ?? [];
  const availableExtraDocs = OPTIONAL_REFERENCE_DOCUMENTS.filter(
    (doc) => !doc.onlyStages || (state.stage !== '' && doc.onlyStages.includes(state.stage))
  );

  const filteredSources = useMemo(() => {
    const q = sourceSearch.trim().toLowerCase();
    if (!q) return deviceSourcesLibrary;
    return deviceSourcesLibrary.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.fileName.toLowerCase().includes(q) ||
        item.fileExt.toLowerCase().includes(q) ||
        (item.authors ?? []).some((a) => a.toLowerCase().includes(q)) ||
        (item.source ?? '').toLowerCase().includes(q)
    );
  }, [deviceSourcesLibrary, sourceSearch]);

  const toggleExtraDoc = (docId: string) => {
    const current = state.selectedExtraDocs ?? [];
    const exists = current.includes(docId);
    const next = exists ? current.filter((id) => id !== docId) : [...current, docId];
    onUpdateField('selectedExtraDocs', next);
  };

  const toggleDeviceSource = (src: DeviceSource) => {
    const exists = selectedSources.some((item) => item.id === src.id);
    const next = exists
      ? selectedSources.filter((item) => item.id !== src.id)
      : [...selectedSources, src];
    onUpdateField('selectedDeviceSources', next);
  };

  const handleDeviceFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setSourceError(null);
    setIsReadingFiles(true);

    try {
      const imported: DeviceSource[] = [];
      for (const file of files) {
        const parsed = await readDeviceFile(file);
        imported.push(...parsed);
      }
      if (imported.length > 0) {
        onImportDeviceSources(imported);
        // Seleciona automaticamente os arquivos recém-enviados no prompt atual
        const existingKeys = new Set(
          selectedSources.map((s) => `${s.fileName.toLowerCase()}::${s.name.toLowerCase()}`)
        );
        const toAdd = imported.filter(
          (s) => !existingKeys.has(`${s.fileName.toLowerCase()}::${s.name.toLowerCase()}`)
        );
        if (toAdd.length > 0) {
          onUpdateField('selectedDeviceSources', [...selectedSources, ...toAdd]);
        }
        onNotify(
          imported.length === 1
            ? `Fonte "${imported[0].fileName}" adicionada do dispositivo!`
            : `${imported.length} fontes adicionadas do dispositivo!`
        );
      }
    } catch (err) {
      setSourceError(
        err instanceof Error ? err.message : 'Não foi possível ler o(s) arquivo(s) selecionado(s).'
      );
    } finally {
      setIsReadingFiles(false);
      e.target.value = '';
    }
  };

  const hasReadableExcerpts =
    selectedSources.some((s) => Boolean(s.excerpt)) ||
    deviceSourcesLibrary.some((s) => Boolean(s.excerpt));

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
              {activeStage
                ? 'Selecione o ano / série / segmento...'
                : 'Selecione primeiro a etapa acima...'}
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
              {activeStage
                ? 'Selecione o componente curricular...'
                : 'Selecione primeiro a etapa acima...'}
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

      {/* Campo Opcional: Outros documentos + Fontes do Dispositivo */}
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
                ou envie arquivos diretamente do seu <strong>dispositivo</strong> abaixo.
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
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${active
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

        {/* Upload de Fontes e Materiais do Dispositivo */}
        <div className="border-t border-[var(--border)] pt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-start gap-2">
              <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
              <div>
                <span className="text-xs font-bold text-[var(--text)]">
                  Inserir Fontes do Dispositivo
                </span>
                <p className="text-[11px] text-[var(--faint)]">
                  Envie arquivos do computador ou celular:{' '}
                  <strong>PDF, Word (.docx), TXT, Markdown, CSV, slides, imagens</strong> ou listas
                  bibliográficas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={isReadingFiles}
                onClick={() => fileInputRef.current?.click()}
                className="ufma-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold disabled:opacity-60"
              >
                <Upload className="h-3.5 w-3.5 text-[var(--accent)]" />
                {isReadingFiles ? 'Lendo arquivos...' : 'Selecionar do dispositivo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.odt,.txt,.md,.markdown,.csv,.tsv,.html,.htm,.pptx,.ppt,.xlsx,.xls,.json,.bib,.bibtex,.ris,.png,.jpg,.jpeg,.webp"
                onChange={handleDeviceFilesChange}
                className="hidden"
              />

              {deviceSourcesLibrary.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClearDeviceSourcesLibrary();
                    onUpdateField('selectedDeviceSources', []);
                    onNotify('Fontes do dispositivo removidas deste navegador.');
                  }}
                  title="Limpar fontes enviadas do dispositivo"
                  className="rounded-full border border-[var(--border)] p-1.5 text-[var(--faint)] hover:border-[var(--bad)] hover:text-[var(--bad)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {sourceError && (
            <p className="mt-2 rounded-lg border border-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_12%,transparent)] px-3 py-1.5 text-xs text-[var(--text)]">
              {sourceError}
            </p>
          )}

          {/* Fontes selecionadas para o prompt atual */}
          {selectedSources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedSources.map((src) => (
                <span
                  key={src.id}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_16%,transparent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
                >
                  <FileText className="h-3 w-3 shrink-0 text-[var(--teal)]" />
                  <span className="max-w-[260px] truncate">
                    {src.fileName}
                    {src.sizeBytes ? ` (${formatFileSize(src.sizeBytes)})` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleDeviceSource(src)}
                    aria-label={`Remover ${src.fileName}`}
                    className="rounded-full p-0.5 hover:bg-black/15"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Lista pesquisável de arquivos carregados do dispositivo */}
          {deviceSourcesLibrary.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {deviceSourcesLibrary.length > 2 && (
                  <div className="relative min-w-[200px] flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--faint)]" />
                    <input
                      type="text"
                      value={sourceSearch}
                      onChange={(e) => setSourceSearch(e.target.value)}
                      placeholder={`Filtrar ${deviceSourcesLibrary.length} fonte(s) enviada(s)...`}
                      className="ufma-input py-1.5 pr-3 pl-8 text-xs"
                    />
                  </div>
                )}

                {hasReadableExcerpts && (
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={state.includeSourceExcerpts !== false}
                      onChange={(e) => onUpdateField('includeSourceExcerpts', e.target.checked)}
                      className="h-3.5 w-3.5 accent-[var(--teal)]"
                    />
                    Incluir conteúdo/trechos lidos no prompt
                  </label>
                )}
              </div>

              <div className="custom-scrollbar max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {filteredSources.map((src) => {
                  const selected = selectedSources.some((item) => item.id === src.id);
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => toggleDeviceSource(src)}
                      className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all ${selected
                          ? 'border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_14%,var(--surface-2))] text-[var(--text)]'
                          : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text)] hover:border-[var(--accent)]'
                        }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected
                            ? 'border-[var(--teal)] bg-[var(--teal)] text-white'
                            : 'border-[var(--border-strong)]'
                          }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 text-[9.5px] font-bold text-[var(--accent)]">
                            {src.fileExt}
                          </span>
                          <p className="truncate font-semibold leading-snug text-[var(--text)]">
                            {src.name}
                          </p>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                          {src.fileName}
                          {src.sizeBytes ? ` · ${formatFileSize(src.sizeBytes)}` : ''}
                          {src.excerpt
                            ? ' · conteúdo extraído automaticamente'
                            : ' · anexe este arquivo junto ao prompt na IA'}
                        </p>
                      </div>
                    </button>
                  );
                })}
                {filteredSources.length === 0 && (
                  <p className="py-2 text-center text-xs text-[var(--muted)]">
                    Nenhuma fonte encontrada para &ldquo;{sourceSearch}&rdquo;.
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
