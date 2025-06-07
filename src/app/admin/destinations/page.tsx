"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Destinations() {
  const [destinations, setDestinations] = useState(
    JSON.parse(localStorage.getItem("destinations") || "[]")
  );
  const [destinationName, setDestinationName] = useState("");
  const router = useRouter();

  const addDestination = () => {
    if (!destinationName) {
      alert("Por favor ingresa el nombre del destino.");
      return;
    }
    const updatedDestinations = [...destinations, { name: destinationName, hotels: [] }];
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setDestinationName("");
  };

  const deleteDestination = (name) => {
    const updatedDestinations = destinations.filter((d) => d.name !== name);
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
  };

  const goToHotels = (destinationName) => {
    router.push(`/admin/hotels?destination=${encodeURIComponent(destinationName)}`);
  };

  return (
    <div>
    
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Destinos</h1>
        <div className="border p-4 rounded w-full max-w-md mb-8">
          <h2 className="font-bold mb-2">Agregar Destino</h2>
          <input
            type="text"
            placeholder="Nombre del Destino"
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            className="border p-2 rounded mb-2 w-full"
          />
          <button
            type="button"
            onClick={addDestination}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Agregar Destino
          </button>
        </div>
        <ul className="list-disc pl-5">
          {destinations.map((destination, index) => (
            <li key={index} className="mb-2">
              <strong>{destination.name}</strong>
              <button
                onClick={() => goToHotels(destination.name)}
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Gestionar Hoteles
              </button>
              <button
                onClick={() => deleteDestination(destination.name)}
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
