// Ejemplo de componente de perfil:
export const SidebarProfile = ({
  avatar,
  name,
}: {
  avatar: string;
  name: string;
}) => (
  <div className="flex items-center gap-3 p-2 rounded bg-green-800">
    <img
      src={avatar}
      alt="avatar"
      className="w-10 h-10 rounded-full border-2 border-white"
    />
    <span className="text-white font-semibold">{name}</span>
  </div>
);