"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when modal opens (safer default)
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => cancelRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/60">
        {/* Top accent line */}
        <div className={`h-px w-full ${danger ? "bg-gradient-to-r from-transparent via-red-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-primary/50 to-transparent"}`} />

        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${danger ? "bg-red-500/10" : "bg-primary/10"}`}>
            {danger ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>

          {/* Text */}
          <h2 id="confirm-modal-title" className="text-center text-[15px] font-semibold text-text-primary">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-center text-sm text-text-secondary leading-relaxed">
              {description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 rounded-xl border border-[var(--color-input-border)] bg-[var(--color-input)] px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-[var(--color-input-border)] hover:text-text-primary disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-border-subtle"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 focus-visible:outline-2 ${
                danger
                  ? "bg-red-500/80 hover:bg-red-500 focus-visible:outline-red-500"
                  : "bg-primary hover:bg-primary-hover focus-visible:outline-primary"
              }`}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                  </svg>
                  Deleting…
                </span>
              ) : confirmLabel}
            </button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>
    </div>
  );

  // Render into body via portal so it's above everything
  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}
