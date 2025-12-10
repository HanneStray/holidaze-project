function VenueCard({ venue }) {
  //placeholder image
  let imgUrl = "https://via.placeholder.com/400x250?text=No+image";
  let imgAlt = venue.name || "Venue Image";

  if (venue.media && venue.media.length > 0 && venue.media[0].url) {
    imgUrl = venue.media[0].url;
  }

  return (
    <a
      href={`/venues/${venue.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
    >
      <div className="h-40 w-full overflow-hidden">
        <img src={imgUrl} alt={imgAlt} className="h-full w-full object-cover" />
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h2 className="font-semibold text-slate-800 truncate">{venue.name}</h2>
      </div>
    </a>
  );
}

export default VenueCard;
