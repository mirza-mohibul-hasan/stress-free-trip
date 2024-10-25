import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("low-cost");
  const [duration, setDuration] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/itinerary", {
      state: { startingPoint, destination, budget, duration },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Plan Your Itinerary</h2>

        <input
          type="text"
          placeholder="Starting Point"
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="low-cost">Low Cost</option>
          <option value="mid-range">Mid Range</option>
          <option value="luxury">Luxury</option>
        </select>

        <input
          type="number"
          placeholder="Duration (Days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
