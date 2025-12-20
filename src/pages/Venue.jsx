import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import VenueCalendar from "../components/VenueCalendar.jsx";
import { fetchVenueById } from "../api/apiClient.js";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("holidazeUser")) || null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("nb-NO");
}

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

  function isLoggedIn() {
    const user = getStoredUser();
    return Boolean(user?.accessToken);
  }

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

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

  let imgUrl = venue.media?.[0]?.url || "";
  let imgAlt = venue.media?.[0]?.alt || venue.name || "Venue image";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link to="/" className="text-sm text-sky-700 hover:underline">
          ← Back to all Venues
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-64 w-full overflow-hidden bg-slate-200">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={imgAlt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-slate-600">
              No image
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900"> {venue.name}</h1>

          {venue.location?.country && (
            <p className="text-sm text-slate-600">
              {venue.location.city ? `${venue.location.city}, ` : ""}
              {venue.location.country}
            </p>
          )}

          {venue.description && (
            <p className="text-sm text-slate-700 mt-2">{venue.description}</p>
          )}

          {typeof venue.price === "number" && (
            <p className="font-semibold mt-3">
              Price per night:
              <span className="text-sky-700">{venue.price}</span> NOK
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-2">Availability</h2>
        <p className="text-xs text-slate-500 mb-2">
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
            <p className="text-sm text-slate-600"> No bookings yet </p>
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
                    <p className="text-sm text-slate-600">Guests: {b.guests}</p>
                    {b.customer?.name && (
                      <p className="text-sm text-slate-600">
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
          className="mt-3 w-full rounded bg-sky-700 text-white py-2 hover:bg-sky-800"
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
