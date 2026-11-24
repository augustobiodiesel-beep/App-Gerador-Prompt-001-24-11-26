import { Accessibility } from 'lucide-react';
import {
  ACTIVE_METHODOLOGIES,
  INCLUSION_PROFILES,
  OUTPUT_FORMAT_OPTIONS,
  TONE_OPTIONS,
} from '../data/education';
import type { PromptFormState } from '../types/prompt';

interface PedagogicalRefinementSectionProps {
  state: PromptFormState;
  isEditorialSlidesOnly: boolean;
  onUpdateField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
}

export function PedagogicalRefinementSection({
  state,
  isEditorialSlidesOnly,
  onUpdateField,
}: PedagogicalRefinementSectionProps) {
  const toggleInclusionProfile = (profile: string) => {
    const exists = state.inclusionProfiles.includes(profile);
    const next = exists
      ? state.inclusionProfiles.filter((p) => p !== profile)
      : [...state.inclusionProfiles, profile];
    onUpdateField('inclusionProfiles', next);
  };

  return (
    <section className="ufma-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="ufma-step-badge flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold">
          4
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-[var(--text)] sm:text-lg">
            Refinamento Pedagógico e Inclusão (DUA)
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Ajuste metodologia, linguagem, acessibilidade e restrições extras. A progressão
            cognitiva (Taxonomia de Bloom) e o formato estruturado já são aplicados automaticamente
            no motor do prompt.
          </p>
        </div>
      </div>

      {!isEditorialSlidesOnly && (
        <div className="mb-5 space-y-4">
          {/* Metodologia e Tom */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="methodology"
                className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
              >
                Metodologia / Abordagem Didática (opcional)
              </label>
              <select
                id="methodology"
                value={state.methodology}
                onChange={(e) => onUpdateField('methodology', e.target.value)}
                className="ufma-input px-3 py-2.5 text-xs sm:text-sm"
              >
                <option value="">Selecione (opcional)...</option>
                {ACTIVE_METHODOLOGIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="tone"
                className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
              >
                Tom e Registro de Linguagem (opcional)
              </label>
              <select
                id="tone"
                value={state.tone}
                onChange={(e) => onUpdateField('tone', e.target.value)}
                className="ufma-input px-3 py-2.5 text-xs sm:text-sm"
              >
                <option value="">Selecione (opcional)...</option>
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="outputFormat"
              className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
            >
              Formato de Entrega Esperado (opcional)
            </label>
            <select
              id="outputFormat"
              value={state.outputFormat}
              onChange={(e) => onUpdateField('outputFormat', e.target.value)}
              className="ufma-input px-3 py-2.5 text-xs sm:text-sm"
            >
              <option value="">Selecione (opcional)...</option>
              {OUTPUT_FORMAT_OPTIONS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Educação Inclusiva e DUA */}
      <div className="ufma-tealbox mb-5 p-4">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Accessibility className="h-4 w-4 text-[var(--teal)]" />
            <span className="text-xs font-bold text-[var(--text)]">
              Educação Inclusiva, LBI e Acessibilidade (DUA)
            </span>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-[var(--teal)]">
            <input
              type="checkbox"
              checked={state.inclusionEnabled}
              onChange={(e) => onUpdateField('inclusionEnabled', e.target.checked)}
              className="h-4 w-4 accent-[var(--teal)]"
            />
            Ativar
          </label>
        </div>

        {state.inclusionEnabled && (
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {INCLUSION_PROFILES.map((profile) => {
                const shortLabel = profile.split(' (')[0];
                const active = state.inclusionProfiles.includes(profile);
                return (
                  <button
                    key={profile}
                    type="button"
                    title={profile}
                    onClick={() => toggleInclusionProfile(profile)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      active
                        ? 'border-[var(--teal)] bg-[var(--teal)] text-white'
                        : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)] hover:border-[var(--teal)] hover:text-[var(--text)]'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {shortLabel}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={state.inclusionNotes}
              onChange={(e) => onUpdateField('inclusionNotes', e.target.value)}
              placeholder="Observações específicas de acessibilidade (opcional, sem nomes reais)..."
              className="ufma-input px-3 py-1.5 text-xs"
            />
          </div>
        )}
      </div>

      {/* Restrições adicionais */}
      <div>
        <label
          htmlFor="extraConstraints"
          className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
        >
          Restrições ou pedidos adicionais (opcional)
        </label>
        <input
          id="extraConstraints"
          type="text"
          value={state.extraConstraints}
          onChange={(e) => onUpdateField('extraConstraints', e.target.value)}
          placeholder="Ex.: Usar exemplos da cultura maranhense/nordestina; evitar jargões em inglês; caber em 2 páginas..."
          className="ufma-input px-3.5 py-2 text-sm"
        />
      </div>
    </section>
  );
}
