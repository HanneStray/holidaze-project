/**
 * Displays a single venue as a card with an image and name.
 * @param {object} props - Component props.
 * @param {object} props.venue - The venue object to display.
 * @returns {JSX.Element} A clickable venue card linking to the venue page.
 */
function VenueCard({ venue }) {
  let imgUrl = "https://via.placeholder.com/400x250?text=No+image";
  const imgAlt = venue.name || "Venue Image";

  if (venue.media && venue.media.length > 0 && venue.media[0].url) {
    imgUrl = venue.media[0].url;
  }

  return (
    <a
      href={`/venues/${venue.id}`}
      className="bg-[#E8D3C5] rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
    >
      <div className="h-40 w-full overflow-hidden">
        <img src={imgUrl} alt={imgAlt} className="h-full w-full object-cover" />
      </div>

      <div className="p-3 flex-1 flex flex-col gap-1">
        <h2 className="font-semibold text-[#5A3A2E] truncate">{venue.name}</h2>

        {(venue.location?.city || venue.location?.country) && (
          <p className="text-xs text-[#5A3A2E]/70 truncate">
            {[venue.location.city, venue.location.country].filter(Boolean).join(", ")}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-[#5A3A2E]">
          <div className="flex items-center gap-2">
            {typeof venue.price === "number" && (
              <span className="font-bold">{venue.price} NOK<span className="font-normal"> / night</span></span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {typeof venue.rating === "number" && venue.rating > 0 && (
              <span>⭐ {venue.rating.toFixed(1)}</span>
            )}
            {typeof venue.maxGuests === "number" && (
              <span>👥 {venue.maxGuests}</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

export default VenueCard;
