interface UfmaCrestProps {
  size?: number;
  compactLabel?: boolean;
}

export function UfmaCrest({ size = 42, compactLabel = false }: UfmaCrestProps) {
  return (
    <span
      className="ufma-crest shrink-0"
      style={{ width: size, height: size }}
      title="Brasão Institucional — UFMA / PROFCOMP-MA"
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" style={{ width: size - 6, height: size - 6, display: 'block' }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#D4B277" strokeWidth="3.2" />
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="#FEC84D"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity=".7"
        />
        <path
          d="M29 27h42v25c0 15-9.5 25-21 30-11.5-5-21-15-21-30V27z"
          fill="#8D0333"
          stroke="#D4B277"
          strokeWidth="2.6"
        />
        <path
          d="M35 33h30v17c0 10-6.2 17-15 20.5C41.2 67 35 60 35 50V33z"
          fill="#630122"
          opacity=".65"
        />
        <path
          d="M50 35l3.2 7.2 7.8.8-5.9 5.2 1.8 7.6L50 51.8 43.1 55.8l1.8-7.6-5.9-5.2 7.8-.8z"
          fill="#FEC84D"
        />
        <text
          x="50"
          y="21"
          textAnchor="middle"
          fill="#FAF5F0"
          fontFamily="Montserrat, sans-serif"
          fontWeight="800"
          fontSize="11.5"
          letterSpacing="1.2"
        >
          UFMA
        </text>
        <text
          x="50"
          y="90"
          textAnchor="middle"
          fill="#D4B277"
          fontFamily="Montserrat, sans-serif"
          fontWeight="700"
          fontSize="7.2"
          letterSpacing=".8"
        >
          {compactLabel ? 'PROFCOMP' : 'PROFCOMP-MA'}
        </text>
      </svg>
    </span>
  );
}
