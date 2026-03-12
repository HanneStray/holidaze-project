import { useEffect, useRef, useState } from "react";
import VenueCard from "../components/VenueCard.jsx";
import { fetchVenues } from "../api/apiClient.js";

/**
 * Page component that displays a searchable, paginated list of venues.
 * @returns {JSX.Element} The venues list page with search and load more functionality.
 */
function VenuesList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchInputRef = useRef(null);
  const limit = 24;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();

    /**
     * Fetches the first page of venues and resets the list.
     */
    async function loadFirstPage() {
      setErrorMessage("");
      setLoading(true);
      setHasMore(true);

      try {
        const result = await fetchVenues({
          page: 1,
          limit,
          q: debouncedSearch,
          signal: controller.signal,
        });

        setVenues(result.items);
        setPage(1);

        if (typeof result.meta.isLastPage === "boolean") {
          setHasMore(!result.meta.isLastPage);
        } else {
          setHasMore(result.items.length > 0);
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        setErrorMessage(error.message || "Something went wrong");
        setVenues([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    }

    loadFirstPage();

    return () => controller.abort();
  }, [debouncedSearch]);

  /**
   * Loads the next page of venues and appends them to the existing list.
   */
  async function handleLoadMore() {
    setErrorMessage("");
    setLoadingMore(true);

    const controller = new AbortController();

    try {
      const nextPage = page + 1;

      const result = await fetchVenues({
        page: nextPage,
        limit,
        q: debouncedSearch,
        signal: controller.signal,
      });

      setVenues((prev) => [...prev, ...result.items]);
      setPage(nextPage);

      if (typeof result.meta?.isLastPage === "boolean") {
        setHasMore(!result.meta.isLastPage);
      } else {
        setHasMore(result.items.length > 0);
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setLoadingMore(false);

      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2"> Venues </h1>

      <div className="mb-4">
        <label
          htmlFor="venueSearch"
          className="block text-sm font-medium text-[#5A3A2E] mb-1"
        >
          Search venues by name
        </label>
        <input
          id="venueSearch"
          ref={searchInputRef}
          type="text"
          placeholder="Search for a venue here"
          className="w-full max-w-md rounded border border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-[#5A3A2E] mt-1"> {errorMessage} </p>
      )}

      {loading ? (
        <p className="text-sm text-red-600 mb-3"> Loading venues...</p>
      ) : venues.length === 0 ? (
        <p> No venues found. Try again</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded border border-[#A7CDBD] bg-white px-4 py-2 text-sm hover:bg-[#DFF8EB] disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {!hasMore && venues.length > 0 && (
            <p className="mt-6 text-center text-xs text-[#5A3A2E]">
              No more venues to load
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default VenuesList;
