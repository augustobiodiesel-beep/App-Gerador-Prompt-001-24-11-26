import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Eye, Sliders } from 'lucide-react';
import { AiDirectoryView } from './components/AiDirectoryView';
import { CategoryTemplatePicker } from './components/CategoryTemplatePicker';
import { EducationContextSection } from './components/EducationContextSection';
import { Header, type ActiveTab, type ThemeMode } from './components/Header';
import { HomeView } from './components/HomeView';
import { LibraryView } from './components/LibraryView';
import { PedagogicalRefinementSection } from './components/PedagogicalRefinementSection';
import { PromptGuideView } from './components/PromptGuideView';
import { PromptPreviewPanel } from './components/PromptPreviewPanel';
import { TemplateSpecificFields } from './components/TemplateSpecificFields';
import { UfmaCrest } from './components/UfmaCrest';
import { FREE_AI_PLATFORMS } from './data/aiPlatforms';
import { getStageById } from './data/education';
import {
  createInitialPromptState,
  getDefaultSpecificValues,
  getTemplateById,
  getTemplatesByCategory,
} from './data/templates';
import { analyzePromptQuality, buildPrompt } from './engine/promptBuilder';
import { loadSavedPrompts, persistSavedPrompts } from './services/storage';
import type {
  DemoPreset,
  EducationStageId,
  PromptFormState,
  ResourceCategoryId,
  SavedPrompt,
  SlidePromptConfig,
} from './types/prompt';

