import type { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: ReactNode;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-14">
      <h2 className="font-heading text-3xl font-bold tracking-tight text-text-primary lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
      )}
      <div className="mt-5 h-px w-10 bg-primary/50" />
    </div>
  );
}
