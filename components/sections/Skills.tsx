import { skills, skillCategories } from "@/data/skills";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Skills() {
  return (
    <section id="skills" className="relative border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionTitle
          title="Technical Stack"
          subtitle="Technologies and tools I work with"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            return (
              <div key={category} className="glass rounded-2xl p-6 transition-all duration-300 hover:border-primary/30">
                <h3 className="font-heading mb-4 text-sm font-bold tracking-wider uppercase text-primary">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded-lg border border-border bg-surface/50 px-3.5 py-2 text-sm font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-primary/10"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
