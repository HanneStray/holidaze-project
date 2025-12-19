import { Routes, Route } from "react-router-dom";
import VenuesList from "./pages/VenuesList.jsx";
import Login from "./pages/Login.jsx";
import Venue from "./pages/Venue.jsx";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";

import ManageVenues from "./pages/ManageVenues.jsx";
import CreateVenue from "./pages/CreateVenue.jsx";
import EditVenue from "./pages/EditVenue.jsx";
import BookingConfirm from "./pages/BookingConfirm.jsx";
import Bookings from "./pages/Bookings.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<VenuesList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/venues/:id" element={<Venue />} />

          <Route path="/venues/manage" element={<ManageVenues />} />
          <Route path="/venues/create" element={<CreateVenue />} />
          <Route path="/venues/edit/:id" element={<EditVenue />} />
          <Route path="/booking/confirm" element={<BookingConfirm />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
