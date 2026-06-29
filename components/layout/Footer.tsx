import { GithubIcon, LinkedinIcon, EmailIcon, ArrowUpIcon } from "@/components/ui/Icons";
import type { Profile } from "@/data/profile";

export default function Footer({ profile }: { profile: Profile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-[#091626]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <a
              href="#"
              className="font-heading text-xl font-bold text-text-primary transition-colors hover:text-primary"
            >
              {profile.shortName}
            </a>
            <p className="mt-2 text-sm text-text-secondary">
              {profile.primaryRole} & {profile.secondaryRole}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary transition-all hover:bg-primary hover:text-white"
                aria-label="Email"
              >
                <EmailIcon size={18} />
              </a>
            )}
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
          <p>&copy; {currentYear} {profile.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
