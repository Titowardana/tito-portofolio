import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProject } from "@/lib/data";
import { ProjectDetailClient } from "./ProjectDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProject(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Tito Pamungkas Wardana`,
    description: project.shortDescription,
  };
}

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublicProject(slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
