import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MapView from "../../components/MapView";
import { useSelector } from "react-redux";
import { js } from "@eslint/js";

export default function Itinerary() {
  const { state } = useLocation();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user_id = useSelector((state) => state.login.user_id);

  useEffect(() => {
    const fetchItinerary = async () => {
      // Validate if state has the required fields
      if (
        !state ||
        !state.startingPoint ||
        !state.destination ||
        !state.budget ||
        !state.duration
      ) {
        setError("Missing required fields in itinerary request.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:9000/api/v1/itinerary/generate",
          state
        );
        setItinerary(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch itinerary");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [state]);

  const handleClick = async (way) => {
    try {
      console.log(user_id);
      const response = await axios.post(
        "http://localhost:9000/api/v1/auth/add-way",
        { user_id, data: way }
      );

      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Your Itinerary</h1>

      {itinerary?.ways?.map((way, index) => (
        <div key={index} className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{way.name}</h2>

          {way?.days?.map((day) => (
            <div key={day.day} className="mb-4">
              <h3 className="font-bold">Day {day.day}</h3>
              <p>
                <strong>Transportation:</strong>{" "}
                {day.transportation?.join(", ")}
              </p>
              <p>
                <strong>Accommodation:</strong> {day.accommodation}
              </p>
              <p>
                <strong>Meals:</strong> {day.meals?.join(", ")}
              </p>
              <p>
                <strong>Activities:</strong> {day.activities?.join(", ")}
              </p>
            </div>
          ))}

          <p>
            <strong>Total Cost:</strong> {way.totalCost}
          </p>
          <p>
            <strong>Summary:</strong> {way.summary}
          </p>

          <ul className="list-disc pl-6">
            {way?.tips?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>

          <button
            onClick={() => {
              handleClick(way);
            }}
            className="mt-4 bg-blue-500 rounded-md text-white px-5 py-2"
          >
            Select
          </button>
        </div>
      ))}

      {/* Render the MapView component */}
      <div className="min-h-screen bg-blue-50 p-6">
        <h1 className="text-3xl font-bold mb-4">Itinerary Map</h1>

        <MapView
          startingPoint={state.startingPoint}
          destination={state.destination}
        />
      </div>
    </div>
  );
}
