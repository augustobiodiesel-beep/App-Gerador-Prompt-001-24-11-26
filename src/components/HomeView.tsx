import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
  Globe,
  Layers,
  Lightbulb,
  Presentation,
  School,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { FREE_AI_PLATFORMS } from '../data/aiPlatforms';
import { DEMO_PRESETS } from '../data/templates';
import type { DemoPreset } from '../types/prompt';
import { UfmaCrest } from './UfmaCrest';

interface HomeViewProps {
  savedCount: number;
  onStartBuilder: () => void;
  onOpenSlides: () => void;
  onOpenAiDirectory: () => void;
  onOpenLibrary: () => void;
  onApplyPreset: (preset: DemoPreset) => void;
}

const FLOATING_TILES = [
  { id: 'bncc', Icon: BookOpen, left: '6%', top: '20%', size: 72, delay: '0s', variant: '' },
  { id: 'slides', Icon: Presentation, left: '32%', top: '5%', size: 58, delay: '-0.6s', variant: 'gold' },
  { id: 'spark', Icon: Sparkles, left: '46%', top: '29%', size: 92, delay: '-1.1s', variant: '' },
  { id: 'trend', Icon: TrendingUp, left: '76%', top: '11%', size: 62, delay: '-0.3s', variant: 'teal' },
  { id: 'bib', Icon: BookMarked, left: '17%', top: '47%', size: 80, delay: '-1.7s', variant: 'gold' },
  { id: 'escola', Icon: School, left: '68%', top: '42%', size: 68, delay: '-0.9s', variant: '' },
  { id: 'code', Icon: Code2, left: '84%', top: '34%', size: 48, delay: '-2.2s', variant: 'teal' },
  { id: 'cal', Icon: Calendar, left: '8%', top: '67%', size: 56, delay: '-1.4s', variant: 'fade' },
  { id: 'shield', Icon: ShieldCheck, left: '46%', top: '67%', size: 62, delay: '-0.5s', variant: 'teal' },
  { id: 'idea', Icon: Lightbulb, left: '74%', top: '67%', size: 54, delay: '-2.4s', variant: 'gold' },
];

