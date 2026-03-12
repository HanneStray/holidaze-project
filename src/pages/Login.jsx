import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

/**
 * Login page component.
 * Handles user authentication via the Noroff API and stores the session in localStorage.
 * @returns {JSX.Element} The login form page.
 */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");

  /**
   * Handles login form submission.
   * Authenticates the user, fetches their profile, and stores the session.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event.
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const apiMessage = data?.errors?.[0]?.message;
        throw new Error(
          apiMessage || "Login failed. Please check your email and password."
        );
      }

      const u = data.data;

      const profileRes = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${u.name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            Authorization: `Bearer ${u.accessToken}`,
          },
        }
      );

      const profileJson = await profileRes.json().catch(() => null);

      if (!profileRes.ok) {
        const msg =
          profileJson?.errors?.[0]?.message || "Could not load profile";
        throw new Error(msg);
      }

      const profile = profileJson.data;

      const storedUser = {
        name: profile.name,
        email: profile.email,
        accessToken: u.accessToken,
        venueManager: Boolean(profile.venueManager),
        avatar: profile.avatar?.url || "",
        banner: profile.banner?.url || "",
      };

      localStorage.setItem("holidazeUser", JSON.stringify(storedUser));
      window.dispatchEvent(new Event("authChanged"));

      navigate(redirect || "/", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong during login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> Login </h1>
      <p className="text-sm text-[#5A3A2E] mb-4">
        Email (must be a stud.noroff.no e-mail)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="loginEmail"
            className="block text-sm font-medium text-[#5A3A2E] mb-1"
          >
            Email
          </label>
          <input
            id="loginEmail"
            type="email"
            className="w-full rounded border border-[#A7CDBD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
            placeholder="yourname@stud.noroff.no"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="loginPassword"
            className="block text-sm font-medium text-[#5A3A2E] mb-1"
          >
            Password
          </label>
          <input
            id="loginPassword"
            type="password"
            className="w-full rounded border border-[#A7CDBD] px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C65A3A]"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-[#C65A3A] text-white py-2 text-sm font-semibold hover:bg-[#9C2F1F] disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-xs text-[#5A3A2E] mt-4">
        Don&apos;t have an account yet {""}
        <Link to="/register" className="text-[#869D7A] hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default Login;
