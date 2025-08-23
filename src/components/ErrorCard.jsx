import React from "react";
import { errorMeta, toneClasses, ToneIcon } from "../errors/errorMeta";

// Accepts either { error: {...} } from backend or already-unwrapped object
// Optional actions: onRetry, onEdit (buttons hidden if not provided)
export default function ErrorCard({ error, onRetry, onEdit, className = "" }) {
  const e = normalizeError(error);

  const meta = errorMeta[e.code] || errorMeta.default;
  const tone = toneClasses[meta.tone] || toneClasses.neutral;

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${tone} ${className}`}>
      <div className="flex items-start gap-3">
        <ToneIcon tone={meta.tone} />
        <div className="flex-1 space-y-1">
          <div className="font-semibold leading-6">
            {meta.title || e.title || "Erro"}
          </div>
          <div className="text-sm opacity-90">
            {e.message || "Algo correu mal."}
          </div>

          {/* Hint (short suggestion) */}
          {e.hint ? (
            <div className="text-sm opacity-80">
              <span className="font-medium">Dica:</span> {e.hint}
            </div>
          ) : null}

          {/* Context (key/value) */}
          {e.context && Object.keys(e.context).length > 0 && (
            <div className="text-xs opacity-75">
              {Object.entries(e.context).map(([k, v]) => (
                <div key={k}><span className="font-medium">{k}:</span> {String(v)}</div>
              ))}
            </div>
          )}

          {/* Actions */}
          {(onRetry || onEdit) && (
            <div className="pt-2 flex gap-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-xl bg-neutral-900/90 text-white px-3 py-1.5 text-sm dark:bg-white/10 hover:opacity-90"
                >
                  Tentar de novo
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-xl border px-3 py-1.5 text-sm border-current/30 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Editar parâmetros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Small badge with code/status (dev aid) */}
        <div className="text-[10px] uppercase tracking-wide opacity-60 ml-2">
          {e.code}{e.http_status ? ` · ${e.http_status}` : ""}
        </div>
      </div>
    </div>
  );
}

/** Normalize various error shapes into a single object */
function normalizeError(raw) {
  const src = raw?.error ? raw.error : raw || {};
  return {
    code: src.code || "unknown_error",
    http_status: src.http_status || raw?.status || undefined,
    title: src.title || undefined,
    message: src.message || raw?.message || "Ocorreu um erro.",
    hint: src.hint || undefined,
    context: src.context || undefined,
  };
}
