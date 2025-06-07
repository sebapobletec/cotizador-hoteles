"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Admin() {
  const router = useRouter();
  // This component serves as the main admin dashboard for hotel management

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Gestión de Administración
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => router.push("/admin/destinations")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Gestionar Destinos
        </button>
        <button
          onClick={() => router.push("/admin/hotels")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Gestionar Hoteles
        </button>
        <button
          onClick={() => router.push("/admin/rates")}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Gestionar Tarifas de Hoteles
        </button>
        <button
          onClick={() => router.push("/admin/tours")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Gestionar Tours
        </button>
   
        <button
          onClick={() => router.push("/admin/tour-rates")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Gestionar Tarifas de Tours
        </button>
      </div>
    </div>
  );
}
