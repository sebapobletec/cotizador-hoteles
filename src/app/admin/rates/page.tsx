"use client";

import { useState, useEffect } from "react";

export default function Rates() {
  const [destinations, setDestinations] = useState(
    JSON.parse(localStorage.getItem("destinations") || "[]")
  );
  const [selectedDestination, setSelectedDestination] = useState("");
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [rates, setRates] = useState({ resident: "", nonResident: "" });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [existingRates, setExistingRates] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (selectedDestination) {
      const destination = destinations.find((d) => d.name === selectedDestination);
      setHotels(destination ? destination.hotels : []);
    }
  }, [selectedDestination, destinations]);

  useEffect(() => {
    if (selectedHotel) {
      const hotel = hotels.find((h) => h.name === selectedHotel);
      setRoomTypes(hotel ? hotel.roomTypes : []);
    }
  }, [selectedHotel, hotels]);

  useEffect(() => {
    if (selectedRoomType) {
      const roomType = roomTypes.find((r) => r.name === selectedRoomType);
      setExistingRates(roomType ? roomType.rates || [] : []);
    }
  }, [selectedRoomType, roomTypes]);

  const assignRates = () => {
    if (
      !selectedDestination ||
      !selectedHotel ||
      !selectedRoomType ||
      !rates.resident ||
      !rates.nonResident ||
      !dateRange.start ||
      !dateRange.end
    ) {
      alert("Por favor completa todos los campos para asignar tarifas.");
      return;
    }

    const newRate = { dateRange: { ...dateRange }, rates: { ...rates } };

    let updatedRates;
    if (editingIndex !== null) {
      // Edit existing rate
      updatedRates = existingRates.map((rate, i) =>
        i === editingIndex ? newRate : rate
      );
      setEditingIndex(null);
    } else {
      // Add new rate
      updatedRates = [...existingRates, newRate];
    }

    const updatedHotels = hotels.map((hotel) =>
      hotel.name === selectedHotel
        ? {
            ...hotel,
            roomTypes: hotel.roomTypes.map((roomType) =>
              roomType.name === selectedRoomType
                ? { ...roomType, rates: updatedRates }
                : roomType
            ),
          }
        : hotel
    );

    const updatedDestinations = destinations.map((destination) =>
      destination.name === selectedDestination
        ? { ...destination, hotels: updatedHotels }
        : destination
    );

    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setExistingRates(updatedRates);
    alert(editingIndex !== null ? "Tarifa editada correctamente." : "Tarifa asignada correctamente.");
    setRates({ resident: "", nonResident: "" });
    setDateRange({ start: "", end: "" });
  };

  const deleteRate = (index) => {
    const updatedRates = existingRates.filter((_, i) => i !== index);
    const updatedHotels = hotels.map((hotel) =>
      hotel.name === selectedHotel
        ? {
            ...hotel,
            roomTypes: hotel.roomTypes.map((roomType) =>
              roomType.name === selectedRoomType
                ? { ...roomType, rates: updatedRates }
                : roomType
            ),
          }
        : hotel
    );

    const updatedDestinations = destinations.map((destination) =>
      destination.name === selectedDestination
        ? { ...destination, hotels: updatedHotels }
        : destination
    );

    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setExistingRates(updatedRates);
  };

  const editRate = (index) => {
    const rateToEdit = existingRates[index];
    setRates(rateToEdit.rates);
    setDateRange(rateToEdit.dateRange);
    setEditingIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tarifas</h1>
      <div className="border p-4 rounded w-full max-w-md mb-8">
        <h2 className="font-bold mb-2">Seleccionar Destino</h2>
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
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
        <div className="border p-4 rounded w-full max-w-md mb-8">
          <h2 className="font-bold mb-2">Seleccionar Hotel</h2>
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border p-2 rounded mb-2 w-full"
          >
            <option value="">Selecciona un Hotel</option>
            {hotels.map((hotel, index) => (
              <option key={index} value={hotel.name}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedHotel && (
        <div className="border p-4 rounded w-full max-w-md mb-8">
          <h2 className="font-bold mb-2">Seleccionar Tipo de Habitación</h2>
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="border p-2 rounded mb-2 w-full"
          >
            <option value="">Selecciona un Tipo de Habitación</option>
            {roomTypes.map((roomType, index) => (
              <option key={index} value={roomType.name}>
                {roomType.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedRoomType && (
        <>
          <div className="border p-4 rounded w-full max-w-md mb-8">
            <h2 className="font-bold mb-2">{editingIndex !== null ? "Editar Tarifa" : "Asignar Tarifas"}</h2>
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
              onClick={assignRates}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editingIndex !== null ? "Guardar Cambios" : "Asignar Tarifas"}
            </button>
          </div>
          <div className="border p-4 rounded w-full max-w-md">
            <h2 className="font-bold mb-2">Tarifas Asignadas</h2>
            <ul className="list-disc pl-5">
              {existingRates.map((rate, index) => (
                <li key={index} className="mb-2">
                  <strong>Rango:</strong> {rate.dateRange.start} - {rate.dateRange.end} |{" "}
                  <strong>Residente:</strong> CLP {rate.rates.resident} |{" "}
                  <strong>No Residente:</strong> USD {rate.rates.nonResident}
                  <button
                    onClick={() => deleteRate(index)}
                    className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => editRate(index)}
                    className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
