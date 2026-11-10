// import { useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import {
//   MapPin,
//   Star,
//   Search,
//   SlidersHorizontal,
//   BedDouble,
//   Users,
//   ArrowRight,
//   CalendarDays,
// } from "lucide-react";

// import { useActiveHotels } from "../../data/hotelStore";
// import {
//   useBookings,
//   remainingRooms,
//   nightsBetween,
// } from "../../data/bookingStore";
// import { formatPKR } from "../../data/hotels";
// import { destinations, getAreasByDestination } from "../../data/destinations";

// import "../../styles/hotels.css";

// const getToday = () => {
//   const date = new Date();

//   return [
//     date.getFullYear(),
//     String(date.getMonth() + 1).padStart(2, "0"),
//     String(date.getDate()).padStart(2, "0"),
//   ].join("-");
// };

// const normalize = (value) =>
//   String(value ?? "")
//     .trim()
//     .toLowerCase();

// export default function Hotels() {
//   const hotels = useActiveHotels();

//   // Keep room availability updated when bookings change.
//   useBookings();

//   const [params, setParams] = useSearchParams();

//   const [keyword, setKeyword] = useState("");
//   const [maxPrice, setMaxPrice] = useState(100000);
//   const [sortBy, setSortBy] = useState("recommended");

//   const city = params.get("destination") || "";
//   const area = params.get("area") || "";

//   const checkIn = params.get("checkIn") || "";
//   const checkOut = params.get("checkOut") || "";

//   const roomCount = Number(params.get("rooms") ?? params.get("roomCount") ?? 1);

//   const guests = Number(params.get("guests") || 2);

//   const nights = nightsBetween(checkIn, checkOut);

//   const datesSelected = Boolean(checkIn && checkOut);

//   const datesValid = datesSelected && checkIn >= getToday() && nights > 0;

//   const datesInvalid = Boolean(checkIn || checkOut) && !datesValid;

//   // Combine configured destinations with destinations
//   // already saved in the hotel store.
//   const cities = [
//     ...new Set([...destinations, ...hotels.map((hotel) => hotel.destination)]),
//   ].filter(Boolean);

//   // Areas depend on the selected destination.
//   // Also include any custom areas saved by admin.
//   const areas = [
//     ...new Set([
//       ...getAreasByDestination(city),
//       ...hotels
//         .filter((hotel) => normalize(hotel.destination) === normalize(city))
//         .map((hotel) => hotel.area)
//         .filter(Boolean),
//     ]),
//   ];

//   const updateParam = (key, value) => {
//     const next = new URLSearchParams(params);

//     if (String(value ?? "").trim()) {
//       next.set(key, String(value));
//     } else {
//       next.delete(key);
//     }

//     // Changing the destination resets its area.
//     if (key === "destination") {
//       next.delete("area");
//     }

//     if (key === "rooms") {
//       next.delete("roomCount");
//     }

//     // Reset check-out when it is no longer valid.
//     if (
//       key === "checkIn" &&
//       next.get("checkOut") &&
//       next.get("checkOut") <= value
//     ) {
//       next.delete("checkOut");
//     }

//     setParams(next);
//   };

//   // Convert each hotel's room types into separate cards.
//   const allRooms = hotels.flatMap((hotel) =>
//     (hotel.rooms || []).map((room) => {
//       const inventory = Number(room.available ?? 0);

//       const available = datesValid
//         ? remainingRooms(hotel.id, room.id, checkIn, checkOut)
//         : inventory;

//       return {
//         hotel,
//         room,
//         available,
//       };
//     }),
//   );

//   const results = allRooms
//     .filter(({ hotel, room, available }) => {
//       // Destination filtering
//       const cityMatch =
//         !city || normalize(hotel.destination) === normalize(city);

//       // Area filtering
//       const areaMatch = !area || normalize(hotel.area) === normalize(area);

//       const searchableText = [
//         hotel.name,
//         hotel.location,
//         hotel.destination,
//         hotel.area,
//         hotel.type,
//         room.name,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       const keywordMatch = searchableText.includes(normalize(keyword));

//       const price = Number(room.price || 0);
//       const capacity = Number(room.capacity || 0);

//       const priceMatch = price > 0 && price <= maxPrice;

//       const capacityMatch = capacity > 0 && capacity * roomCount >= guests;

//       const inventoryMatch = available >= roomCount;

//       return (
//         cityMatch &&
//         areaMatch &&
//         keywordMatch &&
//         priceMatch &&
//         capacityMatch &&
//         inventoryMatch
//       );
//     })
//     .sort((a, b) => {
//       if (sortBy === "price-low") {
//         return Number(a.room.price) - Number(b.room.price);
//       }

