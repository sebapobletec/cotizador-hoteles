import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <Navbar />
  
      <p className="text-center mb-8">
        Bienvenido al mockup de cotizador de hoteles.
      </p>

    </div>
  );
}
