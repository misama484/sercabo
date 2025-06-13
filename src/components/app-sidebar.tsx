import * as React from "react"
import { ChevronRight } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
  examenes: [
   {
    title: "Cantidad Preguntas",
    items: [
      { title: "5", id: 5 },
      { title: "10", id: 10 },
      { title: "15", id: 15 },
      { title: "20", id: 20 },
      { title: "30", id: 30 },
      { title: "50", id: 50 },
    ],
   },
   {
    title: "Temas",
    items: [
      { id: 1, title: "Tema 1 - RROO" },
      { id: 2, title: "Tema 2 - Ley 8/2006" },
      { id: 3, title: "Tema 3 - Orden ministerial 3/2011" },
      { id: 4, title: "Tema 4 - Ley 39-2007 Carrera Militar" },
      { id: 5, title: "Tema 5 - Regimen disciplinario" },
      { id: 6, title: "Tema 6 - Seguridad en las FAS" },
      { id: 7, title: "Tema 7 - Codigo penal" },
      { id: 8, title: "Tema 8 - Organización de las FAS" },
    ],
   },
   {
    title: "Opciones",
    items: [
      { id: 1, title: "Generar Examen" },
      { id: 2, title: "Recuperar Examenes" },
      { id: 3, title: "Inicio" },
    ],
   }
  ],
}

export function AppSidebar({
  onCantidadPreguntas,
  onSeleccionarTema,
  onGenerarExamen,
  onRecuperarExamenes,
  onInicio,
  cantidadPreguntasSeleccionada,
  temaSeleccionado,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onCantidadPreguntas?: (cantidad: number) => void;
  onSeleccionarTema?: (temaId: number) => void;
  onGenerarExamen?: () => void;
  onRecuperarExamenes?: () => void;
  onInicio?: () => void;
  cantidadPreguntasSeleccionada?: number;
  temaSeleccionado?: number;
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.examenes.map((parent) => (
          <Collapsible
            key={parent.title}
            title={parent.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {parent.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {parent.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild >
                          <Button
                            className={
                              parent.title === "Cantidad Preguntas" && cantidadPreguntasSeleccionada === Number(item.title)
                                ? "bg-teal-900 text-white shadow-lg"
                                : parent.title === "Temas" && temaSeleccionado === item.id
                                ? "bg-teal-900 text-white shadow-lg"
                                : ""
                            }
                            onClick={() => {
                              if (parent.title === "Cantidad Preguntas" && onCantidadPreguntas)
                                onCantidadPreguntas(Number(item.title));
                              else if (parent.title === "Temas" && onSeleccionarTema)
                                onSeleccionarTema(item.id);
                              else if (parent.title === "Opciones") {
                                if (item.title === "Generar Examen" && onGenerarExamen)
                                  onGenerarExamen();
                                else if (item.title === "Recuperar Examenes" && onRecuperarExamenes)
                                  onRecuperarExamenes();
                                else if (item.title === "Inicio" && onInicio)
                                  onInicio();
                              }
                            }}
                            >
                            {item.title}
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
