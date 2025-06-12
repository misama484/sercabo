import React from "react";

interface NavbarHorizontalProps {
  active: string;
  onChange: (section: string) => void;
  avatarUrl: string;
  nombre: string;
}

const NavbarHorizontal: React.FC<NavbarHorizontalProps> = ({
  active,
  onChange,
  avatarUrl,
  nombre,
}) => (
  <nav className="w-full bg-gray-900 flex items-center justify-between px-8 py-3 shadow">
    <div className="flex-1 flex justify-center">
      {["Datos", "Test", "Examenes"].map((section) => (
        <button
          key={section}
          className={`mx-4 px-4 py-2 rounded font-semibold transition ${
            active === section
              ? "bg-teal-400 text-black"
              : "bg-gray-800 text-white hover:bg-teal-700"
          }`}
          onClick={() => onChange(section)}
        >
          {section}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full border-2 border-teal-400"
      />
      <span className="font-bold text-white">{nombre}</span>
    </div>
  </nav>
);

export default NavbarHorizontal;