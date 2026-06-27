import { SkillForm } from "../skill-form";

export default function NewSkillPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Add Skill</h1>
        <p className="mt-1 text-sm text-text-secondary">Add a new technical skill to your portfolio.</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <SkillForm />
      </div>
    </div>
  );
}
