import type { DeviceSource, SavedPrompt } from '../types/prompt';

const STORAGE_KEY = 'promptdocente_library_v1';
const DEVICE_SOURCES_STORAGE_KEY = 'promptdocente_device_sources_v1';

export function loadDeviceSourcesLibrary(): DeviceSource[] {
  try {
    const raw = window.localStorage.getItem(DEVICE_SOURCES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as DeviceSource[];
  } catch {
    return [];
  }
}

export function persistDeviceSourcesLibrary(sources: DeviceSource[]): void {
  try {
    window.localStorage.setItem(DEVICE_SOURCES_STORAGE_KEY, JSON.stringify(sources));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadSavedPrompts(): SavedPrompt[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedPrompt[];
  } catch {
    return [];
  }
}

export function persistSavedPrompts(items: SavedPrompt[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function exportLibraryToJson(items: SavedPrompt[]): string {
  return JSON.stringify(
    {
      app: 'PromptDocente',
      version: 1,
      exportedAt: new Date().toISOString(),
      prompts: items,
    },
    null,
    2
  );
}

export function parseImportedLibraryJson(raw: string): SavedPrompt[] {
  const parsed = JSON.parse(raw) as unknown;
  if (Array.isArray(parsed)) {
    return parsed as SavedPrompt[];
  }
  if (
    parsed &&
    typeof parsed === 'object' &&
    'prompts' in parsed &&
    Array.isArray((parsed as { prompts: unknown }).prompts)
  ) {
    return (parsed as { prompts: SavedPrompt[] }).prompts;
  }
  throw new Error('Formato de arquivo JSON inválido para a biblioteca PromptDocente.');
}
