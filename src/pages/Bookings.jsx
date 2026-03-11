import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyBookings } from "../api/apiClient";

/**
 * Formats an ISO date string into a human-readable date.
 * @param {string} iso - The ISO date string to format.
 * @returns {string} The formatted date string, or an empty string if no value is provided.
 */
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Checks whether an error is an AbortError from a cancelled fetch.
 * @param {Error} err - The error to check.
 * @returns {boolean} True if the error is an abort error.
 */
function isAbortError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return err?.name === "AbortError" || msg.includes("aborted");
}

/**
 * Page component that lists all bookings for the currently logged-in user.
 * Redirects to login if the user is not authenticated.
 * @returns {JSX.Element} The bookings list page.
 */
function Bookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    /**
     * Fetches the current user's bookings from the API.
     */
    async function loadBookings() {
      try {
        setError("");
        const data = await fetchMyBookings({
          signal: controller.signal,
        });
        setBookings(data);
      } catch (err) {
        if (isAbortError(err)) return;

        if (String(err.message).toLowerCase().includes("logged in")) {
          navigate("/login");
          return;
        }

        setError(err.message || "Could not load bookings");
      } finally {
        setLoading(false);
      }
    }
    loadBookings();

    return () => controller.abort();
  }, [navigate]);

  if (loading) {
    return <p className="p-4"> Loading your bookings...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  if (bookings.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2"> My bookings </h1>
        <p className="text-slate-600">You have no upcoming bookings</p>
        <Link to="/" className="inline-block mt-3 text-sky-700 hover:underline">
          {" "}
          Browse venues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My bookings</h1>

      <div className="space-y-4">
        {[...bookings]
          .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
          .map((booking) => {
            const venue = booking.venue;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <h2 className="font-semibold text-lg">
                  {venue?.name || "Venue"}
                </h2>

                <p className="text-sm text-slate-600">
                  {formatDate(booking.dateFrom)} → {formatDate(booking.dateTo)}
                </p>

                <p className="text-sm">Guests : {booking.guests} </p>

                {venue?.id && (
                  <Link
                    to={`/venues/${venue.id}`}
                    className="inline-block mt-2 text-sm text-sky-700 hover:underline"
                  >
                    View venue
                  </Link>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Bookings;
