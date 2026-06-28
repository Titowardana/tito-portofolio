const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("Seeding remaining data...");

  const skills = [
    { name: "HTML", category: "Frontend", level: "intermediate", sortOrder: 0, featured: true },
    { name: "CSS", category: "Frontend", level: "intermediate", sortOrder: 1, featured: true },
    { name: "JavaScript", category: "Frontend", level: "beginner", sortOrder: 2, featured: true },
    { name: "TypeScript", category: "Frontend", level: "beginner", sortOrder: 3, featured: false },
    { name: "React", category: "Frontend", level: "beginner", sortOrder: 4, featured: false },
    { name: "Next.js", category: "Frontend", level: "beginner", sortOrder: 5, featured: false },
    { name: "Tailwind CSS", category: "Frontend", level: "beginner", sortOrder: 6, featured: false },
    { name: "PHP", category: "Backend", level: "intermediate", sortOrder: 0, featured: true },
    { name: "CodeIgniter 4", category: "Backend", level: "intermediate", sortOrder: 1, featured: true },
    { name: "Laravel", category: "Backend", level: "beginner", sortOrder: 2, featured: false },
    { name: "MySQL", category: "Database", level: "intermediate", sortOrder: 0, featured: true },
    { name: "Python", category: "Programming", level: "beginner", sortOrder: 0, featured: true },
    { name: "Git", category: "Tools", level: "intermediate", sortOrder: 0, featured: true },
    { name: "GitHub", category: "Tools", level: "intermediate", sortOrder: 1, featured: true },
    { name: "Visual Studio Code", category: "Tools", level: "intermediate", sortOrder: 2, featured: true },
    { name: "Figma", category: "Design", level: "beginner", sortOrder: 0, featured: true },
    { name: "Cisco Packet Tracer", category: "Networking", level: "beginner", sortOrder: 0, featured: true },
    { name: "Basic Cybersecurity", category: "Cybersecurity", level: "beginner", sortOrder: 0, featured: true },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({ where: { name: s.name }, update: s, create: s });
    console.log("  Skill:", s.name);
  }

  // Education
  await prisma.experience.create({
    data: {
      type: "education",
      title: "Informatics Engineering",
      institution: "Universitas Maritim Raja Ali Haji",
      location: "Tanjungpinang",
      startDate: "2023",
      isCurrent: true,
      description: "Undergraduate Informatics Engineering student with an interest in web development, software engineering, user interface design, networking, and basic cybersecurity.",
      sortOrder: 0,
    },
  }).catch(() => console.log("  Education already exists"));
  console.log("  Education done");

  // Internship
  await prisma.experience.create({
    data: {
      type: "internship",
      title: "Information Technology Intern",
      institution: "DKP Tanjungpinang",
      startDate: "2024",
      isCurrent: false,
      description: "Supported information technology activities, web-based system development, digital media preparation, and field activities related to fisheries services.",
      responsibilities: JSON.stringify([
        "Developed a web-based salary slip system.",
        "Developed a QR-code-based archive system.",
        "Created banners, presentations, posters, and other digital media.",
        "Assisted with field activities at fisheries port facilities.",
      ]),
      technologies: JSON.stringify([
        "Web Development",
        "QR Code",
        "Digital Design",
        "Information Systems",
      ]),
      sortOrder: 1,
    },
  }).catch(() => console.log("  Internship already exists"));
  console.log("  Internship done");

  console.log("All remaining data seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
