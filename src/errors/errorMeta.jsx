// Central styling/text per backend error code
export const errorMeta = {
  geocoding_failed: {
    title: "Localização não encontrada",
    tone: "warning",
  },
  invalid_location: {
    title: "Localização inválida",
    tone: "warning",
  },
  missing_params: {
    title: "Parâmetros em falta",
    tone: "info",
  },
  upstream_timeout: {
    title: "Tempo limite excedido",
    tone: "danger",
  },
  polar_day_or_night: {
    title: "Fora do intervalo solar",
    tone: "info",
  },
  default: {
    title: "Ocorreu um erro",
    tone: "neutral",
  },
};

// Map tone → Tailwind classes (light + dark)
export const toneClasses = {
  danger:  "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200",
  warning: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200",
  info:    "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-200",
  neutral: "border-neutral-300 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200",
};

// Small inline icons (no extra deps)
export function ToneIcon({ tone = "neutral", className = "w-5 h-5" }) {
  const common = "stroke-current";
  if (tone === "danger")  return (
    <svg viewBox="0 0 24 24" className={`${className} ${common}`} fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (tone === "warning") return (
    <svg viewBox="0 0 24 24" className={`${className} ${common}`} fill="none"><path d="M12 8v5m0 4h.01M4.93 19h14.14a2 2 0 0 0 1.73-3L13.73 4.74a2 2 0 0 0-3.46 0L3.2 16a2 2 0 0 0 1.73 3Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (tone === "info")    return (
    <svg viewBox="0 0 24 24" className={`${className} ${common}`} fill="none"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path d="M12 8h.01M11 12h1v4h1" strokeWidth="2" strokeLinecap="round"/></svg>
  );
  return (
    <svg viewBox="0 0 24 24" className={`${className} ${common}`} fill="none"><path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" strokeWidth="2"/></svg>
  );
}
