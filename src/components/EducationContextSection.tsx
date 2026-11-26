import { useMemo, useRef, useState } from 'react';
import {
  AlignLeft,
  BookCheck,
  Check,
  ClipboardPaste,
  FilePlus2,
  FileText,
  Globe,
  GraduationCap,
  Link2,
  Paperclip,
  Plus,
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
import {
  createTextDeviceSource,
  createUrlDeviceSources,
  formatFileSize,
  readDeviceFile,
} from '../services/deviceSources';
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
  const [activeInputPanel, setActiveInputPanel] = useState<'none' | 'url' | 'text'>('none');
  const [urlDraft, setUrlDraft] = useState('');
  const [urlTitleDraft, setUrlTitleDraft] = useState('');
  const [textDraft, setTextDraft] = useState('');
  const [textTitleDraft, setTextTitleDraft] = useState('');
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
        (item.url ?? '').toLowerCase().includes(q) ||
        (item.excerpt ?? '').toLowerCase().includes(q) ||
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

  const addAndSelectSources = (incoming: DeviceSource[], notifyMsg: string) => {
    onImportDeviceSources(incoming);
    const existingKeys = new Set(
      selectedSources.map((s) => `${s.fileName.toLowerCase()}::${s.name.toLowerCase()}`)
    );
    const toAdd = incoming.filter(
      (s) => !existingKeys.has(`${s.fileName.toLowerCase()}::${s.name.toLowerCase()}`)
    );
    if (toAdd.length > 0) {
      onUpdateField('selectedDeviceSources', [...selectedSources, ...toAdd]);
    }
    onNotify(notifyMsg);
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
        addAndSelectSources(
          imported,
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

  const handleAddUrlSource = () => {
    setSourceError(null);
    try {
      const created = createUrlDeviceSources(urlDraft, urlTitleDraft);
      addAndSelectSources(
        created,
        created.length === 1
          ? `Link "${created[0].name}" adicionado como fonte!`
          : `${created.length} links adicionados como fontes!`
      );
      setUrlDraft('');
      setUrlTitleDraft('');
      setActiveInputPanel('none');
    } catch (err) {
      setSourceError(err instanceof Error ? err.message : 'Endereço/link inválido.');
    }
  };

  const handleAddTextSource = () => {
    setSourceError(null);
    try {
      const created = createTextDeviceSource(textDraft, textTitleDraft);
      addAndSelectSources([created], `Texto "${created.name}" adicionado como fonte!`);
      setTextDraft('');
      setTextTitleDraft('');
      setActiveInputPanel('none');
    } catch (err) {
      setSourceError(err instanceof Error ? err.message : 'Não foi possível adicionar o texto.');
    }
  };

  const hasReadableExcerpts =
    selectedSources.some((s) => Boolean(s.excerpt)) ||
    deviceSourcesLibrary.some((s) => Boolean(s.excerpt));

  const renderSourceIcon = (src: DeviceSource) => {
    if (src.kind === 'url' || src.url) {
      return <Globe className="h-3 w-3 shrink-0 text-[var(--teal)]" />;
    }
    if (src.kind === 'text') {
      return <AlignLeft className="h-3 w-3 shrink-0 text-[var(--teal)]" />;
    }
    return <FileText className="h-3 w-3 shrink-0 text-[var(--teal)]" />;
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
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
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

      {/* Campo Opcional: Outros documentos + Fontes (Dispositivo, Links e Textos Copiados) */}
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
                ou adicione <strong>arquivos, links de sites ou textos copiados</strong> abaixo.
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

        {/* Fontes do Dispositivo, Links de Sites e Textos Copiados */}
        <div className="border-t border-[var(--border)] pt-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
              <div>
                <span className="text-xs font-bold text-[var(--text)]">
                  Inserir Fontes (Dispositivo, Links de Sites ou Textos Copiados)
                </span>
                <p className="text-[11px] text-[var(--faint)]">
                  Envie arquivos do computador/celular (<strong>PDF, Word, TXT, imagens...</strong>),
                  cole <strong>links de sites</strong> ou <strong>textos copiados</strong>. O prompt
                  instruirá a IA a usar obrigatoriamente essas fontes.
                </p>
              </div>
            </div>

            {deviceSourcesLibrary.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClearDeviceSourcesLibrary();
                  onUpdateField('selectedDeviceSources', []);
                  onNotify('Fontes adicionadas removidas deste navegador.');
                }}
                title="Limpar todas as fontes adicionadas"
                className="shrink-0 rounded-full border border-[var(--border)] p-1.5 text-[var(--faint)] hover:border-[var(--bad)] hover:text-[var(--bad)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* 3 botões rápidos: Dispositivo, Link de Site, Texto Copiado */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
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

            <button
              type="button"
              onClick={() => {
                setSourceError(null);
                setActiveInputPanel((prev) => (prev === 'url' ? 'none' : 'url'));
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeInputPanel === 'url'
                  ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                  : 'ufma-btn'
              }`}
            >
              <Link2 className="h-3.5 w-3.5 text-[var(--accent)]" />
              Adicionar link / site
            </button>

            <button
              type="button"
              onClick={() => {
                setSourceError(null);
                setActiveInputPanel((prev) => (prev === 'text' ? 'none' : 'text'));
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeInputPanel === 'text'
                  ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                  : 'ufma-btn'
              }`}
            >
              <ClipboardPaste className="h-3.5 w-3.5 text-[var(--accent)]" />
              Colar texto como fonte
            </button>
          </div>

          {/* Formulário inline: Adicionar Link / Site */}
          {activeInputPanel === 'url' && (
            <div className="mt-3 space-y-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-solid)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text)]">
                  Adicionar endereço(s) / link(s) de site como fonte
                </span>
                <button
                  type="button"
                  onClick={() => setActiveInputPanel('none')}
                  className="rounded-full p-0.5 text-[var(--faint)] hover:text-[var(--text)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={urlTitleDraft}
                onChange={(e) => setUrlTitleDraft(e.target.value)}
                placeholder="Título opcional da fonte (ex.: Portal MEC — BNCC Computação)"
                className="ufma-input px-3 py-1.5 text-xs"
              />
              <textarea
                rows={2}
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="Cole um ou mais links (um por linha). Ex.: https://basenacionalcomum.mec.gov.br/"
                className="ufma-input px-3 py-2 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInputPanel('none')}
                  className="ufma-btn rounded-full px-3 py-1 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddUrlSource}
                  className="ufma-btn-pri inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar link
                </button>
              </div>
            </div>
          )}

          {/* Formulário inline: Colar Texto Copiado */}
          {activeInputPanel === 'text' && (
            <div className="mt-3 space-y-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-solid)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text)]">
                  Colar texto copiado como fonte obrigatória
                </span>
                <button
                  type="button"
                  onClick={() => setActiveInputPanel('none')}
                  className="rounded-full p-0.5 text-[var(--faint)] hover:text-[var(--text)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={textTitleDraft}
                onChange={(e) => setTextTitleDraft(e.target.value)}
                placeholder="Título opcional da fonte (ex.: Trecho do livro didático / Artigo base)"
                className="ufma-input px-3 py-1.5 text-xs"
              />
              <textarea
                rows={4}
                value={textDraft}
                onChange={(e) => setTextDraft(e.target.value)}
                placeholder="Cole aqui o texto copiado de um artigo, documento, apostila, notícia ou página da internet..."
                className="ufma-input px-3 py-2 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInputPanel('none')}
                  className="ufma-btn rounded-full px-3 py-1 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddTextSource}
                  className="ufma-btn-pri inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar texto
                </button>
              </div>
            </div>
          )}

          {sourceError && (
            <p className="mt-2 rounded-lg border border-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_12%,transparent)] px-3 py-1.5 text-xs text-[var(--text)]">
              {sourceError}
            </p>
          )}

          {/* Fontes selecionadas para o prompt atual */}
          {selectedSources.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                {selectedSources.map((src) => (
                  <span
                    key={src.id}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_16%,transparent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
                  >
                    {renderSourceIcon(src)}
                    <span className="max-w-[260px] truncate">
                      {src.kind === 'url' || src.kind === 'text' ? src.name : src.fileName}
                      {src.sizeBytes ? ` (${formatFileSize(src.sizeBytes)})` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleDeviceSource(src)}
                      aria-label={`Remover ${src.name}`}
                      className="rounded-full p-0.5 hover:bg-black/15"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-[11px] font-medium text-[var(--teal)]">
                ✓ {selectedSources.length}{' '}
                {selectedSources.length === 1
                  ? 'fonte ativa — o prompt mandará a IA utilizá-la como uma das fontes obrigatórias.'
                  : 'fontes ativas — o prompt mandará a IA utilizá-las como fontes obrigatórias.'}
              </p>
            </div>
          )}

          {/* Lista pesquisável de fontes carregadas (arquivos, links e textos) */}
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
                      placeholder={`Filtrar ${deviceSourcesLibrary.length} fonte(s) adicionada(s)...`}
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
                    Incluir textos/conteúdos extraídos no prompt
                  </label>
                )}
              </div>

              <div className="custom-scrollbar max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {filteredSources.map((src) => {
                  const selected = selectedSources.some((item) => item.id === src.id);
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => toggleDeviceSource(src)}
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
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 text-[9.5px] font-bold text-[var(--accent)]">
                            {src.fileExt}
                          </span>
                          <p className="truncate font-semibold leading-snug text-[var(--text)]">
                            {src.name}
                          </p>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                          {src.kind === 'url' || src.url
                            ? src.url
                            : src.kind === 'text'
                              ? `${src.fileName} · inserido diretamente no prompt`
                              : `${src.fileName}${src.sizeBytes ? ` · ${formatFileSize(src.sizeBytes)}` : ''}${
                                  src.excerpt
                                    ? ' · conteúdo extraído automaticamente'
                                    : ' · anexe este arquivo junto ao prompt na IA'
                                }`}
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
