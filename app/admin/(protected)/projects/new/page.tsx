import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Add Project</h1>
        <p className="mt-1 text-sm text-text-secondary">Create a new portfolio project entry.</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
