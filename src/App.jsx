import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/home" className="text-xl font-bold text-sky-700">
            Holidaze
          </a>
          <div className="space-x-4 text-sm">
            <a href="/home" className="text-slate-700 hover:text-sky-700">
              Home
            </a>
            <a href="/login" className="text-slate-700 hover:text-sky-700">
              Login
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default App;
