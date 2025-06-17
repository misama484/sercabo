import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-background text-white">
      
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold mt-5">SerCabo</h1>
        <h2 className="text-2xl m-5">Oposición Cabo Ejército Español</h2>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Image
          className="rounded-lg m-20"
          src="/img/sercabologo.png" 
          alt="Logo SerCabo"
          width={500}
          height={500}
        />
        <p className="text-lg text-center mb-10">
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