//       if (sortBy === "price-high") {
//         return Number(b.room.price) - Number(a.room.price);
//       }

//       if (sortBy === "rating") {
//         return Number(b.hotel.rating || 0) - Number(a.hotel.rating || 0);
//       }

//       return 0;
//     });

//   const resetFilters = () => {
//     setParams({});
//     setKeyword("");
//     setMaxPrice(100000);
//     setSortBy("recommended");
//   };

//   return (
//     <main className="hotels-page">
//       {/* PAGE HEADING */}
//       <section className="listing-banner">
//         <div className="container">
//           <span className="section-label">FIND YOUR PERFECT ROOM</span>

//           <h1>Available Rooms</h1>

//           <p>
//             Choose your destination and preferred area. Compare rooms, prices
//             and availability across Northern Pakistan.
//           </p>
//         </div>
//       </section>

//       <div className="container listing-layout">
//         {/* SEARCH FILTERS */}
//         <aside className="filters-panel">
//           <div className="filters-title">
//             <SlidersHorizontal size={20} />
//             <h3>Search & Filters</h3>
//           </div>

//           <label htmlFor="room-keyword">Search Room or Hotel</label>

//           <div className="filter-input">
//             <Search size={17} />

//             <input
//               id="room-keyword"
//               type="text"
//               placeholder="Deluxe, family, mountain..."
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//             />
//           </div>

//           {/* DESTINATION */}
//           <label htmlFor="room-city">
//             <MapPin size={15} />
//             Destination
//           </label>

//           <select
//             id="room-city"
//             value={city}
//             onChange={(e) => updateParam("destination", e.target.value)}
//           >
//             <option value="">All Destinations</option>

//             {cities.map((item) => (
//               <option key={item} value={item}>
//                 {item}
//               </option>
//             ))}
//           </select>

//           {/* AREA */}
//           <label htmlFor="room-area">
//             <MapPin size={15} />
//             Area
//           </label>

//           <select
//             id="room-area"
//             value={area}
//             disabled={!city}
//             onChange={(e) => updateParam("area", e.target.value)}
//           >
//             <option value="">
//               {city ? "All Areas" : "Select Destination First"}
//             </option>

//             {areas.map((item) => (
//               <option key={item} value={item}>
//                 {item}
//               </option>
//             ))}
//           </select>

//           {/* DATES */}
//           <label htmlFor="room-checkin">
//             <CalendarDays size={15} />
//             Check-in
//           </label>

//           <input
//             id="room-checkin"
//             type="date"
//             min={getToday()}
//             value={checkIn}
//             onChange={(e) => updateParam("checkIn", e.target.value)}
//           />

//           <label htmlFor="room-checkout">
//             <CalendarDays size={15} />
//             Check-out
//           </label>

//           <input
//             id="room-checkout"
//             type="date"
//             min={checkIn || getToday()}
//             value={checkOut}
//             onChange={(e) => updateParam("checkOut", e.target.value)}
//           />

//           {/* ROOM QUANTITY */}
//           <label htmlFor="room-quantity">
//             <BedDouble size={15} />
//             Number of Rooms
//           </label>

//           <select
//             id="room-quantity"
//             value={roomCount}
//             onChange={(e) => updateParam("rooms", e.target.value)}
//           >
//             {Array.from({ length: 10 }, (_, index) => index + 1).map(
//               (count) => (
//                 <option key={count} value={count}>
//                   {count} {count === 1 ? "Room" : "Rooms"}
//                 </option>
//               ),
//             )}
//           </select>

//           {/* GUESTS */}
//           <label htmlFor="room-guests">
//             <Users size={15} />
//             Total Guests
//           </label>

//           <select
//             id="room-guests"
//             value={guests}
//             onChange={(e) => updateParam("guests", e.target.value)}
//           >
//             {Array.from({ length: 30 }, (_, index) => index + 1).map(
//               (count) => (
//                 <option key={count} value={count}>
//                   {count} {count === 1 ? "Guest" : "Guests"}
//                 </option>
//               ),
//             )}
//           </select>

//           {/* PRICE */}
//           <label htmlFor="room-price">Maximum Price / Room / Night</label>

//           <input
//             id="room-price"
//             type="range"
//             min="1000"
//             max="100000"
//             step="1000"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(Number(e.target.value))}
//           />

//           <strong className="price-value">{formatPKR(maxPrice)}</strong>

//           <button
//             type="button"
//             className="reset-filters"
//             onClick={resetFilters}
//           >
//             Reset Filters
//           </button>
//         </aside>