export function HomeView({
  savedCount,
  onStartBuilder,
  onOpenSlides,
  onOpenAiDirectory,
  onOpenLibrary,
  onApplyPreset,
}: HomeViewProps) {
  const chineseCount = FREE_AI_PLATFORMS.filter((a) => a.group === 'chinesas').length;

  return (
    <div className="view-enter space-y-6">
      {/* HERO com tiles flutuantes (identico ao Caderno de Contexto UFMA) */}
      <section className="grid grid-cols-1 items-center gap-7 py-3 lg:grid-cols-12 lg:py-5">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <UfmaCrest variant="hero" />
            <span className="hero-badge">
              <i />
              PROFCOMP-MA · UFMA · BNCC &amp; Legislação
            </span>
          </div>

          <h1 className="font-display mt-4 mb-4 text-3xl font-extrabold leading-[1.08] tracking-tight text-[var(--text)] sm:text-5xl">
            Prompts profissionais com{' '}
            <span className="hero-grad">a identidade da sua aula</span>.
          </h1>

          <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--muted)]">
            Crie prompts estruturados para recursos <strong>didáticos e documentais</strong> na
            Educação Básica (Infantil, Fundamental, Médio Regular, Médio Técnico e EJA). A IA lê o
            documento oficial da <strong>BNCC</strong> automaticamente, e você ainda conta com o
            gerador editorial de <strong>Slides Premium</strong> e links para{' '}
            <strong>{FREE_AI_PLATFORMS.length} IAs gratuitas</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartBuilder}
              className="ufma-btn-pri inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
            >
              <ArrowRight className="h-4 w-4" />
              Montar prompt agora
            </button>

            <button
              type="button"
              onClick={onOpenSlides}
              className="ufma-btn inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
            >
              <Presentation className="h-4 w-4 text-[var(--accent)]" />
              Slides Editoriais
            </button>

            <button
              type="button"
              onClick={onOpenAiDirectory}
              className="ufma-btn inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
            >
              <Globe className="h-4 w-4 text-[var(--teal)]" />
              {FREE_AI_PLATFORMS.length} IAs Gratuitas
            </button>
          </div>

          {/* Exemplos rápidos logo abaixo do Hero */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-[var(--faint)] uppercase">
              Testar exemplo pronto:
            </span>
            {DEMO_PRESETS.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tiles Flutuantes (assinatura visual do Caderno de Contexto) */}
        <div className="hero-tiles lg:col-span-5" aria-hidden="true">
          {FLOATING_TILES.map(({ id, Icon, left, top, size, delay, variant }) => (
            <span
              key={id}
              className={`hero-tile ${variant}`}
              style={{
                left,
                top,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: delay,
              }}
            >
              <Icon style={{ width: '44%', height: '44%' }} />
            </span>
          ))}
          <span className="hero-base" />
        </div>
      </section>

      {/* 3 PASSOS NUMERADOS (identico à grade .passos) */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={onStartBuilder}
          className="ufma-card passo-card p-5 text-left"
        >
          <span className="passo-num">1</span>
          <span className="ico-chip inline-grid h-9 w-9 place-items-center rounded-xl">
            <Layers className="h-4 w-4" />
          </span>
          <h2 className="font-display mt-3.5 mb-1.5 text-base font-bold text-[var(--text)]">
            Escolha entre 16 recursos
          </h2>
          <p className="mb-3.5 text-xs leading-relaxed text-[var(--muted)]">
            Planos de aula, sequências, provas, rubricas, PEI, relatórios, atas, jogos e{' '}
            <strong>Slides Editoriais Premium</strong> em 4 categorias.
          </p>
          <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <i className="inline-block h-2 w-2 rounded-full bg-[var(--good)] shadow-[0_0_8px_var(--good)]" />
            BNCC lida automaticamente pela IA
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenAiDirectory}
          className="ufma-card passo-card p-5 text-left"
        >
          <span className="passo-num">2</span>
          <span className="ico-chip inline-grid h-9 w-9 place-items-center rounded-xl">
            <Globe className="h-4 w-4" />
          </span>
          <h2 className="font-display mt-3.5 mb-1.5 text-base font-bold text-[var(--text)]">
            Copie e abra em {FREE_AI_PLATFORMS.length} IAs
          </h2>
          <p className="mb-3.5 text-xs leading-relaxed text-[var(--muted)]">
            Acesso direto a todas as IAs com plano gratuito, incluindo{' '}
            <strong>{chineseCount} IAs chinesas</strong> (DeepSeek, Qwen, Kimi, GLM, ERNIE,
            Doubao...), globais e IA brasileira.
          </p>
          <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <i className="inline-block h-2 w-2 rounded-full bg-[var(--good)] shadow-[0_0_8px_var(--good)]" />
            Links UFMA · PROFCOMP-MA · MEC RED
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenLibrary}
          className="ufma-card passo-card p-5 text-left"
        >
          <span className="passo-num">3</span>
          <span className="ico-chip inline-grid h-9 w-9 place-items-center rounded-xl">
            <BookMarked className="h-4 w-4" />
          </span>
          <h2 className="font-display mt-3.5 mb-1.5 text-base font-bold text-[var(--text)]">
            Curadoria e Biblioteca
          </h2>
          <p className="mb-3.5 text-xs leading-relaxed text-[var(--muted)]">
            Inspecione o prompt em camadas explicativas, valide com o checklist docente (INST-04) e
            salve versões com backup em JSON.
          </p>
          <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <i
              className={`inline-block h-2 w-2 rounded-full ${
                savedCount > 0
                  ? 'bg-[var(--good)] shadow-[0_0_8px_var(--good)]'
                  : 'bg-[var(--faint)]'
              }`}
            />
            {savedCount} prompt{savedCount === 1 ? '' : 's'} salvo{savedCount === 1 ? '' : 's'} no
            navegador
          </span>
        </button>
      </section>

      {/* FUNDAMENTAÇÃO CURRICULAR E LEGAL (identico ao card .porque) */}
      <section className="ufma-card p-5 sm:p-6">
        <div className="mb-1 flex items-center gap-3">
          <span className="ico-chip inline-grid h-9 w-9 shrink-0 place-items-center rounded-xl">
            <BookOpen className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-bold text-[var(--text)]">
            Fundamentação Curricular e Legal
          </h2>
        </div>
        <p className="mb-5 text-xs text-[var(--muted)]">
          Projetado para a realidade das escolas brasileiras na Educação Básica (Infantil,
          Fundamental, Médio Regular, Médio Técnico e EJA).
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <span className="ico-chip inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg">
              <BookOpen className="h-4 w-4" />
            </span>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              <strong className="text-[var(--text)]">
                Consulta Automática ao Documento Oficial.
              </strong>{' '}
              O professor não precisa decorar códigos: o prompt inclui comando fixo para a IA
              consultar a BNCC, CNCT ou DCNs da EJA e escolher as habilidades mais adequadas, além
              de campo opcional para DCTMA, PPP ou PDFs.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="ico-chip inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg">
              <Presentation className="h-4 w-4" />
            </span>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              <strong className="text-[var(--text)]">Slides Editoriais de Alto Padrão.</strong>{' '}
              Modelo dedicado de direção de arte (Apple Keynote / Kinfolk / Monocle) com 1 ideia por
              slide, fotos editoriais verificadas, arco narrativo em 5 atos e auto-revisão.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="ico-chip inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              <strong className="text-[var(--text)]">Camadas Explicativas e Curadoria.</strong> O
              prompt aparece dividido em camadas com notas pedagógicas e checklist de validação
              docente (INST-04) para fortalecer sua autoria crítica.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="ico-chip inline-grid h-8 w-8 shrink-0 place-items-center rounded-lg">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              <strong className="text-[var(--text)]">Privacidade, LGPD e Uso Offline.</strong>{' '}
              Biblioteca local sem cadastro nem exposição de dados pessoais de estudantes — com
              proteção LGPD automática para PEIs, pareceres e documentos escolares.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
