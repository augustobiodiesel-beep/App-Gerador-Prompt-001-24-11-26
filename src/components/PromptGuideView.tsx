import { BookOpen, ExternalLink, Presentation, ShieldCheck, Sparkles, Target } from 'lucide-react';

export function PromptGuideView() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="ufma-card p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--accent)] uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Fundamentação Pedagógica · PROFCOMP-MA / UFMA
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-[var(--text)]">
          Como o PromptDocente estrutura prompts de alta qualidade para a Educação Básica
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Prompts genéricos (&ldquo;crie um plano de aula sobre frações&rdquo;) produzem materiais
          superficiais e desconectados da realidade escolar. Este produto educacional — desenvolvido
          no âmbito do <strong className="text-[var(--text)]">PROFCOMP-MA / UFMA</strong> e
          inspirado no REA{' '}
          <a
            href="https://educ.nekoweb.org/geradores/home.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] underline"
          >
            Geradores de Prompts de AI para Professores (MEC RED, ID 364756)
          </a>{' '}
          — combina engenharia de prompts com a <strong className="text-[var(--text)]">BNCC</strong>
          , <strong className="text-[var(--text)]">Taxonomia de Bloom</strong> e{' '}
          <strong className="text-[var(--text)]">DUA</strong> para toda a Educação Básica (Infantil,
          Fundamental, Médio Regular, Médio Técnico e EJA).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="ufma-card p-5">
          <div className="mb-3 flex items-center gap-2 text-[var(--accent)]">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-display text-base font-bold text-[var(--text)]">
              Anatomia dos Prompts Didáticos e Documentais
            </h2>
          </div>
          <ol className="space-y-2.5 text-xs leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--text)]">1. Papel (Persona):</strong> define a
              especialidade docente (design instrucional, avaliação formativa, AEE/DUA ou redação
              oficial).
            </li>
            <li>
              <strong className="text-[var(--text)]">2. Contexto Escolar &amp; BNCC:</strong> ancora
              a IA na faixa etária, etapa (Infantil, EF, Médio Regular, Médio Técnico ou EJA) e
              habilidades oficiais.
            </li>
            <li>
              <strong className="text-[var(--text)]">3. Objetivo &amp; Taxonomia de Bloom:</strong>{' '}
              eleva a demanda cognitiva de simples memorização até análise, avaliação e criação.
            </li>
            <li>
              <strong className="text-[var(--text)]">4. Estrutura Obrigatória:</strong> garante
              seções práticas (tempos de aula, distratores comentados, rubricas observáveis).
            </li>
            <li>
              <strong className="text-[var(--text)]">5. Inclusão (DUA) e Verificação:</strong> evita
              alucinações de códigos BNCC e inclui adaptações reais para turmas heterogêneas.
            </li>
          </ol>
        </div>

        <div className="ufma-card p-5">
          <div className="mb-3 flex items-center gap-2 text-[var(--accent)]">
            <Presentation className="h-5 w-5" />
            <h2 className="font-display text-base font-bold text-[var(--text)]">
              Modelo de Slides Editoriais Premium
            </h2>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-[var(--muted)]">
            Inspirado no padrão visual de keynotes da Apple e editoriais da Kinfolk/Monocle, esse
            gerador substitui slides lotados de texto por comunicação visual de alto impacto:
          </p>
          <ul className="space-y-2 text-xs leading-relaxed text-[var(--muted)]">
            <li>
              • <strong className="text-[var(--text)]">1 ideia por slide</strong> e máximo de 25
              palavras de texto corrido.
            </li>
            <li>
              • <strong className="text-[var(--text)]">Paleta coesa</strong> (até 3 cores +
              neutros) e par tipográfico editorial.
            </li>
            <li>
              • <strong className="text-[var(--text)]">Fotografia real verificada</strong>{' '}
              (Unsplash/Pexels) com contraste AA e créditos.
            </li>
            <li>
              • <strong className="text-[var(--text)]">Arco narrativo em 5 atos</strong> (Capa →
              Gancho → Blocos → Momento Uau → Fechamento).
            </li>
            <li>
              • <strong className="text-[var(--text)]">Prévia em 5 linhas + notas + checklist</strong>{' '}
              de auto-revisão antes da entrega final.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="ufma-warnbox p-5">
          <div className="mb-2 flex items-center gap-2 text-[var(--warn)]">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-display text-sm font-bold text-[var(--text)]">
              Ética, LGPD e Autoria Docente
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            Este aplicativo gera apenas prompts profissionais — não produz os materiais finais. Ao
            criar PEIs, pareceres descritivos ou atas, nunca informe nome completo, CPF ou dados
            clínicos identificáveis de estudantes em ferramentas de IA. A curadoria pedagógica é
            sempre sua.
          </p>
        </div>

        <div className="ufma-tealbox p-5">
          <div className="mb-2 flex items-center gap-2 text-[var(--teal)]">
            <Target className="h-5 w-5" />
            <h3 className="font-display text-sm font-bold text-[var(--text)]">
              Fundamentação Normativa Brasileira
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            BNCC (MEC), LDB (Lei nº 9.394/1996), DCN, LBI (Lei nº 13.146/2015), Leis nº 10.639/2003
            e nº 11.645/2008, BNCC de Computação (Resolução CNE/CEB nº 1/2022) e Política Nacional
            de Educação Digital — PNED (Lei nº 14.533/2023).
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
            <a
              href="https://plataformaintegrada.mec.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
            >
              MEC RED <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://sigaa.ufma.br/sigaa/public/programa/apresentacao_stricto.jsf?lc=pt_BR&idPrograma=1997"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
            >
              PROFCOMP-MA / UFMA <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
