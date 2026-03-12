/**
 * Hero banner component displayed at the top of the home page.
 * Shows a full-width travel image with an overlaid headline, tagline, and search bar.
 * @param {object} props
 * @param {string} props.searchTerm - The current search query value.
 * @param {function} props.onSearchChange - Callback to update the search query.
 * @returns {JSX.Element} The hero section element.
 */
export default function Hero({ searchTerm, onSearchChange }) {
  const heroUrl =
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="h-60 sm:h-[340px] lg:h-[420px]">
        <img
          src={heroUrl}
          alt="Scenic travel destination"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 px-4">
        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center">
          Find your stay
        </h1>
        <p className="mt-2 text-white/90 text-sm sm:text-base lg:text-lg text-center">
          Unique venues - city breaks, cabins and some hidden gems
        </p>

        <div className="mt-8 w-full max-w-lg flex shadow-lg">
          <label htmlFor="heroSearch" className="sr-only">
            Search venues
          </label>
          <input
            id="heroSearch"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search venues by name..."
            className="flex-1 rounded-l-lg px-4 py-2.5 text-sm bg-white text-[#5A3A2E] placeholder-[#5A3A2E]/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onSearchChange(searchTerm)}
            className="rounded-r-lg bg-[#C65A3A] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#9C2F1F] transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
