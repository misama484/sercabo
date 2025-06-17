import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IconBook, IconUser, IconListCheck, IconClipboardList } from "@tabler/icons-react";
import { SidebarProfile } from "@/components/ui/sidebarProfile";
import logo from "@/public/img/sercabologo.png";
import { getToken } from "@/lib/auth";
import { UserProvider } from "@/context/userContext";
import Navbar from "@/components/navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SerCabo",
  description: "Webapp oposicion cabo ejército español",
};

const sidebarLinks = [
  {
    label: "Test",
    href: "/test",
    icon: <IconListCheck />,
  },
  {
    label: "Temario",
    href: "/temario",
    icon: <IconBook />,
  },
  {
    label: "Exámenes",
    href: "/examenes",
    icon: <IconClipboardList />,
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: <IconUser />,
  },
];


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-white">
        <UserProvider>
          <Navbar />
          {/* El contenido principal de cada página irá aquí */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}