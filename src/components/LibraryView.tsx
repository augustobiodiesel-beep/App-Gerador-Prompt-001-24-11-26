import { useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookMarked,
  Check,
  Copy,
  Download,
  Search,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { findStageById } from '../data/education';
import { getTemplateById, RESOURCE_CATEGORIES } from '../data/templates';
import { exportLibraryToJson, parseImportedLibraryJson } from '../services/storage';
import type { ResourceCategoryId, SavedPrompt } from '../types/prompt';

interface LibraryViewProps {
  prompts: SavedPrompt[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadIntoBuilder: (item: SavedPrompt) => void;
  onImportPrompts: (imported: SavedPrompt[]) => void;
}

export function LibraryView({
  prompts,
  onToggleFavorite,
  onDelete,
  onLoadIntoBuilder,
  onImportPrompts,
}: LibraryViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategoryId | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prompts.filter((item) => {
      if (onlyFavorites && !item.isFavorite) return false;
      if (categoryFilter !== 'all' && item.state.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.promptText.toLowerCase().includes(q) ||
        item.state.topic.toLowerCase().includes(q) ||
        item.state.component.toLowerCase().includes(q)
      );
    });
  }, [prompts, onlyFavorites, categoryFilter, search]);

  const handleCopy = async (item: SavedPrompt) => {
    try {
      await navigator.clipboard.writeText(item.promptText);
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleExportBackup = () => {
    const json = exportLibraryToJson(prompts);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptdocente-ufma-biblioteca-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseImportedLibraryJson(text);
      onImportPrompts(imported);
      setImportFeedback(`${imported.length} prompt(s) importado(s) com sucesso.`);
      window.setTimeout(() => setImportFeedback(null), 3500);
    } catch (err) {
      setImportFeedback(err instanceof Error ? err.message : 'Erro ao importar arquivo JSON.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="ufma-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-extrabold text-[var(--text)]">
            Minha Biblioteca e Histórico Local
          </h1>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Seus prompts ficam salvos exclusivamente neste navegador, sem identificação de
            estudantes. Exporte em JSON para backup.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            disabled={prompts.length === 0}
            className="ufma-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold disabled:opacity-45"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar Backup (.json)
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="ufma-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
          >
            <Upload className="h-3.5 w-3.5" />
            Importar (.json)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {importFeedback && (
        <div className="ufma-tealbox px-4 py-2.5 text-xs font-semibold text-[var(--text)]">
          {importFeedback}
        </div>
      )}

      {/* Filtros */}
      <div className="ufma-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, tema, componente ou trecho do prompt..."
            className="ufma-input py-2 pr-3 pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              categoryFilter === 'all'
                ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)]'
            }`}
          >
            Todos ({prompts.length})
          </button>
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                categoryFilter === cat.id
                  ? 'border-[var(--ufma-dourado)] bg-[var(--ufma-vinho)] text-[#FAF5F0]'
                  : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)]'
              }`}
            >
              {cat.shortLabel}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
              onlyFavorites
                ? 'border-[var(--warn)] bg-[color-mix(in_srgb,var(--warn)_20%,transparent)] text-[var(--text)]'
                : 'border-[var(--border)] bg-[var(--surface-solid)] text-[var(--muted)]'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                onlyFavorites ? 'fill-[#FEC84D] text-[#FEC84D]' : ''
              }`}
            />
            Favoritos
          </button>
        </div>
      </div>

      {/* Lista de prompts */}
      {filtered.length === 0 ? (
        <div className="ufma-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <BookMarked className="mb-3 h-10 w-10 text-[var(--accent)] opacity-75" />
          <h3 className="font-display text-base font-bold text-[var(--text)]">
            {prompts.length === 0
              ? 'Sua biblioteca ainda está vazia'
              : 'Nenhum prompt encontrado com esses filtros'}
          </h3>
          <p className="mt-1 max-w-md text-xs text-[var(--muted)]">
            {prompts.length === 0
              ? 'Monte um prompt na aba Construtor e clique em "Salvar na Biblioteca" para reutilizá-lo nas próximas aulas.'
              : 'Tente limpar a busca ou selecionar outra categoria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((item) => {
            const selectedIds =
              item.state.selectedTemplateIds?.length
                ? item.state.selectedTemplateIds
                : item.state.templateId
                  ? [item.state.templateId]
                  : [];
            const selectedTemplates = selectedIds.map((id) => getTemplateById(id));
            const stage = findStageById(item.state.stage);
            return (
              <article
                key={item.id}
                className="ufma-card flex flex-col justify-between p-4 transition-all hover:border-[var(--border-strong)]"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        {selectedTemplates.length > 0 ? (
                          selectedTemplates.map((tpl) => (
                            <span
                              key={tpl.id}
                              className="rounded-full border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]"
                            >
                              {tpl.shortName}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                            Prompt Pedagógico
                          </span>
                        )}
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                          {stage?.shortLabel ?? 'Educação Básica'}
                        </span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-[var(--text)]">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      aria-label="Favoritar prompt"
                      className="rounded-lg p-1.5 text-[var(--faint)] hover:text-[#FEC84D]"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          item.isFavorite ? 'fill-[#FEC84D] text-[#FEC84D]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <p className="mb-3 line-clamp-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] p-2.5 font-mono-prompt text-[11px] leading-relaxed text-[var(--muted)]">
                    {item.promptText}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                  <span className="text-[11px] text-[var(--faint)]">
                    Salvo em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className="ufma-btn inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-[var(--good)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedId === item.id ? 'Copiado' : 'Copiar'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onLoadIntoBuilder(item)}
                      className="ufma-btn-pri inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      Reabrir
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      aria-label="Excluir prompt"
                      className="rounded-full p-1.5 text-[var(--faint)] hover:text-[var(--bad)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
