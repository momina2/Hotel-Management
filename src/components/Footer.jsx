import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mountain, ArrowRight, ArrowUp, Building2, MapPin } from "lucide-react";
import { API_BASE } from "../api/client";
import "../styles/footer.css";

const MAX_FOOTER_CITIES = 6;

// Footer destinations come from the live city list so links never point at empty cities.
function useFooterCities() {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/getCities.php`, { signal: controller.signal, cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (controller.signal.aborted || !data.success || !Array.isArray(data.cities)) return;
        const names = data.cities
          .filter((city) => city.city_name && (city.status == null || city.status === "YES"))
          .map((city) => city.city_name.trim());
        setCities([...new Set(names)].slice(0, MAX_FOOTER_CITIES));
      })
      .catch(() => { });
    return () => controller.abort();
  }, []);
  return cities;
}

export default function Footer() {
  const cities = useFooterCities();
  const { pathname } = useLocation();
  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="nsf">
      <div className="nsf-container">
        {pathname !== "/register-hotel" && (
        <section className="nsf-cta" aria-label="List your hotel">
          <span className="nsf-cta-icon"><Building2 size={22} /></span>
          <div>
            <h2>Own a hotel in the north?</h2>
            <p>List your property on NorthernStays and reach travellers planning their next mountain escape.</p>
          </div>
          <Link to="/register-hotel" className="nsf-cta-btn">List your hotel <ArrowRight size={17} /></Link>
        </section>
        )}

        <div className="nsf-main">
          <div className="nsf-brand">
            <Link to="/" className="nsf-logo" onClick={goTop} aria-label="NorthernStays home">
              <Mountain size={26} strokeWidth={1.8} />
              <span>Northern<span>Stays</span></span>
            </Link>
            <p>
              Handpicked rooms across the valleys and mountain towns of Northern Pakistan.
              Find your stay, check availability and book in minutes.
            </p>
            <span className="nsf-location"><MapPin size={15} /> Northern Pakistan</span>
          </div>

          <nav className="nsf-col" aria-label="Explore">
            <h3>Explore</h3>
            <Link to="/" onClick={goTop}>Home</Link>
            <Link to="/hotels" onClick={goTop}>Find rooms</Link>
            <Link to="/#destinations">Popular destinations</Link>
          </nav>

          <nav className="nsf-col" aria-label="Destinations">
            <h3>Destinations</h3>
            {cities.length > 0 ? cities.map((city) => (
              <Link key={city} to={`/destinations/${encodeURIComponent(city)}`} onClick={goTop}>{city}</Link>
            )) : (
              <Link to="/hotels" onClick={goTop}>Browse all rooms</Link>
            )}
          </nav>

          <nav className="nsf-col" aria-label="For hotels">
            <h3>For hotels</h3>
            <Link to="/register-hotel" onClick={goTop}>Register your hotel</Link>
            <Link to="/admin/login" onClick={goTop}>Hotel admin login</Link>
            <Link to="/admin/user-login" onClick={goTop}>Hotel staff login</Link>
          </nav>
        </div>

        <div className="nsf-bottom">
          <p>© {new Date().getFullYear()} NorthernStays. All rights reserved.</p>
          <button type="button" onClick={goTop} className="nsf-top">
            Back to top <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
