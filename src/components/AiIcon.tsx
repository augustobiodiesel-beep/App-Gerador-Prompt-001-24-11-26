interface AiIconProps {
  id: string;
  color: string;
  size?: 'sm' | 'md';
}

/**
 * Ícones SVG vetoriais distintos e inspirados na identidade visual de cada
 * plataforma de IA (Globais, Chinesas, Slides/Estudo e Brasil/Acesso Aberto).
 */
export function AiIcon({ id, color, size = 'md' }: AiIconProps) {
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8';
  const svgClass = size === 'sm' ? 'h-3 w-3' : 'h-4.5 w-4.5';

  const renderGlyph = () => {
    switch (id) {
      case 'chatgpt':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={svgClass}>
            <path d="M12 2.8l7.5 4.3v8.6L12 20l-7.5-4.3V7.1L12 2.8z" />
            <path d="M12 7.2l3.8 2.2v4.4L12 16l-3.8-2.2V9.4L12 7.2z" />
            <path d="M12 2.8v4.4M19.5 7.1l-3.7 2.3M19.5 15.7l-3.7-1.9M12 20v-4M4.5 15.7l3.7-1.9M4.5 7.1l3.7 2.3" />
          </svg>
        );
      case 'gemini':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass}>
            <path d="M12 2c.65 5.2 4.8 9.35 10 10-5.2.65-9.35 4.8-10 10-.65-5.2-4.8-9.35-10-10 5.2-.65 9.35-4.8 10-10z" />
          </svg>
        );
      case 'claude':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" className={svgClass}>
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
          </svg>
        );
      case 'copilot':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={svgClass}>
            <path d="M4.5 15.5c0-5 2.6-8.5 6.1-8.5 2.6 0 3.8 2 4.4 4.4" />
            <path d="M19.5 8.5c0 5-2.6 8.5-6.1 8.5-2.6 0-3.8-2-4.4-4.4" />
            <circle cx="9.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="14.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'perplexity':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" className={svgClass}>
            <path d="M12 3v18M5 7l7 4 7-4M5 17l7-4 7 4M5 7v10M19 7v10" />
          </svg>
        );
      case 'grok':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={svgClass}>
            <path d="M5 19L19 5" />
            <path d="M7.5 7.5a6.5 6.5 0 1 0 9 9" />
          </svg>
        );
      case 'meta_ai':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={svgClass}>
            <path d="M7.5 8.5c-2.6 0-4.5 1.8-4.5 3.8s1.9 3.7 4.5 3.7c2.3 0 3.8-2.2 4.5-3.8.7-1.6 2.2-3.7 4.5-3.7 2.6 0 4.5 1.8 4.5 3.8s-1.9 3.7-4.5 3.7c-2.3 0-3.8-2.1-4.5-3.7-.7-1.6-2.2-3.8-4.5-3.8z" />
          </svg>
        );
      case 'mistral':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass}>
            <rect x="3" y="4" width="4" height="4" rx="0.6" />
            <rect x="17" y="4" width="4" height="4" rx="0.6" />
            <rect x="3" y="9.5" width="8" height="4" rx="0.6" />
            <rect x="13" y="9.5" width="8" height="4" rx="0.6" />
            <rect x="3" y="15" width="4" height="4.5" rx="0.6" />
            <rect x="10" y="15" width="4" height="4.5" rx="0.6" />
            <rect x="17" y="15" width="4" height="4.5" rx="0.6" />
          </svg>
        );
      case 'poe':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5-3.6 7.5-8 7.5c-1.3 0-2.5-.3-3.6-.8L4 20l1.3-3.6C4.5 15 4 13.3 4 11.5z" />
            <circle cx="9.5" cy="11.5" r="1.1" fill="currentColor" />
            <circle cx="14.5" cy="11.5" r="1.1" fill="currentColor" />
          </svg>
        );
      case 'deepseek':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass}>
            <path d="M3 13c3.1.6 4.4-1.6 7.4-1.4 2.8.2 3.9 2.7 7.4 3 1.1.1 2.2-.1 3.2-.6-.7 3.4-4 5.8-8.2 5.8C7.2 19.8 3.6 16.9 3 13z" />
            <path d="M17.4 5.2L21 4l-1.1 3.7c-.6-1.1-1.4-1.9-2.5-2.5z" />
            <circle cx="9.5" cy="15.2" r="1.1" fill="#0f172a" />
          </svg>
        );
      case 'qwen':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={svgClass}>
            <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
            <circle cx="12" cy="12" r="3.2" />
            <path d="M14.3 14.3L18.5 18.5" strokeLinecap="round" />
          </svg>
        );
      case 'kimi':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass}>
            <path d="M15.8 4.2A8.2 8.2 0 1 0 19.8 16a6.4 6.4 0 1 1-4-11.8z" />
            <circle cx="17.5" cy="7.5" r="1.8" />
          </svg>
        );
      case 'glm_zai':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M5 6h14L5 18h14" />
            <circle cx="19" cy="6" r="1.3" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'ernie':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass}>
            <circle cx="8" cy="8.5" r="2.2" />
            <circle cx="12" cy="6.2" r="2.2" />
            <circle cx="16" cy="8.5" r="2.2" />
            <path d="M6.8 14.2c0-2.5 2.3-4.2 5.2-4.2s5.2 1.7 5.2 4.2c0 2.3-1.8 4-5.2 4s-5.2-1.7-5.2-4z" />
          </svg>
        );
      case 'doubao':
      case 'cici':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={svgClass}>
            <circle cx="12" cy="12" r="8" />
            <circle cx="9.2" cy="10.8" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="14.8" cy="10.8" r="1.2" fill="currentColor" stroke="none" />
            <path d="M9 14.8c1 1.2 2 1.7 3 1.7s2-.5 3-1.7" strokeLinecap="round" />
          </svg>
        );
      case 'yuanbao':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className={svgClass}>
            <path d="M4 13c0-4.2 3.6-7.5 8-7.5s8 3.3 8 7.5-3.6 6-8 6-8-1.8-8-6z" />
            <path d="M8.5 12.5c1-1.6 2.2-2.4 3.5-2.4s2.5.8 3.5 2.4" strokeLinecap="round" />
          </svg>
        );
      case 'minimax':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" className={svgClass}>
            <path d="M4 15c2-5 4-5 6 0s4 5 6 0 4-5 4-2" />
            <path d="M4 9c2-4 4-4 6 0s4 4 6 0" opacity=".7" />
          </svg>
        );
      case 'stepfun':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M5 17h4v-4h4V9h6" />
            <circle cx="19" cy="9" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'baichuan':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" className={svgClass}>
            <path d="M4 8c2.5-2 5.5-2 8 0s5.5 2 8 0" />
            <path d="M4 13c2.5-2 5.5-2 8 0s5.5 2 8 0" />
            <path d="M4 18c2.5-2 5.5-2 8 0s5.5 2 8 0" />
          </svg>
        );
      case 'manus':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M12 3l2.2 5.3L20 10l-5.8 1.7L12 17l-2.2-5.3L4 10l5.8-1.7L12 3z" />
            <path d="M7 19h10" />
          </svg>
        );
      case 'skywork':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M6.5 16.5a4 4 0 0 1-.4-7.9A5.5 5.5 0 0 1 17 7.5a3.8 3.8 0 0 1 .5 7.5" />
            <path d="M12 11v8M9.5 16.5L12 19l2.5-2.5" />
          </svg>
        );
      case 'gamma':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <rect x="3.5" y="5" width="17" height="12" rx="2.2" />
            <path d="M8 20h8M12 17v3M8 11h8M8 8.5h4" />
          </svg>
        );
      case 'notebooklm':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
            <path d="M9 9h6M9 13h4" />
          </svg>
        );
      case 'aistudio':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
          </svg>
        );
      case 'canva':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={svgClass}>
            <path d="M16.5 8.5a5.5 5.5 0 1 0 0 7" />
            <circle cx="17.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'genspark':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass}>
            <path d="M12 2.5l2.1 6.2 6.4 1.3-5.2 3.9 1.6 6.3L12 16.5l-4.9 3.7 1.6-6.3-5.2-3.9 6.4-1.3L12 2.5z" />
          </svg>
        );
      case 'napkin':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <circle cx="6" cy="6" r="2.2" />
            <circle cx="18" cy="6" r="2.2" />
            <circle cx="12" cy="18" r="2.2" />
            <path d="M8 7l3 9M16 7l-3 9M8.2 6h7.6" />
          </svg>
        );
      case 'maritaca':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M18 7c-2.5-3-7.5-3-10 .5C6 10.3 6 15.5 6 19.5c3.5-1 6.5-2.5 8.5-5.2 1.2-1.7 2-3.5 2-5.3L20 8l-2-1z" />
            <circle cx="13.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'duckai':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <circle cx="11" cy="9" r="4" />
            <path d="M15 9.5h4.5l-2 2.5H14" />
            <path d="M6 16.5c1.5 2 4.5 3 8 2.5 2.2-.3 3.8-1.4 4.5-3" />
          </svg>
        );
      case 'huggingchat':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={svgClass}>
            <circle cx="12" cy="12" r="8" />
            <path d="M8.5 10.2c.5-.6 1.5-.6 2 0M13.5 10.2c.5-.6 1.5-.6 2 0" />
            <path d="M8.5 14.5c1 1.5 2.2 2.1 3.5 2.1s2.5-.6 3.5-2.1" />
          </svg>
        );
      case 'lmarena':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass}>
            <path d="M6 19V9M12 19V5M18 19v-7M3 19h18" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={svgClass}>
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl text-white shadow-xs ${dim}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {renderGlyph()}
    </span>
  );
}
