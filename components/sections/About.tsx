import SectionTitle from "@/components/ui/SectionTitle";

export default function About() {
  return (
    <section id="about" className="relative border-t border-border/50 bg-[var(--background-dark)]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionTitle
          title="About Me"
          subtitle="Get to know me better"
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-text-secondary">
              I am Tito Pamungkas Wardana, an Informatics Engineering student with
              a strong passion for technology and software development. My academic
              journey has equipped me with a solid foundation in web development,
              database management, user interface design, and the fundamentals of
              cybersecurity.
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              I enjoy building modern, responsive web applications using technologies
              like React, Next.js, and Tailwind CSS. I also have experience working
              with backend frameworks such as CodeIgniter 4 and Laravel. I am always
              eager to learn new things and open to exciting opportunities in the
              tech industry.
            </p>
          </div>

          <div className="space-y-6">
            <div className="glass grid grid-cols-2 gap-4 rounded-2xl p-6">
              <div className="space-y-1">
                <p className="font-heading text-2xl font-bold text-primary">5+</p>
                <p className="text-xs text-text-secondary">Projects Completed</p>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-2xl font-bold text-secondary">18+</p>
                <p className="text-xs text-text-secondary">Technologies Used</p>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-2xl font-bold text-primary">Web Dev</p>
                <p className="text-xs text-text-secondary">Current Focus</p>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-sm font-bold text-text-primary leading-tight">
                  Informatics Engineering
                </p>
                <p className="text-xs text-text-secondary">
                  Universitas Maritim Raja Ali Haji
                </p>
              </div>
            </div>

            <div className="glass overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-border/50 bg-primary/5 px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-text-secondary">profile.ts</span>
              </div>
              <div className="p-5">
                <pre className="font-mono text-sm leading-relaxed text-text-secondary">
                  <code>{`const profile = {
  name: "Tito Pamungkas Wardana",
  role: "Full-Stack Developer",
  focus: "Web Development",
  status: "Open to opportunities"
};`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
