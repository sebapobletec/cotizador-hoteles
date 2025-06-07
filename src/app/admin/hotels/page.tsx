"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Hotels() {
  const [destinations, setDestinations] = useState(
    JSON.parse(localStorage.getItem("destinations") || "[]")
  );
  const [selectedDestination, setSelectedDestination] = useState("");
  const [hotels, setHotels] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [editingHotel, setEditingHotel] = useState(null);
  const [newHotelName, setNewHotelName] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypeName, setRoomTypeName] = useState("");
  const [capacityOptions, setCapacityOptions] = useState([]);
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [childAgeLimit, setChildAgeLimit] = useState(""); // Nueva variable para la edad máxima de un niño
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedDestination) {
      const destination = destinations.find((d) => d.name === selectedDestination);
      setHotels(destination ? destination.hotels : []);
    }
  }, [selectedDestination, destinations]);

  const addHotel = () => {
    if (!hotelName || !selectedDestination) {
      alert("Por favor selecciona un destino y completa el nombre del hotel.");
      return;
    }
    const updatedHotels = [...hotels, { name: hotelName, rooms: [], roomTypes: [], childAgeLimit: "" }];
    setHotels(updatedHotels);

    const updatedDestinations = destinations.map((destination) =>
      destination.name === selectedDestination
        ? { ...destination, hotels: updatedHotels }
        : destination
    );
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setHotelName("");
  };

  const deleteHotel = (name) => {
    const updatedHotels = hotels.filter((h) => h.name !== name);
    setHotels(updatedHotels);

    const updatedDestinations = destinations.map((destination) =>
      destination.name === selectedDestination
        ? { ...destination, hotels: updatedHotels }
        : destination
    );
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
  };

  const editHotel = (hotel) => {
    setEditingHotel(hotel);
    setNewHotelName(hotel.name);
    setRoomTypes(hotel.roomTypes || []);
    setChildAgeLimit(hotel.childAgeLimit || ""); // Cargar la edad máxima de un niño
    setShowPopup(true);
  };

  const saveHotelChanges = () => {
    const updatedHotels = hotels.map((hotel) =>
      hotel.name === editingHotel.name
        ? { ...hotel, name: newHotelName, roomTypes, childAgeLimit }
        : hotel
    );
    setHotels(updatedHotels);

    const updatedDestinations = destinations.map((destination) =>
      destination.name === selectedDestination
        ? { ...destination, hotels: updatedHotels }
        : destination
    );
    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setEditingHotel(null);
    setNewHotelName("");
    setRoomTypes([]);
    setChildAgeLimit(""); // Resetear la edad máxima de un niño
    setShowPopup(false);
  };

  const addRoomType = () => {
    if (!roomTypeName || capacityOptions.length === 0) {
      alert("Por favor ingresa un nombre para el tipo de habitación y agrega capacidades.");
      return;
    }
    setRoomTypes([...roomTypes, { name: roomTypeName, capacity: [...capacityOptions] }]);
    setRoomTypeName("");
    setCapacityOptions([]);
  };

  const deleteRoomType = (index) => {
    const updatedRoomTypes = roomTypes.filter((_, i) => i !== index);
    setRoomTypes(updatedRoomTypes);
  };

  const addCapacityOption = () => {
    if (!adults || !children) {
      alert("Por favor completa los campos de adultos y niños para agregar una capacidad.");
      return;
    }
    setCapacityOptions([
      ...capacityOptions,
      { adults: parseInt(adults), children: parseInt(children) },
    ]);
    setAdults("");
    setChildren("");
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Hoteles</h1>
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
          <>
            <div className="border p-4 rounded w-full max-w-md mb-8">
              <h2 className="font-bold mb-2">Agregar Hotel</h2>
              <input
                type="text"
                placeholder="Nombre del Hotel"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <button
                type="button"
                onClick={addHotel}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Agregar Hotel
              </button>
            </div>
            <ul className="list-disc pl-5">
              {hotels.map((hotel, index) => (
                <li key={index} className="mb-2">
                  <strong>{hotel.name}</strong>
                  <button
                    onClick={() => editHotel(hotel)}
                    className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteHotel(hotel.name)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {showPopup && editingHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="font-bold mb-2">Editar Hotel</h2>
              <input
                type="text"
                placeholder="Nuevo Nombre del Hotel"
                value={newHotelName}
                onChange={(e) => setNewHotelName(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <div className="border p-4 rounded mb-4">
                <h3 className="font-bold mb-2">Agregar Tipos de Habitación</h3>
                <input
                  type="text"
                  placeholder="Nombre del Tipo de Habitación"
                  value={roomTypeName}
                  onChange={(e) => setRoomTypeName(e.target.value)}
                  className="border p-2 rounded mb-2 w-full"
                />
                <div className="border p-4 rounded mb-4">
                  <h4 className="font-bold mb-2">Agregar Capacidad</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Adultos"
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      className="border p-2 rounded mb-2 w-full"
                    />
                    <input
                      type="number"
                      placeholder="Niños"
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      className="border p-2 rounded mb-2 w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addCapacityOption}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Agregar Capacidad
                  </button>
                  <ul className="list-disc pl-5 mt-2">
                    {capacityOptions.map((option, index) => (
                      <li key={index}>
                        {option.adults} adultos, {option.children} niños
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={addRoomType}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Agregar Tipo de Habitación
                </button>
                <ul className="list-disc pl-5 mt-2">
                  {roomTypes.map((type, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        {type.name} - Capacidades:{" "}
                        {type.capacity.map(
                          (cap, i) =>
                            `${cap.adults} adultos, ${cap.children} niños${
                              i < type.capacity.length - 1 ? "; " : ""
                            }`
                        )}
                      </span>
                      <button
                        onClick={() => deleteRoomType(index)}
                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border p-4 rounded mb-4">
                <h3 className="font-bold mb-2">Definir edad de niños</h3>
                <input
                  type="number"
                  placeholder="Edad Máxima de un Niño"
                  value={childAgeLimit}
                  onChange={(e) => setChildAgeLimit(e.target.value)}
                  className="border p-2 rounded mb-2 w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveHotelChanges}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
