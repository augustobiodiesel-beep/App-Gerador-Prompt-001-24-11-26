import { useMemo, useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  AI_PLATFORM_GROUPS,
  FREE_AI_PLATFORMS,
  INSTITUTIONAL_LINKS,
  type AIPlatform,
  type AIPlatformGroup,
} from '../data/aiPlatforms';
import { AiIcon } from './AiIcon';

interface AiDirectoryViewProps {
  currentPrompt: string;
}

export function AiDirectoryView({ currentPrompt }: AiDirectoryViewProps) {
  const [group, setGroup] = useState<AIPlatformGroup | 'todas'>('todas');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FREE_AI_PLATFORMS.filter((ai) => {
      if (group !== 'todas' && ai.group !== group) return false;
      if (!q) return true;
      return (
        ai.name.toLowerCase().includes(q) ||
        ai.company.toLowerCase().includes(q) ||
        ai.origin.toLowerCase().includes(q) ||
        ai.freeTierNote.toLowerCase().includes(q) ||
        (ai.recommendedFor ?? '').toLowerCase().includes(q)
      );
    });
  }, [group, search]);

  const chineseCount = FREE_AI_PLATFORMS.filter((a) => a.group === 'chinesas').length;

  const handleCopyAndOpen = async (ai: AIPlatform) => {
    try {
      await navigator.clipboard.writeText(currentPrompt);
      setCopiedId(ai.id);
      window.setTimeout(() => setCopiedId(null), 2400);
    } catch {
      // fallback silently
    }
    window.open(ai.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Institutional & MEC RED Links */}
      <section className="ufma-card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="ufma-step-badge flex h-9 w-9 items-center justify-center rounded-xl">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <h1 className="font-display text-lg font-extrabold text-[var(--text)] sm:text-xl">
                Links Institucionais, MEC RED &amp; Referências Oficiais
              </h1>
              <p className="text-xs text-[var(--muted)]">
                Acesso direto ao PROFCOMP-MA / UFMA, Plataforma MEC RED, BNCC e projeto REA base.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INSTITUTIONAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ufma-subbox group flex flex-col justify-between p-4 transition-all hover:border-[var(--accent)]"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--accent)] uppercase">
                    {link.badge}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[var(--faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
                </div>
                <h2 className="font-display text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
                  {link.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  {link.subtitle}
                </p>
              </div>
              <span className="mt-3 truncate font-mono-prompt text-[10px] text-[var(--faint)]">
                {link.url}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Free AI Platforms Directory */}
      <section className="ufma-card p-5 sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="ufma-step-badge flex h-9 w-9 items-center justify-center rounded-xl">
              <Globe className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold text-[var(--text)] sm:text-xl">
                Diretório Completo de IAs com Versão Gratuita ({FREE_AI_PLATFORMS.length})
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Inclui todas as <strong>{chineseCount} principais IAs chinesas</strong>, IAs
                globais, ferramentas de slides/estudo e IA brasileira. Ao clicar, seu prompt atual é
                copiado automaticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {AI_PLATFORM_GROUPS.map((g) => {
              const active = group === g.id;
              const count =
                g.id === 'todas'
                  ? FREE_AI_PLATFORMS.length
                  : FREE_AI_PLATFORMS.filter((a) => a.group === g.id).length;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGroup(g.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0] shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                  }`}
                >
                  {g.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar IA (ex.: DeepSeek, Qwen, Kimi...)"
              className="ufma-input py-2 pr-3 pl-9 text-xs"
            />
          </div>
        </div>

        {/* AI Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ai) => {
            const isCopied = copiedId === ai.id;
            return (
              <article
                key={ai.id}
                style={{ '--ia-color': ai.color } as React.CSSProperties}
                className="ufma-ia-pill flex flex-col justify-between rounded-2xl p-4"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <AiIcon id={ai.id} color={ai.color} size="md" />
                      <div>
                        <h3 className="font-display text-sm font-bold text-[var(--text)]">
                          {ai.name}
                        </h3>
                        <p className="text-[11px] text-[var(--faint)]">{ai.company}</p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                      {ai.origin}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-[var(--muted)]">{ai.freeTierNote}</p>

                  {ai.recommendedFor && (
                    <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[var(--teal)]">
                      <Sparkles className="h-3 w-3 shrink-0" />
                      <span>Ideal para: {ai.recommendedFor}</span>
                    </p>
                  )}
                </div>

                <div className="mt-3.5 flex items-center gap-2 border-t border-[var(--border)] pt-3">
                  <button
                    type="button"
                    onClick={() => handleCopyAndOpen(ai)}
                    className="ufma-btn-pri flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isCopied ? 'Copiado! Abrindo...' : 'Copiar Prompt & Abrir'}</span>
                  </button>

                  <a
                    href={ai.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Abrir ${ai.name} em nova aba`}
                    className="ufma-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
