import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import { IconBook, IconUser, IconListCheck, IconClipboardList } from "@tabler/icons-react";
import { SidebarProfile } from "@/components/ui/sidebarProfile";
import logo from "@/public/img/sercabologo.png";
import { getToken } from "@/lib/auth";
import { UserProvider } from "@/context/userContext";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Obtener el token de las cookies
  const token = getToken();

  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-white`}
      >
        <UserProvider>
          <div className="flex min-h-screen">
            {/* Sidebar solo si hay token */}
            {token && (
              <Sidebar>
                <SidebarBody>
                  {sidebarLinks.map((link) => (
                    <SidebarLink key={link.href} link={link} />
                  ))}
                </SidebarBody>
              </Sidebar>
            )}
            {/* Contenido principal */}
            <main className="flex-1">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}