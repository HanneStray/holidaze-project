import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVenueById, updateVenue } from "../api/apiClient.js";

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(1000);
  const [maxGuests, setMaxGuests] = useState(2);

  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  useEffect(() => {
    async function loadVenue() {
      setErrorMessage("");
      setIsLoading(true);

      try {
        const venue = await fetchVenueById(id);

        setName(venue.name || "");
        setDescription(venue.description || "");
        setPrice(venue.price ?? 1000);
        setMaxGuests(venue.maxGuests ?? 2);

        const firstMedia = venue.media?.[0];
        setMediaUrl(firstMedia?.url || "");
        setMediaAlt(firstMedia?.alt || "");
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message || "Could not load venue");
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!name || !description) {
      setErrorMessage("please fill in name and description");
      return;
    }

    if (!mediaUrl) {
      setErrorMessage("Please provide an image URL for the venue");
      return;
    }

    if (Number(maxGuests) < 1) {
      setErrorMessage("Max guest must be at least 1");
      return;
    }

    if (Number(price) <= 0) {
      setErrorMessage("Price must be greater than 0");
      return;
    }

    const venueData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      maxGuests: Number(maxGuests),
      media: [
        {
          url: mediaUrl.trim(),
          alt: mediaAlt.trim() || name.trim(),
        },
      ],
    };

    setIsSubmitting(true);

    try {
      await updateVenue(id, venueData);
      navigate("/venues/manage");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-slate-600"> Loading venues...</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4"> Edit venue </h1>

      {errorMessage && (
        <p className="text-sm text-red-600 mb-4"> {errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full border rounded border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Venue name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your venue"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price per night
            </label>
            <input
              type="number"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Max Guests
            </label>
            <input
              type="number"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
            />
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-800 mb-2"> Photos </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate700 mb-1">
                Alt text
              </label>
              <input
                type="text"
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={mediaAlt}
                onChange={(e) => setMediaAlt(e.target.value)}
                placeholder="Short description of the image"
              />
              <p className="text-xs text-slate-500 mb-1">
                {" "}
                If you leave this empty, we will use the venue name{" "}
              </p>
            </div>
          </div>
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/venues/manage")}
            className="rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditVenue;
