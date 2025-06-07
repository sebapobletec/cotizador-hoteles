"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function User() {
  const [destinations, setDestinations] = useState(
    JSON.parse(localStorage.getItem("destinations") || "[]")
  );
  const [selectedDestination, setSelectedDestination] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [rooms, setRooms] = useState([{ passengers: [{ age: "" }] }]);
  const [selectedTours, setSelectedTours] = useState([]);
  const [isResident, setIsResident] = useState(true);
  const [results, setResults] = useState([]);
  const [tourCosts, setTourCosts] = useState([]);
  const [ticketCosts, setTicketCosts] = useState([]);

  const addRoom = () => {
    setRooms([...rooms, { passengers: [{ age: "" }] }]);
  };

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const addPassengerToRoom = (roomIndex) => {
    const updatedRooms = rooms.map((room, i) =>
      i === roomIndex ? { ...room, passengers: [...room.passengers, { age: "" }] } : room
    );
    setRooms(updatedRooms);
  };

  const removePassengerFromRoom = (roomIndex, passengerIndex) => {
    const updatedRooms = rooms.map((room, i) =>
      i === roomIndex
        ? { ...room, passengers: room.passengers.filter((_, j) => j !== passengerIndex) }
        : room
    );
    setRooms(updatedRooms);
  };

  const handlePassengerAgeChange = (roomIndex, passengerIndex, value) => {
    const updatedRooms = rooms.map((room, i) =>
      i === roomIndex
        ? {
            ...room,
            passengers: room.passengers.map((passenger, j) =>
              j === passengerIndex ? { ...passenger, age: value } : passenger
            ),
          }
        : room
    );
    setRooms(updatedRooms);
  };

  const calculateNights = () => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const diffTime = endDate - startDate;
    const days = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))+1;
    const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return { days, nights };
  };

  const formatCurrency = (amount, isCLP) => {
    if (isCLP) {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
        useGrouping: true,
      }).format(amount).replace(/\./g, ',').replace(/,/g, '.'); // Replace grouping separator
    }
    return Math.round(amount); // Para USD, redondear sin decimales
  };

  const handleSubmit = () => {
    if (!selectedDestination || !dateRange.start || !dateRange.end || rooms.some((room) => room.passengers.some((p) => !p.age))) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      alert("El rango de fechas no es válido.");
      return;
    }

    const destination = destinations.find((d) => d.name === selectedDestination);
    if (!destination) {
      alert("Destino no encontrado.");
      return;
    }

    // Calcular costos de tours
    const tourCosts = selectedTours.map((tour) => {
      const tourData = destination.tours.find((t) => t.name === tour);
      if (!tourData) return null;

      const passengersDetails = rooms.flatMap((room) =>
        room.passengers.map((passenger) => {
          const age = parseInt(passenger.age);
          const rate = tourData.rates.find(
            (r) => age >= r.ageRange.start && age <= r.ageRange.end
          );
          return {
            age,
            rate: rate ? (isResident ? rate.residentRate : rate.nonResidentRate) : null,
          };
        })
      );

      const totalCost = passengersDetails.reduce(
        (sum, passenger) => sum + (passenger.rate || 0),
        0
      );

      return { name: tour, totalCost, passengersDetails };
    });

    setTourCosts(tourCosts.filter((cost) => cost !== null));

    // Calcular costos de tickets
    const ticketCosts = selectedTours
      .map((tour) => {
        const tourData = destination.tours.find((t) => t.name === tour);
        if (!tourData || !tourData.ticketRates) return null;

        const passengersDetails = rooms.flatMap((room) =>
          room.passengers.map((passenger) => {
            const age = parseInt(passenger.age);
            const rate = tourData.ticketRates.find(
              (r) => age >= r.ageRange.start && age <= r.ageRange.end
            );
            return {
              age,
              rate: rate ? (isResident ? rate.residentRate : rate.nonResidentRate) : null,
            };
          })
        );

        const totalCost = passengersDetails.reduce(
          (sum, passenger) => sum + (passenger.rate || 0),
          0
        );

        return { name: tour, totalCost, passengersDetails };
      })
      .filter((cost) => cost !== null && cost.passengersDetails.some((p) => p.rate !== null));

    setTicketCosts(ticketCosts);

    // Calcular costos de hoteles
    const results = destination.hotels.map((hotel) => {
      const roomDetails = rooms.map((room) => {
        const totalAdults = room.passengers.filter((p) => parseInt(p.age) >= (hotel.childAgeLimit || 12)).length;
        const totalChildren = room.passengers.filter((p) => parseInt(p.age) < (hotel.childAgeLimit || 12)).length;

        const matchingRoomType = hotel.roomTypes.find((roomType) =>
          roomType.capacity.some(
            (capacity) => capacity.adults >= totalAdults && capacity.children >= totalChildren
          )
        );

        if (!matchingRoomType) return null;

        const totalCost = calculateRoomCost(matchingRoomType.rates, dateRange, isResident, nights);

        return {
          roomType: matchingRoomType.name,
          totalCost,
        };
      });

      const totalCost = roomDetails.reduce((sum, room) => sum + (room ? room.totalCost : 0), 0);

      return {
        hotelName: hotel.name,
        roomDetails: roomDetails.filter((room) => room !== null),
        totalCost,
      };
    });

    const filteredResults = results.filter((result) => result.roomDetails.length > 0);
    setResults(filteredResults);
  };

  const calculateRoomCost = (rates, dateRange, isResident, nights) => {
    return rates.reduce((sum, rate) => {
      const rateStart = new Date(rate.dateRange.start);
      const rateEnd = new Date(rate.dateRange.end);
      const overlapStart = new Date(Math.max(rateStart, new Date(dateRange.start)));
      const overlapEnd = new Date(Math.min(rateEnd, new Date(dateRange.end)));

      const overlapNights = Math.max(0, Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)));
      if (overlapNights > 0) {
        const ratePerNight = isResident ? rate.rates.resident : rate.rates.nonResident;
        return sum + overlapNights * parseFloat(ratePerNight);
      }
      return sum;
    }, 0);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      <header className="w-full bg-white shadow-md p-4 mb-6">
        <nav className="max-w-4xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold text-gray-800">Cotizador de Hoteles y Tours</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Inicio
          </Link>
        </nav>
      </header>
      <div className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mb-6">
        <h2 className="font-medium text-lg mb-4 text-gray-700">Seleccionar Destino</h2>
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mb-6">
          <h2 className="font-medium text-lg mb-4 text-gray-700">Seleccionar Tours</h2>
          <div className="flex flex-col gap-2">
            {destinations
              .find((d) => d.name === selectedDestination)
              ?.tours.map((tour, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={tour.name}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTours([...selectedTours, tour.name]);
                      } else {
                        setSelectedTours(selectedTours.filter((t) => t !== tour.name));
                      }
                    }}
                    className="focus:ring-blue-400"
                  />
                  <span className="text-gray-600">{tour.name}</span>
                </label>
              ))}
          </div>
        </div>
      )}
      <div className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mb-6">
        <h2 className="font-medium text-lg mb-4 text-gray-700">Seleccionar Fechas</h2>
        <div className="flex gap-4">
          <input
            type="date"
            placeholder="Fecha Inicio"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            placeholder="Fecha Fin"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {dateRange.start && dateRange.end && (
          <p className="text-gray-600 mt-4">
            <strong>Noches:</strong> {calculateNights().nights}{" "}
            <strong>Días:</strong> {calculateNights().days}
          </p>
        )}
      </div>
      <div className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mb-6">
        <h2 className="font-medium text-lg mb-4 text-gray-700">Seleccionar Tipo de Residente</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="resident"
              checked={isResident}
              onChange={() => setIsResident(true)}
              className="focus:ring-blue-400"
            />
            <span className="text-gray-600">Residente</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="resident"
              checked={!isResident}
              onChange={() => setIsResident(false)}
              className="focus:ring-blue-400"
            />
            <span className="text-gray-600">No Residente</span>
          </label>
        </div>
      </div>
      {rooms.map((room, roomIndex) => (
        <div key={roomIndex} className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mb-6">
          <h2 className="font-medium text-lg mb-4 text-gray-700">Habitación {roomIndex + 1}</h2>
          {room.passengers.map((passenger, passengerIndex) => (
            <div key={passengerIndex} className="flex items-center gap-4 mb-4">
              <input
                type="number"
                placeholder={`Edad del Pasajero ${passengerIndex + 1}`}
                value={passenger.age}
                onChange={(e) => handlePassengerAgeChange(roomIndex, passengerIndex, e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {room.passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassengerFromRoom(roomIndex, passengerIndex)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addPassengerToRoom(roomIndex)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Agregar Pasajero
          </button>
          {rooms.length > 1 && (
            <button
              type="button"
              onClick={() => removeRoom(roomIndex)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none mt-4"
            >
              Eliminar Habitación
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addRoom}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none mb-6"
      >
        Agregar Habitación
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none"
      >
        Cotizar
      </button>
      {tourCosts.length > 0 && (
        <div className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mt-8">
          <h2 className="font-medium text-lg mb-4 text-gray-700">Costos de Tours</h2>
          <ul className="list-disc pl-5 text-gray-600">
            {tourCosts.map((tour, index) => (
              <li key={index}>
                <strong>{tour.name}:</strong> {isResident ? formatCurrency(tour.totalCost, true) : `$${formatCurrency(tour.totalCost, false)}`}
                <ul className="list-disc pl-5 mt-2">
                  {tour.passengersDetails.map((passenger, i) => (
                    <li key={i}>
                      Pasajero {i + 1} (Edad: {passenger.age}):{" "}
                      {passenger.rate !== null
                        ? isResident
                          ? formatCurrency(passenger.rate, true)
                          : `$${formatCurrency(passenger.rate, false)}`
                        : "Sin tarifa aplicable"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="font-semibold text-gray-800 mt-4">
            Costo Total de Tours:{" "}
            {isResident
              ? formatCurrency(tourCosts.reduce((sum, tour) => sum + tour.totalCost, 0), true)
              : `$${formatCurrency(tourCosts.reduce((sum, tour) => sum + tour.totalCost, 0), false)}`}
          </p>
        </div>
      )}
      {ticketCosts.length > 0 && (
        <div className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mt-8">
          <h2 className="font-medium text-lg mb-4 text-gray-700">Costos de Tickets</h2>
          <ul className="list-disc pl-5 text-gray-600">
            {ticketCosts.map((ticket, index) => (
              <li key={index}>
                <strong>{ticket.name}:</strong>{" "}
                {isResident
                  ? formatCurrency(ticket.totalCost, true)
                  : `$${formatCurrency(ticket.totalCost, false)}`}
                <ul className="list-disc pl-5 mt-2">
                  {ticket.passengersDetails.map((passenger, i) => (
                    <li key={i}>
                      Pasajero {i + 1} (Edad: {passenger.age}):{" "}
                      {passenger.rate !== null
                        ? isResident
                          ? formatCurrency(passenger.rate, true)
                          : `$${formatCurrency(passenger.rate, false)}`
                        : "Sin tarifa aplicable"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="font-semibold text-gray-800 mt-4">
            Costo Total de Tickets:{" "}
            {isResident
              ? formatCurrency(ticketCosts.reduce((sum, ticket) => sum + ticket.totalCost, 0), true)
              : `$${formatCurrency(ticketCosts.reduce((sum, ticket) => sum + ticket.totalCost, 0), false)}`}
          </p>
        </div>
      )}
      {results.length > 0 && (
        <div className="border p-6 rounded-lg w-full max-w-lg bg-white shadow-md mt-8">
          <h2 className="font-medium text-lg mb-4 text-gray-700">Opciones de Hoteles</h2>
          {results.map((hotel, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold text-gray-800">Opción {index + 1}: {hotel.hotelName}</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {hotel.roomDetails.map((room, i) => (
                  <li key={i}>
                    1 x {room.roomType}{" "}
                    {isResident
                      ? formatCurrency(room.totalCost, true)
                      : `$${formatCurrency(room.totalCost, false)}`}
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-gray-800 mt-4">
                Total:{" "}
                {isResident
                  ? formatCurrency(hotel.totalCost, true)
                  : `$${formatCurrency(hotel.totalCost, false)}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
