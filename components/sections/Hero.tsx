import SafeImage from "@/components/ui/SafeImage";
import { GithubIcon, LinkedinIcon, EmailIcon, WhatsappIcon, ArrowRightIcon } from "@/components/ui/Icons";

function ProfilePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/10">
      <span className="font-heading text-5xl font-bold text-text-primary/20">TPW</span>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-grid pt-24"
    >
      <div className="pointer-events-none absolute top-1/4 right-0 -mr-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-[100px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-16 md:py-24 lg:flex-row lg:py-32">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-block rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-medium text-secondary">
            Informatics Engineering Student
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium tracking-widest uppercase text-text-secondary">
              Hello, I&apos;m
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
              Tito Pamungkas<br />Wardana
            </h1>
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold text-primary sm:text-xl">
                Full-Stack Developer
              </p>
              <p className="font-heading text-base font-medium text-secondary sm:text-lg">
                Cybersecurity Enthusiast
              </p>
            </div>
          </div>

          <p className="mx-auto max-w-md text-sm leading-relaxed text-text-secondary lg:mx-0">
            Informatics Engineering student passionate about web development,
            UI/UX design, database management, and cybersecurity. Open to
            opportunities and collaboration.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#projects"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white transition-all hover:bg-primary-hover sm:w-auto"
            >
              View Projects
              <ArrowRightIcon />
            </a>
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface/50 px-8 py-3 text-sm font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-surface sm:w-auto"
            >
              Contact Me
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2 lg:justify-start">
            <a
              href="https://github.com/titopamungkas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://linkedin.com/in/titopamungkas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={18} />
            </a>
            {/* TODO: Ganti dengan alamat email yang sebenarnya */}
            <a
              href="mailto:tito@example.com"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="Email Tito"
            >
              <EmailIcon size={18} />
            </a>
            {/* TODO: Ganti dengan nomor WhatsApp yang sebenarnya */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
              aria-label="WhatsApp Tito"
            >
              <WhatsappIcon size={18} />
            </a>
          </div>
        </div>

        <div className="flex-1 lg:flex lg:justify-center">
          <div className="relative w-72 sm:w-80 md:w-96">
            <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/50">
              <SafeImage
                src="/images/profile/tito-profile.jpeg"
                alt="Tito Pamungkas Wardana"
                fill
                className="object-cover"
                containerClassName="h-full w-full"
                fallback={<ProfilePlaceholder />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
