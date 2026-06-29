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
  { id: "python", name: "Python", category: "programming", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "c", name: "C++", category: "programming", level: "learning", icon: "", description: "", featured: false, active: true, order: 0 },
  { id: "opencode", name: "Opencode", category: "tools", level: "fundamental", icon: "", description: "", featured: false, active: true, order: 0 },
  { id: "kiro", name: "Kiro", category: "tools", level: "learning", icon: "", description: "", featured: false, active: true, order: 0 },
  { id: "antigravity", name: "Antigravity", category: "tools", level: "fundamental", icon: "", description: "", featured: false, active: true, order: 0 },
  { id: "stitch", name: "Stitch", category: "design", level: "fundamental", icon: "", description: "", featured: false, active: true, order: 0 },
  { id: "basic-cybersecurity", name: "Basic Cybersecurity", category: "cybersecurity", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "cisco-packet-tracer", name: "Cisco Packet Tracer", category: "networking", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "figma", name: "Figma", category: "design", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "git", name: "Git", category: "tools", level: "used-in-projects", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "html", name: "HTML", category: "frontend", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "mysql", name: "MySQL", category: "database", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "php", name: "PHP", category: "backend", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 0 },
  { id: "github", name: "GitHub", category: "tools", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 1 },
  { id: "codeigniter-4", name: "CodeIgniter 4", category: "backend", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 1 },
  { id: "css", name: "CSS", category: "frontend", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 1 },
  { id: "laravel", name: "Laravel", category: "backend", level: "fundamental", icon: "", description: "", featured: false, active: true, order: 2 },
  { id: "visual-studio-code", name: "Visual Studio Code", category: "tools", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 2 },
  { id: "javascript", name: "JavaScript", category: "frontend", level: "fundamental", icon: "", description: "", featured: true, active: true, order: 2 },
  { id: "typescript", name: "TypeScript", category: "frontend", level: "learning", icon: "", description: "", featured: false, active: true, order: 3 },
  { id: "react", name: "React", category: "frontend", level: "learning", icon: "", description: "", featured: false, active: true, order: 4 },
  { id: "next-js", name: "Next.js", category: "frontend", level: "learning", icon: "", description: "", featured: false, active: true, order: 5 },
  { id: "tailwind-css", name: "Tailwind CSS", category: "frontend", level: "fundamental", icon: "", description: "", featured: false, active: true, order: 6 },
];
