// import { useEffect, useRef, useState } from "react";

// import AdminAreas from "./pages/admin/AdminAreas";

// import AdminCities from "./pages/admin/AdminCities";
// import AdminHotelUsers from "./pages/admin/AdminHotelUsers";
// import AdminAddons from "./pages/admin/AdminAddons";
// import HotelUserLogin from "./pages/admin/HotelUserLogin";

// import {

//   BrowserRouter,

//   Routes,

//   Route,

//   Link,

//   useNavigate,

//   useLocation,

//   Navigate,

//   Outlet,

//   useParams,

// } from "react-router-dom";

// import {

//   AdminLayout,

//   AdminDashboard,

//   AdminHotels,


//   AdminRooms,

//   AdminBookings,

// } from "./pages/admin/AdminPortal";

// import {

//   MapPin,

//   CalendarDays,

//   Users,

//   Search,

//   ArrowRight,

//   Mountain,

//   BedDouble,

//   Menu,

//   X,

//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// import HotelRegistration from "./pages/customer/HotelRegistration";

// import HotelAdminLogin from "./pages/admin/HotelAdminLogin";
// import AddHotel from "./pages/admin/AddHotel";

// import Hotels from "./pages/customer/Hotels";

// import HotelDetails from "./pages/customer/HotelDetails";

// import RoomDetails from "./pages/customer/RoomDetails";

// import Checkout from "./pages/customer/Checkout";

// import BookingSuccess from "./pages/customer/BookingSuccess";

// import "./styles/global.css";
// // import "./styles/popularDestinations.css";

// import Footer from "./components/Footer";



// const DESTINATIONS_API = "https://coreops.pk/Hotel/api/getCities.php";

// const PUBLIC_AREAS_API = "https://coreops.pk/Hotel/api/getAreasByCities.php";

// const ROOMS_BY_AREA_API = "https://coreops.pk/Hotel/api/getRoomsByArea.php";



// const DESTINATION_FALLBACK_IMAGE =

//   "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000";



// const DESTINATION_IMAGES = {

//   hunza: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000",

//   "hunza valley": "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000",

//   skardu: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000",

//   naran: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000",

// };



// function usePublicDestinations() {

//   const [data, setData] = useState({ cities: [], areas: [], loading: true, error: "" });

//   useEffect(() => {

//     const controller = new AbortController();

//     async function load() {

//       try {

//         const response = await fetch(DESTINATIONS_API, {

//           signal: controller.signal,

//           cache: "no-store",

//         });

//         const result = await response.json();

//         if (!response.ok || !result.success || !Array.isArray(result.cities)) {

//           throw new Error(result.message || "Unable to load destinations.");

//         }

//         if (!controller.signal.aborted) {

//           setData({

//             cities: Array.from(

//               new Map(

//                 result.cities

//                   .filter((city) => city.city_name && (city.status == null || city.status === "YES"))

//                   .map((city) => [city.city_name.trim().toLocaleLowerCase(), city])

//               ).values()

//             ),

//             areas: [], // getCities.php only returns cities.

//             loading: false,

//             error: "",

//           });

//         }

//       } catch (error) {

//         if (!controller.signal.aborted) {

//           setData({ cities: [], areas: [], loading: false, error: error.message });

//         }

//       }

//     }

//     load();

//     return () => controller.abort();

//   }, []);

//   return data;

// }



// function Navbar() {

//   const [menuOpen, setMenuOpen] = useState(false);

//   const location = useLocation();

//   const closeMenu = () => setMenuOpen(false);

//   return (

//     <header className="site-header">

//       <nav className="navbar">

//         <Link to="/" className="brand" onClick={closeMenu}>

//           <Mountain size={28} strokeWidth={1.8} />

//           <span>

//             Northern<span className="brand-accent">Stays</span>

//           </span>

//         </Link>

//         <div className={`nav-links ${menuOpen ? "active" : ""}`}>

//           <Link

//             to="/"

//             className={location.pathname === "/" ? "nav-active" : ""}

//             onClick={closeMenu}

//           >

//             Home

//           </Link>

//           <Link

//             to="/hotels"

//             className={location.pathname === "/hotels" ? "nav-active" : ""}

//             onClick={closeMenu}

//           >

//             Hotels

//           </Link>

//           <Link to="/#destinations" onClick={closeMenu}>

//             Destinations

//           </Link>

//           <Link

//             to="/register-hotel"

//             className="mobile-login"

//             onClick={closeMenu}

//           >

//             Register your Hotel

//           </Link>

//         </div>

//         <div className="nav-actions">

//           <Link to="/register-hotel" className="nav-button">

//             Register your Hotel

//           </Link>

//           <button

//             type="button"

//             className="menu-toggle"

//             onClick={() => setMenuOpen(!menuOpen)}

//             aria-label={menuOpen ? "Close menu" : "Open menu"}

//             aria-expanded={menuOpen}

//           >

//             {menuOpen ? <X size={25} /> : <Menu size={25} />}

//           </button>

//         </div>

//       </nav>

//     </header>

//   );

// }

// const today = () => {

//   const date = new Date();

//   return [

//     date.getFullYear(),

//     String(date.getMonth() + 1).padStart(2, "0"),

//     String(date.getDate()).padStart(2, "0"),

//   ].join("-");

// };



// function SearchBar({ initialCity = "", cities = [], allAreas = [], loading = false }) {

//   const navigate = useNavigate();

//   const [city, setCity] = useState(initialCity);

//   const [area, setArea] = useState("");

//   const [checkIn, setCheckIn] = useState("");

//   const [checkOut, setCheckOut] = useState("");

//   const [roomCount, setRoomCount] = useState(1);

//   const [guests, setGuests] = useState(2);

//   const [error, setError] = useState("");

//   const selectedCity = cities.find((item) => item.city_name === city);

//   const areas = allAreas

//     .filter((item) => Number(item.city_id) === Number(selectedCity?.id))

//     .map((item) => item.area_name);

//   const handleSearch = (event) => {

//     event.preventDefault();

//     setError("");

//     if (!city) {

//       setError("Please select a destination.");

//       return;

//     }

//     if (Boolean(checkIn) !== Boolean(checkOut)) {

//       setError("Please select both check-in and check-out dates.");

//       return;

//     }

//     if (checkIn && (checkIn < today() || checkOut <= checkIn)) {

