import PortfolioIntro from "@/components/effects/PortfolioIntro";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import {
  getPublicProfile,
  getPublicProjects,
  getPublicSkills,
  getPublicExperiences,
  getPublicCertificates,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects, skills, experiences, certificates] =
    await Promise.all([
      getPublicProfile(),
      getPublicProjects(),
      getPublicSkills(),
      getPublicExperiences(),
      getPublicCertificates(),
    ]);

  const hasCertificates = certificates.length > 0;

  return (
    <>
      <PortfolioIntro />
      <Navbar
        shortName={profile.shortName}
        cvUrl={profile.cvUrl}
        hasCertificates={hasCertificates}
      />
      <main>
        <Hero profile={profile} />
        <About profile={profile} projects={projects} skills={skills} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        {hasCertificates && <Certificates certificates={certificates} />}
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
