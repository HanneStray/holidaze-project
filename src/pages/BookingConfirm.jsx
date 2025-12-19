import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createBooking, fetchVenueById } from "../api/apiClient";

function BookingConfirm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const venueId = params.get("venueId");
  const dateFrom = params.get("from");
  const dateTo = params.get("to");
  const guests = Number(params.get("guests") || 1);

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nights = useMemo(() => {
    if (!dateFrom || !dateTo) return 0;

    const from = new Date(`${dateFrom}T00:00:00Z`);
    const to = new Date(`${dateTo}T00:00:00Z`);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;

    const diffMs = to.getTime() - from.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (!venueId) {
      setError("Missing venueId in Url");
      setLoading(false);
      return;
    }

    fetchVenueById(venueId)
      .then(setVenue)
      .catch((err) => setError(err.message || "Could not load venue"))
      .finally(() => setLoading(false));
  }, [venueId]);

  async function handleConfirm() {
    console.log({ venueId, dateFrom, dateTo, guests, nights });

    setError("");

    if (!venueId) return setError("Missing venueId.");
    if (!dateFrom || !dateTo) return setError("Missing dates.");
    if (nights === 0) return setError("Check-out must be after check-in.");
    if (!Number.isFinite(guests) || guests < 1)
      return setError("invalid guests");

    try {
      setSubmitting(true);

      await createBooking({
        venueId,
        dateFrom,
        dateTo,
        guests,
      });

      navigate("/bookings");
    } catch (err) {
      setError(err.message || "could not create booking");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-4"> Loading booking ...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!venue) return <p className="p-4">Venue not found</p>;

  const price = Number(venue.price);
  const total = Number.isFinite(price) ? price * nights : null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> Confirm booking </h1>

      <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
        <p className="font-semibold">{venue.name}</p>
        <p className="text-sm text-slate-600">
          {dateFrom} → {dateTo} ({nights} nights)
        </p>
        <p className="text-sm">Guests: {guests}</p>

        {total !== null && (
          <p className="font-semibold">
            Total: <span className="text-sky-700">{total}</span> NOK
          </p>
        )}

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="mt-3 w-full rounded bg-sky-700 text-white py-2 hover:bg-sky-800 disabled:opacity-60"
        >
          {submitting ? "Booking..." : "Confirm booking"}
        </button>

        <button
          onClick={() => navigate(`/venues/${venueId}`)}
          className="w-full rounded border py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default BookingConfirm;
