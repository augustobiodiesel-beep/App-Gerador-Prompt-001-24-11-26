import { useMemo, useState } from 'react';
import {
  BookmarkPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Globe,
  Layers,
  Lightbulb,
  PlugZap,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { FREE_AI_PLATFORMS, type AIPlatformGroup } from '../data/aiPlatforms';
import { estimatePromptStats, splitPromptIntoLayers } from '../engine/promptBuilder';
import type { PromptQualityAnalysis } from '../types/prompt';
import { AiIcon } from './AiIcon';

interface PromptPreviewPanelProps {
  promptText: string;
  isManuallyEdited: boolean;
  isEditorialSlides: boolean;
  quality: PromptQualityAnalysis;
  templateName: string;
  onManualChange: (value: string) => void;
  onResetManualEdit: () => void;
  onSavePrompt: (customTitle: string) => void;
  onOpenAiDirectory: () => void;
  onNotify: (msg: string) => void;
}

type QuickAiTab = 'destaques' | AIPlatformGroup;

const QUICK_AI_TABS: { id: QuickAiTab; label: string }[] = [
  { id: 'destaques', label: 'Destaques' },
  { id: 'chinesas', label: 'Chinesas' },
  { id: 'principais', label: 'Globais' },
  { id: 'slides_estudo', label: 'Slides & Docs' },
  { id: 'brasil_privacidade', label: 'Brasil / Abertas' },
];

const CURADORIA_BASE = [
  {
    id: 'bncc',
    title: 'Alinhamento à BNCC e objetivos claros',
    sub: 'As competências e habilidades selecionadas pela IA conferem com o documento oficial?',
  },
  {
    id: 'pub',
    title: 'Adequação à turma, modalidade e inclusão (LBI)',
    sub: 'A linguagem, o nível e as adaptações fazem sentido para seus estudantes?',
  },
  {
    id: 'conc',
    title: 'Correção conceitual e revisão de [verificar código oficial]',
    sub: 'Conferi conceitos, dados, exemplos e códigos antes de aplicar em sala?',
  },
  {
    id: 'viab',
    title: 'Viabilidade real na infraestrutura da escola',
    sub: 'Cabe no tempo de aula e nos recursos disponíveis (com ou sem internet)?',
  },
  {
    id: 'cur',
    title: 'Curadoria e marca autoral docente',
    sub: 'Personalizei o material gerado pela IA com o meu olhar pedagógico?',
  },
];

export function PromptPreviewPanel({
  promptText,
  isManuallyEdited,
  isEditorialSlides,
  quality,
  templateName,
  onManualChange,
  onResetManualEdit,
  onSavePrompt,
  onOpenAiDirectory,
  onNotify,
}: PromptPreviewPanelProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'camadas' | 'editar'>('camadas');
  const [showNotes, setShowNotes] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showCuradoria, setShowCuradoria] = useState(false);
  const [curadoriaChecked, setCuradoriaChecked] = useState<Record<string, boolean>>({});
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [quickAiTab, setQuickAiTab] = useState<QuickAiTab>('destaques');

  const stats = estimatePromptStats(promptText);
  const layers = useMemo(
    () => splitPromptIntoLayers(promptText, isEditorialSlides),
    [promptText, isEditorialSlides]
  );

  const curadoriaItems = useMemo(() => {
    if (!isEditorialSlides) return CURADORIA_BASE;
    return [
      ...CURADORIA_BASE,
      {
        id: 'slides_visual',
        title: 'Qualidade visual dos slides (padrão editorial)',
        sub: '1 ideia por slide (máx. 25 palavras), contraste legível, fotos reais verificadas e notas curtas?',
      },
    ];
  }, [isEditorialSlides]);

  const curadoriaDoneCount = curadoriaItems.filter((item) => curadoriaChecked[item.id]).length;

  const visibleAIs =
    quickAiTab === 'destaques'
      ? FREE_AI_PLATFORMS.filter((a) => a.quickLaunch)
      : FREE_AI_PLATFORMS.filter((a) => a.group === quickAiTab);

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const handleCopy = async () => {
    await copyTextToClipboard();
    setCopied(true);
    onNotify('Prompt completo copiado!');
    window.setTimeout(() => setCopied(false), 2200);
  };

  const handleOpenAI = async (name: string, url: string) => {
    await copyTextToClipboard();
    onNotify(`Prompt copiado! Cole com Ctrl+V no ${name}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (ext: 'md' | 'txt') => {
    const blob = new Blob([promptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = templateName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    a.href = url;
    a.download = `prompt-${safeName || 'pedagogico'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(`Arquivo .${ext} baixado!`);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrompt(saveTitle.trim());
    setSaveTitle('');
    setShowSaveForm(false);
    setJustSaved(true);
    onNotify('Prompt salvo na Biblioteca!');
    window.setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
      {/* Medidor de qualidade pedagógica */}
      <div className="ufma-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--accent)] uppercase">
              Qualidade do Prompt Pedagógico
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold text-[var(--text)]">
                {quality.score}%
              </span>
              <span className="rounded-full border border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_15%,transparent)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--text)]">
                {quality.level}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowChecklist((prev) => !prev)}
            className="ufma-btn flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
          >
            <span>Critérios</span>
            {showChecklist ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${quality.score}%`,
              background: 'linear-gradient(90deg, var(--teal), var(--ufma-dourado))',
            }}
          />
        </div>

        {showChecklist && (
          <ul className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
            {quality.checks.map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-xs">
                {item.passed ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--good)]" />
                ) : (
                  <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warn)]" />
                )}
                <div>
                  <p className="font-semibold text-[var(--text)]">{item.label}</p>
                  {!item.passed && <p className="text-[11px] text-[var(--muted)]">{item.tip}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cartão Principal: Prompt em Camadas (estilo Caderno de Contexto) + Edição */}
      <div className="ufma-card flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="ico-chip inline-grid h-7 w-7 place-items-center rounded-lg">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-sm font-bold text-[var(--text)]">
              Prompt profissional pronto
            </span>
            {isManuallyEdited && (
              <span className="rounded-full border border-[var(--warn)] bg-[color-mix(in_srgb,var(--warn)_16%,transparent)] px-2 py-0.5 text-[10px] font-bold text-[var(--text)]">
                Editado
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isManuallyEdited && (
              <button
                type="button"
                onClick={onResetManualEdit}
                title="Restaurar sincronização automática com o formulário"
                className="flex items-center gap-1 rounded-full border border-[var(--warn)] bg-[color-mix(in_srgb,var(--warn)_14%,transparent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
              >
                <RotateCcw className="h-3 w-3" />
                Restaurar
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === 'camadas' ? 'editar' : 'camadas'))}
              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${viewMode === 'editar'
                ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                : 'border-[var(--border-strong)] bg-[var(--surface-solid)] text-[var(--text)] hover:border-[var(--accent)]'
                }`}
            >
              <Edit3 className="h-3 w-3" />
              {viewMode === 'editar' ? 'Ver camadas' : 'Ajuste fino'}
            </button>
          </div>
        </div>

        {/* Sub-barra: métricas + toggle Notas explicativas */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-2 text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-[var(--text)]">{stats.words}</strong> palavras
            </span>
            <span>
              ~<strong className="text-[var(--text)]">{stats.estimatedTokens}</strong> tokens
            </span>
          </div>

          {viewMode === 'camadas' && (
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text)]">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={(e) => setShowNotes(e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--accent)]"
              />
              Notas explicativas
            </label>
          )}
        </div>

        {/* Conteúdo: Camadas expansíveis OU Editor completo */}
        <div className="p-4">
          {viewMode === 'editar' ? (
            <textarea
              value={promptText}
              onChange={(e) => onManualChange(e.target.value)}
              rows={17}
              className="ufma-input custom-scrollbar font-mono-prompt resize-y p-3.5 text-xs leading-relaxed"
            />
          ) : (
            <div className="custom-scrollbar max-h-[410px] space-y-2.5 overflow-y-auto pr-1">
              {layers.map((layer, idx) => (
                <details
                  key={`${layer.number}-${layer.title}`}
                  className="camada-box"
                  open={idx === 0 || idx === 1 || idx === layers.length - 1}
                >
                  <summary className="camada-summary">
                    <span className="camada-num">{layer.number}</span>
                    <span className="truncate">{layer.title}</span>
                    <span className="camada-kind">{layer.kind}</span>
                  </summary>
                  <pre className="custom-scrollbar font-mono-prompt m-0 max-h-56 overflow-auto whitespace-pre-wrap break-words p-3 text-[11.5px] leading-relaxed text-[var(--text)]">
                    {layer.content}
                  </pre>
                  {showNotes && (
                    <div className="camada-note">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                      <span>{layer.note}</span>
                    </div>
                  )}
                </details>
              ))}
            </div>
          )}
        </div>

        {/* Botões principais + IAs Gratuitas */}
        <div className="space-y-3 border-t border-[var(--border)] bg-[var(--surface-2)] p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ${copied ? 'ufma-btn-teal' : 'ufma-btn-pri'
                }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Prompt copiado!' : 'Copiar prompt completo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSaveForm((prev) => !prev)}
              className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ${justSaved ? 'ufma-btn-teal' : 'ufma-btn'
                }`}
            >
              {justSaved ? (
                <Check className="h-4 w-4" />
              ) : (
                <BookmarkPlus className="h-4 w-4 text-[var(--accent)]" />
              )}
              <span>{justSaved ? 'Salvo!' : 'Salvar versão'}</span>
            </button>
          </div>

          {showSaveForm && (
            <form
              onSubmit={handleConfirmSave}
              className="ufma-subbox flex flex-col gap-2 p-3 sm:flex-row"
            >
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Título opcional (ex.: Slides Clima 2ª série EM)"
                className="ufma-input flex-1 px-3 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="ufma-btn-pri rounded-full px-4 py-1.5 text-xs font-bold"
              >
                Confirmar
              </button>
            </form>
          )}

          {/* Export & API v2 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleDownload('md')}
                className="ufma-btn inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold"
              >
                <Download className="h-3 w-3" />
                Baixar .md
              </button>
              <button
                type="button"
                onClick={() => handleDownload('txt')}
                className="ufma-btn inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold"
              >
                <Download className="h-3 w-3" />
                Baixar .txt
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowApiInfo((prev) => !prev)}
              className="ufma-btn inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold"
            >
              <PlugZap className="h-3 w-3 text-[var(--warn)]" />
              API (v2)
            </button>
          </div>

          {showApiInfo && (
            <div className="ufma-subbox p-3 text-[11px] leading-relaxed text-[var(--muted)]">
              <p className="font-bold text-[var(--text)]">Pronto para integração futura via API</p>
              <p className="mt-1">
                O aplicativo funciona 100% no navegador sem custo de API. A camada{' '}
                <code className="font-mono-prompt text-[var(--accent)]">
                  src/services/aiProvider.ts
                </code>{' '}
                já prepara a interface <code>AIProvider</code> para conexão futura.
              </p>
            </div>
          )}

          {/* Links diretos para IAs gratuitas */}
          <div className="border-t border-[var(--border)] pt-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold text-[var(--text)]">
                Copiar e abrir em IAs gratuitas ({FREE_AI_PLATFORMS.length}):
              </p>
              <button
                type="button"
                onClick={onOpenAiDirectory}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent)] hover:underline"
              >
                <Globe className="h-3 w-3" />
                Ver diretório
              </button>
            </div>

            <div className="mb-2.5 flex flex-wrap gap-1">
              {QUICK_AI_TABS.map((tab) => {
                const active = quickAiTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setQuickAiTab(tab.id)}
                    className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold transition-all ${active
                      ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                      : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)] hover:text-[var(--text)]'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {visibleAIs.map((ai) => (
                <button
                  key={ai.id}
                  type="button"
                  title={`${ai.name} (${ai.company} • ${ai.origin}) — ${ai.freeTierNote}`}
                  style={{ '--ia-color': ai.color } as React.CSSProperties}
                  onClick={() => handleOpenAI(ai.name, ai.url)}
                  className="ufma-ia-pill inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5 text-[11.5px] font-semibold"
                >
                  <AiIcon id={ai.id} color={ai.color} size="sm" />
                  <span>{ai.name}</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist de Curadoria Docente (INST-04 — igual ao Caderno de Contexto) */}
      <div className="ufma-card p-4">
        <button
          type="button"
          onClick={() => setShowCuradoria((prev) => !prev)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="ico-chip inline-grid h-7 w-7 shrink-0 place-items-center rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-display text-xs font-bold text-[var(--text)] sm:text-sm">
                Checklist de curadoria docente (INST-04)
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {curadoriaDoneCount}/{curadoriaItems.length} itens validados após usar na IA
              </p>
            </div>
          </div>
          {showCuradoria ? (
            <ChevronUp className="h-4 w-4 text-[var(--accent)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--accent)]" />
          )}
        </button>

        {showCuradoria && (
          <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
            {curadoriaItems.map((item) => {
              const checked = Boolean(curadoriaChecked[item.id]);
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-xs transition-all ${checked
                    ? 'border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_10%,var(--surface-solid))]'
                    : 'border-[var(--border)] bg-[var(--surface-solid)] hover:border-[var(--border-strong)]'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setCuradoriaChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--teal)]"
                  />
                  <span>
                    <strong className="block text-[var(--text)]">{item.title}</strong>
                    <span className="text-[11px] text-[var(--muted)]">{item.sub}</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
