import { ExperienceForm } from "../experience-form";

export default function NewExperiencePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Add Experience / Education</h1>
        <p className="mt-1 text-sm text-text-secondary">Add a new work experience or education entry.</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <ExperienceForm />
      </div>
    </div>
  );
}
