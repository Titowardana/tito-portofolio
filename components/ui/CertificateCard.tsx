"use client";

import { motion } from "motion/react";
import type { Certificate } from "@/data/certificates";
import SafeImage from "./SafeImage";
import { ExternalLinkIcon } from "./Icons";

interface CertificateCardProps {
  certificate: Certificate;
  index?: number;
}

function CertificatePlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--background-dark)]">
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <svg
        className="absolute text-primary/10"
        width={48}
        height={48}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        aria-hidden
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <span className="relative font-heading text-2xl font-bold tracking-tight text-text-primary/[0.08] select-none">
        Cert
      </span>
    </div>
  );
}

export function CertificateCardFeatured({ certificate, index = 0 }: CertificateCardProps) {
  const hasDate = certificate.issueDate || certificate.expiryDate;
  const dateStr = [certificate.issueDate, certificate.expiryDate].filter(Boolean).join(" – ");
  const hasUrl = !!certificate.credentialUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="sm:col-span-2"
    >
      <a
        href={hasUrl ? certificate.credentialUrl : undefined}
        target={hasUrl ? "_blank" : undefined}
        rel={hasUrl ? "noopener noreferrer" : undefined}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--background)] transition-all duration-400 ease-out hover:-translate-y-[2px] hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(37,99,235,0.12)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 sm:flex-row"
      >
        {/* Image */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[280px] lg:w-[320px]">
          <SafeImage
            src={certificate.image}
            alt={certificate.title}
            fill
            className="object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03]"
            containerClassName="h-full w-full"
            fallback={<CertificatePlaceholder />}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-[var(--background)]/40" />

          {/* Mobile featured badge */}
          {certificate.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary sm:hidden">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col p-5 sm:p-6">
          {/* Desktop featured badge */}
          {certificate.featured && (
            <span className="mb-3 hidden w-fit rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary sm:inline-block">
              Featured
            </span>
          )}

          <h3 className="font-heading text-lg font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary">
            {certificate.title}
          </h3>

          <p className="mt-1 text-sm font-medium text-text-primary">
            {certificate.issuer}
          </p>

          {hasDate && (
            <p className="mt-2 text-xs text-text-muted">{dateStr}</p>
          )}

          {certificate.credentialId && (
            <p className="mt-1 text-xs text-text-muted">
              ID: <span className="font-mono">{certificate.credentialId}</span>
            </p>
          )}

          {hasUrl && (
            <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              <ExternalLinkIcon size={14} />
              Verify Credential
            </span>
          )}

          {/* Hover arrow indicator */}
          {hasUrl && (
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary/40 sm:right-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>
      </a>
    </motion.div>
  );
}

export function CertificateCardSmall({ certificate, index = 0 }: CertificateCardProps) {
  const hasDate = certificate.issueDate || certificate.expiryDate;
  const dateStr = [certificate.issueDate, certificate.expiryDate].filter(Boolean).join(" – ");
  const hasUrl = !!certificate.credentialUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
    >
      <a
        href={hasUrl ? certificate.credentialUrl : undefined}
        target={hasUrl ? "_blank" : undefined}
        rel={hasUrl ? "noopener noreferrer" : undefined}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-[var(--background)] transition-all duration-400 ease-out hover:-translate-y-[2px] hover:border-primary/25 hover:shadow-[0_6px_24px_rgba(37,99,235,0.1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <SafeImage
            src={certificate.image}
            alt={certificate.title}
            fill
            className="object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03]"
            containerClassName="h-full w-full"
            fallback={<CertificatePlaceholder />}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)]/40 to-transparent" />

          {/* Featured badge */}
          {certificate.featured && (
            <span className="absolute right-3 top-3 z-10 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-heading text-[15px] font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary line-clamp-2">
            {certificate.title}
          </h3>

          <p className="mt-1 text-sm font-medium text-text-primary">
            {certificate.issuer}
          </p>

          {hasDate && (
            <p className="mt-2 text-xs text-text-muted">{dateStr}</p>
          )}

          {certificate.credentialId && (
            <p className="mt-1 text-xs text-text-muted">
              ID: <span className="font-mono">{certificate.credentialId}</span>
            </p>
          )}

          {hasUrl && (
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-all duration-300 group-hover:gap-2">
              <ExternalLinkIcon size={13} />
              Verify
            </span>
          )}
        </div>
      </a>
    </motion.div>
  );
}
