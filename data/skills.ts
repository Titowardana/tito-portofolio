export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "programming"
  | "tools"
  | "design"
  | "networking"
  | "cybersecurity";

export type SkillLevel =
  | "fundamental"
  | "learning"
  | "used-in-projects"
  | "comfortable";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon: string;
  description: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export const skills: Skill[] = [
  { id: "html", name: "HTML", category: "frontend", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 1 },
  { id: "css", name: "CSS", category: "frontend", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 2 },
  { id: "javascript", name: "JavaScript", category: "frontend", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 3 },
  { id: "typescript", name: "TypeScript", category: "frontend", level: "learning", icon: "", description: "", featured: false, active: true, order: 4 },
  { id: "react", name: "React", category: "frontend", level: "learning", icon: "", description: "", featured: false, active: true, order: 5 },
  { id: "nextjs", name: "Next.js", category: "frontend", level: "learning", icon: "", description: "", featured: false, active: true, order: 6 },
  { id: "tailwind-css", name: "Tailwind CSS", category: "frontend", level: "learning", icon: "", description: "", featured: false, active: true, order: 7 },
  { id: "php", name: "PHP", category: "backend", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 8 },
  { id: "codeigniter-4", name: "CodeIgniter 4", category: "backend", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 9 },
  { id: "laravel", name: "Laravel", category: "backend", level: "learning", icon: "", description: "", featured: false, active: true, order: 10 },
  { id: "mysql", name: "MySQL", category: "database", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 11 },
  { id: "python", name: "Python", category: "programming", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 12 },
  { id: "git", name: "Git", category: "tools", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 13 },
  { id: "github", name: "GitHub", category: "tools", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 14 },
  { id: "vs-code", name: "Visual Studio Code", category: "tools", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 15 },
  { id: "figma", name: "Figma", category: "design", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 16 },
  { id: "cisco-packet-tracer", name: "Cisco Packet Tracer", category: "networking", level: "fundamental", icon: "", description: "", featured: false, active: true, order: 17 },
  { id: "basic-cybersecurity", name: "Basic Cybersecurity", category: "cybersecurity", level: "fundamental", icon: "", description: "", featured: false, active: true, order: 18 },
];
