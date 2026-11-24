import {
  BookOpen,
  Check,
  ClipboardCheck,
  FileText,
  Presentation,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import {
  DEMO_PRESETS,
  getTemplateById,
  getTemplatesByCategory,
  RESOURCE_CATEGORIES,
} from '../data/templates';
import type { DemoPreset, ResourceCategoryId } from '../types/prompt';

interface CategoryTemplatePickerProps {
  selectedCategory: ResourceCategoryId;
  selectedTemplateIds: string[];
  onSelectCategory: (category: ResourceCategoryId) => void;
  onToggleTemplate: (templateId: string) => void;
  onApplyPreset: (preset: DemoPreset) => void;
  onResetForm: () => void;
}

const CATEGORY_ICONS: Record<ResourceCategoryId, typeof BookOpen> = {
  didaticos: BookOpen,
  avaliacoes: ClipboardCheck,
  documentais: FileText,
  complementares: Presentation,
};

export function CategoryTemplatePicker({
  selectedCategory,
  selectedTemplateIds,
  onSelectCategory,
  onToggleTemplate,
  onApplyPreset,
  onResetForm,
}: CategoryTemplatePickerProps) {
  const templates = getTemplatesByCategory(selectedCategory);

  const countInCategory = (catId: ResourceCategoryId) => {
    const catIds = new Set(getTemplatesByCategory(catId).map((t) => t.id));
    return selectedTemplateIds.filter((id) => catIds.has(id)).length;
  };

  return (
    <section className="ufma-card p-5 sm:p-6">
      {/* Exemplos prontos em 1 clique */}
      <div className="ufma-subbox mb-5 flex flex-col gap-2.5 p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] text-[var(--accent)] uppercase">
            <Wand2 className="h-3.5 w-3.5" />
            Exemplos prontos em 1 clique
          </span>
          <button
            type="button"
            onClick={onResetForm}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar / Novo prompt
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="group flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-1.5 text-left text-xs transition-all hover:border-[var(--accent)]"
            >
              <span className="rounded-full bg-[color-mix(in_srgb,var(--ufma-vinho)_85%,transparent)] px-2 py-0.5 text-[10px] font-bold text-[#FAF5F0]">
                {preset.badge}
              </span>
              <span className="font-semibold text-[var(--text)]">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cabeçalho do passo */}
      <div className="mb-4 flex items-center gap-3">
        <span className="ufma-step-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold">
          1
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-[var(--text)] sm:text-lg">
            Escolha a categoria e um ou mais recursos
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Você pode combinar <strong>mais de 1 recurso ao mesmo tempo</strong> (inclusive entre
            categorias diferentes — ex.: Plano de Aula + Slides + Prova).
          </p>
        </div>
      </div>

      {/* Abas de categoria */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {RESOURCE_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id];
          const isActive = cat.id === selectedCategory;
          const catSelectedCount = countInCategory(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all ${
                isActive
                  ? 'border-[var(--ufma-dourado)] bg-gradient-to-br from-[#8D0333] to-[#660225] text-[#FAF5F0] shadow-md'
                  : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex w-full items-center justify-between gap-1">
                <Icon
                  className={`h-4 w-4 ${isActive ? 'text-[#FEC84D]' : 'text-[var(--accent)]'}`}
                />
                <div className="flex items-center gap-1">
                  {catSelectedCount > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-[#0AB0AB] text-white'
                          : 'bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                      }`}
                    >
                      {catSelectedCount}
                    </span>
                  )}
                  {cat.id === 'complementares' && catSelectedCount === 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        isActive
                          ? 'bg-[#FEC84D] text-[#1A080E]'
                          : 'border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--ufma-amarelo)_18%,transparent)] text-[var(--text)]'
                      }`}
                    >
                      Slides ★
                    </span>
                  )}
                </div>
              </div>
              <span className="font-display text-xs font-bold leading-snug sm:text-[13px]">
                {cat.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resumo dos recursos selecionados (multisseleção) */}
      {selectedTemplateIds.length > 0 && (
        <div className="ufma-tealbox mb-4 flex flex-wrap items-center gap-1.5 px-3 py-2.5">
          <span className="mr-1 text-[11px] font-bold text-[var(--text)]">
            Selecionados ({selectedTemplateIds.length}):
          </span>
          {selectedTemplateIds.map((id) => {
            const tpl = getTemplateById(id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--teal)] bg-[var(--surface-solid)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text)]"
              >
                {tpl.shortName}
                <button
                  type="button"
                  onClick={() => onToggleTemplate(id)}
                  aria-label={`Remover ${tpl.shortName}`}
                  className="rounded-full p-0.5 hover:bg-black/15"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Cartões dos templates (multisseleção) */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {templates.map((tpl) => {
          const isSelected = selectedTemplateIds.includes(tpl.id);
          return (
            <button
              key={tpl.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleTemplate(tpl.id)}
              className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_13%,var(--surface-solid))] shadow-xs'
                  : 'border-[var(--border)] bg-[var(--surface-solid)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div>
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? 'border-[var(--teal)] bg-[var(--teal)] text-white'
                          : 'border-[var(--border-strong)]'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="font-display text-sm font-bold text-[var(--text)]">
                      {tpl.name}
                    </span>
                  </div>
                  {tpl.badge && (
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tpl.isFeatured
                          ? 'border border-[#D4B277]/60 bg-[#8D0333] text-[#FEC84D]'
                          : tpl.isDocumentWithPrivacy
                          ? 'border border-[var(--warn)] bg-[color-mix(in_srgb,var(--warn)_18%,transparent)] text-[var(--text)]'
                          : 'border border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_16%,transparent)] text-[var(--text)]'
                      }`}
                    >
                      {tpl.isFeatured && <Sparkles className="h-2.5 w-2.5" />}
                      {tpl.isDocumentWithPrivacy && <ShieldCheck className="h-2.5 w-2.5" />}
                      {tpl.badge}
                    </span>
                  )}
                </div>
                <p className="pl-6 text-xs leading-relaxed text-[var(--muted)]">
                  {tpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
