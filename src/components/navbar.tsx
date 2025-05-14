import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background text-white">
      {/* Logo a la izquierda */}
      <div className="flex items-center mr-3">
        <img src="/img/sercabologo.png" alt="Logo" className="h-20" />
        <h1 className="mx-3">Ser Cabo</h1>
      </div>

      {/* Items en el centro */}
      <ul className="flex space-x-8">
        <li>
          <a href="#home" className="hover:underline">
            Inicio
          </a>
        </li>
        <li>
          <Link href="/test" className="hover:underline">
            Test
          </Link>
        </li>
        <li>
          <a href="#services" className="hover:underline">
            Temario
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:underline">
            Contacto
          </a>
        </li>
      </ul>

      {/* Botones a la derecha */}
      <div className="flex space-x-4 ml-3">
        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          Login
        </button>
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
          Registrarse
        </button>
      </div>
    </nav>
  );
};

export default Navbar;