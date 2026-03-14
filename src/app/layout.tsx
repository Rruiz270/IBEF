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
  title: "IBEF Project Control",
  description:
    "Sistema de controle de projetos do Instituto Brasileiro pela Educacao do Futuro - Encomenda Tecnologica Santa Catarina",
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
