import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  function isStudEmail(value) {
    return value.toLowerCase().endsWith("@stud.noroff.no");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !email || !password) {
      setErrorMessage("please fill in all fields.");
      return;
    }

    if (!isStudEmail(email)) {
      setErrorMessage("Email must be a stud.noroff.no address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("register error data:", errorData);

        const apiMessage = errorData?.errors?.[0]?.message;

        if (apiMessage === "Profile already exists") {
          throw new Error(
            "An account with this email already exists. Please try logging in instead."
          );
        }

        throw new Error(
          apiMessage || "Registration failed, please check your details"
        );
      }

      const data = await response.json();
      console.log("register response:", data);

      setSuccessMessage("Registration successful! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage(
        error.message || "Something went wrong during registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> Register </h1>

      <p className="text-sm text-slate-600 mb-4">
        {" "}
        Create a new account. You must use your {""}{" "}
        <span className="font-mono">stud.noroff.no</span> mail{" "}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="Email"
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
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Choose a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage} </p>
        )}

        {successMessage && (
          <p className="text-sm text-green-700"> {successMessage} </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-sky-600 text-white py-2 text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
