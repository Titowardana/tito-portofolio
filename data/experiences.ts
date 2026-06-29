export type ExperienceType =
  | "education"
  | "internship"
  | "work"
  | "project"
  | "organization";

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  active: boolean;
  order: number;
}

export const experiences: Experience[] = [
  {
    id: "informatics-engineering-education",
    type: "education",
    title: "Informatics Engineering",
    institution: "Universitas Maritim Raja Ali Haji",
    location: "Tanjungpinang, Kepulauan Riau, Indonesia",
    startDate: "2023",
    endDate: "",
    isCurrent: true,
    description: "Undergraduate Informatics Engineering student focused on web development, software engineering, database management, user interface design, machine learning, computer networking, and basic cybersecurity. Actively involved in academic projects involving full-stack web applications, information systems, image classification, augmented reality, and intelligent system simulations.",
    responsibilities: ["Developed web-based applications and information systems through individual and team projects", "Designed responsive user interfaces for desktop and mobile devices", "Built and managed relational databases using MySQL", "Implemented machine learning and image classification projects", "Created system designs using use case, activity, sequence, and class diagrams", "Participated in project documentation, presentations, and software testing", "Collaborated with team members in academic software development projects"],
    technologies: ["PHP", "CodeIgniter 4", "Laravel", "JavaScript", "TypeScript", "React", "Next.js", "MySQL", "Python", "TensorFlow", "Tailwind CSS", "Git"],
    active: true,
    order: 0,
  },
  {
    id: "information-technology-intern-internship",
    type: "internship",
    title: "Information Technology Intern",
    institution: "DKP Tanjungpinang",
    location: "Tanjungpinang",
    startDate: "12-01-2026",
    endDate: "13-03-2026",
    isCurrent: false,
    description: "Completed an internship at the Dinas Kelautan dan Perikanan Provinsi Kepulauan Riau, supporting web-based system development, administrative digitalization, technical assistance, digital media preparation, and field activities related to fisheries services.",
    responsibilities: ["Developed a web-based payroll and salary slip management system", "Built features for employee data, payroll processing, approval workflows, and PDF salary slips", "Assisted in developing a QR code-based digital archive system", "Managed and organized administrative data using MySQL", "Created banners, posters, presentation materials, and other digital media", "Provided technical support for office devices and information systems", "Supported field activities at fisheries service locations", "Tested system features and helped identify technical issues"],
    technologies: ["CodeIgniter 4", "MySQL", "HTML", "CSS", "JavaScript", "Bootstrap", "Dompdf"],
    active: true,
    order: 1,
  },
];
