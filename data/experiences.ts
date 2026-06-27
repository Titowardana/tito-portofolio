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
    id: "informatics-engineering",
    type: "education",
    title: "Informatics Engineering",
    institution: "Universitas Maritim Raja Ali Haji",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: true,
    description:
      "Undergraduate Informatics Engineering student with an interest in web development, software engineering, user interface design, networking, and basic cybersecurity.",
    responsibilities: [],
    technologies: [],
    active: true,
    order: 1,
  },
  {
    id: "it-assistant-intern",
    type: "internship",
    title: "IT Assistant Intern",
    institution: "Dinas Kelautan dan Perikanan Provinsi Kepulauan Riau",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description:
      "Supported information technology activities, web-based system development, digital media preparation, and field activities related to fisheries services.",
    responsibilities: [
      "Developed a web-based salary slip system.",
      "Developed a QR-code-based archive system.",
      "Created banners, presentations, posters, and other digital media.",
      "Assisted with field activities at fisheries port facilities.",
    ],
    technologies: [
      "Web Development",
      "QR Code",
      "Digital Design",
      "Information Systems",
    ],
    active: true,
    order: 2,
  },
];