//         {/* ROOM RESULTS */}
//         <section className="hotel-results">
//           <div className="results-header">
//             <div>
//               <h2>
//                 {city || "All Destinations"}
//                 {area ? ` · ${area}` : ""}
//                 {" · Rooms"}
//               </h2>

//               <p>
//                 {results.length} matching room types
//                 {datesValid
//                   ? ` · ${roomCount} rooms · ${guests} guests · ${nights} nights`
//                   : " · Select dates to check availability"}
//               </p>
//             </div>

//             <select
//               className="sort-select"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               aria-label="Sort rooms"
//             >
//               <option value="recommended">Recommended</option>

//               <option value="price-low">Price: Low to High</option>

//               <option value="price-high">Price: High to Low</option>

//               <option value="rating">Highest Rated</option>
//             </select>
//           </div>

//           {datesInvalid && (
//             <div
//               role="alert"
//               style={{
//                 padding: "13px 16px",
//                 marginBottom: 20,
//                 borderRadius: 9,
//                 background: "#fff3e5",
//                 color: "#925c1b",
//                 fontSize: 13,
//               }}
//             >
//               Please select valid future check-in and check-out dates. Rooms
//               below are shown for browsing only.
//             </div>
//           )}

//           <div className="hotel-cards">
//             {results.map(({ hotel, room, available }) => {
//               const photo =
//                 room.image ||
//                 room.gallery?.[0] ||
//                 hotel.image ||
//                 hotel.gallery?.[0];

//               const price = Number(room.price || 0);

//               const total = datesValid ? price * roomCount * nights : 0;

//               const bookingParams = new URLSearchParams({
//                 destination: hotel.destination || "",
//                 rooms: String(roomCount),
//                 guests: String(guests),
//                 roomId: String(room.id),
//               });

//               if (hotel.area) {
//                 bookingParams.set("area", hotel.area);
//               }

//               if (datesValid) {
//                 bookingParams.set("checkIn", checkIn);

//                 bookingParams.set("checkOut", checkOut);
//               }

//               return (
//                 <article
//                   className="hotel-list-card"
//                   key={`${hotel.id}-${room.id}`}
//                 >
//                   {photo ? (
//                     <img src={photo} alt={room.name} loading="lazy" />
//                   ) : (
//                     <div
//                       style={{
//                         display: "grid",
//                         placeItems: "center",
//                         minHeight: 240,
//                         background: "#e8efeb",
//                         color: "#789085",
//                       }}
//                     >
//                       <BedDouble size={46} />
//                     </div>
//                   )}

//                   <div className="hotel-card-body">
//                     <span className="hotel-type">
//                       {hotel.destination}

//                       {hotel.area ? ` · ${hotel.area}` : ""}

//                       {hotel.type ? ` · ${hotel.type}` : ""}
//                     </span>

//                     <h3>{room.name}</h3>

//                     <p className="hotel-location">
//                       <MapPin size={15} />
//                       {hotel.name} · {hotel.location}
//                     </p>

//                     <div className="hotel-rating">
//                       <Star size={16} fill="currentColor" />

//                       <strong>{hotel.rating || "New"}</strong>

//                       <span>({hotel.reviews || 0} reviews)</span>
//                     </div>

//                     <div className="hotel-amenities">
//                       <span>
//                         <Users size={15} />
//                         Up to {room.capacity} guests per room
//                       </span>

//                       <span>
//                         <BedDouble size={15} />

//                         {datesValid
//                           ? `${available} rooms available`
//                           : `${available} rooms listed · Select dates to confirm`}
//                       </span>
//                     </div>

//                     <div className="hotel-card-bottom">
//                       <div>
//                         <small>Per room / night</small>

//                         <strong>{formatPKR(price)}</strong>

//                         {datesValid && (
//                           <>
//                             <small>
//                               {roomCount} rooms × {nights} nights
//                             </small>

//                             <strong>Total: {formatPKR(total)}</strong>
//                           </>
//                         )}
//                       </div>

