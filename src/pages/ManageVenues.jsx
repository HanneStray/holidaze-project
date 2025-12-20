import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyVenues, deleteVenue } from "../api/apiClient";

function ManageVenues() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function load() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const myVenues = await fetchMyVenues();
      setVenues(myVenues);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    const ok = window.confirm("Delete this venue? This cannot be undone");
    if (!ok) return;

    try {
      await deleteVenue(id);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Could not delete venue");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage venues</h1>

        <Link
          to="/venues/create"
          className="rounded bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          {" "}
          Create venue
        </Link>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-600"> Loading your venues </p>
      )}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {!isLoading && !errorMessage && venues.length === 0 && (
        <p className="text-sm text-slate-600">
          {" "}
          You have not created any venues yet
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {venues.map((venue) => (
          <li
            key={venue.id}
            className="rounded border border-slate-200 bg-white p-4"
          >
            {venue.media?.[0]?.url && (
              <img
                src={venue.media[0].url}
                alt={venue.media[0].alt || venue.name}
                className="mb-3 h-40 w-full rounded object-cover"
              />
            )}

            <h2 className="font-semibold text-slate-800">{venue.name}</h2>
            <p className="text-sm text-slate-600">
              Price: {venue.price} • Guests: {venue.maxGuests}
            </p>

            <div className="mt-3 flex gap-2">
              <Link
                to={`/venues/edit/${venue.id}`}
                className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(venue.id)}
                className="rounded border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
              >
                Delete
              </button>

              <Link
                to={`/venues/${venue.id}`}
                className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
              >
                View (bookings)
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={load}
        className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50"
      >
        Refresh list
      </button>
    </div>
  );
}

export default ManageVenues;
