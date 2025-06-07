"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Tours() {
  const [destinations, setDestinations] = useState(
    JSON.parse(localStorage.getItem("destinations") || "[]")
  );
  const [selectedDestination, setSelectedDestination] = useState("");
  const [tourName, setTourName] = useState("");
  const [tours, setTours] = useState([]);

  const addTour = () => {
    if (!selectedDestination || !tourName) {
      alert("Por favor selecciona un destino y completa el nombre del tour.");
      return;
    }

    const updatedTours = [...tours, { name: tourName, rates: [] }];
    setTours(updatedTours);

    const updatedDestinations = destinations.map((destination) =>
      destination.name === selectedDestination
        ? { ...destination, tours: updatedTours }
        : destination
    );
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setTourName("");
  };

  const deleteTour = (name) => {
    const updatedTours = tours.filter((tour) => tour.name !== name);
    setTours(updatedTours);

    const updatedDestinations = destinations.map((destination) =>
      destination.name === selectedDestination
        ? { ...destination, tours: updatedTours }
        : destination
    );
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
  };

  const handleDestinationChange = (e) => {
    const destinationName = e.target.value;
    setSelectedDestination(destinationName);

    const destination = destinations.find((d) => d.name === destinationName);
    setTours(destination ? destination.tours || [] : []);
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Tours</h1>
        <div className="border p-4 rounded w-full max-w-md mb-8">
          <h2 className="font-bold mb-2">Seleccionar Destino</h2>
          <select
            value={selectedDestination}
            onChange={handleDestinationChange}
            className="border p-2 rounded mb-2 w-full"
          >
            <option value="">Selecciona un Destino</option>
            {destinations.map((destination, index) => (
              <option key={index} value={destination.name}>
                {destination.name}
              </option>
            ))}
          </select>
        </div>
        {selectedDestination && (
          <>
            <div className="border p-4 rounded w-full max-w-md mb-8">
              <h2 className="font-bold mb-2">Agregar Tour</h2>
              <input
                type="text"
                placeholder="Nombre del Tour"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <button
                type="button"
                onClick={addTour}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Agregar Tour
              </button>
            </div>
            <ul className="list-disc pl-5">
              {tours.map((tour, index) => (
                <li key={index} className="mb-2">
                  <strong>{tour.name}</strong>
                  <button
                    onClick={() => deleteTour(tour.name)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
