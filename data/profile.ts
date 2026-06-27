export interface Profile {
  name: string;
  shortName: string;
  greeting: string;
  badge: string;
  primaryRole: string;
  secondaryRole: string;
  description: string;
  about: string;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  location: string;
  profileImage: string;
  lanyardImage: string;
  educationLogo: string;
  cvUrl: string;
  isAvailable: boolean;
}

export const profile: Profile = {
  name: "Tito Pamungkas Wardana",
  shortName: "TitoPortfolio",
  greeting: "Hello, I'm",
  badge: "Informatics Engineering Student",
  primaryRole: "Full-Stack Developer",
  secondaryRole: "Cybersecurity Enthusiast",
  description:
    "Informatics Engineering student passionate about web development, UI/UX design, database management, and cybersecurity. Open to opportunities and collaboration.",
  about: "",
  email: "",
  whatsapp: "",
  github: "https://github.com/titopamungkas",
  linkedin: "https://linkedin.com/in/titopamungkas",
  instagram: "",
  tiktok: "",
  location: "",
  profileImage: "/images/profile/tito-profile.jpeg",
  lanyardImage: "",
  educationLogo: "",
  cvUrl: "",
  isAvailable: true,
};
