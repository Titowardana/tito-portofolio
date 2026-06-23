export interface Skill {
  name: string;
  category: string;
}

export const skills: Skill[] = [
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "PHP", category: "Backend" },
  { name: "CodeIgniter 4", category: "Backend" },
  { name: "Laravel", category: "Backend" },
  { name: "MySQL", category: "Database" },
  { name: "Python", category: "Programming and AI" },
  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Figma", category: "Tools" },
  { name: "Cisco Packet Tracer", category: "Networking and Security" },
  { name: "Basic Cybersecurity", category: "Networking and Security" },
];

export const skillCategories = [
  "Frontend",
  "Backend",
  "Database",
  "Programming and AI",
  "Tools",
  "Networking and Security",
] as const;
