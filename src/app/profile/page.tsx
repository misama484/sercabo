"use client";
import React, { useState, useEffect } from "react";
import { SidebarProfile } from "@/components/ui/sidebarProfile";
import { useUser } from "@/context/userContext";
import avatar0 from "@/public/data/avatarImages/0.png";
import axios from "axios";
import { getToken } from "@/lib/auth"; // Asegúrate de tener una función para obtener el token
import { useRouter } from "next/navigation";
import NavbarPerfil from "@/components/navbarPerfil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Opcion {
  [key: string]: string;
}

interface Pregunta {
  id: string;
  pregunta: string;
  respuestaCorrecta: string;
  opciones: Opcion;
  tema: number;
}

interface PreguntaExamen {
  id: number;
  pregunta: Pregunta;
  respuestaUsuario: string | null;
  esCorrecta: boolean | null;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  avatarCode: number;
}
interface Examen {
  id: number;
  usuario: Usuario;
  tema: number;
  fechaCreacion: string;
  respuestasCorrectas: number;
  completado: boolean;
  preguntas: PreguntaExamen[];
}

//TODO Colocar barra superior con menu de navegación y botón de inicio, avatar y nombre en un lateral

const EXAMENES_POR_PAGINA = 5; // Número de exámenes por página
const token = getToken(); // Obtén el token de autenticación

const avatarImg = [
  { avatarCode: 0, avatarUrl: "/img/avatarImages/0.png" },
  { avatarCode: 1, avatarUrl: "/img/avatarImages/1.gif" },
  { avatarCode: 2, avatarUrl: "/img/avatarImages/2.gif" },
];