//       setError("Please select valid booking dates.");

//       return;

//     }

//     const params = new URLSearchParams({

//       destination: city,

//       rooms: String(roomCount),

//       guests: String(guests),

//     });

//     if (area) params.set("area", area);

//     if (checkIn) params.set("checkIn", checkIn);

//     if (checkOut) params.set("checkOut", checkOut);

//     navigate(`/hotels?${params.toString()}`);

//   };

//   return (

//     <form className="search-bar" onSubmit={handleSearch}>

//       <div className="search-field">

//         <label>

//           <MapPin size={16} />

//           Destination

//         </label>

//         <select

//           value={city}

//           onChange={(e) => {

//             setCity(e.target.value);

//             setArea("");

//           }}

//           required

//         >

//           <option value="">{loading ? "Loading destinations..." : "Select Destination"}</option>

//           {cities.map((destination) => (

//             <option key={destination.id} value={destination.city_name}>

//               {destination.city_name}

//             </option>

//           ))}

//         </select>

//       </div>

//       <div className="search-field">

//         <label>

//           <MapPin size={16} />

//           Area

//         </label>

//         <select

//           value={area}

//           onChange={(e) => setArea(e.target.value)}

//           disabled={!city}

//         >

//           <option value="">{city ? (areasLoading ? "Loading areas..." : "All Areas") : "Select City First"}</option>

//           {areas.map((item) => (

//             <option key={item} value={item}>

//               {item}

//             </option>

//           ))}

//         </select>

//       </div>

//       <div className="search-field">

//         <label>

//           <CalendarDays size={16} />

//           Check-in

//         </label>

//         <input

//           type="date"

//           min={today()}

//           value={checkIn}

//           onChange={(e) => {

//             setCheckIn(e.target.value);

//             if (checkOut && checkOut <= e.target.value) {

//               setCheckOut("");

//             }

//           }}

//         />

//       </div>

//       <div className="search-field">

//         <label>

//           <CalendarDays size={16} />

//           Check-out

//         </label>

//         <input

//           type="date"

//           min={checkIn || today()}

//           value={checkOut}

//           onChange={(e) => setCheckOut(e.target.value)}

//         />

//       </div>

//       <div className="search-field">

//         <label>

//           <BedDouble size={16} />

//           Rooms

//         </label>

//         <select

//           value={roomCount}

//           onChange={(e) => setRoomCount(Number(e.target.value))}

//         >

//           {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (

//             <option key={count} value={count}>

//               {count} {count === 1 ? "Room" : "Rooms"}

//             </option>

//           ))}

//         </select>

//       </div>

//       <div className="search-field">

//         <label>

//           <Users size={16} />

//           Guests

//         </label>

//         <select

//           value={guests}

//           onChange={(e) => setGuests(Number(e.target.value))}

//         >

//           {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (

//             <option key={count} value={count}>

//               {count} {count === 1 ? "Guest" : "Guests"}

//             </option>

//           ))}

//         </select>

//       </div>

//       <button type="submit" className="search-btn">

//         <Search size={18} />

//         Search

//       </button>

//       {error && (

//         <p

//           role="alert"

//           style={{

//             gridColumn: "1 / -1",

//             color: "#b42318",

//             margin: 0,

//           }}

//         >

//           {error}

//         </p>

//       )}

//     </form>

//   );

// }



// function PopularDestinationGrid({ cities }) {
//   const navigate = useNavigate();
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [areas, setAreas] = useState([]);
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [areasError, setAreasError] = useState("");
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     if (!selectedCity) return;
//     const controller = new AbortController();
//     setLoadingAreas(true);
//     setAreasError("");
//     setAreas([]);
//     fetch(`${PUBLIC_AREAS_API}?city=${encodeURIComponent(selectedCity.city_name)}`, {
//       signal: controller.signal,
//       cache: "no-store",
//     })
//       .then(async (response) => {
//         const result = await response.json();
//         if (!response.ok || !result.success || !Array.isArray(result.areas)) {
//           throw new Error(result.message || "Unable to load areas.");
//         }
//         return result.areas;
//       })
//       .then((items) => {
//         if (!controller.signal.aborted) {
//           setAreas(items.filter((item) => item.area_name &&
//             (item.status == null || ["YES", "Active"].includes(item.status))));
//         }
//       })
//       .catch((error) => {
//         if (!controller.signal.aborted) setAreasError(error.message);
//       })
//       .finally(() => {
//         if (!controller.signal.aborted) setLoadingAreas(false);
//       });
//     return () => controller.abort();
//   }, [selectedCity]);

//   const cityImage = (cityName) =>
//     DESTINATION_IMAGES[cityName.trim().toLowerCase()] || DESTINATION_FALLBACK_IMAGE;

//   const openCity = (city) => {
//     setSelectedCity((current) => String(current?.id) === String(city.id) ? null : city);
//   };

//   // Render each set of four city cards followed by its own expandable carousel.
//   const rows = [];
//   for (let index = 0; index < cities.length; index += 4) {
//     rows.push(cities.slice(index, index + 4));
//   }

