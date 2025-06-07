import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-md p-4 mb-6">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Cotizador de Hoteles</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Inicio
          </Link>
          <Link href="/admin" className="text-blue-500 hover:text-blue-700">
            Admin
          </Link>
          <Link href="/user" className="text-blue-500 hover:text-blue-700">
            Cotizador
          </Link>
        </div>
      </nav>
    </header>
  );
}
