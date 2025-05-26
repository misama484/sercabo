"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const Navbar: React.FC = () => {

  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-6 py-1 bg-background text-white">
      {/* Logo a la izquierda */}
      <div className="flex items-center mr-3">
        <img src="/img/sercabologo.png" alt="Logo" className="h-20" />
        <h1 className="mx-3">Ser Cabo</h1>
      </div>

      {/* Items en el centro */}
      <ul className="flex space-x-8">
        <li>
          <a href="#home" className="hover:underline hover:text-teal-400">
            Inicio
          </a>
        </li>
        <li>
          <Link href="/test" className="hover:underline hover:text-teal-400">
            Test
          </Link>
        </li>
        <li>
          <a href="/temario" className="hover:underline hover:text-teal-400">
            Temario
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:underline hover:text-teal-400">
            Contacto
          </a>
        </li>
      </ul>

      {/* Botones a la derecha */}
      <div className="flex space-x-4 ml-3">
        <button 
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          onClick={() => router.push('/login')}
          >
          Login
        </button>
        <button className="px-4 py-2 bg-teal-400 hover:bg-teal-700 text-black rounded">
          Registrarse
        </button>
      </div>
    </nav>
  );
};

export default Navbar;