//   return (
//     <div className="ns-popular-city-list">
//       {rows.map((row, rowIndex) => {
//         const expanded = row.find((city) => String(city.id) === String(selectedCity?.id));
//         return (
//           <div className="ns-popular-city-group" key={rowIndex}>
//             <div className="ns-popular-city-grid">
//               {row.map((city) => (
//                 <button
//                   type="button"
//                   key={city.id ?? city.city_name}
//                   className={`ns-popular-city-card ${String(selectedCity?.id) === String(city.id) ? "is-selected" : ""}`}
//                   onClick={() => openCity(city)}
//                   aria-expanded={String(selectedCity?.id) === String(city.id)}
//                 >
//                   <img src={cityImage(city.city_name)} alt="" loading="lazy" />
//                   <span className="ns-popular-city-shade" />
//                   <span className="ns-popular-city-caption">
//                     <strong>{city.city_name}</strong>
//                     <small>Pakistan</small>
//                   </span>
//                 </button>
//               ))}
//             </div>
//             {expanded && (
//               <section className="ns-expanded-areas" aria-label={`${expanded.city_name} areas`}>
//                 <div className="ns-expanded-areas-heading">
//                   <div>
//                     <h3>{expanded.city_name} — Explore Areas</h3>
//                     <p>Select an area to view available rooms</p>
//                   </div>
//                   <button type="button" className="ns-expanded-close" onClick={() => setSelectedCity(null)} aria-label="Close areas"><X size={19} /></button>
//                 </div>
//                 {loadingAreas ? <p>Loading areas...</p> : areasError ? (
//                   <p role="alert">{areasError}</p>
//                 ) : areas.length === 0 ? (
//                   <p>No active areas available in {expanded.city_name}.</p>
//                 ) : (
//                   <div className="ns-expanded-carousel-shell">
//                     <button type="button" className="ns-expanded-arrow" aria-label="Previous areas"
//                       onClick={() => carouselRef.current?.scrollBy({ left: -520, behavior: "smooth" })}>
//                       <ChevronLeft size={22} />
//                     </button>
//                     <div className="ns-expanded-carousel" ref={carouselRef}>
//                       {areas.map((area) => (
//                         <button type="button" className="ns-expanded-area-card"
//                           key={area.id ?? area.area_name}
//                           onClick={() => navigate(`/destinations/${encodeURIComponent(expanded.city_name)}/areas/${encodeURIComponent(area.area_name)}`)}>
//                           <img src={area.image_url || cityImage(expanded.city_name)} alt="" loading="lazy" />
//                           <span className="ns-expanded-area-shade" />
//                           <span className="ns-expanded-area-caption">
//                             <strong>{area.area_name}</strong>
//                             <small>Explore rooms <ArrowRight size={14} /></small>
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                     <button type="button" className="ns-expanded-arrow" aria-label="Next areas"
//                       onClick={() => carouselRef.current?.scrollBy({ left: 520, behavior: "smooth" })}>
//                       <ChevronRight size={22} />
//                     </button>
//                   </div>
//                 )}
//               </section>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function Home() {
//   const { cities, loading, error } = usePublicDestinations();
//   return (
//     <>
//       <section className="hero">
//         <div className="hero-overlay">
//           <div className="hero-content">
//             <span className="eyebrow">DISCOVER NORTHERN PAKISTAN</span>
//             <h1>Stay Somewhere<br /><em>Extraordinary.</em></h1>
//             <p>Discover breathtaking destinations, handpicked hotels and unforgettable mountain escapes.</p>
//             <SearchBar cities={cities} loading={loading} />
//           </div>
//         </div>
//       </section>
//       <section className="destinations ns-destinations ns-popular-destinations" id="destinations">
//         <div className="container">
//           <div className="section-heading">
//             <div>
//               <span className="section-label">EXPLORE THE NORTH</span>
//               <h2>Popular Destinations</h2>
//               <p>Choose a city to explore its beautiful areas.</p>
//             </div>
//             <Link to="/hotels" className="view-all">Explore Hotels <ArrowRight size={18} /></Link>
//           </div>
//           {loading && <p>Loading destinations...</p>}
//           {error && <p role="alert">{error}</p>}
//           {!loading && !error && cities.length === 0 && <p>No active destinations available.</p>}
//           {!loading && !error && <PopularDestinationGrid cities={cities} />}
//         </div>
//       </section>
//       <section className="cta-section">
//         <Mountain size={42} strokeWidth={1.5} />
//         <h2>Your Mountain Escape Starts Here</h2>
//         <p>Explore stays across the most beautiful destinations of Northern Pakistan.</p>
//         <Link to="/hotels" className="cta-button">Explore Hotels <ArrowRight size={18} /></Link>
//       </section>
//     </>
//   );
// }

// function CityAreas() {

//   const { cityName = "" } = useParams();

//   const navigate = useNavigate();

//   const [areas, setAreas] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");



//   useEffect(() => {

//     const controller = new AbortController();

//     setLoading(true);

//     setError("");

//     setAreas([]);

//     fetch(`${PUBLIC_AREAS_API}?city=${encodeURIComponent(cityName)}`, {

//       signal: controller.signal,

//       cache: "no-store",

//     })

//       .then(async (response) => {

//         const result = await response.json();

//         if (!response.ok || !result.success || !Array.isArray(result.areas)) {

//           throw new Error(result.message || "Unable to load areas.");

//         }

//         return result.areas;

//       })

//       .then((items) => {

//         if (!controller.signal.aborted) setAreas(items);

//       })

//       .catch((err) => {

//         if (!controller.signal.aborted) setError(err.message);

//       })

//       .finally(() => {

//         if (!controller.signal.aborted) setLoading(false);

//       });

//     return () => controller.abort();

//   }, [cityName]);



//   return (

//     <main className="destinations" style={{ minHeight: "70vh", paddingTop: 80 }}>

//       <div className="container">

//         <div className="section-heading">

//           <div>

//             <span className="section-label">EXPLORE THE NORTH</span>

//             <h2>{cityName} — Areas</h2>

//             <p>Select an area to explore available rooms.</p>

//           </div>

//           <Link to="/" className="view-all">All Destinations <ArrowRight size={18} /></Link>

//         </div>

//         {loading && <p>Loading areas...</p>}

//         {error && <p role="alert">{error}</p>}

//         {!loading && !error && areas.length === 0 && <p>No active areas available in {cityName}.</p>}

//         <div className="destination-grid">

//           {areas.map((area) => (

//             <button

//               key={area.id}

//               type="button"

//               className="destination-card"

//               onClick={() => {

//                 navigate(`/destinations/${encodeURIComponent(cityName)}/areas/${encodeURIComponent(area.area_name)}`);

//               }}

//             >

//               <img src={DESTINATION_IMAGES[cityName.toLowerCase()] || DESTINATION_FALLBACK_IMAGE}

//                 alt={area.area_name} loading="lazy" />

//               <div className="destination-info">

//                 <h3>{area.area_name}</h3>

//                 <span>Explore Rooms <ArrowRight size={17} /></span>

//               </div>

//             </button>

//           ))}

//         </div>

//       </div>

//     </main>

//   );

// }



// function AreaRooms() {

//   const { cityName = "", areaName = "" } = useParams();

//   const [rooms, setRooms] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");



//   useEffect(() => {

//     const controller = new AbortController();

//     setLoading(true);

//     setError("");

//     setRooms([]);

//     const params = new URLSearchParams({ city: cityName, area: areaName });

//     fetch(`${ROOMS_BY_AREA_API}?${params.toString()}`, {

//       signal: controller.signal,

//       cache: "no-store",

//       credentials: "omit",

