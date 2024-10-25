import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import axios from "axios";

const getCoordinates = async (location) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: location, format: "json", limit: 1 },
      }
    );
    const { lat, lon } = response.data[0];
    return [parseFloat(lat), parseFloat(lon)];
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export default function MapView({ startingPoint, destination }) {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      const startCoords = await getCoordinates(startingPoint);
      const endCoords = await getCoordinates(destination);

      if (startCoords && endCoords) {
        setRoute([startCoords, endCoords]);
      }
    };
    fetchRoute();
  }, [startingPoint, destination]);

  const mapCenter = route.length ? route[0] : [23.8103, 90.4125]; // Default to Dhaka

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {route.length === 2 && (
        <>
          <Marker position={route[0]} />
          <Marker position={route[1]} />
          <Polyline positions={route} color="blue" />
        </>
      )}
    </MapContainer>
  );
}
