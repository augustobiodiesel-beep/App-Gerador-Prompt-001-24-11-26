import { useState } from 'react';
import {
  Camera,
  CheckSquare,
  ListOrdered,
  Palette,
  Plus,
  ShieldAlert,
  Sparkles,
  Type,
} from 'lucide-react';
import {
  SLIDE_AESTHETIC_PROFILES,
  SLIDE_PALETTE_OPTIONS,
  SLIDE_TYPOGRAPHY_OPTIONS,
} from '../data/templates';
import type { PromptFormState, ResourceTemplate, SlidePromptConfig } from '../types/prompt';

interface TemplateSpecificFieldsProps {
  template: ResourceTemplate;
  state: PromptFormState;
  onUpdateSpecificValue: (key: string, value: string | boolean | string[]) => void;
  onUpdateSlideConfig: <K extends keyof SlidePromptConfig>(
    key: K,
    value: SlidePromptConfig[K]
  ) => void;
  onUpdateClassContext: (value: string) => void;
}

export function TemplateSpecificFields({
  template,
  state,
  onUpdateSpecificValue,
  onUpdateSlideConfig,
  onUpdateClassContext,
}: TemplateSpecificFieldsProps) {
  const [customChipInputs, setCustomChipInputs] = useState<Record<string, string>>({});

  if (template.isEditorialSlides) {
    const cfg = state.slideConfig;

    return (
      <section className="ufma-card border-[var(--border-strong)] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="ufma-step-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold">
              3
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-base font-bold text-[var(--text)] sm:text-lg">
                  Direção de Arte e Estrutura dos Slides
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D4B277]/60 bg-[#8D0333] px-2.5 py-0.5 text-[10px] font-bold text-[#FEC84D]">
                  <Sparkles className="h-3 w-3" />
                  Modelo Apple / Kinfolk / Monocle
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                Configurações fiéis ao modelo editorial premium de apresentação.
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="ufma-subbox mb-5 space-y-3.5 p-4">
          <h3 className="text-[11px] font-bold tracking-[0.1em] text-[var(--accent)] uppercase">
            Bloco 1 — Conteúdo da Apresentação
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="slideCount"
                className="mb-1 block text-xs font-semibold text-[var(--text)]"
              >
                Quantidade de slides
              </label>
              <select
                id="slideCount"
                value={cfg.slideCount}
                onChange={(e) => onUpdateSlideConfig('slideCount', e.target.value)}
                className="ufma-input px-3 py-2 text-sm"
              >
                <option value="8–10">8–10 slides (aula curta / 1 tempo)</option>
                <option value="10–15">10–15 slides (padrão do modelo)</option>
                <option value="12">12 slides (exato)</option>
                <option value="15–20">15–20 slides (aula dupla / seminário)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="maxWordsPerSlide"
                className="mb-1 block text-xs font-semibold text-[var(--text)]"
              >
                Limite de palavras por slide
              </label>
              <select
                id="maxWordsPerSlide"
                value={cfg.maxWordsPerSlide}
                onChange={(e) => onUpdateSlideConfig('maxWordsPerSlide', e.target.value)}
                className="ufma-input px-3 py-2 text-sm"
              >
                <option value="20">Máx. 20 palavras (ultra minimalista)</option>
                <option value="25">Máx. 25 palavras (padrão do modelo)</option>
                <option value="35">Máx. 35 palavras (explicação didática leve)</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="audienceCustom"
              className="mb-1 block text-xs font-semibold text-[var(--text)]"
            >
              Público (quem vai assistir — deixe vazio para usar a turma selecionada)
            </label>
            <input
              id="audienceCustom"
              type="text"
              value={cfg.audienceCustom}
              onChange={(e) => onUpdateSlideConfig('audienceCustom', e.target.value)}
              placeholder="Ex.: Alunos do 2º ano do Ensino Médio, turma da EJA ou reunião de famílias..."
              className="ufma-input px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="impactObjective"
              className="mb-1 block text-xs font-semibold text-[var(--text)]"
            >
              Objetivo específico dos slides (opcional — se vazio, a IA gera automaticamente com
              intencionalidade pedagógica)
            </label>
            <textarea
              id="impactObjective"
              rows={2}
              value={cfg.impactObjective}
              onChange={(e) => onUpdateSlideConfig('impactObjective', e.target.value)}
              placeholder="Ex.: Despertar curiosidade científica, entender como funciona o efeito estufa e propor 3 ações práticas na escola."
              className="ufma-input px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="baseMaterial"
              className="mb-1 block text-xs font-semibold text-[var(--text)]"
            >
              Material de base (cole aqui texto, tópicos do plano de aula ou artigo — opcional)
            </label>
            <textarea
              id="baseMaterial"
              rows={3}
              value={cfg.baseMaterial}
              onChange={(e) => onUpdateSlideConfig('baseMaterial', e.target.value)}
              placeholder="Cole tópicos, resumo da aula, dados ou trecho do livro didático que a IA deve transformar em slides..."
              className="ufma-input px-3.5 py-2 text-sm"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-[var(--text)]">
            <input
              type="checkbox"
              checked={cfg.alignWithBncc}
              onChange={(e) => onUpdateSlideConfig('alignWithBncc', e.target.checked)}
              className="h-4 w-4 accent-[var(--teal)]"
            />
            Incluir comando fixo de consulta oficial (BNCC/CNCT/EJA) e documentos adicionais na seção de Conteúdo
          </label>
        </div>

        {/* Direção de Arte */}
        <div className="ufma-subbox mb-5 space-y-4 p-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-[var(--accent)]" />
            <h3 className="text-[11px] font-bold tracking-[0.1em] text-[var(--accent)] uppercase">
              Bloco 2 — Direção de Arte, Paleta e Tipografia
            </h3>
          </div>

          <div>
            <label
              htmlFor="aestheticStyle"
              className="mb-1 block text-xs font-semibold text-[var(--text)]"
            >
              Estética e Persona Visual
            </label>
            <select
              id="aestheticStyle"
              value={cfg.aestheticStyle}
              onChange={(e) =>
                onUpdateSlideConfig(
                  'aestheticStyle',
                  e.target.value as SlidePromptConfig['aestheticStyle']
                )
              }
              className="ufma-input px-3 py-2 text-sm"
            >
              {Object.entries(SLIDE_AESTHETIC_PROFILES).map(([key, profile]) => (
                <option key={key} value={key}>
                  {profile.label}
                </option>
              ))}
            </select>
          </div>

          {/* Paletas */}
          <div>
            <span className="mb-2 block text-xs font-semibold text-[var(--text)]">
              Paleta de Cores (máx. 3 cores + neutros)
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SLIDE_PALETTE_OPTIONS.map((pal) => {
                const active = cfg.paletteId === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => onUpdateSlideConfig('paletteId', pal.id)}
                    className={`flex items-start gap-3 rounded-xl border p-2.5 text-left transition-all ${
                      active
                        ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface-solid))]'
                        : 'border-[var(--border)] bg-[var(--surface-solid)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="mt-0.5 flex shrink-0 -space-x-1">
                      {pal.colors.map((hex) => (
                        <span
                          key={hex}
                          className="h-5 w-5 rounded-full border border-white/25 shadow-xs"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text)]">{pal.name}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-[var(--muted)]">
                        {pal.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={cfg.customPaletteNote}
              onChange={(e) => onUpdateSlideConfig('customPaletteNote', e.target.value)}
              placeholder="Opcional: indique uma cor específica (ex.: vinho UFMA #8D0333 + dourado #D4B277)"
              className="ufma-input mt-2 px-3 py-1.5 text-xs"
            />
          </div>

          {/* Tipografia */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
              <Type className="h-3.5 w-3.5 text-[var(--accent)]" />
              Par Tipográfico
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SLIDE_TYPOGRAPHY_OPTIONS.map((typo) => {
                const active = cfg.typographyId === typo.id;
                return (
                  <button
                    key={typo.id}
                    type="button"
                    onClick={() => onUpdateSlideConfig('typographyId', typo.id)}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      active
                        ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface-solid))]'
                        : 'border-[var(--border)] bg-[var(--surface-solid)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <p className="text-xs font-bold text-[var(--text)]">{typo.name}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                      Títulos: {typo.displayFont} • Texto: {typo.bodyFont}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fotografia, Narrativa e Entrega */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          <div className="ufma-subbox p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--text)]">
                <Camera className="h-3.5 w-3.5 text-[var(--accent)]" />
                Fotografia Editorial
              </span>
              <input
                type="checkbox"
                checked={cfg.includePhotographyRules}
                onChange={(e) => onUpdateSlideConfig('includePhotographyRules', e.target.checked)}
                className="h-4 w-4 accent-[var(--teal)]"
              />
            </div>
            <p className="mb-2 text-[11px] leading-relaxed text-[var(--muted)]">
              Fotos reais verificadas, luz natural, overlay contraste AA e créditos.
            </p>
            {cfg.includePhotographyRules && (
              <input
                type="text"
                value={cfg.photoSources}
                onChange={(e) => onUpdateSlideConfig('photoSources', e.target.value)}
                placeholder="Unsplash, Pexels"
                className="ufma-input px-2.5 py-1.5 text-xs"
              />
            )}
          </div>

          <div className="ufma-subbox p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--text)]">
                <ListOrdered className="h-3.5 w-3.5 text-[var(--accent)]" />
                Arco em 5 Atos
              </span>
              <input
                type="checkbox"
                checked={cfg.includeNarrativeArc}
                onChange={(e) => onUpdateSlideConfig('includeNarrativeArc', e.target.checked)}
                className="h-4 w-4 accent-[var(--teal)]"
              />
            </div>
            <p className="mb-2 text-[11px] leading-relaxed text-[var(--muted)]">
              1. Capa • 2. Gancho • 3. Blocos • 4. Momento Uau • 5. Fechamento + CTA.
            </p>
            {cfg.includeNarrativeArc && (
              <input
                type="text"
                value={cfg.narrativeCustomNotes}
                onChange={(e) => onUpdateSlideConfig('narrativeCustomNotes', e.target.value)}
                placeholder="Ex.: Incluir atividade rápida no slide 10"
                className="ufma-input px-2.5 py-1.5 text-xs"
              />
            )}
          </div>

          <div className="ufma-subbox p-3.5">
            <span className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--text)]">
              <CheckSquare className="h-3.5 w-3.5 text-[var(--accent)]" />
              Regras de Entrega
            </span>
            <div className="space-y-2 text-[11px] text-[var(--muted)]">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={cfg.includeFiveLinePreview}
                  onChange={(e) => onUpdateSlideConfig('includeFiveLinePreview', e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-[var(--teal)]"
                />
                <span>Prévia em 5 linhas (hex, fontes, roteiro)</span>
              </label>
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={cfg.includeSpeakerNotes}
                  onChange={(e) => onUpdateSlideConfig('includeSpeakerNotes', e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-[var(--teal)]"
                />
                <span>Notas curtas do apresentador por slide</span>
              </label>
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={cfg.includeSelfReviewChecklist}
                  onChange={(e) =>
                    onUpdateSlideConfig('includeSelfReviewChecklist', e.target.checked)
                  }
                  className="mt-0.5 h-3.5 w-3.5 accent-[var(--teal)]"
                />
                <span>Auto-revisão final contra o checklist</span>
              </label>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ufma-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="ufma-step-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold">
          3
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-[var(--text)] sm:text-lg">
            Detalhes de {template.shortName}
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Campos personalizados para que a IA entregue a estrutura exata desse recurso.
          </p>
        </div>
      </div>

      {template.isDocumentWithPrivacy && (
        <div className="ufma-warnbox mb-4 flex items-start gap-2.5 p-3 text-xs text-[var(--text)]">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warn)]" />
          <p className="leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--text)]">Boas práticas LGPD:</strong> nunca insira nome
            completo, CPF, matrícula ou laudos identificáveis de estudantes em prompts de IA. Use
            códigos como <em>&ldquo;Estudante A&rdquo;</em>; o prompt gerado já inclui campos entre{' '}
            <code>[COLCHETES]</code> para preenchimento posterior com segurança.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {template.specificFields.map((field) => {
          const val = state.specificValues[field.key] ?? field.defaultValue;

          if (field.type === 'chips') {
            const baseOptions = field.chipOptions ?? [];
            const selectedList: string[] = Array.isArray(val)
              ? val
              : typeof val === 'string' && val.trim()
              ? val
                  .split(/[;,]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];
            const customSelected = selectedList.filter((item) => !baseOptions.includes(item));
            const allOptions = [...baseOptions, ...customSelected];
            const draft = customChipInputs[field.key] ?? '';

            const toggleChip = (option: string) => {
              const exists = selectedList.includes(option);
              const next = exists
                ? selectedList.filter((item) => item !== option)
                : [...selectedList, option];
              onUpdateSpecificValue(field.key, next);
            };

            const addCustomChip = () => {
              const cleaned = draft.trim().replace(/\s+/g, ' ');
              if (!cleaned) return;
              const existingMatch = allOptions.find(
                (item) => item.toLowerCase() === cleaned.toLowerCase()
              );
              if (existingMatch) {
                if (!selectedList.includes(existingMatch)) {
                  onUpdateSpecificValue(field.key, [...selectedList, existingMatch]);
                }
              } else {
                onUpdateSpecificValue(field.key, [...selectedList, cleaned]);
              }
              setCustomChipInputs((prev) => ({ ...prev, [field.key]: '' }));
            };

            return (
              <div key={field.key}>
                <span className="mb-2.5 block text-xs font-bold text-[var(--text)]">
                  {field.label}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {allOptions.map((option) => {
                    const isSelected = selectedList.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleChip(option)}
                        className="ufma-chip"
                      >
                        {option}
                      </button>
                    );
                  })}

                  <span className="inline-flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) =>
                        setCustomChipInputs((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomChip();
                        }
                      }}
                      placeholder="Adicionar outra opção..."
                      aria-label={`Adicionar outra opção em ${field.label}`}
                      className="ufma-chip-input"
                    />
                    <button
                      type="button"
                      onClick={addCustomChip}
                      className="ufma-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Adicionar
                    </button>
                  </span>
                </div>
              </div>
            );
          }

          if (field.type === 'checkbox') {
            return (
              <label
                key={field.key}
                className="ufma-subbox flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-[var(--text)]"
              >
                <input
                  type="checkbox"
                  checked={Boolean(val)}
                  onChange={(e) => onUpdateSpecificValue(field.key, e.target.checked)}
                  className="h-4 w-4 accent-[var(--teal)]"
                />
                <span>{field.label}</span>
              </label>
            );
          }

          if (field.type === 'select' && field.options) {
            return (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
                >
                  {field.label}
                </label>
                <select
                  id={field.key}
                  value={String(val)}
                  onChange={(e) => onUpdateSpecificValue(field.key, e.target.value)}
                  className="ufma-input px-3 py-2.5 text-sm"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
                >
                  {field.label}
                </label>
                <textarea
                  id={field.key}
                  rows={3}
                  value={String(val)}
                  onChange={(e) => onUpdateSpecificValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="ufma-input px-3.5 py-2.5 text-sm"
                />
                {field.helperText && (
                  <p className="mt-1 text-[11px] text-[var(--faint)]">{field.helperText}</p>
                )}
              </div>
            );
          }

          return (
            <div key={field.key}>
              <label
                htmlFor={field.key}
                className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
              >
                {field.label}
              </label>
              <input
                id={field.key}
                type={field.type === 'number' ? 'number' : 'text'}
                min={field.type === 'number' ? 0 : undefined}
                value={String(val)}
                onChange={(e) => onUpdateSpecificValue(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="ufma-input px-3.5 py-2.5 text-sm"
              />
            </div>
          );
        })}

        <div>
          <label
            htmlFor="classContext"
            className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
          >
            Contexto real da turma ou escola (opcional, mas aumenta muito a precisão)
          </label>
          <textarea
            id="classContext"
            rows={2}
            value={state.classContext}
            onChange={(e) => onUpdateClassContext(e.target.value)}
            placeholder="Ex.: Turma de 30 estudantes em escola pública, poucos computadores disponíveis, alunos muito engajados com atividades em grupo..."
            className="ufma-input px-3.5 py-2 text-sm"
          />
        </div>
      </div>
    </section>
  );
}
