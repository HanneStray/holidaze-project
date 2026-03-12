import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import VenueCalendar from "../components/VenueCalendar.jsx";
import { fetchVenueById } from "../api/apiClient.js";

/**
 * Retrieves the stored user object from localStorage.
 * @returns {object|null} The parsed user object, or null if not found or on error.
 */
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("holidazeUser")) || null;
  } catch {
    return null;
  }
}

/**
 * Formats a date value into a localised Norwegian date string.
 * @param {string|Date} value - The date value to format.
 * @returns {string} The formatted date string, or the original value if invalid.
 */
function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("nb-NO");
}

/**
 * Page component that displays details for a single venue.
 * Includes venue info, an availability calendar, booking form, and bookings list for managers.
 * @returns {JSX.Element} The venue detail page.
 */
function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState("");

  const navigate = useNavigate();

  /**
   * Checks whether the current user is logged in.
   * @returns {boolean} True if a user with an access token is stored.
   */
  function isLoggedIn() {
    const user = getStoredUser();
    return Boolean(user?.accessToken);
  }

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    /**
     * Fetches the venue data from the API and updates state.
     */
    async function load() {
      setLoading(true);
      setError("");

      try {
        const venueData = await fetchVenueById(id);
        if (isMounted) setVenue(venueData);
      } catch (err) {
        if (isMounted)
          setError(err.message || "Could not load this venue right now");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <p className="p-4"> Loading venue...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  if (!venue) {
    return <p className="p-4"> Venue not found </p>;
  }

  const user = getStoredUser();
  const isManager = Boolean(user?.venueManager);
  const canSeeVenueBookings = isManager;

  const imgUrl = venue.media?.[0]?.url || "";
  const imgAlt = venue.media?.[0]?.alt || venue.name || "Venue image";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link to="/" className="text-sm text-[#869D7A] hover:underline">
          ← Back to all Venues
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-64 w-full overflow-hidden bg-[#E8D3C5]">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={imgAlt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-[#5A3A2E]">
              No image
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h1 className="text-2xl font-bold text-[#5A3A2E]"> {venue.name}</h1>

          {venue.location?.country && (
            <p className="text-sm text-[#5A3A2E]">
              {venue.location.city ? `${venue.location.city}, ` : ""}
              {venue.location.country}
            </p>
          )}

          {venue.description && (
            <p className="text-sm text-[#5A3A2E] mt-2">{venue.description}</p>
          )}

          {typeof venue.price === "number" && (
            <p className="font-semibold mt-3">
              Price per night:
              <span className="font-bold text-black">{venue.price}</span> NOK
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-2">Availability</h2>
        <p className="text-xs text-[#5A3A2E] mb-2">
          Booked dates are shown in red. Other days are free to book
        </p>
        <VenueCalendar bookings={venue.bookings || []} />
      </div>

      {canSeeVenueBookings && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">
            Bookings for this venue
          </h2>

          {!venue.bookings || venue.bookings.length === 0 ? (
            <p className="text-sm text-[#5A3A2E]"> No bookings yet </p>
          ) : (
            <ul className="space-y-2">
              {venue.bookings
                .slice()
                .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
                .map((b) => (
                  <li key={b.id} className="rounded border p-3">
                    <p className="text-sm font-medium">
                      {" "}
                      {formatDate(b.dateFrom)} → {formatDate(b.dateTo)}{" "}
                    </p>
                    <p className="text-sm text-[#5A3A2E]">Guests: {b.guests}</p>
                    {b.customer?.name && (
                      <p className="text-sm text-[#5A3A2E]">
                        Customer: {b.customer.name}
                      </p>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
        <h3 className="font-semibold mb-2"> Book this venue</h3>

        {bookingError && (
          <p className="text-sm text-red-600 mb-2">{bookingError}</p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm">
            Check in
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </label>

          <label className="text-sm">
            Check-out
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </label>

          <label className="text-sm">
            Guests (max {venue.maxGuests})
            <input
              type="number"
              min="1"
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1 w-full rounded border p-2"
            />
          </label>
        </div>

        <button
          className="mt-3 w-full rounded bg-[#C65A3A] text-white py-2 hover:bg-[#9C2F1F]"
          onClick={() => {
            setBookingError("");

            if (!dateFrom || !dateTo) {
              setBookingError(
                "Please choose both check.in and check-out dates."
              );
              return;
            }
            if (new Date(dateFrom) >= new Date(dateTo)) {
              setBookingError("check-out must be after check-in.");
              return;
            }

            const confirmUrl = `/booking/confirm?venueId=${venue.id}&from=${dateFrom}&to=${dateTo}&guests=${guests}`;

            if (!isLoggedIn()) {
              navigate(`/login?redirect=${encodeURIComponent(confirmUrl)}`);
              return;
            }
            navigate(confirmUrl);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Venue;
