import { Accessibility, Brain, Cpu, SlidersHorizontal } from 'lucide-react';
import {
  ACTIVE_METHODOLOGIES,
  BLOOM_LEVELS,
  INCLUSION_PROFILES,
  OUTPUT_FORMAT_OPTIONS,
  TONE_OPTIONS,
} from '../data/education';
import type { PromptDepth, PromptFormState, TargetAI } from '../types/prompt';

interface PedagogicalRefinementSectionProps {
  state: PromptFormState;
  isEditorialSlides: boolean;
  onUpdateField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
}

const DEPTH_OPTIONS: { id: PromptDepth; label: string; desc: string }[] = [
  {
    id: 'direto',
    label: 'Direto (Enxuto)',
    desc: 'Rápido e objetivo para tarefas simples',
  },
  {
    id: 'estruturado',
    label: 'Estruturado (Recomendado)',
    desc: 'Completo com Persona, BNCC, DUA e critérios',
  },
  {
    id: 'avancado',
    label: 'Avançado (CoT + Iterativo)',
    desc: 'Inclui autoavaliação da IA e perguntas de refinamento',
  },
];

const TARGET_AI_OPTIONS: { id: TargetAI; label: string }[] = [
  { id: 'universal', label: 'Universal (Qualquer IA)' },
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'claude', label: 'Claude' },
  { id: 'copilot', label: 'Microsoft Copilot' },
];

export function PedagogicalRefinementSection({
  state,
  isEditorialSlides,
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
            Refinamento Pedagógico, Inclusão (DUA) e Engenharia do Prompt
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Ajuste o rigor cognitivo, acessibilidade e formato para obter respostas superiores da
            IA.
          </p>
        </div>
      </div>

      {!isEditorialSlides && (
        <div className="mb-5 space-y-4">
          {/* Taxonomia de Bloom */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
              <Brain className="h-3.5 w-3.5 text-[var(--accent)]" />
              Nível Cognitivo — Taxonomia de Bloom Revisada
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BLOOM_LEVELS.map((level) => {
                const active = state.bloomLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => onUpdateField('bloomLevel', level.id)}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      active
                        ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface-solid))]'
                        : 'border-[var(--border)] bg-[var(--surface-solid)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <p className="text-xs font-bold text-[var(--text)]">{level.label}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-[var(--muted)]">
                      {level.verbs}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metodologia e Tom */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="methodology"
                className="mb-1.5 block text-xs font-semibold text-[var(--text)]"
              >
                Metodologia / Abordagem Didática
              </label>
              <select
                id="methodology"
                value={state.methodology}
                onChange={(e) => onUpdateField('methodology', e.target.value)}
                className="ufma-input px-3 py-2.5 text-xs sm:text-sm"
              >
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
                Tom e Registro de Linguagem
              </label>
              <select
                id="tone"
                value={state.tone}
                onChange={(e) => onUpdateField('tone', e.target.value)}
                className="ufma-input px-3 py-2.5 text-xs sm:text-sm"
              >
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
              Formato de Entrega Esperado
            </label>
            <select
              id="outputFormat"
              value={state.outputFormat}
              onChange={(e) => onUpdateField('outputFormat', e.target.value)}
              className="ufma-input px-3 py-2.5 text-xs sm:text-sm"
            >
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

      {/* Profundidade e IA Alvo */}
      <div className="space-y-4">
        {!isEditorialSlides && (
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--accent)]" />
              Nível de Engenharia do Prompt
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {DEPTH_OPTIONS.map((opt) => {
                const active = state.depth === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateField('depth', opt.id)}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      active
                        ? 'border-[var(--ufma-dourado)] bg-gradient-to-br from-[#8D0333] to-[#660225] text-[#FAF5F0]'
                        : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p
                      className={`mt-0.5 text-[10px] leading-snug ${
                        active ? 'text-[#FAF5F0]/80' : 'text-[var(--muted)]'
                      }`}
                    >
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
            <Cpu className="h-3.5 w-3.5 text-[var(--accent)]" />
            Otimizar dica de formatação para qual IA?
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TARGET_AI_OPTIONS.map((ai) => {
              const active = state.targetAI === ai.id;
              return (
                <button
                  key={ai.id}
                  type="button"
                  onClick={() => onUpdateField('targetAI', ai.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                      : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                  }`}
                >
                  {ai.label}
                </button>
              );
            })}
          </div>
        </div>

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
      </div>
    </section>
  );
}
