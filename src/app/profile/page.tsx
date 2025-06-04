"use client";
import React, { useState, useEffect } from "react";
import { SidebarProfile } from "@/components/ui/sidebarProfile";
import { useUser } from "@/context/userContext";
import avatar0 from "@/public/data/avatarImages/0.png";

interface Examen {
  id: number;
  tema: string;
  preguntasTotales: number;
  correctas: number;
}

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

  useEffect(() => {
    if( usuario) {
      setEditNombre(usuario.nombre);
      setEditEmail(usuario.email);
      setEditAvatarCode(usuario.avatarCode);
    }    
  }, [usuario]);

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-white p-8">
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
        </div>
        {/* Aquí puedes añadir la tabla de exámenes si tienes los datos en el contexto */}
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
  );
};

export default ProfilePage;