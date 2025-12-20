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

  return (
    <header className="bg-white shadow-sm mb-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-sky-700">
          Holidaze{" "}
        </Link>

        <div className="space-x-4 text-sm flex items-center">
          <Link to="/" className="text-slate-700 hover:text-sky-700">
            Home{" "}
          </Link>

          {!user ? (
            <Link to="/login" className="text-slate-700 hover:text-sky-700">
              Login
            </Link>
          ) : (
            <>
              <Link to="/profile" className="text-slate-700 hover:text-sky-700">
                {" "}
                Profile
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