//     })

//       .then(async (response) => {

//         const result = await response.json();

//         if (!response.ok || !result.success || !Array.isArray(result.rooms)) {

//           throw new Error(result.message || "Unable to load rooms.");

//         }

//         return result.rooms;

//       })

//       .then((items) => {

//         if (!controller.signal.aborted) setRooms(items);

//       })

//       .catch((err) => {

//         if (!controller.signal.aborted) setError(err.message || "Unable to load rooms.");

//       })

//       .finally(() => {

//         if (!controller.signal.aborted) setLoading(false);

//       });

//     return () => controller.abort();

//   }, [cityName, areaName]);



//   const formatPrice = (price) =>

//     `PKR ${Number(price || 0).toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;



//   return (

//     <main className="destinations" style={{ minHeight: "70vh", paddingTop: 80 }}>

//       <div className="container">

//         <div className="section-heading">

//           <div>

//             <span className="section-label">AVAILABLE STAYS</span>

//             <h2>{areaName}, {cityName} — Rooms</h2>

//             <p>Explore available rooms across hotels in this area.</p>

//           </div>

//           <Link to={`/destinations/${encodeURIComponent(cityName)}`} className="view-all">

//             Back to Areas <ArrowRight size={18} />

//           </Link>

//         </div>

//         {loading && <p role="status">Loading rooms...</p>}

//         {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}

//         {!loading && !error && rooms.length === 0 && (

//           <p>No active rooms available in {areaName} right now.</p>

//         )}

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 24 }}>

//           {rooms.map((room) => (

//             <article key={`${room.company_id}-${room.id}`} style={{ borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 5px 25px rgba(0,0,0,.08)" }}>

//               <img

//                 src={room.image_url || DESTINATION_IMAGES[cityName.toLowerCase()] || DESTINATION_FALLBACK_IMAGE}

//                 alt={room.room_name}

//                 loading="lazy"

//                 onError={(event) => { event.currentTarget.src = DESTINATION_FALLBACK_IMAGE; }}

//                 style={{ width: "100%", height: 205, objectFit: "cover" }}

//               />

//               <div style={{ padding: 20, display: "grid", gap: 10 }}>

//                 <span style={{ color: "#64746d", fontSize: 13 }}>{room.hotel_name}</span>

//                 <h3 style={{ margin: 0 }}>{room.room_name}</h3>

//                 <span style={{ display: "flex", alignItems: "center", gap: 6 }}>

//                   <Users size={16} /> Up to {room.capacity} guests

//                 </span>

//                 {room.room_type && <span>{room.room_type}</span>}

//                 <p style={{ margin: 0 }}><strong>{formatPrice(room.price_per_night)}</strong> / night</p>

//                 <Link

//                   to={`/rooms/${encodeURIComponent(room.hotel_id)}/${encodeURIComponent(room.id)}?${new URLSearchParams({ city: cityName, area: areaName }).toString()}`}

//                   className="cta-button"

//                   style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}

//                 >

//                   View Room <ArrowRight size={16} />

//                 </Link>

//               </div>

//             </article>

//           ))}

//         </div>

//       </div>

//     </main>

//   );

// }



// function Placeholder({ title }) {

//   return (

//     <main className="placeholder">

//       <h1>{title}</h1>

//       <p>This section is coming soon.</p>

//       <Link to="/">Back to Home</Link>

//     </main>

//   );

// }

// // Verify the server-side PHP session before showing any admin screen.



// // Both guards use the same PHP session. Never grant access from local storage.
// const HOTEL_LOGIN_API = "https://coreops.pk/Hotel/api/login.php";

// function useHotelSession() {
//   const [session, setSession] = useState({ status: "checking", user: null });
//   useEffect(() => {
//     const controller = new AbortController();
//     fetch(HOTEL_LOGIN_API, {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "check_session" }),
//       signal: controller.signal,
//       cache: "no-store",
//     })
//       .then(async (response) => {
//         const data = await response.json();
//         if (!response.ok || !data.success || !data.authenticated || !data.user) {
//           return { status: "denied", user: null };
//         }
//         return { status: "allowed", user: data.user };
//       })
//       .then((result) => { if (!controller.signal.aborted) setSession(result); })
//       .catch(() => { if (!controller.signal.aborted) setSession({ status: "denied", user: null }); });
//     return () => controller.abort();
//   }, []);
//   return session;
// }

// function RequireHotelOwner() {
//   const { status, user } = useHotelSession();
//   if (status === "checking") return <div role="status">Checking hotel admin permissions...</div>;
//   if (status !== "allowed") return <Navigate to="/admin/login" replace />;
//   const role = String(user?.hotel_role || "").toLowerCase();
//   const userType = String(user?.user_type || "").toLowerCase();
//   const isOwner = role === "hotel_admin" || userType === "admin";
//   return isOwner ? <Outlet /> : <Navigate to="/admin/bookings" replace />;
// }

// function RequireHotelAdmin() {
//   const { status } = useHotelSession();
//   if (status === "checking") return <div role="status">Checking admin session...</div>;
//   return status === "allowed" ? <Outlet /> : <Navigate to="/admin/login" replace />;
// }

// function App() {

//   return (

//     <BrowserRouter basename="/Hotel">

//       <AppContent />

//     </BrowserRouter>

//   );

// }



// function AppContent() {

//   const location = useLocation();

//   const isAdminPage =

//     location.pathname === "/admin" || location.pathname.startsWith("/admin/");

//   return (

//     <>

//       {/* Customer Navbar */}

//       {!isAdminPage && <Navbar />}

//       <Routes>

//         {/* CUSTOMER PORTAL */}

//         <Route path="/" element={<Home />} />

//         <Route path="/hotels" element={<Hotels />} />

//         <Route path="/destinations/:cityName" element={<CityAreas />} />

//         <Route path="/destinations/:cityName/areas/:areaName" element={<AreaRooms />} />

//         <Route path="/hotels/:id" element={<HotelDetails />} />

//         <Route path="/rooms/:hotelId/:roomId" element={<RoomDetails />} />

//         <Route path="/checkout" element={<Checkout />} />

//         <Route path="/register-hotel" element={<HotelRegistration />} />

//         {/* Booking Confirmation */}

//         <Route path="/booking-success/:id" element={<BookingSuccess />} />

//         <Route path="/login" element={<Placeholder title="Customer Login" />} />

