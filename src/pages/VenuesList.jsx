import { useEffect, useRef, useState } from "react";
import VenueCard from "../components/VenueCard.jsx";

function VenuesList() {
  const [venues, setVenues] = useState([]);
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

  async function fetchVenues({ pageNumber, term, signal }) {
    const trimmed = term.trim();

    const base = trimmed
      ? "https://v2.api.noroff.dev/holidaze/venues/search"
      : "https://v2.api.noroff.dev/holidaze/venues";

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(pageNumber));

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.set("sort", "created");
      params.set("sortOrder", "desc");
    }

    const url = `${base}?${params.toString()}`;

    const res = await fetch(url, { signal });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const apiMessage = data?.errors?.[0]?.message;
      throw new Error(apiMessage || "Could not fetch venues");
    }

    return {
      items: data?.data || [],
      meta: data?.meta || {},
    };
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadFirstPage() {
      setErrorMessage("");

      try {
        const term = debouncedSearch;
        const result = await fetchVenues({
          pageNumber: 1,
          term,
          signal: controller.signal,
        });

        const termLower = term.trim().toLowerCase();
        const filteredItems = termLower
          ? result.items.filter((v) =>
              (v.name || "").toLowerCase().includes(termLower)
            )
          : result.items;

        setVenues(filteredItems);
        setPage(1);

        if (typeof result.meta.isLastPage === "boolean") {
          setHasMore(!result.meta.isLastPage);
        } else {
          setHasMore(filteredItems.length > 0);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error loading venues:", error);
        setErrorMessage(error.message || "Something went wrong");
      } finally {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    }

    loadFirstPage();

    return () => controller.abort();
  }, [debouncedSearch]);

  async function handleLoadMore() {
    setErrorMessage("");
    setLoadingMore(true);

    const controller = new AbortController();

    try {
      const nextPage = page + 1;
      const term = debouncedSearch;

      const result = await fetchVenues({
        pageNumber: nextPage,
        term,
        signal: controller.signal,
      });

      const termLower = term.trim().toLowerCase();
      const moreFiltered = termLower
        ? result.items.filter((v) =>
            (v.name || "").toLowerCase().includes(termLower)
          )
        : result.items;

      setVenues((prev) => [...prev, ...moreFiltered]);
      setPage(nextPage);

      if (typeof result.meta.isLastPage === "boolean") {
        setHasMore(!result.meta.isLastPage);
      } else {
        setHasMore(moreFiltered.length > 0);
      }
    } catch (error) {
      console.error("Error loading more venues:", error);
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
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Search venues by name
        </label>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a venue here"
          className="w-full max-w-md rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-slate-500 mt-1"> {errorMessage} </p>
      )}

      {venues.length === 0 ? (
        <p> No venues found. Try again </p>
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
                className="rounded border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50 disabled::opacity-60"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {!hasMore && venues.length > 0 && (
            <p className="mt-6 text-center text-xs text-slate-500">
              No more venues to load
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default VenuesList;
