import { useEffect, useState } from "react";

function VenuesList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return <p> Getting venues...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2"> Venues </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => {
          let imgUrl = "https://via.placeholder.com/400x250?text=No+image";
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
                </h2>{" "}
                //add more info later - just test
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VenuesList;
