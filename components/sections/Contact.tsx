import { GithubIcon, LinkedinIcon, EmailIcon, WhatsappIcon, ArrowRightIcon } from "@/components/ui/Icons";

export default function Contact() {
  return (
    <section id="contact" className="relative border-t border-border/50">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <h2 className="font-heading text-3xl font-bold leading-tight text-text-primary sm:text-4xl md:text-5xl">
          Let&apos;s Build Something{" "}
          <span className="text-primary">Meaningful.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
          I&apos;m currently open to new opportunities and collaborations.
          Whether you have a project in mind or just want to say hello, feel
          free to reach out.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
          {/* TODO: Ganti dengan alamat email yang sebenarnya */}
          <a
            href="mailto:tito@example.com"
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary-hover sm:w-auto"
          >
            <EmailIcon size={18} />
            tito@example.com
          </a>
          {/* TODO: Ganti dengan nomor WhatsApp yang sebenarnya */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface/50 px-8 py-3.5 text-sm font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-surface sm:w-auto"
          >
            <WhatsappIcon size={18} />
            WhatsApp
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <a
            href="https://github.com/titopamungkas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href="https://linkedin.com/in/titopamungkas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
          {/* TODO: Ganti dengan alamat email yang sebenarnya */}
          <a
            href="mailto:tito@example.com"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
            aria-label="Email"
          >
            <EmailIcon size={20} />
          </a>
        </div>

        <div className="mt-12">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View My Projects
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
