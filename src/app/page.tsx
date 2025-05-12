import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-8 sm:p-20 gap-8 font-[family-name:var(--font-geist-sans)]">
      {/* Navbar fijo en la parte superior */}
      <div className="w-full top-0 items-center shadow-md z-10">
        <Navbar />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold">SerCabo</h1>
        <h2 className="text-2xl">Oposición Cabo Ejército Español</h2>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/img/ascenso-logo-principal.svg"
          alt="Logo SerCabo"
          width={300}
          height={300}
        />
        <p className="text-lg text-center">
          Plataforma de estudio para la oposición de Cabo del Ejército de Tierra.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-2xl font-bold">¿Qué ofrecemos?</h3>
        <p className="text-lg text-center">
          Te ofrecemos un temario completo, test de examen y un foro para resolver
          tus dudas.
        </p>
        <p className="text-lg text-center">
          Además, tendrás acceso a un grupo de estudio donde podrás compartir
          tus dudas y experiencias con otros opositores.
        </p>
        <p className="text-lg text-center">
          Nuestro objetivo es ayudarte a conseguir tu plaza de Cabo en el
          Ejército Español.
        </p>
        <p className="text-lg text-center">
          ¡Únete a nosotros y empieza a estudiar hoy mismo!
        </p>
        </div>
    </div>
  );
}