import { Navigate } from "react-router-dom";

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
 * Route guard component that restricts access to venue manager users only.
 * Redirects to /login if not logged in, or to / if not a venue manager.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child route to render if access is granted.
 * @returns {JSX.Element} The children, or a redirect.
 */
function RequireVenueManager({ children }) {
  const user = getStoredUser();

  if (!user) return <Navigate to="/login" replace />;

  if (!user.venueManager) return <Navigate to="/" replace />;

  return children;
}

export default RequireVenueManager;
