import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VenueCalendar from "../components/VenueCalendar.jsx";

function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load venue");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Single venue with bookings", data);
        setVenue(data.data);
      })
      .catch((err) => {
        console.error("Error getting venue by id:", err);
        setError("Could not load this venue right now");
      })
      .finally(() => {
        setLoading(false);
      });
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

  let imgUrl = "https://via.placeholder.com/800x400?text=No+image";
  let imgAlt = venue.name || "Venue image";

  if (venue.media && venue.media.length > 0) {
    const firstMedia = venue.media[0];
    if (firstMedia.url) {
      imgUrl = firstMedia.url;
    }
    if (firstMedia.alt) {
      imgAlt = firstMedia.alt;
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <a href="/" className="text-sm text-sky-700 hover:underline">
          ← Back to all Venues
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-64 w-full overflow-hidden">
          <img
            src={imgUrl}
            alt={imgAlt}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900"> {venue.name}</h1>

          {venue.location && (
            <p className="text-sm text-slate-600">
              {venue.location.city}, {venue.location.country}
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
          {" "}
          Booked dates are shown in red. Other days are free to book
        </p>
        <VenueCalendar bookings={venue.bookings || []} />
      </div>
    </div>
  );
}

export default Venue;
