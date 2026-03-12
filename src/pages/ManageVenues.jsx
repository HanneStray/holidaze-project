import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyVenues, deleteVenue } from "../api/apiClient";

/**
 * Page component for venue managers to view, edit, and delete their venues.
 * @returns {JSX.Element} The manage venues page.
 */
function ManageVenues() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Fetches the current user's venues from the API and updates state.
   */
  async function load() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const myVenues = await fetchMyVenues();
      setVenues(myVenues);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /**
   * Prompts the user for confirmation and deletes the specified venue.
   * @param {string} id - The ID of the venue to delete.
   */
  async function handleDelete(id) {
    const ok = window.confirm("Delete this venue? This cannot be undone");
    if (!ok) return;

    try {
      await deleteVenue(id);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      setErrorMessage(error.message || "Could not delete venue");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage venues</h1>

        <Link
          to="/venues/create"
          className="rounded bg-[#C65A3A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#9C2F1F]"
        >
          {" "}
          Create venue
        </Link>
      </div>

      {isLoading && (
        <p className="text-sm text-[#5A3A2E]"> Loading your venues </p>
      )}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {!isLoading && !errorMessage && venues.length === 0 && (
        <p className="text-sm text-[#5A3A2E]">
          {" "}
          You have not created any venues yet
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {venues.map((venue) => (
          <li
            key={venue.id}
            className="rounded border border-[#A7CDBD] bg-white p-4"
          >
            {venue.media?.[0]?.url && (
              <img
                src={venue.media[0].url}
                alt={venue.media[0].alt || venue.name}
                className="mb-3 h-40 w-full rounded object-cover"
              />
            )}

            <h2 className="font-semibold text-[#5A3A2E]">{venue.name}</h2>
            <p className="text-sm text-[#5A3A2E]">
              Price: {venue.price} • Guests: {venue.maxGuests}
            </p>

            <div className="mt-3 flex gap-2">
              <Link
                to={`/venues/edit/${venue.id}`}
                className="rounded border border-[#A7CDBD] px-3 py-1 text-xs hover:bg-[#DFF8EB]"
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
                className="rounded border border-[#A7CDBD] px-3 py-1 text-xs hover:bg-[#DFF8EB]"
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
        className="rounded border border-[#A7CDBD] px-3 py-1 text-xs hover:bg-[#DFF8EB]"
      >
        Refresh list
      </button>
    </div>
  );
}

export default ManageVenues;
