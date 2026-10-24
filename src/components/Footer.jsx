import { Link, useLocation } from "react-router-dom";
import {
  Mountain,
  MapPin,
  Mail,
  ArrowUpRight,
  ArrowUp,
  Heart,
  LockKeyhole,
} from "lucide-react";
import "../styles/footer.css";

const cities = ["Hunza", "Skardu", "Naran", "Swat", "Murree", "Gilgit"];

export default function Footer() {
  const location = useLocation();

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const goToDestinations = () => {
    if (location.pathname === "/") {
      requestAnimationFrame(() =>
        document
          .getElementById("destinations")
          ?.scrollIntoView({ behavior: "smooth" }),
      );
    }
  };

  return (
    <footer className="ns-footer">
      <div className="container ns-footer-main">
        <div className="ns-footer-brand">
          <Link to="/" className="ns-footer-logo" onClick={goTop}>
            <Mountain size={29} strokeWidth={1.7} />
            <span>
              Northern<strong>Stays</strong>
            </span>
          </Link>
          <p>
            Discover extraordinary stays across the breathtaking landscapes of
            Northern Pakistan. Find the perfect room for your next adventure.
          </p>
          <div className="ns-footer-tagline">
            Made for mountain escapes <Heart size={14} />
          </div>
        </div>

        <div className="ns-footer-column">
          <h4>Explore</h4>
          <Link to="/" onClick={goTop}>
            Home
          </Link>
          <Link to="/hotels" onClick={goTop}>
            Find Rooms
          </Link>
          <Link to="/#destinations" onClick={goToDestinations}>
            Popular Destinations
          </Link>
          <Link to="/login" onClick={goTop}>
            Login / Sign Up
          </Link>
        </div>

        <div className="ns-footer-column">
          <h4>Destinations</h4>
          {cities.map((city) => (
            <Link
              key={city}
              to={`/hotels?destination=${encodeURIComponent(city)}`}
              onClick={goTop}
            >
              {city} <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>

        <div className="ns-footer-column ns-footer-contact">
          <h4>Get in Touch</h4>
          <p>
            Have questions about your stay? Explore available rooms and discover
            your next destination.
          </p>
          <div className="ns-footer-contact-item">
            <MapPin size={17} />
            <span>Pakistan</span>
          </div>
          <div className="ns-footer-contact-item">
            <Mail size={17} />
            <span>Contact details coming soon</span>
          </div>
          <div className="ns-footer-actions">
            <Link to="/hotels" className="ns-footer-explore" onClick={goTop}>
              Explore Rooms <ArrowUpRight size={16} />
            </Link>
            <Link to="/admin" className="ns-footer-admin-btn" onClick={goTop}>
              <LockKeyhole size={16} /> Admin Login <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="ns-footer-divider" />
      </div>
      <div className="container ns-footer-bottom">
        <p>© {new Date().getFullYear()} NorthernStays. All rights reserved.</p>
        <p>
          Discover the North <Heart size={13} />
        </p>
        <button
          type="button"
          onClick={goTop}
          className="ns-footer-top"
          aria-label="Back to top"
        >
          <ArrowUp size={17} />
        </button>
      </div>
    </footer>
  );
}
