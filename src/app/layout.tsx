import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProjectProvider } from "@/contexts/ProjectContext";
import LayoutShell from "@/components/LayoutShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "i10 Project Control",
  description:
    "Sistema de controle de projetos do Instituto i10 — Educação do Futuro - Encomenda Tecnológica Santa Catarina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#030B1A] min-h-screen text-text-primary`}
      >
        <ProjectProvider>
          <LayoutShell>{children}</LayoutShell>
        </ProjectProvider>
      </body>
    </html>
  );
}
