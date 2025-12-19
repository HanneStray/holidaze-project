const BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

function getStoredUser() {
  try {
    const raw = localStorage.getItem("holidazeUser");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("could not red holidazeUser from localStorage", error);
    return null;
  }
}

function getAccessToken() {
  const user = getStoredUser();
  return user?.accessToken || null;
}

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

export async function fetchVenueById(venueId) {
  const data = await request(`/holidaze/venues/${venueId}?_bookings=true`);
  return data.data;
}

export async function fetchMyVenues() {
  const user = getStoredUser();
  if (!user?.name) throw new Error("Missing user name. Please log in again.");

  const data = await request(`/holidaze/profiles/${user.name}?_venues=true`, {
    auth: true,
  });

  return data?.data?.venues || [];
}

export async function deleteVenue(venueId) {
  await request(`/holidaze/venues/${venueId}`, {
    method: "DELETE",
    auth: true,
  });

  return true;
}

export async function createVenue(venueData) {
  const data = await request(`/holidaze/venues`, {
    method: "POST",
    auth: true,
    body: venueData,
  });

  return data.data;
}

export async function updateVenue(venueId, venueData) {
  const data = await request(`/holidaze/venues/${venueId}`, {
    method: "PUT",
    auth: true,
    body: venueData,
  });
  return data.data;
}

export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  const data = await request(`/holidaze/bookings`, {
    method: "POST",
    auth: true,
    body: { dateFrom, dateTo, guests, venueId },
  });

  return data.data;
}

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
