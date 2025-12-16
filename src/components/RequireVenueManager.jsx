import { Navigate } from "react-router-dom";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("holidazeUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function RequireVenueManager({ children }) {
  const user = getStoredUser();

  if (!user) return <Navigate to="/login" replace />;

  if (!user.venueManager) return <Navigate to="/" replace />;

  return children;
}

export default RequireVenueManager;
