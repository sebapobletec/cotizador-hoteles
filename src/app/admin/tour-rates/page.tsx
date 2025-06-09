"use client";

import { useState } from "react";

export default function TourRates() {
  const [destinations, setDestinations] = useState(
    JSON.parse(localStorage.getItem("destinations") || "[]")
  );
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedTour, setSelectedTour] = useState("");
  const [tours, setTours] = useState([]);
  const [ageRange, setAgeRange] = useState({ start: 0, end: 99 });
  const [residentRate, setResidentRate] = useState("");
  const [nonResidentRate, setNonResidentRate] = useState("");
  const [rates, setRates] = useState([]);
  const [ticketRates, setTicketRates] = useState([]);

  const handleDestinationChange = (e) => {
    const destinationName = e.target.value;
    setSelectedDestination(destinationName);

    const destination = destinations.find((d) => d.name === destinationName);
    setTours(destination ? destination.tours || [] : []);
    setSelectedTour("");
    setRates([]);
  };

  const handleTourChange = (e) => {
    const tourName = e.target.value;
    setSelectedTour(tourName);

    const destination = destinations.find((d) => d.name === selectedDestination);
    const tour = destination?.tours.find((t) => t.name === tourName);
    setRates(tour ? tour.rates || [] : []);
    setTicketRates(tour ? tour.ticketRates || [] : []); // Load ticket rates specific to the selected tour
  };

  const addRate = () => {
    if (!residentRate || !nonResidentRate) {
      alert("Por favor completa las tarifas para residentes y no residentes.");
      return;
    }

    const updatedRates = [
      ...rates,
      {
        ageRange: { start: parseInt(ageRange.start), end: parseInt(ageRange.end) },
        residentRate: parseFloat(residentRate),
        nonResidentRate: parseFloat(nonResidentRate),
      },
    ];
    setRates(updatedRates);

    const updatedDestinations = destinations.map((destination) => {
      if (destination.name === selectedDestination) {
        return {
          ...destination,
          tours: destination.tours.map((tour) =>
            tour.name === selectedTour ? { ...tour, rates: updatedRates, ticketRates } : tour
          ),
        };
      }
      return destination;
    });

    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setResidentRate("");
    setNonResidentRate("");
    setAgeRange({ start: 0, end: 99 });
  };

  const addTicketRate = () => {
    if (!residentRate || !nonResidentRate) {
      alert("Por favor completa las tarifas de tickets para residentes y no residentes.");
      return;
    }

    const updatedTicketRates = [
      ...ticketRates,
      {
        ageRange: { start: parseInt(ageRange.start), end: parseInt(ageRange.end) },
        residentRate: parseFloat(residentRate),
        nonResidentRate: parseFloat(nonResidentRate),
      },
    ];
    setTicketRates(updatedTicketRates);

    const updatedDestinations = destinations.map((destination) => {
      if (destination.name === selectedDestination) {
        return {
          ...destination,
          tours: destination.tours.map((tour) =>
            tour.name === selectedTour ? { ...tour, ticketRates: updatedTicketRates } : tour
          ),
        };
      }
      return destination;
    });

    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    setResidentRate("");
    setNonResidentRate("");
    setAgeRange({ start: 0, end: 99 });
  };

  const deleteRate = (index) => {
    const updatedRates = rates.filter((_, i) => i !== index);
    setRates(updatedRates);

    const updatedDestinations = destinations.map((destination) => {
      if (destination.name === selectedDestination) {
        return {
          ...destination,
          tours: destination.tours.map((tour) =>
            tour.name === selectedTour ? { ...tour, rates: updatedRates } : tour
          ),
        };
      }
      return destination;
    });

    setDestinations(updatedDestinations);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Tarifas de Tours</h1>
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
          <div className="border p-4 rounded w-full max-w-md mb-8">
            <h2 className="font-bold mb-2">Seleccionar Tour</h2>
            <select
              value={selectedTour}
              onChange={handleTourChange}
              className="border p-2 rounded mb-2 w-full"
            >
              <option value="">Selecciona un Tour</option>
              {tours.map((tour, index) => (
                <option key={index} value={tour.name}>
                  {tour.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedTour && (
          <>
            <div className="border p-4 rounded w-full max-w-md mb-8">
              <h2 className="font-bold mb-2">Agregar Tarifa</h2>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Edad Inicio"
                  value={ageRange.start}
                  onChange={(e) =>
                    setAgeRange({ ...ageRange, start: parseInt(e.target.value) })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="number"
                  placeholder="Edad Fin"
                  value={ageRange.end}
                  onChange={(e) =>
                    setAgeRange({ ...ageRange, end: parseInt(e.target.value) })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <input
                type="number"
                placeholder="Tarifa Residente"
                value={residentRate}
                onChange={(e) => setResidentRate(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Tarifa No Residente"
                value={nonResidentRate}
                onChange={(e) => setNonResidentRate(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <button
                type="button"
                onClick={addRate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Agregar Tarifa
              </button>
            </div>
            <ul className="list-disc pl-5">
              {rates.map((rate, index) => (
                <li key={index} className="mb-2">
                  <strong>
                    {rate.ageRange.start} - {rate.ageRange.end} años:
                  </strong>{" "}
                  Residente: {rate.residentRate}, No Residente: {rate.nonResidentRate}
                  <button
                    onClick={() => deleteRate(index)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="border p-4 rounded w-full max-w-md mb-8">
              <h2 className="font-bold mb-2">Agregar Tarifa de Tickets</h2>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Edad Inicio"
                  value={ageRange.start}
                  onChange={(e) =>
                    setAgeRange({ ...ageRange, start: parseInt(e.target.value) })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="number"
                  placeholder="Edad Fin"
                  value={ageRange.end}
                  onChange={(e) =>
                    setAgeRange({ ...ageRange, end: parseInt(e.target.value) })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <input
                type="number"
                placeholder="Tarifa Ticket Residente"
                value={residentRate}
                onChange={(e) => setResidentRate(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Tarifa Ticket No Residente"
                value={nonResidentRate}
                onChange={(e) => setNonResidentRate(e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              />
              <button
                type="button"
                onClick={addTicketRate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Agregar Tarifa de Ticket
              </button>
            </div>
            <ul className="list-disc pl-5">
              {ticketRates.map((rate, index) => (
                <li key={index} className="mb-2">
                  <strong>
                    {rate.ageRange.start} - {rate.ageRange.end} años:
                  </strong>{" "}
                  Residente: {rate.residentRate}, No Residente: {rate.nonResidentRate}
                  <button
                    onClick={() => {
                      const updatedTicketRates = ticketRates.filter((_, i) => i !== index);
                      setTicketRates(updatedTicketRates);

                      const updatedDestinations = destinations.map((destination) => {
                        if (destination.name === selectedDestination) {
                          return {
                            ...destination,
                            tours: destination.tours.map((tour) =>
                              tour.name === selectedTour
                                ? { ...tour, ticketRates: updatedTicketRates }
                                : tour
                            ),
                          };
                        }
                        return destination;
                      });

                      setDestinations(updatedDestinations);
                      localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
                    }}
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
