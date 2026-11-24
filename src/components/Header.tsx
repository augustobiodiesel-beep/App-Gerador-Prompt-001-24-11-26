import {
  BookMarked,
  BookOpenCheck,
  ExternalLink,
  Globe,
  Home,
  Layers,
  Moon,
  Presentation,
  Sun,
} from 'lucide-react';
import { UfmaCrest } from './UfmaCrest';

export type ActiveTab = 'inicio' | 'builder' | 'ais' | 'library' | 'guide';
export type ThemeMode = 'escuro' | 'claro';

interface HeaderProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  savedCount: number;
  aiCount: number;
  isSlidesActive: boolean;
  onQuickOpenSlides: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Header({
  activeTab,
  onChangeTab,
  savedCount,
  aiCount,
  isSlidesActive,
  onQuickOpenSlides,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const navItems: {
    id: ActiveTab;
    label: string;
    shortLabel: string;
    Icon: typeof Home;
    badge?: number;
    tealIcon?: boolean;
  }[] = [
    { id: 'inicio', label: 'Início', shortLabel: 'Início', Icon: Home },
    { id: 'builder', label: 'Gerar Prompt', shortLabel: 'Gerar', Icon: Layers },
    { id: 'ais', label: 'IAs & Links', shortLabel: 'IAs', Icon: Globe, badge: aiCount, tealIcon: true },
    { id: 'library', label: 'Biblioteca', shortLabel: 'Salvos', Icon: BookMarked, badge: savedCount || undefined },
    { id: 'guide', label: 'Guia', shortLabel: 'Guia', Icon: BookOpenCheck },
  ];

  return (
    <>
      {/* Faixa Institucional UFMA / PROFCOMP-MA + MEC RED */}
      <div className="inst-strip text-[11.5px] sm:text-xs">
        <div className="mx-auto flex min-h-8 max-w-[1180px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1 sm:px-5">
          <span>
            Universidade Federal do Maranhão · <strong>PROFCOMP-MA</strong> — Mestrado Profissional
            em Ensino de Computação
          </span>
          <div className="flex flex-wrap items-center gap-3 font-semibold text-[#FEC84D]">
            <a
              href="https://sigaa.ufma.br/sigaa/public/programa/apresentacao_stricto.jsf?lc=pt_BR&idPrograma=1997"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              PROFCOMP-MA <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://portalpadrao.ufma.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 hover:underline sm:inline-flex"
            >
              UFMA <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://plataformaintegrada.mec.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              MEC RED <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://educ.nekoweb.org/geradores/home.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 hover:underline md:inline-flex"
            >
              REA Base <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Cabeçalho Principal */}
      <header className="ufma-header sticky top-0 z-30">
        <div className="mx-auto flex h-[66px] max-w-[1180px] items-center justify-between gap-3 px-4 sm:px-5">
          {/* Logo + Brasão UFMA / PROFCOMP-MA */}
          <button
            type="button"
            onClick={() => onChangeTab('inicio')}
            className="flex shrink-0 items-center gap-3 text-left transition-opacity hover:opacity-90"
          >
            <UfmaCrest variant="header" />
            <div>
              <span className="font-display block text-[16.5px] font-extrabold leading-tight text-[var(--text)]">
                Caderno de Contexto
              </span>
              <span className="mt-0.5 block text-[10.5px] font-semibold tracking-[0.06em] text-[var(--muted)] uppercase">
                Gerador de Prompts · BNCC
              </span>
            </div>
          </button>

          {/* Navegação principal (vira barra inferior fixa no celular, igual ao Caderno de Contexto) */}
          <nav
            aria-label="Seções principais"
            className="ufma-nav-tabs flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 md:ml-auto"
          >
            {navItems.map(({ id, label, shortLabel, Icon, badge, tealIcon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeTab(id)}
                  className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all md:flex-initial md:flex-row md:gap-1.5 md:rounded-full md:px-3 md:text-[13.5px] ${
                    active
                      ? 'border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] shadow-[var(--glow)]'
                      : 'border border-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      tealIcon ? 'text-[var(--teal)]' : 'text-[var(--accent)]'
                    }`}
                  />
                  <span className="md:hidden">{shortLabel}</span>
                  <span className="hidden md:inline">{label}</span>
                  {badge !== undefined && (
                    <span className="hidden rounded-full bg-[var(--ufma-vinho)] px-1.5 py-0.5 text-[10px] font-bold text-[#FAF5F0] lg:inline">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Ações direita: Atalho Slides + Tema Claro/Escuro */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onQuickOpenSlides}
              className={`hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all xl:flex ${
                activeTab === 'builder' && isSlidesActive ? 'ufma-btn-pri' : 'ufma-btn'
              }`}
              title="Abrir gerador de prompts para slides seguindo o modelo de Direção de Arte Editorial"
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>Slides</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Alternar entre modo claro e escuro"
              title={theme === 'escuro' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all hover:-rotate-12 hover:border-[var(--border-strong)] hover:shadow-[var(--glow)]"
            >
              {theme === 'escuro' ? (
                <Sun className="h-4 w-4 text-[#FEC84D]" />
              ) : (
                <Moon className="h-4 w-4 text-[#8D0333]" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
