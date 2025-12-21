import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function loadUser() {
    try {
      const storedUser = localStorage.getItem("holidazeUser");
      if (!storedUser) return null;
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      return null;
    }
  }

  const [user, setUser] = useState(() => loadUser());

  useEffect(() => {
    function updateUserFromStorage() {
      setUser(loadUser());
    }

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

  function handleLogout() {
    try {
      localStorage.removeItem("holidazeUser");
    } catch (error) {
      console.error("Error removing user", error);
    }

    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  }

  const displayName = user?.name || user?.email || "";
  const initial = (displayName?.[0] || "?").toUpperCase();

  return (
    <header className="bg-white shadow-sm mb-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight hover:opacity-80"
          style={{ color: "#869D7A" }}
        >
          Holidaze{" "}
        </Link>

        <div className="space-x-4 text-sm flex items-center">
          <Link to="/" className="text-slate-700 hover:text-sky-700">
            Home
          </Link>

          {!user ? (
            <Link to="/login" className="text-slate-700 hover:text-sky-700">
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full hover:bg-slate-50 px-2 py-1"
                title="Go to profile"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Your avatar"
                    className="h-8 w-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700">
                    {initial}
                  </div>
                )}
                <span className="hidden sm:block text-slate-700">
                  {" "}
                  Hi,{" "}
                  <span className="font-medium">{user?.name || "there"}</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
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
