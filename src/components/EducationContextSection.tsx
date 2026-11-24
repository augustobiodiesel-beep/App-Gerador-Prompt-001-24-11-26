import { BookCheck, FilePlus2, GraduationCap } from 'lucide-react';
import {
  EDUCATION_STAGES,
  getStageById,
  OPTIONAL_REFERENCE_DOCUMENTS,
} from '../data/education';
import type { EducationStageId, PromptFormState } from '../types/prompt';

interface EducationContextSectionProps {
  state: PromptFormState;
  isEditorialSlides: boolean;
  onChangeStage: (stage: EducationStageId) => void;
  onUpdateField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
}

export function EducationContextSection({
  state,
  isEditorialSlides,
  onChangeStage,
  onUpdateField,
}: EducationContextSectionProps) {
  const activeStage = getStageById(state.stage);

  const toggleExtraDoc = (docId: string) => {
    const current = state.selectedExtraDocs ?? [];
    const exists = current.includes(docId);
    const next = exists ? current.filter((id) => id !== docId) : [...current, docId];
    onUpdateField('selectedExtraDocs', next);
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
            onChange={(e) => onUpdateField('yearOrTrack', e.target.value)}
            className="ufma-input px-3 py-2.5 text-sm"
          >
            {activeStage.yearsOrTracks.map((yr) => (
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
            onChange={(e) => onUpdateField('component', e.target.value)}
            className="ufma-input px-3 py-2.5 text-sm"
          >
            {activeStage.components.map((comp) => (
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
              <span className="rounded-full border border-[var(--teal)] bg-[color-mix(in_srgb,var(--teal)_16%,transparent)] px-2 py-0.5 text-[10px] font-bold text-[var(--text)]">
                {activeStage.badge}
              </span>
            </div>
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
          </div>
        </div>
      </div>

      {/* Campo Opcional: Outros documentos para a IA consultar */}
      <div className="ufma-subbox p-4">
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
              Marque referenciais complementares ou escreva o nome de documentos da sua rede/escola
              (currículo estadual/municipal, PPP, ementa técnica, livro didático do PNLD, leis ou
              PDF que você anexará na IA).
            </p>
          </div>
        </div>

        {/* Atalhos rápidos de documentos complementares */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {OPTIONAL_REFERENCE_DOCUMENTS.map((doc) => {
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

        {/* Campo livre de texto para outros documentos */}
        <textarea
          id="additionalDocuments"
          rows={2}
          value={state.additionalDocuments}
          onChange={(e) => onUpdateField('additionalDocuments', e.target.value)}
          placeholder="Ex.: Documento Curricular do meu município, Matriz do SAEB, Projeto Político-Pedagógico da escola, capítulo 4 do livro didático PNLD, ou o PDF em anexo..."
          className="ufma-input px-3 py-2 text-xs"
        />
      </div>
    </section>
  );
}