//         {/* HOTEL ADMIN LOGIN */}

//         <Route path="/admin/user-login" element={<HotelUserLogin />} />
//         <Route path="/admin/login" element={<HotelAdminLogin />} />

//         {/* PROTECTED ADMIN PORTAL */}

//         <Route element={<RequireHotelAdmin />}>

//           <Route path="/admin" element={<AdminLayout />}>

//             <Route element={<RequireHotelOwner />}>
//               <Route index element={<AdminDashboard />} />

//               <Route path="dashboard" element={<AdminDashboard />} />

//               <Route path="hotels" element={<AdminHotels />} />

//               <Route path="hotels/add" element={<AddHotel />} />

//               <Route path="hotels/:id/edit" element={<AddHotel />} />

//               <Route path="rooms" element={<AdminRooms />} />
//               <Route path="addons" element={<AdminAddons />} />

//             </Route>
//             <Route path="bookings" element={<AdminBookings />} />
//             <Route element={<RequireHotelOwner />}>
//               <Route path="hotel-users" element={<AdminHotelUsers />} />

//               <Route path="areas" element={<AdminAreas />} />

//               <Route path="cities" element={<AdminCities />} />
//             </Route>

//           </Route>

//         </Route>

//         {/* 404 PAGE */}

//         <Route path="*" element={<Placeholder title="Page Not Found" />} />

//       </Routes>

//       {!isAdminPage && <Footer />}

//     </>

//   );

// }



// export default App;











import { useEffect, useRef, useState } from "react";

import AdminAreas from "./pages/admin/AdminAreas";

import AdminCities from "./pages/admin/AdminCities";
import AdminHotelUsers from "./pages/admin/AdminHotelUsers";
import AdminAddons from "./pages/admin/AdminAddons";
import HotelUserLogin from "./pages/admin/HotelUserLogin";

import {

  BrowserRouter,

  Routes,

  Route,

  Link,

  useNavigate,

  useLocation,

  Navigate,

  Outlet,

  useParams,

} from "react-router-dom";

import {

  AdminLayout,

  AdminDashboard,

  AdminHotels,


  AdminRooms,

  AdminBookings,

} from "./pages/admin/AdminPortal";

import {

  MapPin,

  CalendarDays,

  Users,

  Search,

  ArrowRight,

  Mountain,

  BedDouble,

  Menu,

  X,

  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import HotelRegistration from "./pages/customer/HotelRegistration";

import HotelAdminLogin from "./pages/admin/HotelAdminLogin";
import AddHotel from "./pages/admin/AddHotel";

import Hotels from "./pages/customer/Hotels";

import HotelDetails from "./pages/customer/HotelDetails";

import RoomDetails from "./pages/customer/RoomDetails";

import Checkout from "./pages/customer/Checkout";

import BookingSuccess from "./pages/customer/BookingSuccess";

import "./styles/global.css";
// import "./styles/popularDestinations.css";

import Footer from "./components/Footer";



const DESTINATIONS_API = "https://coreops.pk/Hotel/api/getCities.php";

const PUBLIC_AREAS_API = "https://coreops.pk/Hotel/api/getAreasByCities.php";

const ROOMS_BY_AREA_API = "https://coreops.pk/Hotel/api/getRoomsByArea.php";



const DESTINATION_FALLBACK_IMAGE =

  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000";



const DESTINATION_IMAGES = {

  hunza: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000",

  "hunza valley": "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000",

  skardu: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000",

  naran: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000",

};



function usePublicDestinations() {

  const [data, setData] = useState({ cities: [], areas: [], loading: true, error: "" });

  useEffect(() => {

    const controller = new AbortController();

    async function load() {

      try {

        const response = await fetch(DESTINATIONS_API, {

          signal: controller.signal,

          cache: "no-store",

        });

        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.cities)) {

          throw new Error(result.message || "Unable to load destinations.");

        }

        if (!controller.signal.aborted) {

          setData({

            cities: Array.from(

              new Map(

                result.cities

                  .filter((city) => city.city_name && (city.status == null || city.status === "YES"))

                  .map((city) => [city.city_name.trim().toLocaleLowerCase(), city])

              ).values()

            ),

            areas: [], // getCities.php only returns cities.

            loading: false,

            error: "",

          });

        }

      } catch (error) {

        if (!controller.signal.aborted) {

          setData({ cities: [], areas: [], loading: false, error: error.message });

        }

      }

    }

    load();

    return () => controller.abort();

  }, []);

  return data;

}



function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (

    <header className="site-header">

      <nav className="navbar">

        <Link to="/" className="brand" onClick={closeMenu}>

          <Mountain size={28} strokeWidth={1.8} />

          <span>

            Northern<span className="brand-accent">Stays</span>

          </span>

        </Link>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

          <Link

            to="/"

            className={location.pathname === "/" ? "nav-active" : ""}

            onClick={closeMenu}

          >

            Home

          </Link>

          <Link

            to="/hotels"

            className={location.pathname === "/hotels" ? "nav-active" : ""}

            onClick={closeMenu}

          >

            Hotels

          </Link>

          <Link to="/#destinations" onClick={closeMenu}>

            Destinations

          </Link>

          <Link

            to="/register-hotel"

            className="mobile-login"

            onClick={closeMenu}

          >

            Register your Hotel

          </Link>

        </div>

        <div className="nav-actions">

          <Link to="/register-hotel" className="nav-button">

            Register your Hotel

          </Link>

          <button

            type="button"

            className="menu-toggle"

            onClick={() => setMenuOpen(!menuOpen)}

            aria-label={menuOpen ? "Close menu" : "Open menu"}

            aria-expanded={menuOpen}

          >

            {menuOpen ? <X size={25} /> : <Menu size={25} />}

          </button>

        </div>

      </nav>

    </header>

  );

}

const today = () => {

  const date = new Date();

  return [

    date.getFullYear(),

    String(date.getMonth() + 1).padStart(2, "0"),

    String(date.getDate()).padStart(2, "0"),

  ].join("-");

};



