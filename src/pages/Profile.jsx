import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyBookings, updateMyAvatar } from "../api/apiClient";

function isAbortError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return err?.name === "AbortError" || msg.includes("aborted");
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("holidazeUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("nb-NO");
}

function isUpcoming(dateTo) {
  const end = new Date(dateTo);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return end >= today;
}

export default function Profile() {
  const navigate = useNavigate();
  const user = useMemo(() => getStoredUser(), []);
  const isManager = Boolean(user?.venueManager);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState([]);

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [avatarStatus, setAvatarStatus] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    if (!user?.accessToken) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        setError("");
        setLoading(true);

        const all = await fetchMyBookings({ signal: controller.signal });

        const upcoming = (all || [])
          .filter((b) => isUpcoming(b.dateTo))
          .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

        setBookings(upcoming);
      } catch (err) {
        if (isAbortError(err)) return;
        setError(err?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [navigate, user?.accessToken]);

  async function onSaveAvatar(e) {
    e.preventDefault();
    setAvatarStatus("");

    const trimmed = avatarUrl.trim();
    if (!trimmed) {
      setAvatarStatus("Please paste an image URL");
      return;
    }

    try {
      setSavingAvatar(true);
      const updated = await updateMyAvatar(trimmed);

      const current = getStoredUser();
      const next = { ...current, avatar: updated?.avatar?.url || trimmed };
      localStorage.setItem("holidazeUser", JSON.stringify(next));
      window.dispatchEvent(new Event("authChanged"));

      setAvatarStatus("Avatar updated");
    } catch (err) {
      setAvatarStatus(err?.message || "Could not update avatar");
    } finally {
      setSavingAvatar(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold"> Profile</h1>
          <p className="text-sm text-slate-600">
            Signed in as
            <span className="font-medium"> {user?.name || user?.email} </span>
            {isManager ? " (venue manager)" : " (customer)"}
          </p>
        </div>

        <Link
          to="/"
          className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
        >
          Back to venues
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-slate-600">Loading...</p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold"> Avatar </h2>

            <form onSubmit={onSaveAvatar} className="mt-3 space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {" "}
                Avatar image URL{" "}
              </label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="https://.."
              />

              <div className="flex items-center gap-2">
                <button
                  disabled={savingAvatar}
                  className="rounded-md bg-sky-700 px-3 py-2 text-sm text-white disabled:opacity-60"
                >
                  {savingAvatar ? "saving..." : "Update avatar"}
                </button>

                {avatarStatus && (
                  <p className="text-sm text-slate-700">{avatarStatus}</p>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold"> Upcoming bookings</h2>
              <Link
                to="/bookings"
                className="text-sm text-sky-700 hover:underline"
              >
                View all
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">
                No upcoming bookings yet
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {bookings.slice(0, 3).map((b) => (
                  <li key={b.id} className="rounded-md border p-3">
                    <p className="font-medium">{b.venue?.name || "Venue"}</p>
                    <p className="text-sm text-slate-600">
                      {formatDate(b.dateFrom)} → {formatDate(b.dateTo)} •{" "}
                      {b.guests} guests
                    </p>
                    {b.venue?.id && (
                      <Link
                        to={`/venues/${b.venue.id}`}
                        className="mt-2 inline-block text-sm text-sky-700 hover:underline"
                      >
                        View venue
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {isManager && (
            <section className="md:col-span-2 rounded-lg border bg-white p-4">
              <h2 className="text-lg font-semibold"> Venue manager</h2>
              <p className=""> Manage your venues and view bookings</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/venues/manage"
                  className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                >
                  {" "}
                  Manage venues
                </Link>
                <Link
                  to="/venues/create"
                  className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Create venue
                </Link>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
