"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MenuIcon, CloseIcon, SunIcon, MoonIcon } from "@/components/ui/Icons";
import { useTheme } from "@/lib/theme-provider";

interface NavbarProps {
  shortName: string;
  cvUrl: string;
  hasCertificates: boolean;
}

export default function Navbar({ shortName, cvUrl, hasCertificates }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    const scrollHandler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", scrollHandler, { passive: true });
    // setTimeout defers the setState to after paint, avoiding the synchronous-setState-in-effect lint error
    const t = window.setTimeout(() => setIsMounted(true), 0);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { theme, toggleTheme } = useTheme();

  const handleNavClick = () => setIsOpen(false);

  const baseLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
  ];

  const conditionalLinks = hasCertificates
    ? [
        ...baseLinks,
        { label: "Certificates", href: "#certificates" },
        { label: "Contact", href: "#contact" },
      ]
    : [...baseLinks, { label: "Contact", href: "#contact" }];

  return (
    <motion.header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-heading text-xl font-bold text-text-primary transition-colors hover:text-primary"
        >
          {shortName}
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {conditionalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
          {cvUrl && (
            <a
              href={cvUrl}
              className="rounded-lg border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
            >
              Download CV
            </a>
          )}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:text-text-primary hover:bg-surface"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-text-primary transition-colors hover:bg-surface md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={reducedMotion ? {} : { rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={reducedMotion ? {} : { rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CloseIcon />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={reducedMotion ? {} : { rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={reducedMotion ? {} : { rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MenuIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile menu — only mounted after first client paint to prevent SSR mismatch */}
      <AnimatePresence>
        {isOpen && isMounted && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/50 md:hidden"
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? {} : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="menu"
              className="glass-strong fixed top-[72px] right-0 left-0 mx-4 overflow-hidden rounded-2xl border border-border/50 md:hidden"
              initial={reducedMotion ? {} : { opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-1 p-4">
                {conditionalLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary/10 hover:text-text-primary"
                    initial={reducedMotion ? {} : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                {cvUrl && (
                  <motion.a
                    href={cvUrl}
                    onClick={handleNavClick}
                    className="mt-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
                    initial={reducedMotion ? {} : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: conditionalLinks.length * 0.04,
                      duration: 0.2,
                    }}
                  >
                    Download CV
                  </motion.a>
                )}
                <button
                  onClick={toggleTheme}
                  className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary/10 hover:text-text-primary"
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