function SearchBar({ initialCity = "", cities = [], loading = false }) {

  const navigate = useNavigate();

  const [city, setCity] = useState(initialCity);

  const [area, setArea] = useState("");

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [roomCount, setRoomCount] = useState(1);

  const [guests, setGuests] = useState(2);

  const [error, setError] = useState("");

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [areasError, setAreasError] = useState("");

  // Only load area dropdown options when city changes.
  // The rooms search endpoint is NOT called until Search is submitted.
  useEffect(() => {
    if (!city) {
      setAreas([]);
      setAreasLoading(false);
      setAreasError("");
      return;
    }

    const controller = new AbortController();
    setAreasLoading(true);
    setAreas([]);
    setAreasError("");

    fetch(`${PUBLIC_AREAS_API}?city=${encodeURIComponent(city)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.areas)) {
          throw new Error(result.message || "Unable to load areas.");
        }
        return result.areas;
      })
      .then((items) => {
        if (!controller.signal.aborted) {
          setAreas([...new Set(items
            .filter((item) => item.area_name &&
              (item.status == null || ["YES", "Active"].includes(item.status)))
            .map((item) => item.area_name))]);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) setAreasError(err.message || "Unable to load areas.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setAreasLoading(false);
      });

    return () => controller.abort();
  }, [city]);

  const handleSearch = (event) => {

    event.preventDefault();

    setError("");

    if (!city) {

      setError("Please select a destination.");

      return;

    }

    if (Boolean(checkIn) !== Boolean(checkOut)) {

      setError("Please select both check-in and check-out dates.");

      return;

    }

    if (checkIn && (checkIn < today() || checkOut <= checkIn)) {

      setError("Please select valid booking dates.");

      return;

    }

    const params = new URLSearchParams({

      destination: city,

      rooms: String(roomCount),

      guests: String(guests),

    });

    if (area) params.set("area", area);

    if (checkIn) params.set("checkIn", checkIn);

    if (checkOut) params.set("checkOut", checkOut);

    navigate(`/hotels?${params.toString()}`);

  };

  return (

    <form className="search-bar" onSubmit={handleSearch}>

      <div className="search-field">

        <label>

          <MapPin size={16} />

          Destination

        </label>

        <select

          value={city}

          onChange={(e) => {

            setCity(e.target.value);

            setArea("");

          }}

          required

        >

          <option value="">{loading ? "Loading destinations..." : "Select Destination"}</option>

          {cities.map((destination) => (

            <option key={destination.id} value={destination.city_name}>

              {destination.city_name}

            </option>

          ))}

        </select>

      </div>

      <div className="search-field">

        <label>

          <MapPin size={16} />

          Area

        </label>

        <select

          value={area}

          onChange={(e) => setArea(e.target.value)}

          disabled={!city}

        >

          <option value="">{city ? (areasLoading ? "Loading areas..." : areasError ? "Areas unavailable" : "All Areas") : "Select City First"}</option>

          {areas.map((item) => (

            <option key={item} value={item}>

              {item}

            </option>

          ))}

        </select>

      </div>

      <div className="search-field">

        <label>

          <CalendarDays size={16} />

          Check-in

        </label>

        <input

          type="date"

          min={today()}

          value={checkIn}

          onChange={(e) => {

            setCheckIn(e.target.value);

            if (checkOut && checkOut <= e.target.value) {

              setCheckOut("");

            }

          }}

        />

      </div>

      <div className="search-field">

        <label>

          <CalendarDays size={16} />

          Check-out

        </label>

        <input

          type="date"

          min={checkIn || today()}

          value={checkOut}

          onChange={(e) => setCheckOut(e.target.value)}

        />

      </div>

      <div className="search-field">

        <label>

          <BedDouble size={16} />

          Rooms

        </label>

        <select

          value={roomCount}

          onChange={(e) => setRoomCount(Number(e.target.value))}

        >

          {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (

            <option key={count} value={count}>

              {count} {count === 1 ? "Room" : "Rooms"}

            </option>

          ))}

        </select>

      </div>

      <div className="search-field">

        <label>

          <Users size={16} />

          Guests

        </label>

        <select

          value={guests}

          onChange={(e) => setGuests(Number(e.target.value))}

        >

          {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (

            <option key={count} value={count}>

              {count} {count === 1 ? "Guest" : "Guests"}

            </option>

          ))}

        </select>

      </div>

      <button type="submit" className="search-btn">

        <Search size={18} />

        Search

      </button>

      {error && (

        <p

          role="alert"

          style={{

            gridColumn: "1 / -1",

            color: "#b42318",

            margin: 0,

          }}

        >

          {error}

        </p>

      )}

    </form>

  );

}



function PopularDestinationGrid({ cities }) {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [areasError, setAreasError] = useState("");
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!selectedCity) return;
    const controller = new AbortController();
    setLoadingAreas(true);
    setAreasError("");
    setAreas([]);
    fetch(`${PUBLIC_AREAS_API}?city=${encodeURIComponent(selectedCity.city_name)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.areas)) {
          throw new Error(result.message || "Unable to load areas.");
        }
        return result.areas;
      })
      .then((items) => {
        if (!controller.signal.aborted) {
          setAreas(items.filter((item) => item.area_name &&
            (item.status == null || ["YES", "Active"].includes(item.status))));
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setAreasError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingAreas(false);
      });
    return () => controller.abort();
  }, [selectedCity]);

  const cityImage = (cityName) =>
    DESTINATION_IMAGES[cityName.trim().toLowerCase()] || DESTINATION_FALLBACK_IMAGE;

  const openCity = (city) => {
    setSelectedCity((current) => String(current?.id) === String(city.id) ? null : city);
  };

  // Render each set of four city cards followed by its own expandable carousel.
  const rows = [];
  for (let index = 0; index < cities.length; index += 4) {
    rows.push(cities.slice(index, index + 4));
  }

  return (
    <div className="ns-popular-city-list">
      {rows.map((row, rowIndex) => {
        const expanded = row.find((city) => String(city.id) === String(selectedCity?.id));
        return (
          <div className="ns-popular-city-group" key={rowIndex}>
            <div className="ns-popular-city-grid">
              {row.map((city) => (
                <button
                  type="button"
                  key={city.id ?? city.city_name}
                  className={`ns-popular-city-card ${String(selectedCity?.id) === String(city.id) ? "is-selected" : ""}`}
                  onClick={() => openCity(city)}
                  aria-expanded={String(selectedCity?.id) === String(city.id)}
                >
                  <img src={cityImage(city.city_name)} alt="" loading="lazy" />
                  <span className="ns-popular-city-shade" />
                  <span className="ns-popular-city-caption">
                    <strong>{city.city_name}</strong>
                    <small>Pakistan</small>
                  </span>
                </button>
              ))}
            </div>
            {expanded && (
              <section className="ns-expanded-areas" aria-label={`${expanded.city_name} areas`}>
                <div className="ns-expanded-areas-heading">
                  <div>
                    <h3>{expanded.city_name} — Explore Areas</h3>
                    <p>Select an area to view available rooms</p>
                  </div>
                  <button type="button" className="ns-expanded-close" onClick={() => setSelectedCity(null)} aria-label="Close areas"><X size={19} /></button>
                </div>
                {loadingAreas ? <p>Loading areas...</p> : areasError ? (
                  <p role="alert">{areasError}</p>
                ) : areas.length === 0 ? (
                  <p>No active areas available in {expanded.city_name}.</p>
                ) : (
                  <div className="ns-expanded-carousel-shell">
                    <button type="button" className="ns-expanded-arrow" aria-label="Previous areas"
                      onClick={() => carouselRef.current?.scrollBy({ left: -520, behavior: "smooth" })}>
                      <ChevronLeft size={22} />
                    </button>
                    <div className="ns-expanded-carousel" ref={carouselRef}>
                      {areas.map((area) => (
                        <button type="button" className="ns-expanded-area-card"
                          key={area.id ?? area.area_name}
                          onClick={() => navigate(`/destinations/${encodeURIComponent(expanded.city_name)}/areas/${encodeURIComponent(area.area_name)}`)}>
                          <img src={area.image_url || cityImage(expanded.city_name)} alt="" loading="lazy" />
                          <span className="ns-expanded-area-shade" />
                          <span className="ns-expanded-area-caption">
                            <strong>{area.area_name}</strong>
                            <small>Explore rooms <ArrowRight size={14} /></small>
                          </span>
                        </button>
                      ))}
                    </div>
                    <button type="button" className="ns-expanded-arrow" aria-label="Next areas"
                      onClick={() => carouselRef.current?.scrollBy({ left: 520, behavior: "smooth" })}>
                      <ChevronRight size={22} />
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Home() {
  const { cities, loading, error } = usePublicDestinations();
  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="eyebrow">DISCOVER NORTHERN PAKISTAN</span>
            <h1>Stay Somewhere<br /><em>Extraordinary.</em></h1>
            <p>Discover breathtaking destinations, handpicked hotels and unforgettable mountain escapes.</p>
            <SearchBar cities={cities} loading={loading} />
          </div>
        </div>
      </section>
      <section className="destinations ns-destinations ns-popular-destinations" id="destinations">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE THE NORTH</span>
              <h2>Popular Destinations</h2>
              <p>Choose a city to explore its beautiful areas.</p>
            </div>
            <Link to="/hotels" className="view-all">Explore Hotels <ArrowRight size={18} /></Link>
          </div>
          {loading && <p>Loading destinations...</p>}
          {error && <p role="alert">{error}</p>}
          {!loading && !error && cities.length === 0 && <p>No active destinations available.</p>}
          {!loading && !error && <PopularDestinationGrid cities={cities} />}
        </div>
      </section>
      <section className="cta-section">
        <Mountain size={42} strokeWidth={1.5} />
        <h2>Your Mountain Escape Starts Here</h2>
        <p>Explore stays across the most beautiful destinations of Northern Pakistan.</p>
        <Link to="/hotels" className="cta-button">Explore Hotels <ArrowRight size={18} /></Link>
      </section>
    </>
  );
}

function CityAreas() {

  const { cityName = "" } = useParams();

  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    const controller = new AbortController();

    setLoading(true);

    setError("");

    setAreas([]);

    fetch(`${PUBLIC_AREAS_API}?city=${encodeURIComponent(cityName)}`, {

      signal: controller.signal,

      cache: "no-store",

    })

      .then(async (response) => {

        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.areas)) {

          throw new Error(result.message || "Unable to load areas.");

        }

        return result.areas;

      })

      .then((items) => {

        if (!controller.signal.aborted) setAreas(items);

      })

      .catch((err) => {

        if (!controller.signal.aborted) setError(err.message);

      })

      .finally(() => {

        if (!controller.signal.aborted) setLoading(false);

      });

    return () => controller.abort();

  }, [cityName]);



  return (

    <main className="destinations" style={{ minHeight: "70vh", paddingTop: 80 }}>

      <div className="container">

        <div className="section-heading">

          <div>

            <span className="section-label">EXPLORE THE NORTH</span>

            <h2>{cityName} — Areas</h2>

            <p>Select an area to explore available rooms.</p>

          </div>

          <Link to="/" className="view-all">All Destinations <ArrowRight size={18} /></Link>

        </div>

        {loading && <p>Loading areas...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && areas.length === 0 && <p>No active areas available in {cityName}.</p>}

        <div className="destination-grid">

          {areas.map((area) => (

            <button

              key={area.id}

              type="button"

              className="destination-card"

              onClick={() => {

                navigate(`/destinations/${encodeURIComponent(cityName)}/areas/${encodeURIComponent(area.area_name)}`);

              }}

            >

              <img src={DESTINATION_IMAGES[cityName.toLowerCase()] || DESTINATION_FALLBACK_IMAGE}

                alt={area.area_name} loading="lazy" />

              <div className="destination-info">

                <h3>{area.area_name}</h3>

                <span>Explore Rooms <ArrowRight size={17} /></span>

              </div>

            </button>

          ))}

        </div>

      </div>

    </main>

  );

}



function AreaRooms() {

  const { cityName = "", areaName = "" } = useParams();

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    const controller = new AbortController();

    setLoading(true);

    setError("");

    setRooms([]);

    const params = new URLSearchParams({ city: cityName, area: areaName });

    fetch(`${ROOMS_BY_AREA_API}?${params.toString()}`, {

      signal: controller.signal,

      cache: "no-store",

      credentials: "omit",

    })

      .then(async (response) => {

        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.rooms)) {

          throw new Error(result.message || "Unable to load rooms.");

        }

        return result.rooms;

      })

      .then((items) => {

        if (!controller.signal.aborted) setRooms(items);

      })

      .catch((err) => {

        if (!controller.signal.aborted) setError(err.message || "Unable to load rooms.");

      })

      .finally(() => {

        if (!controller.signal.aborted) setLoading(false);

      });

    return () => controller.abort();

  }, [cityName, areaName]);



  const formatPrice = (price) =>

    `PKR ${Number(price || 0).toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;



  return (

    <main className="destinations" style={{ minHeight: "70vh", paddingTop: 80 }}>

      <div className="container">

        <div className="section-heading">

          <div>

            <span className="section-label">AVAILABLE STAYS</span>

            <h2>{areaName}, {cityName} — Rooms</h2>

            <p>Explore available rooms across hotels in this area.</p>

          </div>

          <Link to={`/destinations/${encodeURIComponent(cityName)}`} className="view-all">

            Back to Areas <ArrowRight size={18} />

          </Link>

        </div>

        {loading && <p role="status">Loading rooms...</p>}

        {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}

        {!loading && !error && rooms.length === 0 && (

          <p>No active rooms available in {areaName} right now.</p>

        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 24 }}>

          {rooms.map((room) => (

            <article key={`${room.company_id}-${room.id}`} style={{ borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 5px 25px rgba(0,0,0,.08)" }}>

              <img

                src={room.image_url || DESTINATION_IMAGES[cityName.toLowerCase()] || DESTINATION_FALLBACK_IMAGE}

                alt={room.room_name}

                loading="lazy"

                onError={(event) => { event.currentTarget.src = DESTINATION_FALLBACK_IMAGE; }}

                style={{ width: "100%", height: 205, objectFit: "cover" }}

              />

              <div style={{ padding: 20, display: "grid", gap: 10 }}>

                <span style={{ color: "#64746d", fontSize: 13 }}>{room.hotel_name}</span>

                <h3 style={{ margin: 0 }}>{room.room_name}</h3>

                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>

                  <Users size={16} /> Up to {room.capacity} guests

                </span>

                {room.room_type && <span>{room.room_type}</span>}

                <p style={{ margin: 0 }}><strong>{formatPrice(room.price_per_night)}</strong> / night</p>

                <Link

                  to={`/rooms/${encodeURIComponent(room.hotel_id)}/${encodeURIComponent(room.id)}?${new URLSearchParams({ city: cityName, area: areaName }).toString()}`}

                  className="cta-button"

                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}

                >

                  View Room <ArrowRight size={16} />

                </Link>

              </div>

            </article>

          ))}

        </div>

      </div>

    </main>

  );

}



function Placeholder({ title }) {

  return (

    <main className="placeholder">

      <h1>{title}</h1>

      <p>This section is coming soon.</p>

      <Link to="/">Back to Home</Link>

    </main>

  );

}

// Verify the server-side PHP session before showing any admin screen.



// Both guards use the same PHP session. Never grant access from local storage.
const HOTEL_LOGIN_API = "https://coreops.pk/Hotel/api/login.php";

function useHotelSession() {
  const [session, setSession] = useState({ status: "checking", user: null });
  useEffect(() => {
    const controller = new AbortController();
    fetch(HOTEL_LOGIN_API, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check_session" }),
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success || !data.authenticated || !data.user) {
          return { status: "denied", user: null };
        }
        return { status: "allowed", user: data.user };
      })
      .then((result) => { if (!controller.signal.aborted) setSession(result); })
      .catch(() => { if (!controller.signal.aborted) setSession({ status: "denied", user: null }); });
    return () => controller.abort();
  }, []);
  return session;
}

function RequireHotelOwner() {
  const { status, user } = useHotelSession();
  if (status === "checking") return <div role="status">Checking hotel admin permissions...</div>;
  if (status !== "allowed") return <Navigate to="/admin/login" replace />;
  const role = String(user?.hotel_role || "").toLowerCase();
  const userType = String(user?.user_type || "").toLowerCase();
  const isOwner = role === "hotel_admin" || userType === "admin";
  return isOwner ? <Outlet /> : <Navigate to="/admin/bookings" replace />;
}

function RequireHotelAdmin() {
  const { status } = useHotelSession();
  if (status === "checking") return <div role="status">Checking admin session...</div>;
  return status === "allowed" ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

function App() {

  return (

    <BrowserRouter basename="/Hotel">

      <AppContent />

    </BrowserRouter>

  );

}



function AppContent() {

  const location = useLocation();

  const isAdminPage =

    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  return (

    <>

      {/* Customer Navbar */}

      {!isAdminPage && <Navbar />}

      <Routes>

        {/* CUSTOMER PORTAL */}

        <Route path="/" element={<Home />} />

        <Route path="/hotels" element={<Hotels />} />

        <Route path="/destinations/:cityName" element={<CityAreas />} />

        <Route path="/destinations/:cityName/areas/:areaName" element={<AreaRooms />} />

        <Route path="/hotels/:id" element={<HotelDetails />} />

        <Route path="/rooms/:hotelId/:roomId" element={<RoomDetails />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/register-hotel" element={<HotelRegistration />} />

        {/* Booking Confirmation */}

        <Route path="/booking-success/:id" element={<BookingSuccess />} />

        <Route path="/login" element={<Placeholder title="Customer Login" />} />

        {/* HOTEL ADMIN LOGIN */}

        <Route path="/admin/user-login" element={<HotelUserLogin />} />
        <Route path="/admin/login" element={<HotelAdminLogin />} />

        {/* PROTECTED ADMIN PORTAL */}

        <Route element={<RequireHotelAdmin />}>

          <Route path="/admin" element={<AdminLayout />}>

            <Route element={<RequireHotelOwner />}>
              <Route index element={<AdminDashboard />} />

              <Route path="dashboard" element={<AdminDashboard />} />

              <Route path="hotels" element={<AdminHotels />} />

              <Route path="hotels/add" element={<AddHotel />} />

              <Route path="hotels/:id/edit" element={<AddHotel />} />

              <Route path="rooms" element={<AdminRooms />} />
              <Route path="addons" element={<AdminAddons />} />

            </Route>
            <Route path="bookings" element={<AdminBookings />} />
            <Route element={<RequireHotelOwner />}>
              <Route path="hotel-users" element={<AdminHotelUsers />} />

              <Route path="areas" element={<AdminAreas />} />

              <Route path="cities" element={<AdminCities />} />
            </Route>

          </Route>

        </Route>

        {/* 404 PAGE */}

        <Route path="*" element={<Placeholder title="Page Not Found" />} />

      </Routes>

      {!isAdminPage && <Footer />}

    </>

  );

}



export default App;
