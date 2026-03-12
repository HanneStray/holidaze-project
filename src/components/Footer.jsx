import { Link } from "react-router-dom";

/**
 * Reads and parses the stored user from localStorage.
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
 * Site footer component displayed at the bottom of every page.
 * Shows navigation links, an about blurb, social placeholders, contact info, and copyright.
 * @returns {JSX.Element} The footer element.
 */
function Footer() {
  const user = getStoredUser();

  return (
    <footer className="bg-[#A7CDBD] mt-auto border-t border-[#A7CDBD]/60 text-[#5A3A2E]">
      <div className="mx-auto max-w-5xl px-4 py-8 grid grid-cols-3 gap-8">

        {/* About */}
        <div>
          <p className="font-semibold text-base mb-2">Holidaze</p>
          <p className="text-sm leading-relaxed">
            Accommodation you don&apos;t want to leave. Inspired by nature,
            travel and calm escapes.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="font-semibold text-base mb-2">Navigate</p>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/" className="hover:text-[#C65A3A] transition-colors">
                Home
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-[#C65A3A] transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bookings"
                    className="hover:text-[#C65A3A] transition-colors"
                  >
                    Bookings
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <p className="font-semibold text-base mb-2">Contact</p>
          <p className="text-sm mb-3">
            <a
              href="mailto:contact@holidaze.com"
              className="hover:text-[#C65A3A] transition-colors"
            >
              contact@holidaze.com
            </a>
          </p>
          <div className="flex flex-wrap gap-2">
            {["Instagram", "LinkedIn", "Facebook"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="rounded border border-[#5A3A2E]/30 px-3 py-1 text-xs hover:border-[#C65A3A] hover:text-[#C65A3A] transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#5A3A2E]/20 py-3 text-center text-xs text-[#5A3A2E]">
        &copy; 2025 Holidaze
      </div>
    </footer>
  );
}

export default Footer;
