import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/**
 * Site navigation bar component.
 * Displays the logo, home link, and either a login link or user avatar with logout button
 * depending on whether a user is currently logged in.
 * @returns {JSX.Element} The navigation header element.
 */
function Navbar() {
  const navigate = useNavigate();

  /**
   * Reads and parses the stored user from localStorage.
   * @returns {object|null} The parsed user object, or null if not found or on parse error.
   */
  function loadUser() {
    try {
      const storedUser = localStorage.getItem("holidazeUser");
      if (!storedUser) return null;
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }

  const [user, setUser] = useState(() => loadUser());

  useEffect(() => {
    /**
     * Refreshes the user state from localStorage.
     */
    function updateUserFromStorage() {
      setUser(loadUser());
    }

    /**
     * Handles cross-tab storage events and updates user if the key matches.
     * @param {StorageEvent} event - The storage event.
     */
    function handleStorage(event) {
      if (event.key === "holidazeUser") {
        updateUserFromStorage();
      }
    }

    window.addEventListener("authChanged", updateUserFromStorage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("authChanged", updateUserFromStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  /**
   * Logs the current user out by clearing localStorage and redirecting to home.
   */
  function handleLogout() {
    try {
      localStorage.removeItem("holidazeUser");
    } catch {
      // Silently ignore storage errors on logout
    }

    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  }

  const displayName = user?.name || user?.email || "";
  const initial = (displayName?.[0] || "?").toUpperCase();

  return (
    <header className="bg-[#A7CDBD] shadow-sm mb-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight hover:opacity-80"
          style={{ color: "#5A3A2E" }}
        >
          Holidaze{" "}
        </Link>

        <div className="space-x-4 text-sm flex items-center">
          <Link to="/" className="text-[#5A3A2E] hover:text-[#869D7A]">
            Home
          </Link>

          {!user ? (
            <Link to="/login" className="text-[#5A3A2E] hover:text-[#869D7A]">
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full hover:bg-[#8eb8a8] px-2 py-1"
                title="Go to profile"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Your avatar"
                    className="h-8 w-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border bg-[#DFF8EB] flex items-center justify-center text-xs font-semibold text-[#5A3A2E]">
                    {initial}
                  </div>
                )}
                <span className="hidden sm:block text-[#5A3A2E]">
                  {" "}
                  Hi,{" "}
                  <span className="font-medium">{user?.name || "there"}</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded border border-[#5A3A2E]/30 px-3 py-1 text-xs text-[#5A3A2E] hover:bg-[#8eb8a8]"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
