import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ProjectProvider } from "@/contexts/ProjectContext";
import LayoutShell from "@/components/LayoutShell";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A2463",
};

export const metadata: Metadata = {
  title: "i10 Project Control",
  description:
    "Sistema de controle de projetos do Instituto i10 — Educação do Futuro - Encomenda Tecnológica Santa Catarina",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "i10 Control",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
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
        <ServiceWorkerRegistrar />
        <ProjectProvider>
          <LayoutShell>{children}</LayoutShell>
        </ProjectProvider>
      </body>
    </html>
  );
}
