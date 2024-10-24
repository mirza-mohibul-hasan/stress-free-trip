import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Itinerary() {
  const { state } = useLocation();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/generate-itinerary",
          state
        );
        setItinerary(response.data);
      } catch (err) {
        setError("Failed to fetch itinerary");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [state]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Your Itinerary</h1>

      {itinerary?.ways.map((way, index) => (
        <div key={index} className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{way.name}</h2>

          {way.days.map((day) => (
            <div key={day.day} className="mb-4">
              <h3 className="font-bold">Day {day.day}</h3>
              <p>
                <strong>Transportation:</strong> {day.transportation.join(", ")}
              </p>
              <p>
                <strong>Accommodation:</strong> {day.accommodation}
              </p>
              <p>
                <strong>Meals:</strong> {day.meals.join(", ")}
              </p>
              <p>
                <strong>Activities:</strong> {day.activities.join(", ")}
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
            {way.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
