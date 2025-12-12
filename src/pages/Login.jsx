import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

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

      if (!response.ok) {
        throw new Error("Login failed. Please check your email and password.");
      }

      const data = await response.json();
      console.log("Login response:", data);

      const userData = data.data;

      try {
        localStorage.setItem("holidazeUser", JSON.stringify(userData));
      } catch (storageError) {
        console.error("Could not save user til localStorage", storageError);
      }

      setSuccessMessage("You are now logged in");
    } catch (error) {
      console.error("error logged in:", error);
      setErrorMessage(error.message || "Something went wrong during login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> Login </h1>
      <p className="text-sm text-slate-600 mb-4">
        Email (must be a stud.noroff.no e-mail)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="yourname@stud.noroff.no"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded border border-slate-300 px-3 py-3 text-sm focus:outline:none focus:ring-2 focus:ring-sky-500"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        {successMessage && (
          <p className="text-sm text-green-700"> {successMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-sky-600 text-white py-2 text-sm font-semibold hover:bg-sky-7009 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
