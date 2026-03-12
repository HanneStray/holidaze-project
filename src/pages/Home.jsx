import { useState } from "react";
import Hero from "../components/Hero.jsx";
import VenuesList from "./VenuesList.jsx";

/**
 * Home page component.
 * Renders the hero banner followed by the full venues list.
 * Owns the shared search term so the hero search bar and venue list stay in sync.
 * @returns {JSX.Element} The home page.
 */
function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <Hero searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <VenuesList searchTerm={searchTerm} onSearchChange={setSearchTerm} />
    </div>
  );
}

export default Home;
