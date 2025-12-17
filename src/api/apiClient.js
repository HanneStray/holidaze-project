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

function getAuthHeaders() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("You must be logged in to do this action.");
  }

  if (!API_KEY) {
    throw new Error(
      "Missing API key. Add VITE_NOROFF_API_KEY to your .env file."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
    "Content-Type": "application/json",
  };
}

export async function fetchMyVenues() {
  const user = getStoredUser();
  if (!user?.name) throw new Error("Missing user name. Please log in again.");

  const url = `${BASE_URL}/holidaze/profiles/${user.name}?_venues=true`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage = data?.errors?.[0]?.message;
    throw new Error(apiMessage || "Could not fetch your venues");
  }

  return data?.data?.venues || [];
}

export async function deleteVenue(venueId) {
  const response = await fetch(`${BASE_URL}/holidaze/venues/${venueId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const apiMessage = data?.errors?.[0]?.message;
    throw new Error(apiMessage || "Could not delete venue");
  }

  return true;
}

export async function createVenue(venueData) {
  const response = await fetch(`${BASE_URL}/holidaze/venues`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(venueData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage = data?.errors?.[0]?.message;
    throw new Error(apiMessage || "Could not create venue");
  }

  return data.data;
}

export async function fetchVenuesById(venueId) {
  const response = await fetch(`${BASE_URL}/holidaze/venues/${venueId}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage = data?.errors?.[0]?.message;
    throw new Error(apiMessage || "Could not fetch venue");
  }

  return data.data;
}

export async function updateVenue(venueId, venueData) {
  const response = await fetch(`${BASE_URL}/holidaze/venues/${venueId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(venueData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const apiMessage = data?.errors?.[0]?.message;
    throw new Error(apiMessage || "Could not update venue");
  }
  return data.data;
}
