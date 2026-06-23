import { GithubIcon, LinkedinIcon, EmailIcon, ArrowUpIcon } from "@/components/ui/Icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-[var(--background-dark)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <a
              href="#"
              className="font-heading text-xl font-bold text-text-primary transition-colors hover:text-primary"
            >
              TitoPortfolio
            </a>
            <p className="mt-2 text-sm text-text-secondary">
              Full-Stack Developer & Cybersecurity Enthusiast
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/titopamungkas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://linkedin.com/in/titopamungkas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            {/* TODO: Ganti dengan alamat email yang sebenarnya */}
            <a
              href="mailto:tito@example.com"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="Email"
            >
              <EmailIcon size={18} />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="Back to top"
            >
              <ArrowUpIcon size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6 text-center text-sm text-text-secondary">
          <p>&copy; {currentYear} Tito Pamungkas Wardana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
