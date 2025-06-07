"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Rooms() {
  const searchParams = useSearchParams();
  const destinationName = searchParams.get("destination");
  const hotelName = searchParams.get("hotel");
  const [destinations, setDestinations] = useState(
    JSON.parse(localStorage.getItem("destinations") || "[]")
  );
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [rates, setRates] = useState({ resident: "", nonResident: "" });

  useEffect(() => {
    const destination = destinations.find((d) => d.name === destinationName);
    const hotel = destination?.hotels.find((h) => h.name === hotelName);
    setRooms(hotel ? hotel.rooms : []);
  }, [destinationName, hotelName, destinations]);

  const addRatesToRoom = () => {
    if (!selectedRoom || !dateRange.start || !dateRange.end || !rates.resident || !rates.nonResident) {
      alert("Por favor completa todos los campos para agregar tarifas.");
      return;
    }
    const updatedRooms = rooms.map((room) =>
      room.name === selectedRoom
        ? {
            ...room,
            rates: [...room.rates, { dateRange, rates: { ...rates } }],
          }
        : room
    );
    setRooms(updatedRooms);

    const updatedDestinations = destinations.map((destination) => {
      if (destination.name === destinationName) {
        return {
          ...destination,
          hotels: destination.hotels.map((hotel) =>
            hotel.name === hotelName ? { ...hotel, rooms: updatedRooms } : hotel
          ),
        };
      }
      return destination;
    });
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setSelectedRoom("");
    setDateRange({ start: "", end: "" });
    setRates({ resident: "", nonResident: "" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Tarifas - {hotelName}</h1>
      <div className="border p-4 rounded w-full max-w-md mb-8">
        <h2 className="font-bold mb-2">Agregar Tarifas</h2>
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        >
          <option value="">Selecciona una Habitación</option>
          {rooms.map((room, index) => (
            <option key={index} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            placeholder="Fecha Inicio"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          />
          <input
            type="date"
            placeholder="Fecha Fin"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          />
        </div>
        <input
          type="text"
          placeholder="Tarifa Residente (CLP)"
          value={rates.resident}
          onChange={(e) => setRates({ ...rates, resident: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Tarifa No Residente (USD)"
          value={rates.nonResident}
          onChange={(e) => setRates({ ...rates, nonResident: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        />
        <button
          type="button"
          onClick={addRatesToRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar Tarifas
        </button>
      </div>
    </div>
  );
}
