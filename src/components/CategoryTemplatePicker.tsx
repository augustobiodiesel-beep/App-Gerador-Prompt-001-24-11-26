import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Presentation,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';
import {
  DEMO_PRESETS,
  getTemplatesByCategory,
  RESOURCE_CATEGORIES,
} from '../data/templates';
import type { DemoPreset, ResourceCategoryId } from '../types/prompt';

interface CategoryTemplatePickerProps {
  selectedCategory: ResourceCategoryId;
  selectedTemplateId: string;
  onSelectCategory: (category: ResourceCategoryId) => void;
  onSelectTemplate: (templateId: string) => void;
  onApplyPreset: (preset: DemoPreset) => void;
}

const CATEGORY_ICONS: Record<ResourceCategoryId, typeof BookOpen> = {
  didaticos: BookOpen,
  avaliacoes: ClipboardCheck,
  documentais: FileText,
  complementares: Presentation,
};

export function CategoryTemplatePicker({
  selectedCategory,
  selectedTemplateId,
  onSelectCategory,
  onSelectTemplate,
  onApplyPreset,
}: CategoryTemplatePickerProps) {
  const templates = getTemplatesByCategory(selectedCategory);

  return (
    <section className="ufma-card p-5 sm:p-6">
      {/* Exemplos prontos em 1 clique */}
      <div className="ufma-subbox mb-5 flex flex-col gap-2.5 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] text-[var(--accent)] uppercase">
            <Wand2 className="h-3.5 w-3.5" />
            Exemplos prontos em 1 clique
          </span>
          <span className="hidden text-[11px] text-[var(--faint)] sm:inline">
            Preenchimento automático para demonstrar
          </span>
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
            Escolha a categoria e o tipo de recurso
          </h2>
          <p className="text-xs text-[var(--muted)]">
            16 modelos pedagógicos estruturados, incluindo o gerador exclusivo de Slides Editoriais
            Premium.
          </p>
        </div>
      </div>

      {/* Abas de categoria */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {RESOURCE_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id];
          const isActive = cat.id === selectedCategory;
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
              <div className="flex w-full items-center justify-between">
                <Icon
                  className={`h-4 w-4 ${isActive ? 'text-[#FEC84D]' : 'text-[var(--accent)]'}`}
                />
                {cat.id === 'complementares' && (
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
              <span className="font-display text-xs font-bold leading-snug sm:text-[13px]">
                {cat.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cartões dos templates */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {templates.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id)}
              className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_11%,var(--surface-solid))] shadow-xs'
                  : 'border-[var(--border)] bg-[var(--surface-solid)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div>
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <span className="font-display text-sm font-bold text-[var(--text)]">
                    {tpl.name}
                  </span>
                  {tpl.badge && (
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tpl.isFeatured
                          ? 'bg-[#8D0333] text-[#FEC84D] border border-[#D4B277]/60'
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
                <p className="text-xs leading-relaxed text-[var(--muted)]">{tpl.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
