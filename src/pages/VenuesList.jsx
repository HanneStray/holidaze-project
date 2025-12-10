import { useEffect, useState } from "react";

function VenuesList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://v2.api.noroff.dev/holidaze/venues")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched venues:", data);
        setVenues(data.data || []);
      })
      .catch((error) => {
        console.error("Error loading venues:", error); //Change error later=? more explain.
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-4"> Getting venues...</p>;
  }

  const filteredVenues = venues.filter((venue) => {
    if (!searchTerm) {
      return true;
    }

    if (!venue.name) {
      return false;
    }

    return venue.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2"> Venues </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Search venues
        </label>
        <input
          type="text"
          placeholder="Type a venue name"
          className="w-full max-w-md rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {filteredVenues.length == 0 ? (
        <p> No venues found. Try again </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => {
            //DEfault values if there is no media
            let imgUrl = "https://via.placeholder.com/400x250?text=No+image";
            let imgAlt = venue.name || "Venue image";

            // If there is at least one media item, use that instead
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
              <div
                key={venue.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={imgAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h2 className="font-semibold text-slate-800 truncate">
                    {venue.name}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default VenuesList;