//                       <Link
//                         className="details-button"
//                         to={`/hotels/${hotel.id}?${bookingParams.toString()}`}
//                       >
//                         View Room
//                         <ArrowRight size={16} />
//                       </Link>
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           {results.length === 0 && (
//             <div className="empty-results">
//               <h3>No Matching Rooms Found</h3>
//               {area &&
//                 hotels.some(
//                   (hotel) =>
//                     normalize(hotel.destination) === normalize(city) &&
//                     !hotel.area,
//                 ) && (
//                   <p>
//                     Some hotels in this destination do not have an area assigned
//                     yet. Please update their area in Admin Hotel Management.
//                   </p>
//                 )}

//               {allRooms.length === 0 && (
//                 <p>
//                   No room inventory is currently available in the active hotel
//                   data. Please check Admin → Hotels and Admin → Rooms.
//                 </p>
//               )}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }






import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal, BedDouble, Users, ArrowRight, CalendarDays } from "lucide-react";
import "../../styles/hotels.css";

const API = "https://coreops.pk/Hotel/api/";
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const money = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK")}`;
const norm = (s) => String(s || "").trim().toLowerCase();

export default function Hotels() {
  const [params, setParams] = useSearchParams();
  const city = params.get("destination") || "";
  const area = params.get("area") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const roomCount = Math.max(1, Number(params.get("rooms") || 1));
  const guests = Math.max(1, Number(params.get("guests") || 2));
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("recommended");

  const nights = checkIn && checkOut ? Math.round((new Date(`${checkOut}T12:00:00`) - new Date(`${checkIn}T12:00:00`)) / 86400000) : 0;
  const datesValid = Boolean(checkIn && checkOut && checkIn >= today() && nights > 0);
  const datesInvalid = Boolean(checkIn || checkOut) && !datesValid;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API}getCities.php`, { signal: controller.signal, cache: "no-store" })
      .then(r => r.json()).then(data => {
        if (data.success && Array.isArray(data.cities)) setCities(data.cities.filter(c => c.city_name && (c.status == null || c.status === "YES")));
      }).catch(() => { });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!city) { setAreas([]); return; }
    const controller = new AbortController();
    fetch(`${API}getAreasByCities.php?city=${encodeURIComponent(city)}`, { signal: controller.signal, cache: "no-store" })
      .then(r => r.json()).then(data => {
        if (data.success && Array.isArray(data.areas)) setAreas(data.areas.filter(a => a.area_name && (a.status == null || ["YES", "Active"].includes(a.status))));
      }).catch(() => setAreas([]));
    return () => controller.abort();
  }, [city]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ rooms: String(roomCount), guests: String(guests) });
    if (city) query.set("city", city);
    if (area) query.set("area", area);
    fetch(`${API}getRoomsByArea.php?${query}`, { signal: controller.signal, cache: "no-store" })
      .then(async r => {
        const data = await r.json();
        if (!r.ok || !data.success || !Array.isArray(data.rooms)) throw new Error(data.message || "Unable to load rooms");
        return data.rooms;
      })
      .then(data => { if (!controller.signal.aborted) setRooms(data); })
      .catch(e => { if (!controller.signal.aborted) { setRooms([]); setError(e.message); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [city, area, roomCount, guests]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (String(value ?? "").trim()) next.set(key, String(value));
    else next.delete(key);
    if (key === "destination") next.delete("area");
    if (key === "checkIn" && next.get("checkOut") && next.get("checkOut") <= value) next.delete("checkOut");
    setParams(next);
  };
  const results = useMemo(() => rooms.filter(room => {
    const price = Number(room.discounted_price_per_night || room.price_per_night || 0);
    const text = [room.room_name, room.room_type, room.hotel_name, room.city_name, room.area_name].join(" ");
    return norm(text).includes(norm(keyword)) && price > 0 && price <= maxPrice && Number(room.online_rooms) >= roomCount && Number(room.capacity) * roomCount >= guests;
  }).sort((a, b) => {
    const pa = Number(a.discounted_price_per_night || a.price_per_night || 0);
    const pb = Number(b.discounted_price_per_night || b.price_per_night || 0);
    return sortBy === "price-low" ? pa - pb : sortBy === "price-high" ? pb - pa : 0;
  }), [rooms, keyword, maxPrice, sortBy, roomCount, guests]);

  return (
    <main className="hotels-page">
      <section className="listing-banner"><div className="container"><span className="section-label">FIND YOUR PERFECT ROOM</span><h1>Available Rooms</h1><p>Explore Online rooms across Northern Pakistan.</p></div></section>
      <div className="container listing-layout">
        <aside className="filters-panel">
          <div className="filters-title"><SlidersHorizontal size={20} /><h3>Search & Filters</h3></div>
          <label htmlFor="room-keyword">Search Room or Hotel</label>
          <div className="filter-input"><Search size={17} /><input id="room-keyword" placeholder="Suite, family, mountain..." value={keyword} onChange={e => setKeyword(e.target.value)} /></div>
          <label htmlFor="room-city"><MapPin size={15} /> Destination</label>
          <select id="room-city" value={city} onChange={e => updateParam("destination", e.target.value)}><option value="">All Destinations</option>{cities.map(c => <option key={c.id} value={c.city_name}>{c.city_name}</option>)}</select>
          <label htmlFor="room-area"><MapPin size={15} /> Area</label>
          <select id="room-area" value={area} disabled={!city} onChange={e => updateParam("area", e.target.value)}><option value="">{city ? "All Areas" : "Select Destination First"}</option>{areas.map(a => <option key={a.id ?? a.area_name} value={a.area_name}>{a.area_name}</option>)}</select>
          <label htmlFor="room-checkin"><CalendarDays size={15} /> Check-in</label>
          <input id="room-checkin" type="date" min={today()} value={checkIn} onChange={e => updateParam("checkIn", e.target.value)} />
          <label htmlFor="room-checkout"><CalendarDays size={15} /> Check-out</label>
          <input id="room-checkout" type="date" min={checkIn || today()} value={checkOut} onChange={e => updateParam("checkOut", e.target.value)} />
          <label htmlFor="room-quantity"><BedDouble size={15} /> Number of Rooms</label>
          <select id="room-quantity" value={roomCount} onChange={e => updateParam("rooms", e.target.value)}>{Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? "Room" : "Rooms"}</option>)}</select>
          <label htmlFor="room-guests"><Users size={15} /> Total Guests</label>
          <select id="room-guests" value={guests} onChange={e => updateParam("guests", e.target.value)}>{Array.from({ length: 30 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}</select>
          <label htmlFor="room-price">Maximum Price / Room / Night</label>
          <input id="room-price" type="range" min="1000" max="100000" step="1000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
          <strong className="price-value">{money(maxPrice)}</strong>
          <button type="button" className="reset-filters" onClick={() => { setParams({}); setKeyword(""); setMaxPrice(100000); setSortBy("recommended"); }}>Reset Filters</button>
        </aside>
        <section className="hotel-results">
          <div className="results-header"><div><h2>{city || "All Destinations"}{area ? ` · ${area}` : ""} · Rooms</h2><p>{results.length} matching Online room types · {roomCount} rooms · {guests} guests</p></div>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort rooms"><option value="recommended">Recommended</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select>
          </div>
          {datesInvalid && <p role="alert" style={{ color: "#b42318" }}>Please select a valid check-in and check-out date.</p>}
          {datesValid && <p style={{ fontSize: 13, color: "#64746d", marginBottom: 16 }}>Showing listed Online inventory for {nights} nights. Availability for these dates must be confirmed during booking.</p>}
          {loading && <p role="status">Loading Online rooms...</p>}
          {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
          <div className="hotel-cards">{!loading && !error && results.map(room => {
            const price = Number(room.discounted_price_per_night || room.price_per_night || 0);
            const bookingParams = new URLSearchParams({ city: room.city_name || city, area: room.area_name || area, rooms: String(roomCount), guests: String(guests) });
            if (datesValid) { bookingParams.set("checkIn", checkIn); bookingParams.set("checkOut", checkOut); }
            return <article className="hotel-list-card" key={`${room.company_id}-${room.id}`}>
              {room.image_url ? <img src={room.image_url} alt={room.room_name} loading="lazy" /> : <div style={{ minHeight: 240, display: "grid", placeItems: "center", background: "#e8efeb" }}><BedDouble size={46} /></div>}
              <div className="hotel-card-body"><span className="hotel-type">{room.city_name} · {room.area_name}{room.room_type ? ` · ${room.room_type}` : ""}</span><h3>{room.room_name}</h3>
                <p className="hotel-location"><MapPin size={15} />{room.hotel_name}</p>
                <div className="hotel-amenities"><span><Users size={15} /> Up to {room.capacity} guests per room</span><span><BedDouble size={15} />{room.online_rooms} Online rooms listed</span></div>
                <div className="hotel-card-bottom"><div><small>Per room / night</small><strong>{money(price)}</strong>{datesValid && <><small>{roomCount} rooms × {nights} nights</small><strong>Estimated total: {money(price * roomCount * nights)}</strong></>}</div>
                  <Link className="details-button" to={`/rooms/${encodeURIComponent(room.hotel_id)}/${encodeURIComponent(room.id)}?${bookingParams}`}>View Room <ArrowRight size={16} /></Link>
                </div>
              </div>
            </article>;
          })}</div>
          {!loading && !error && results.length === 0 && <div className="empty-results"><h3>No Matching Online Rooms Found</h3><p>Try another destination, area, room quantity or guest count.</p></div>}
        </section>
      </div>
    </main>
  );
}
