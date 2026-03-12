import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../api/apiClient";
import Toast from "../components/Toast.jsx";

/**
 * Page component for creating a new venue.
 * Renders a form and submits venue data to the API on submit.
 * @returns {JSX.Element} The create venue form page.
 */
function CreateVenue() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(1000);
  const [maxGuests, setMaxGuests] = useState(2);

  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState("");

  /**
   * Handles form submission for creating a new venue.
   * Validates inputs, builds the venue payload, and calls the API.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event.
   */
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

    const media = [
      {
        url: mediaUrl.trim(),
        alt: mediaAlt.trim() || name,
      },
    ];

    const venueData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      maxGuests: Number(maxGuests),
      media,
    };

    setIsSubmitting(true);

    try {
      await createVenue(venueData);
      setToast("Venue created!");
      setTimeout(() => navigate("/venues/manage"), 1500);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4"> Create venue </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="venueName"
            className="block text-sm font-medium text-[#5A3A2E] mb-1"
          >
            Name
          </label>
          <input
            id="venueName"
            type="text"
            className="w-full border rounded border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Venue name"
          />
        </div>

        <div>
          <label
            htmlFor="venueDescription"
            className="block text-sm font-medium text-[#5A3A2E] mb-1"
          >
            Description
          </label>
          <textarea
            id="venueDescription"
            className="w-full rounded border border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your venue"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="venuePrice"
              className="block text-sm font-medium text-[#5A3A2E] mb-1"
            >
              Price per night
            </label>
            <input
              id="venuePrice"
              type="number"
              className="w-full rounded border border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
            />
          </div>

          <div>
            <label
              htmlFor="venueMaxGuests"
              className="block text-sm font-medium text-[#5A3A2E] mb-1"
            >
              Max Guests
            </label>
            <input
              id="venueMaxGuests"
              type="number"
              className="w-full rounded border border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              min="1"
            />
          </div>
        </div>

        <div className="rounded border border-[#A7CDBD] bg-white p-4">
          <h2 className="font-semibold text-[#5A3A2E] mb-2"> Photos </h2>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="venueMediaUrl"
                className="block text-sm font-medium text-[#5A3A2E] mb-1"
              >
                Image URL
              </label>
              <input
                id="venueMediaUrl"
                type="url"
                required
                className="w-full rounded border border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label
                htmlFor="venueMediaAlt"
                className="block text-sm font-medium text-[#5A3A2E] mb-1"
              >
                Alt text
              </label>
              <input
                id="venueMediaAlt"
                type="text"
                className="w-full rounded border border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
                value={mediaAlt}
                onChange={(e) => setMediaAlt(e.target.value)}
                placeholder="Short description of the image"
              />
              <p className="text-xs text-[#5A3A2E] mb-1">
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
            className="rounded bg-[#C65A3A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9C2F1F] disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "create venue"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/venues/manage")}
            className="rounded border border-[#A7CDBD] px-4 py-2 text-sm hover:bg-[#f0ebe8]"
          >
            Cancel
          </button>
        </div>
      </form>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

export default CreateVenue;
