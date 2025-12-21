import Hero from "../components/Hero.jsx";
import VenuesList from "./VenuesList.jsx";

function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <VenuesList />
    </div>
  );
}

export default Home;
