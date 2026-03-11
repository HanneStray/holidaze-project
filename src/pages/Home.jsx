import Hero from "../components/Hero.jsx";
import VenuesList from "./VenuesList.jsx";

/**
 * Home page component.
 * Renders the hero banner followed by the full venues list.
 * @returns {JSX.Element} The home page.
 */
function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <VenuesList />
    </div>
  );
}

export default Home;
