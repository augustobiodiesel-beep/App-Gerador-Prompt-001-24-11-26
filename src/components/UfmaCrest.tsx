interface UfmaCrestProps {
  variant?: 'header' | 'hero' | 'footer';
}

export function UfmaCrest({ variant = 'header' }: UfmaCrestProps) {
  const sizeClass =
    variant === 'hero'
      ? 'h-16 sm:h-20 px-3 py-1.5 rounded-2xl'
      : variant === 'footer'
      ? 'h-14 px-2.5 py-1.5 rounded-xl'
      : 'h-11 px-2 py-1 rounded-xl';

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-[#D4B277]/80 bg-white/95 shadow-sm ${sizeClass}`}
      title="Universidade Federal do Maranhão — UFMA · SEMPRE+ (Qualidade, Inovação, Inclusão)"
    >
      <img
        src="/ufma-logo.png"
        alt="Logo oficial da Universidade Federal do Maranhão — UFMA SEMPRE+"
        className="h-full w-auto object-contain"
      />
    </span>
  );
}