const ProfilePage: React.FC = () => {
  const { usuario, setUsuario } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [editNombre, setEditNombre] = useState(usuario?.nombre || "");
  const [editEmail, setEditEmail] = useState(usuario?.email || "");
  const [editAvatarCode, setEditAvatarCode] = useState<number>(usuario?.avatarCode ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Lista de exámenes
  const [listaExamenes, setListaExamenes] = useState<Examen[]>([]);
  const [examenSeleccionado, setExamenSeleccionado] = useState<Examen | null>(null);
  const [ paginaActual, setPaginaActual] = useState(1);
  const [examen, setExamen] = useState<Examen | null>(null);
  
  const router = useRouter(); // Usar el router de Next.js

  useEffect(() => {
    if( usuario) {
      setEditNombre(usuario.nombre);
      setEditEmail(usuario.email);
      setEditAvatarCode(usuario.avatarCode);
      recuperarExamen(usuario.id);
    }    
  }, [usuario]);

  //FUNCIONES LISTA DE EXAMENES
  // Si cambia la lista, vuelve a la página 1
  useEffect(() => {
    setPaginaActual(1);
  }, [listaExamenes]);

    // Calcular los exámenes a mostrar en la página actual
  const totalPaginas = Math.ceil(listaExamenes.length / EXAMENES_POR_PAGINA);
  const inicio = (paginaActual - 1) * EXAMENES_POR_PAGINA;
  const fin = inicio + EXAMENES_POR_PAGINA;
  const examenesPagina = listaExamenes.slice(inicio, fin);

    // Funciones para navegar
  const handleAnterior = () => setPaginaActual((p) => Math.max(1, p - 1));
  const handleSiguiente = () => setPaginaActual((p) => Math.min(totalPaginas, p + 1));

  //RECUPERAR EXAMEN DESDE BBDD
  const recuperarExamen = async (usuarioId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/examenes/all?usuarioId=${usuarioId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setListaExamenes(res.data);
      setExamen(null);
      setExamenSeleccionado(null);
      setError(null);
    } catch (err) {
      setError("No se pudo recuperar el listado de exámenes.");
    }
  };



  // Obtener la URL del avatar seleccionado
  const selectedAvatarUrl =
    avatarImg.find((a) => a.avatarCode === usuario?.avatarCode)?.avatarUrl ||
    "/data/avatarImages/0.png";

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAvatarSelect = (code: number) => {
    setEditAvatarCode(code);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Aquí deberías hacer la petición para actualizar el usuario en el backend
      // await axios.put(...);
      setUsuario(
        usuario
          ? { ...usuario, nombre: editNombre, email: editEmail, avatarCode: editAvatarCode }
          : usuario
      );
      setModalOpen(false);
    } catch (err) {
      setError("No se pudieron actualizar los datos.");
    }
    setSaving(false);
  };

  console.log("Usuario en ProfilePage:", usuario);
  console.log("imagen avatar: ", selectedAvatarUrl);
  if (!usuario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        No hay datos de usuario.--
      </div>
    );
  }

  const handleVolverHome = () => {
    router.push("/");
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-white p-8">
      <NavbarPerfil
        active={""}
        onChange={() => {}}
        avatarUrl={selectedAvatarUrl}
        nombre={usuario.nombre}
      />
      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Perfil */}
        <div className="w-full flex flex-col items-left gap-2">
          <SidebarProfile
            avatar={selectedAvatarUrl}
            name={usuario.nombre}
          />
          <p className="text-lg text-gray-300">{usuario.email}</p>
          <button
            className="mt-2 px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-700"
            onClick={handleOpenModal}
          >
            Editar perfil
          </button>
          <button
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={handleVolverHome}
          >
            Inicio
          </button>
        </div>
        {/* Aquí puedes añadir la tabla de exámenes si tienes los datos en el contexto */}
        {listaExamenes.length > 0 && (
        <div className="mt-8 w-full overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-white">Tus exámenes</h2>
          <table className="min-w-full bg-gray-800 rounded text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tema</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Correctas</th>
                <th className="px-4 py-2">Completado</th>
                <th className="px-4 py-2">Ver</th>
              </tr>
            </thead>
            <tbody>
              {examenesPagina.map((ex) => (
                <tr
                  key={ex.id}
                  className="text-center border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                >
                  <td className="px-4 py-2">{ex.id}</td>
                  <td className="px-4 py-2">{ex.tema}</td>
                  <td className="px-4 py-2">{new Date(ex.fechaCreacion).toLocaleString()}</td>
                  <td className="px-4 py-2">{ex.respuestasCorrectas}</td>
                  <td className="px-4 py-2">
                    {ex.completado ? (
                      <span className="text-green-400 font-bold">Sí</span>
                    ) : (
                      <span className="text-red-400 font-bold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-teal-400 text-black px-3 py-1 rounded hover:bg-teal-600"
                      onClick={() => setExamenSeleccionado(ex)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Controles de paginación */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
              onClick={handleAnterior}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
              onClick={handleSiguiente}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
      </div>
    )}
    <div className="mt-8 w-full">
    <Card>
      <CardHeader>
        <CardTitle>{usuario.nombre}</CardTitle>
        <CardDescription>{usuario.email}</CardDescription>
        <CardAction>
          <Avatar>
            <AvatarImage src={selectedAvatarUrl} />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Examenes generados: {listaExamenes.length}</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
    </div>

      {/* Modal para editar perfil */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded shadow-lg w-full max-w-md flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Editar perfil</h2>
            <input
              type="text"
              className="w-full mb-3 px-4 py-2 rounded bg-gray-700 text-white border border-gray-500 focus:outline-none"
              placeholder="Nombre"
              value={editNombre}
              onChange={(e) => setEditNombre(e.target.value)}
            />
            <input
              type="email"
              className="w-full mb-3 px-4 py-2 rounded bg-gray-700 text-white border border-gray-500 focus:outline-none"
              placeholder="Email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <div className="w-full mb-3">
              <p className="mb-2 text-gray-300">Selecciona tu avatar:</p>
              <div className="flex gap-4 justify-center">
                {avatarImg.map((avatar) => (
                  <button
                    key={avatar.avatarCode}
                    type="button"
                    className={`rounded-full border-4 ${
                      editAvatarCode === avatar.avatarCode
                        ? "border-teal-400"
                        : "border-transparent"
                    } focus:outline-none`}
                    onClick={() => handleAvatarSelect(avatar.avatarCode)}
                  >
                    <img
                      src={avatar.avatarUrl}
                      alt={`Avatar ${avatar.avatarCode}`}
                      className="w-16 h-16 rounded-full"
                    />
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <div className="text-red-400 text-sm mb-2">{error}</div>
            )}
            <div className="flex gap-4 mt-2">
              <button
                className="px-4 py-2 bg-teal-400 text-black rounded hover:bg-teal-700"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={handleCloseModal}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePage;