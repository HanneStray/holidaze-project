const BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

/**
 * Retrieves the stored user object from localStorage.
 * @returns {object|null} The parsed user object, or null if not found or on error.
 */
function getStoredUser() {
  try {
    const raw = localStorage.getItem("holidazeUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the access token from the stored user.
 * @returns {string|null} The access token, or null if not available.
 */
function getAccessToken() {
  const user = getStoredUser();
  return user?.accessToken || null;
}

/**
 * Returns the base request headers including the API key.
 * @returns {{ "X-Noroff-API-Key": string, "Content-Type": string }} Base headers object.
 * @throws {Error} If the API key environment variable is missing.
 */
function getBaseHeaders() {
  if (!API_KEY) {
    throw new Error(
      "Missing API key. Add VITE_NOROFF_API_KEY to your .env. file"
    );
  }

  return {
    "X-Noroff-API-Key": API_KEY,
    "Content-Type": "application/json",
  };
}

/**
 * Returns authenticated request headers including a Bearer token.
 * @returns {object} Headers object with Authorization and base headers.
 * @throws {Error} If no access token is found in localStorage.
 */
function getAuthHeaders() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("You must be logged in to do this action.");
  }

  return {
    ...getBaseHeaders(),
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Makes an HTTP request to the Noroff API.
 * @param {string} path - The API path to request (appended to BASE_URL).
 * @param {object} [options={}] - Request options.
 * @param {string} [options.method="GET"] - HTTP method.
 * @param {object} [options.body] - Request body to JSON-stringify.
 * @param {boolean} [options.auth=false] - Whether to include auth headers.
 * @param {AbortSignal} [options.signal] - AbortSignal for cancellation.
 * @returns {Promise<object>} Parsed JSON response data.
 * @throws {Error} If the response is not OK.
 */
async function request(
  path,
  { method = "GET", body, auth = false, signal } = {}
) {
  const headers = auth ? getAuthHeaders() : getBaseHeaders();

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage = data?.errors?.[0]?.message;
    throw new Error(apiMessage || "Request failed");
  }
  return data;
}

/**
 * Fetches a paginated list of venues, with optional search.
 * @param {object} params - Fetch parameters.
 * @param {number} [params.page=1] - Page number.
 * @param {number} [params.limit=24] - Number of items per page.
 * @param {string} [params.q=""] - Search query string.
 * @param {AbortSignal} [params.signal] - AbortSignal for cancellation.
 * @returns {Promise<{ items: object[], meta: object }>} Venues and pagination metadata.
 */
export async function fetchVenues({ page = 1, limit = 24, q = "", signal }) {
  const trimmed = q.trim();

  const base = trimmed ? "/holidaze/venues/search" : "/holidaze/venues";

  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));

  if (trimmed) {
    params.set("q", trimmed);
  } else {
    params.set("sort", "created");
    params.set("sortOrder", "desc");
  }

  const data = await request(`${base}?${params.toString()}`, {
    auth: false,
    signal,
  });

  return {
    items: data?.data || [],
    meta: data?.meta || {},
  };
}

/**
 * Fetches a single venue by its ID, including its bookings.
 * @param {string} venueId - The ID of the venue to fetch.
 * @returns {Promise<object>} The venue data object.
 */
export async function fetchVenueById(venueId) {
  const data = await request(`/holidaze/venues/${venueId}?_bookings=true`);
  return data.data;
}

/**
 * Fetches all venues owned by the currently logged-in user.
 * @returns {Promise<object[]>} Array of venue objects.
 * @throws {Error} If the user name is missing.
 */
export async function fetchMyVenues() {
  const user = getStoredUser();
  if (!user?.name) throw new Error("Missing user name. Please log in again.");

  const data = await request(`/holidaze/profiles/${user.name}?_venues=true`, {
    auth: true,
  });

  return data?.data?.venues || [];
}

/**
 * Deletes a venue by its ID.
 * @param {string} venueId - The ID of the venue to delete.
 * @returns {Promise<true>} Resolves to true on success.
 */
export async function deleteVenue(venueId) {
  await request(`/holidaze/venues/${venueId}`, {
    method: "DELETE",
    auth: true,
  });

  return true;
}

/**
 * Creates a new venue.
 * @param {object} venueData - The venue data to submit.
 * @returns {Promise<object>} The created venue object.
 */
export async function createVenue(venueData) {
  const data = await request(`/holidaze/venues`, {
    method: "POST",
    auth: true,
    body: venueData,
  });

  return data.data;
}

/**
 * Updates an existing venue by its ID.
 * @param {string} venueId - The ID of the venue to update.
 * @param {object} venueData - The updated venue data.
 * @returns {Promise<object>} The updated venue object.
 */
export async function updateVenue(venueId, venueData) {
  const data = await request(`/holidaze/venues/${venueId}`, {
    method: "PUT",
    auth: true,
    body: venueData,
  });
  return data.data;
}

/**
 * Creates a new booking.
 * @param {object} booking - Booking details.
 * @param {string} booking.dateFrom - Check-in date (ISO string).
 * @param {string} booking.dateTo - Check-out date (ISO string).
 * @param {number} booking.guests - Number of guests.
 * @param {string} booking.venueId - ID of the venue to book.
 * @returns {Promise<object>} The created booking object.
 */
export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  const data = await request(`/holidaze/bookings`, {
    method: "POST",
    auth: true,
    body: { dateFrom, dateTo, guests, venueId },
  });

  return data.data;
}

/**
 * Fetches all bookings for a specific venue.
 * @param {string} venueId - The ID of the venue.
 * @param {object} [options={}] - Optional settings.
 * @param {AbortSignal} [options.signal] - AbortSignal for cancellation.
 * @returns {Promise<object[]>} Array of booking objects.
 */
export async function fetchVenueBookings(venueId, { signal } = {}) {
  const data = await request(`/holidaze/venues/${venueId}?_bookings=true`, {
    auth: true,
    signal,
  });

  return data.data?.bookings || [];
}

/**
 * Fetches all bookings for the currently logged-in user.
 * @param {object} [options={}] - Optional settings.
 * @param {AbortSignal} [options.signal] - AbortSignal for cancellation.
 * @returns {Promise<object[]>} Array of booking objects.
 * @throws {Error} If the user is not logged in.
 */
export async function fetchMyBookings({ signal } = {}) {
  const user = getStoredUser();
  if (!user?.name) {
    throw new Error("You must be logged in to view bookings");
  }

  const data = await request(
    `/holidaze/profiles/${user.name}/bookings?_venue=true`,
    {
      auth: true,
      signal,
    }
  );

  return data?.data || [];
}

/**
 * Returns the currently stored user object.
 * @returns {object|null} The current user, or null if not logged in.
 */
export function getCurrentUser() {
  return getStoredUser();
}

/**
 * Fetches the full profile of the currently logged-in user.
 * @returns {Promise<object>} The user profile object.
 * @throws {Error} If the username is missing.
 */
export async function fetchMyProfile() {
  const user = getStoredUser();
  if (!user.name) throw new Error("Missing username. Please log in again.");

  const data = await request(
    `/holidaze/profiles/${user.name}?_venues=true&_bookings=true`,
    { auth: true }
  );
  return data.data;
}

/**
 * Updates the avatar image for the currently logged-in user.
 * @param {string} url - The URL of the new avatar image.
 * @returns {Promise<object>} The updated profile object.
 * @throws {Error} If the username is missing.
 */
export async function updateMyAvatar(url) {
  const user = getStoredUser();
  if (!user?.name) throw new Error("Missing username. Please login again");

  const data = await request(
    `/holidaze/profiles/${encodeURIComponent(user.name)}`,
    {
      method: "PUT",
      auth: true,
      body: {
        avatar: {
          url,
          alt: `Avatar for ${user.name}`,
        },
      },
    }
  );

  return data.data;
}