function getInitialTheme(): ThemeMode {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'claro' || attr === 'escuro') return attr;
  }
  return 'escuro';
}

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [mobilePanel, setMobilePanel] = useState<'form' | 'preview'>('form');
  const [state, setState] = useState<PromptFormState>(() => createInitialPromptState());
  const [manualPromptText, setManualPromptText] = useState<string | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => loadSavedPrompts());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 2600);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('cdc.tema', theme);
    } catch {
      // Ignore storage errors
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'escuro' ? '#8D0333' : '#FAF7F2');
    }
  }, [theme]);

  useEffect(() => {
    persistSavedPrompts(savedPrompts);
  }, [savedPrompts]);

  const activeTemplate = useMemo(() => getTemplateById(state.templateId), [state.templateId]);
  const generatedPrompt = useMemo(() => buildPrompt(state), [state]);
  const displayPrompt = manualPromptText ?? generatedPrompt;
  const quality = useMemo(() => analyzePromptQuality(state), [state]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'escuro' ? 'claro' : 'escuro'));
  };

  const navigateTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateField = <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectCategory = (category: ResourceCategoryId) => {
    const firstTemplate = getTemplatesByCategory(category)[0];
    if (!firstTemplate) return;
    setManualPromptText(null);
    setState((prev) => ({
      ...prev,
      category,
      templateId: firstTemplate.id,
      specificValues: getDefaultSpecificValues(firstTemplate),
    }));
  };

  const handleSelectTemplate = (templateId: string) => {
    const tpl = getTemplateById(templateId);
    setManualPromptText(null);
    setState((prev) => ({
      ...prev,
      category: tpl.category,
      templateId: tpl.id,
      specificValues: getDefaultSpecificValues(tpl),
    }));
  };

  const handleChangeStage = (stageId: EducationStageId) => {
    const stageMeta = getStageById(stageId);
    setState((prev) => ({
      ...prev,
      stage: stageId,
      yearOrTrack: stageMeta.yearsOrTracks[0],
      component: stageMeta.components[0],
    }));
  };

  const handleUpdateSpecificValue = (key: string, value: string | boolean | string[]) => {
    setState((prev) => ({
      ...prev,
      specificValues: {
        ...prev.specificValues,
        [key]: value,
      },
    }));
  };

  const handleUpdateSlideConfig = <K extends keyof SlidePromptConfig>(
    key: K,
    value: SlidePromptConfig[K]
  ) => {
    setState((prev) => ({
      ...prev,
      slideConfig: {
        ...prev.slideConfig,
        [key]: value,
      },
    }));
  };

  const handleApplyPreset = (preset: DemoPreset) => {
    const tpl = getTemplateById(preset.state.templateId);
    const base = createInitialPromptState();
    setManualPromptText(null);
    setState({
      ...base,
      ...preset.state,
      specificValues: {
        ...getDefaultSpecificValues(tpl),
        ...(preset.state.specificValues ?? {}),
      },
      slideConfig: {
        ...base.slideConfig,
        ...(preset.state.slideConfig ?? {}),
      },
    });
    navigateTab('builder');
    notify(`Exemplo carregado: ${preset.label}`);
  };

  const handleQuickOpenSlides = () => {
    const tpl = getTemplateById('slides_editorial');
    setManualPromptText(null);
    setState((prev) => ({
      ...prev,
      category: tpl.category,
      templateId: tpl.id,
    }));
    navigateTab('builder');
  };

  const handleSavePrompt = (customTitle: string) => {
    const stage = getStageById(state.stage);
    const fallbackTitle = state.topic.trim()
      ? `${activeTemplate.shortName}: ${state.topic.trim()}`
      : `${activeTemplate.shortName} (${stage.shortLabel} • ${state.component})`;

    const now = new Date().toISOString();
    const newItem: SavedPrompt = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `prompt-${Date.now()}`,
      title: customTitle || fallbackTitle,
      promptText: displayPrompt,
      isManuallyEdited: manualPromptText !== null,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      tags: [activeTemplate.shortName, stage.shortLabel, state.component],
      state: structuredClone(state),
    };

    setSavedPrompts((prev) => [newItem, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setSavedPrompts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleDeleteSaved = (id: string) => {
    setSavedPrompts((prev) => prev.filter((item) => item.id !== id));
    notify('Prompt removido da biblioteca');
  };

  const handleLoadFromLibrary = (item: SavedPrompt) => {
    const base = createInitialPromptState();
    setState({
      ...base,
      ...structuredClone(item.state),
      selectedExtraDocs: item.state.selectedExtraDocs ?? [],
      additionalDocuments: item.state.additionalDocuments ?? '',
    });
    setManualPromptText(item.isManuallyEdited ? item.promptText : null);
    setMobilePanel('form');
    navigateTab('builder');
    notify('Prompt reaberto no construtor');
  };

  const handleImportPrompts = (imported: SavedPrompt[]) => {
    setSavedPrompts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const fresh = imported.filter((p) => p && p.id && !existingIds.has(p.id));
      return [...fresh, ...prev];
    });
  };

  return (
    <div className="min-h-screen text-[var(--text)]">
      <Header
        activeTab={activeTab}
        onChangeTab={navigateTab}
        savedCount={savedPrompts.length}
        aiCount={FREE_AI_PLATFORMS.length}
        isSlidesActive={Boolean(activeTemplate.isEditorialSlides)}
        onQuickOpenSlides={handleQuickOpenSlides}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="ufma-main-wrap mx-auto min-h-[72vh] max-w-[1180px] px-4 py-6 sm:px-5">
        {activeTab === 'inicio' && (
          <HomeView
            savedCount={savedPrompts.length}
            onStartBuilder={() => navigateTab('builder')}
            onOpenSlides={handleQuickOpenSlides}
            onOpenAiDirectory={() => navigateTab('ais')}
            onOpenLibrary={() => navigateTab('library')}
            onApplyPreset={handleApplyPreset}
          />
        )}

        {activeTab === 'builder' && (
          <div className="view-enter">
            {/* Cabeçalho da página (padrão .page-head do Caderno de Contexto) */}
            <div className="mb-5">
              <span className="text-[11.5px] font-bold tracking-[0.15em] text-[var(--accent)] uppercase">
                Gerador Pedagógico · PROFCOMP-MA / UFMA
              </span>
              <h1 className="font-display mt-1 text-2xl font-extrabold text-[var(--text)] sm:text-3xl">
                Monte seu prompt em camadas
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-[var(--muted)]">
                Escolha o recurso didático ou documental, informe o tema e a turma. A IA recebe o
                comando fixo para consultar a BNCC automaticamente e selecionar competências e
                habilidades oficiais.
              </p>
            </div>

            {/* Mobile view switcher */}
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 lg:hidden">
              <button
                type="button"
                onClick={() => setMobilePanel('form')}
                className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold ${
                  mobilePanel === 'form'
                    ? 'bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                    : 'text-[var(--muted)]'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                Configurar Prompt
              </button>
              <button
                type="button"
                onClick={() => setMobilePanel('preview')}
                className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold ${
                  mobilePanel === 'preview'
                    ? 'bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                    : 'text-[var(--muted)]'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Ver Prompt ({quality.score}%)
              </button>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div
                className={`space-y-5 lg:col-span-7 ${
                  mobilePanel === 'preview' ? 'hidden lg:block' : 'block'
                }`}
              >
                <CategoryTemplatePicker
                  selectedCategory={state.category}
                  selectedTemplateId={state.templateId}
                  onSelectCategory={handleSelectCategory}
                  onSelectTemplate={handleSelectTemplate}
                  onApplyPreset={handleApplyPreset}
                />

                <EducationContextSection
                  state={state}
                  isEditorialSlides={Boolean(activeTemplate.isEditorialSlides)}
                  onChangeStage={handleChangeStage}
                  onUpdateField={updateField}
                />

                <TemplateSpecificFields
                  template={activeTemplate}
                  state={state}
                  onUpdateSpecificValue={handleUpdateSpecificValue}
                  onUpdateSlideConfig={handleUpdateSlideConfig}
                  onUpdateClassContext={(val) => updateField('classContext', val)}
                />

                <PedagogicalRefinementSection
                  state={state}
                  isEditorialSlides={Boolean(activeTemplate.isEditorialSlides)}
                  onUpdateField={updateField}
                />
              </div>

              <div
                className={`lg:col-span-5 ${
                  mobilePanel === 'form' ? 'hidden lg:block' : 'block'
                }`}
              >
                <PromptPreviewPanel
                  promptText={displayPrompt}
                  isManuallyEdited={manualPromptText !== null}
                  isEditorialSlides={Boolean(activeTemplate.isEditorialSlides)}
                  quality={quality}
                  templateName={activeTemplate.shortName}
                  onManualChange={(val) => setManualPromptText(val)}
                  onResetManualEdit={() => setManualPromptText(null)}
                  onSavePrompt={handleSavePrompt}
                  onOpenAiDirectory={() => navigateTab('ais')}
                  onNotify={notify}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ais' && (
          <div className="view-enter">
            <AiDirectoryView currentPrompt={displayPrompt} />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="view-enter">
            <LibraryView
              prompts={savedPrompts}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteSaved}
              onLoadIntoBuilder={handleLoadFromLibrary}
              onImportPrompts={handleImportPrompts}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="view-enter">
            <PromptGuideView />
          </div>
        )}
      </main>

      {/* Toast flutuante institucional UFMA */}
      <div
        role="status"
        aria-live="polite"
        className={`ufma-toast pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 md:bottom-7 ${
          toastMsg ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {toastMsg}
      </div>

      {/* Rodapé Institucional com créditos UFMA / PROFCOMP-MA, educ.nekoweb.org e MEC RED */}
      <footer className="ufma-footer mt-12 py-8 text-xs leading-relaxed">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-4 sm:px-5 md:grid-cols-12">
          <div className="flex items-start gap-3.5 md:col-span-6">
            <UfmaCrest size={48} compactLabel />
            <div className="space-y-1.5">
              <p className="text-[var(--text)]">
                <strong>Caderno de Contexto · PromptDocente</strong> — Produto Educacional
                desenvolvido no{' '}
                <a
                  href="https://sigaa.ufma.br/sigaa/public/programa/apresentacao_stricto.jsf?lc=pt_BR&idPrograma=1997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--accent)] hover:underline"
                >
                  PROFCOMP-MA / Universidade Federal do Maranhão (UFMA)
                </a>
                .
              </p>
              <p className="text-[var(--muted)]">
                Este aplicativo <strong>gera apenas prompts profissionais</strong> — não produz os
                recursos didáticos finais. A autoria, a revisão crítica e a curadoria pedagógica
                permanecem sempre com você. Dados salvos exclusivamente neste navegador, sem
                identificação de estudantes.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 font-semibold">
                <a
                  href="https://sigaa.ufma.br/sigaa/public/programa/apresentacao_stricto.jsf?lc=pt_BR&idPrograma=1997"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                >
                  PROFCOMP-MA <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://portalpadrao.ufma.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                >
                  Portal UFMA <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://plataformaintegrada.mec.gov.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                >
                  MEC RED <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://basenacionalcomum.mec.gov.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                >
                  BNCC (MEC) <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-6">
            <p className="text-[var(--muted)]">
              <strong className="text-[var(--text)]">
                Atribuição e Referência do Modelo Base:
              </strong>{' '}
              Adaptado do Recurso Educacional Aberto{' '}
              <a
                href="https://educ.nekoweb.org/geradores/home.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                Geradores de Prompts de AI para Professores (educ.nekoweb.org)
              </a>{' '}
              publicado no{' '}
              <a
                href="https://plataformaintegrada.mec.gov.br/recurso/364756"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                MEC RED (ID 364756)
              </a>{' '}
              — © 2025 Sérgio Araújo, sob <strong>Licença CC BY-NC-SA 4.0</strong>.
            </p>
            <p className="text-[var(--faint)]">
              Fundamentação normativa: BNCC (MEC), LDB (Lei nº 9.394/1996), DCN, LBI (Lei nº
              13.146/2015), Leis nº 10.639/2003 e nº 11.645/2008, BNCC de Computação (Resolução
              CNE/CEB nº 1/2022) e PNED (Lei nº 14.533/2023). Identidade visual oficial UFMA 2024.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
