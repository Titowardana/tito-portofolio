import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/lib/theme-provider";
import BackgroundDecorations from "@/components/effects/BackgroundDecorations";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tito Pamungkas Wardana | Full-Stack Developer",
  description:
    "Portfolio pribadi Tito Pamungkas Wardana, mahasiswa Teknik Informatika, Full-Stack Developer, dan Cybersecurity Enthusiast.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={`${theme === "light" ? "light" : ""} ${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <ThemeProvider initialTheme={theme}>
          <BackgroundDecorations />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
